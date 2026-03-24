import type { ILicense } from "@/types/driver";

export function initials(name: string): string {
  return name
    .split(' ')
    .map(word => word.charAt(0))
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

export function formatAddress(addr?: {
  addressLine1?: string; 
  village?: string;
  tehsil?: string; 
  district?: string;
  state?: string; 
  pincode?: string
}): string | null {
  if (!addr) return null;
  
  const parts = [
    addr.addressLine1,
    addr.village,
    addr.tehsil,
    addr.district,
    addr.state,
    addr.pincode
  ].filter(Boolean);
  
  return parts.length > 0 ? parts.join(', ') : null;
}

export function licenseStatusClass(lic: ILicense): string {
  const isActive = lic.isActive && !isLicenseExpired(lic);
  return isActive 
    ? "bg-emerald-100 text-emerald-800 border-emerald-200" 
    : "bg-red-100 text-red-800 border-red-200";
}

export function isLicenseExpired(lic: ILicense): boolean {
  if (!lic.expiryDate) return false;
  
  const expiry = new Date(lic.expiryDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Set to start of day for accurate comparison
  
  return expiry < today;
}
