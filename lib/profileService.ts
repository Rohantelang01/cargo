// lib/profileService.ts

import { 
  UserProfile, 
  ProfileResponse, 
  ProfileUpdateResponse, 
  ValidationSchema,
  personalInfoValidation,
  addressValidation,
  driverInfoValidation
} from '@/types/profile';

// API Base Configuration
const API_BASE = '/api/profile';

const getAuthHeaders = (): HeadersInit => {
  const token = typeof window !== 'undefined' 
    ? localStorage.getItem('authToken') || sessionStorage.getItem('authToken')
    : null;
    
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

// Profile Service Class
export class ProfileService {
  
  // Fetch user profile
  static async fetchProfile(): Promise<UserProfile> {
    try {
      const response = await fetch(API_BASE, {
        method: 'GET',
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch profile');
      }

      const data: ProfileResponse = await response.json();
      return data.user;
      
    } catch (error) {
      console.error('ProfileService.fetchProfile error:', error);
      throw error;
    }
  }

  // Update entire profile
  static async updateProfile(updateData: Partial<UserProfile>): Promise<UserProfile> {
    try {
      const response = await fetch(API_BASE, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update profile');
      }

      const data: ProfileUpdateResponse = await response.json();
      return data.user;
      
    } catch (error) {
      console.error('ProfileService.updateProfile error:', error);
      throw error;
    }
  }

  // Update profile section
  static async updateSection(section: string, sectionData: any): Promise<UserProfile> {
    try {
      const response = await fetch(API_BASE, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify({ section, data: sectionData }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Failed to update ${section} section`);
      }

      const data: ProfileUpdateResponse = await response.json();
      return data.user;
      
    } catch (error) {
      console.error(`ProfileService.updateSection(${section}) error:`, error);
      throw error;
    }
  }

  // Upload image to Cloudinary
  static async uploadImage(file: File, folder: string = 'profile-images'): Promise<string> {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'ridesharex');
      formData.append('folder', folder);

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error('Failed to upload image');
      }

      const data = await response.json();
      return data.secure_url;
      
    } catch (error) {
      console.error('ProfileService.uploadImage error:', error);
      throw error;
    }
  }

  // Upload multiple documents (for driver)
  static async uploadDocuments(documents: { [key: string]: File }): Promise<{ [key: string]: string }> {
    try {
      const uploadPromises = Object.entries(documents).map(async ([key, file]) => {
        const url = await this.uploadImage(file, 'driver-documents');
        return [key, url];
      });

      const results = await Promise.all(uploadPromises);
      return Object.fromEntries(results);
      
    } catch (error) {
      console.error('ProfileService.uploadDocuments error:', error);
      throw error;
    }
  }
}

// Validation Utilities
export class ValidationUtils {
  
  // Validate form data against schema
  static validateFormData(data: any, schema: ValidationSchema): { [key: string]: string } {
    const errors: { [key: string]: string } = {};
    
    Object.entries(schema).forEach(([field, rules]) => {
      const value = this.getNestedValue(data, field);
      const fieldErrors = this.validateField(value, rules, field);
      
      if (fieldErrors) {
        errors[field] = fieldErrors;
      }
    });
    
    return errors;
  }
  
  // Validate single field
  static validateField(value: any, rules: any, fieldName: string): string | null {
    if (rules.required && (value === undefined || value === null || value === '')) {
      return `${this.formatFieldName(fieldName)} is required`;
    }
    
    if (value === undefined || value === null || value === '') {
      return null; // Skip other validations if field is empty and not required
    }
    
    if (rules.minLength && value.length < rules.minLength) {
      return `${this.formatFieldName(fieldName)} must be at least ${rules.minLength} characters`;
    }
    
    if (rules.maxLength && value.length > rules.maxLength) {
      return `${this.formatFieldName(fieldName)} must not exceed ${rules.maxLength} characters`;
    }
    
    if (rules.min && Number(value) < rules.min) {
      return `${this.formatFieldName(fieldName)} must be at least ${rules.min}`;
    }
    
    if (rules.max && Number(value) > rules.max) {
      return `${this.formatFieldName(fieldName)} must not exceed ${rules.max}`;
    }
    
    if (rules.pattern && !rules.pattern.test(value)) {
      return `${this.formatFieldName(fieldName)} format is invalid`;
    }
    
    if (rules.custom) {
      const result = rules.custom(value);
      if (typeof result === 'string') {
        return result;
      } else if (result === false) {
        return `${this.formatFieldName(fieldName)} is invalid`;
      }
    }
    
    return null;
  }
  
  // Get nested object value by dot notation
  static getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  }
  
  // Format field name for display
  static formatFieldName(fieldName: string): string {
    return fieldName
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase())
      .replace(/\./g, ' ');
  }
  
  // Validate personal info
  static validatePersonalInfo(data: any) {
    return this.validateFormData(data, personalInfoValidation);
  }
  
  // Validate address info
  static validateAddressInfo(data: any) {
    const errors: { [key: string]: string } = {};
    
    // Validate home location if provided
    if (data.homeLocation) {
      const homeErrors = this.validateFormData(data.homeLocation, addressValidation);
      Object.entries(homeErrors).forEach(([key, value]) => {
        errors[`homeLocation.${key}`] = value;
      });
    }
    
    // Validate current location if provided
    if (data.currentLocation) {
      const currentErrors = this.validateFormData(data.currentLocation, addressValidation);
      Object.entries(currentErrors).forEach(([key, value]) => {
        errors[`currentLocation.${key}`] = value;
      });
    }
    
    return errors;
  }
  
  // Validate driver info
  static validateDriverInfo(data: any) {
    const errors = this.validateFormData(data, driverInfoValidation);
    
    // Additional driver-specific validations
    if (data.licenseExpiry) {
      const expiryDate = new Date(data.licenseExpiry);
      const today = new Date();
      if (expiryDate < today) {
        errors.licenseExpiry = 'License expiry date must be in the future';
      }
    }

    return errors;
  }
}