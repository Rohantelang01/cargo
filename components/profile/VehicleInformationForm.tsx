"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Card } from "@/components/ui/card";
import { useEffect, useState } from "react";

const VEHICLE_LICENSE_MAP: Record<string, string> = {
  'bike': 'MCG',
  'auto': '3W-T',
  'car': 'LMV',
  'bus': 'HPMV',
  'truck': 'HGV',
};

const LICENSE_VEHICLE_MAP: Record<string, string> = {
  'MCWOG': 'bike', 'MCG': 'bike',
  '3W-NT': 'auto', '3W-T': 'auto',
  'LMV-NT': 'car', 'LMV': 'car',
  'HMV': 'truck', 'HPMV': 'bus', 'HGV': 'truck'
};

const vehicleSchema = z.object({
  _id: z.string().optional(),
  make: z.string().min(1, "Make is required"),
  model: z.string().min(1, "Model is required"),
  year: z.coerce.number().min(1900).max(new Date().getFullYear() + 1),
  color: z.string().min(1, "Color is required"),
  plateNumber: z.string().min(1, "Plate number is required"),
  vehicleType: z.enum(['bike', 'auto', 'car', 'bus', 'truck']),
  seatingCapacity: z.coerce.number().min(1),
  perKmRate: z.coerce.number().min(1),
  rcDocument: z.string().url().optional().or(z.literal("")),
  insurance: z.string().url().optional().or(z.literal("")),
  isAvailable: z.boolean().default(true),
  requiredLicense: z.enum(['MCWOG', 'MCG', '3W-NT', '3W-T', 'LMV-NT', 'LMV', 'HMV', 'HPMV', 'HGV']),
  selfDriven: z.boolean(),
  licenseData: z.object({
    licenseType: z.enum(['MCWOG', 'MCG', '3W-NT', '3W-T', 'LMV-NT', 'LMV', 'HMV', 'HPMV', 'HGV']),
    licenseNumber: z.string().min(1, "License number required"),
    licenseImage: z.string().optional().or(z.literal("")),
    vehicleCategory: z.string(),
    hourlyRate: z.coerce.number().min(50, "Minimum ₹50"),
    expiryDate: z.string().optional(),
  }).optional(),
});

const defaultVehicleValues = {
  make: "", model: "", year: new Date().getFullYear(),
  color: "", plateNumber: "",
  vehicleType: "car" as const,
  seatingCapacity: 4, perKmRate: 10,
  rcDocument: "", insurance: "",
  isAvailable: true,
  requiredLicense: "LMV" as const,
  selfDriven: false,
};

interface VehicleInformationFormProps {
  ownerId: string;
  onSave: (data: any) => Promise<{ success: boolean; error?: string }>;
  onDelete: (vehicleId: string) => Promise<{ success: boolean; error?: string }>;
  onCancel: () => void;
  isLoading: boolean;
}

interface Vehicle {
  _id: string;
  make: string;
  model: string;
  year: number;
  color: string;
  plateNumber: string;
  vehicleType: 'bike' | 'auto' | 'car' | 'bus' | 'truck';
  seatingCapacity: number;
  perKmRate: number;
  rcDocument?: string;
  insurance?: string;
  isAvailable: boolean;
  requiredLicense: string;
  selfDriven: boolean;
  owner: string;
}

const VehicleInformationForm = ({ ownerId, onSave, onDelete, isLoading, onCancel }: VehicleInformationFormProps) => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  const form = useForm<z.infer<typeof vehicleSchema>>({
    resolver: zodResolver(vehicleSchema),
    defaultValues: defaultVehicleValues,
  });

  const watchSelfDriven = form.watch('selfDriven');
  const watchVehicleType = form.watch('vehicleType');

  // Initialize licenseData when selfDriven is toggled on
  useEffect(() => {
    if (watchSelfDriven && !form.getValues('licenseData')) {
      form.setValue('licenseData', {
        licenseType: VEHICLE_LICENSE_MAP[watchVehicleType] || 'LMV',
        licenseNumber: '',
        licenseImage: '',
        vehicleCategory: watchVehicleType || 'car',
        hourlyRate: 50,
        expiryDate: '',
      });
    }
  }, [watchSelfDriven, watchVehicleType, form]);

  // Jab vehicleType change ho — licenseType aur vehicleCategory auto set karo
  useEffect(() => {
    if (watchVehicleType) {
      const autoLicense = VEHICLE_LICENSE_MAP[watchVehicleType];
      const autoCategory = watchVehicleType;
      if (autoLicense) {
        form.setValue('licenseData.licenseType', autoLicense as any);
        form.setValue('licenseData.vehicleCategory', autoCategory);
        form.setValue('requiredLicense', autoLicense as any);
      }
    }
  }, [watchVehicleType, form]);

  const getToken = () => localStorage.getItem('token');

  const fetchVehicles = async () => {
    try {
      const response = await fetch(`/api/vehicles?owner=${ownerId}`, {
        headers: { 'Authorization': `Bearer ${getToken()}` },
      });
      if (response.ok) {
        const data = await response.json();
        setVehicles(data.vehicles || []);
      }
    } catch (error) {
      console.error('Error fetching vehicles:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchVehicles(); }, [ownerId]);

  const handleEditVehicle = (vehicle: Vehicle) => {
    setEditingVehicle(vehicle._id);
    setShowAddForm(false);
    form.reset({
      make: vehicle.make, model: vehicle.model, year: vehicle.year,
      color: vehicle.color, plateNumber: vehicle.plateNumber,
      vehicleType: vehicle.vehicleType, seatingCapacity: vehicle.seatingCapacity,
      perKmRate: vehicle.perKmRate, rcDocument: vehicle.rcDocument || "",
      insurance: vehicle.insurance || "", isAvailable: vehicle.isAvailable,
      requiredLicense: vehicle.requiredLicense as any, selfDriven: vehicle.selfDriven,
    });
  };

  const handleDeleteVehicle = async (vehicleId: string) => {
    try {
      const result = await onDelete(vehicleId);
      if (result.success) setVehicles(vehicles.filter(v => v._id !== vehicleId));
    } catch (error) {
      console.error('Error deleting vehicle:', error);
    }
  };

  const handleAddNewVehicle = () => {
    setEditingVehicle(null);
    setShowAddForm(true);
    form.reset(defaultVehicleValues);
  };

  const handleCancelForm = () => {
    setEditingVehicle(null);
    setShowAddForm(false);
    form.reset(defaultVehicleValues);
  };

  async function onSubmit(values: z.infer<typeof vehicleSchema>) {
    setIsSubmitting(true);
    try {
      // Validation for self-driven vehicles
      if (values.selfDriven) {
        if (!values.licenseData) {
          console.error("License details required for self-driven vehicles");
          alert("License details are required for self-driven vehicles");
          return;
        }
        if (!values.licenseData.licenseNumber || !values.licenseData.licenseType) {
          console.error("License number and type required for self-driven vehicles");
          alert("License number and type are required for self-driven vehicles");
          return;
        }
        if (!values.licenseData.hourlyRate || values.licenseData.hourlyRate < 50) {
          console.error("Valid hourly rate required for license");
          alert("Hourly rate must be at least ₹50");
          return;
        }
      }

      // Validate required fields
      if (!values.make || !values.model || !values.plateNumber || !values.vehicleType) {
        console.error("Required vehicle fields missing");
        alert("Please fill all required vehicle fields");
        return;
      }

      const payload: any = {
        vehicleData: {
          make: values.make, model: values.model, year: values.year,
          color: values.color, plateNumber: values.plateNumber,
          vehicleType: values.vehicleType, seatingCapacity: values.seatingCapacity,
          perKmRate: values.perKmRate, rcDocument: values.rcDocument,
          insurance: values.insurance, isAvailable: values.isAvailable,
          requiredLicense: values.requiredLicense, selfDriven: values.selfDriven,
          currentLocation: {
            type: "Point",
            coordinates: [0, 0] // Default coordinates [longitude, latitude]
          }
        },
      };

      if (values.selfDriven && values.licenseData) {
        payload.licenseData = values.licenseData;
      }

      console.log('Submitting vehicle data:', payload);
      const result = await onSave(payload);
      
      if (result.success) {
        await fetchVehicles();
        setEditingVehicle(null);
        setShowAddForm(false);
        form.reset(defaultVehicleValues);
        console.log('Vehicle saved successfully');
      } else {
        console.error("Failed to save vehicle:", result.error);
        // Show user-friendly error message
        alert(`Failed to save vehicle: ${result.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert(`Error submitting form: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsSubmitting(false);
    }
  }

  if (loading) {
    return <div className="flex justify-center items-center py-8">Loading vehicles...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Your Vehicles</h3>
        <Button onClick={handleAddNewVehicle} variant="outline">Add New Vehicle</Button>
      </div>

      {vehicles.map((vehicle) => (
        <Card key={vehicle._id} className="p-6 border dark:border-gray-700 dark:bg-gray-800">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-md font-medium dark:text-white">{vehicle.make} {vehicle.model} ({vehicle.year})</h4>
              <div className="flex gap-2">
                <Button type="button" variant="outline" size="sm" onClick={() => handleEditVehicle(vehicle)}>Edit</Button>
                <Button type="button" variant="destructive" size="sm" onClick={() => handleDeleteVehicle(vehicle._id)}>Remove</Button>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
              <div><span className="font-medium">Color:</span> {vehicle.color}</div>
              <div><span className="font-medium">Plate:</span> {vehicle.plateNumber}</div>
              <div><span className="font-medium">Type:</span> {vehicle.vehicleType}</div>
              <div><span className="font-medium">Seats:</span> {vehicle.seatingCapacity}</div>
              <div><span className="font-medium">Rate:</span> ₹{vehicle.perKmRate}/km</div>
              <div>
                <span className="font-medium">Status:</span>
                <span className={`ml-1 px-2 py-1 rounded text-xs ${vehicle.isAvailable ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'}`}>
                  {vehicle.isAvailable ? 'Available' : 'Unavailable'}
                </span>
              </div>
            </div>
          </div>
        </Card>
      ))}

      {vehicles.length === 0 && !showAddForm && (
        <div className="text-center py-8 text-gray-500">
          No vehicles added yet. Click "Add New Vehicle" to get started.
        </div>
      )}

      {(showAddForm || editingVehicle !== null) && (
        <Card className="p-6 border dark:border-gray-700 dark:bg-gray-800">
          <h3 className="text-lg font-medium mb-4 dark:text-white">
            {editingVehicle ? 'Edit Vehicle' : 'Add New Vehicle'}
          </h3>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField control={form.control} name="make" render={({ field }) => (<FormItem><FormLabel>Make *</FormLabel><FormControl><Input placeholder="e.g., Toyota" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="model" render={({ field }) => (<FormItem><FormLabel>Model *</FormLabel><FormControl><Input placeholder="e.g., Camry" {...field} /></FormControl><FormMessage /></FormItem>)} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField control={form.control} name="year" render={({ field }) => (<FormItem><FormLabel>Year *</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="color" render={({ field }) => (<FormItem><FormLabel>Color *</FormLabel><FormControl><Input placeholder="e.g., White" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="plateNumber" render={({ field }) => (<FormItem><FormLabel>Plate Number *</FormLabel><FormControl><Input placeholder="MH12AB1234" {...field} /></FormControl><FormMessage /></FormItem>)} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField control={form.control} name="vehicleType" render={({ field }) => (
                  <FormItem><FormLabel>Vehicle Type *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl><SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger></FormControl>
                      <SelectContent>
                        <SelectItem value="bike">Bike</SelectItem>
                        <SelectItem value="auto">Auto</SelectItem>
                        <SelectItem value="car">Car</SelectItem>
                        <SelectItem value="bus">Bus</SelectItem>
                        <SelectItem value="truck">Truck</SelectItem>
                      </SelectContent>
                    </Select>
                  <FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="seatingCapacity" render={({ field }) => (<FormItem><FormLabel>Seating Capacity *</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField control={form.control} name="perKmRate" render={({ field }) => (<FormItem><FormLabel>Per km Rate (₹) *</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="requiredLicense" render={({ field }) => (
                  <FormItem><FormLabel>Required License *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl><SelectTrigger><SelectValue placeholder="Select license" /></SelectTrigger></FormControl>
                      <SelectContent>
                        <SelectItem value="MCWOG">MCWOG</SelectItem>
                        <SelectItem value="MCG">MCG</SelectItem>
                        <SelectItem value="3W-NT">3W-NT</SelectItem>
                        <SelectItem value="3W-T">3W-T</SelectItem>
                        <SelectItem value="LMV-NT">LMV-NT</SelectItem>
                        <SelectItem value="LMV">LMV</SelectItem>
                        <SelectItem value="HMV">HMV</SelectItem>
                        <SelectItem value="HPMV">HPMV</SelectItem>
                        <SelectItem value="HGV">HGV</SelectItem>
                      </SelectContent>
                    </Select>
                  <FormMessage /></FormItem>
                )} />
              </div>

              {/* Self Driven Toggle */}
              <FormField control={form.control} name="selfDriven" render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base font-normal">Self Driven</FormLabel>
                    <p className="text-sm text-muted-foreground">Will you drive this vehicle yourself?</p>
                  </div>
                  <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                </FormItem>
              )} />

              {/* Driver License Section — sirf selfDriven ON hone pe */}
              {watchSelfDriven && (
                <Card className="p-4 border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950 space-y-4">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium text-blue-900 dark:text-blue-100">📋 Driver License Details</h4>
                    <span className="text-xs bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 px-2 py-1 rounded">Required</span>
                  </div>
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    Self-drive ke liye license details required hain.
                    Vehicle type ke according license auto-select ho gaya hai.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                    <FormField control={form.control} name="licenseData.licenseType" render={({ field }) => (
                      <FormItem><FormLabel>License Type *</FormLabel>
                        <Select onValueChange={(val) => {
                          field.onChange(val);
                          form.setValue('licenseData.vehicleCategory', LICENSE_VEHICLE_MAP[val] || '');
                        }} value={field.value}>
                          <FormControl><SelectTrigger><SelectValue placeholder="Select license type" /></SelectTrigger></FormControl>
                          <SelectContent>
                            <SelectItem value="MCWOG">MCWOG — Scooty</SelectItem>
                            <SelectItem value="MCG">MCG — Bike</SelectItem>
                            <SelectItem value="3W-NT">3W-NT — Auto Personal</SelectItem>
                            <SelectItem value="3W-T">3W-T — Auto Commercial</SelectItem>
                            <SelectItem value="LMV-NT">LMV-NT — Car Personal</SelectItem>
                            <SelectItem value="LMV">LMV — Car Taxi</SelectItem>
                            <SelectItem value="HMV">HMV — Truck</SelectItem>
                            <SelectItem value="HPMV">HPMV — Bus</SelectItem>
                            <SelectItem value="HGV">HGV — Goods Truck</SelectItem>
                          </SelectContent>
                        </Select>
                      <FormMessage /></FormItem>
                    )} />

                    <FormField control={form.control} name="licenseData.vehicleCategory" render={({ field }) => (
                      <FormItem><FormLabel>Vehicle Category (auto-filled)</FormLabel>
                        <FormControl><Input {...field} disabled className="bg-gray-100" /></FormControl>
                      <FormMessage /></FormItem>
                    )} />

                    <FormField control={form.control} name="licenseData.licenseNumber" render={({ field }) => (
                      <FormItem><FormLabel>License Number *</FormLabel>
                        <FormControl><Input placeholder="MH1234567890" {...field} /></FormControl>
                      <FormMessage /></FormItem>
                    )} />

                    <FormField control={form.control} name="licenseData.hourlyRate" render={({ field }) => (
                      <FormItem><FormLabel>Hourly Rate (₹) *</FormLabel>
                        <FormControl><Input type="number" placeholder="e.g., 150" {...field} /></FormControl>
                      <FormMessage /></FormItem>
                    )} />

                    <FormField control={form.control} name="licenseData.licenseImage" render={({ field }) => (
                      <FormItem><FormLabel>License Image URL</FormLabel>
                        <FormControl><Input placeholder="https://example.com/license.jpg" {...field} /></FormControl>
                      <FormMessage /></FormItem>
                    )} />

                    <FormField control={form.control} name="licenseData.expiryDate" render={({ field }) => (
                      <FormItem><FormLabel>Expiry Date</FormLabel>
                        <FormControl><Input type="date" {...field} /></FormControl>
                      <FormMessage /></FormItem>
                    )} />

                  </div>
                </Card>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField control={form.control} name="rcDocument" render={({ field }) => (<FormItem><FormLabel>RC Document URL</FormLabel><FormControl><Input placeholder="https://example.com/rc.pdf" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="insurance" render={({ field }) => (<FormItem><FormLabel>Insurance URL</FormLabel><FormControl><Input placeholder="https://example.com/insurance.pdf" {...field} /></FormControl><FormMessage /></FormItem>)} />
              </div>

              <FormField control={form.control} name="isAvailable" render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base font-normal">Available</FormLabel>
                    <p className="text-sm text-muted-foreground">Make this vehicle available for rides</p>
                  </div>
                  <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                </FormItem>
              )} />

              <div className="flex gap-4 pt-4">
                <Button type="submit" disabled={isSubmitting || isLoading} className="flex-1">
                  {isSubmitting || isLoading ? "Saving..." : "Save Vehicle"}
                </Button>
                <Button type="button" variant="outline" onClick={handleCancelForm} className="flex-1">
                  Cancel
                </Button>
              </div>

            </form>
          </Form>
        </Card>
      )}
    </div>
  );
};

export default VehicleInformationForm;