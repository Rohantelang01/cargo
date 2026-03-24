
"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Card } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { IDriverInfo, LICENSE_VEHICLE_MAP } from "@/types/driver";

const licenseSchema = z.object({
  licenseType: z.enum(['MCWOG', 'MCG', '3W-NT', '3W-T', 'LMV-NT', 'LMV', 'HMV', 'HPMV', 'HGV']),
  licenseNumber: z.string().min(1, "License number is required"),
  licenseImage: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
  vehicleCategory: z.string(),
  hourlyRate: z.coerce.number().min(50, "Hourly rate must be at least ₹50"),
  expiryDate: z.string().optional(),
  isActive: z.boolean().default(true),
});

const formSchema = z.object({
  status: z.enum(['OFFLINE', 'AVAILABLE', 'UNAVAILABLE']).default('OFFLINE'),
  idProof: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
  licenses: z.array(licenseSchema).min(1, "At least one license is required"),
});

interface DrivingInformationFormProps {
  data?: IDriverInfo;
  onSave: (data: any) => Promise<{ success: boolean; error?: string }>;
  onCancel: () => void;
  isLoading: boolean;
}

const DrivingInformationForm = ({ data, onSave, isLoading, onCancel }: DrivingInformationFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      status: data?.status || 'OFFLINE',
      idProof: data?.idProof || "",
      licenses: data?.licenses?.length > 0 ? data.licenses.map(license => ({
        licenseType: license.licenseType,
        licenseNumber: license.licenseNumber,
        licenseImage: license.licenseImage || "",
        vehicleCategory: license.vehicleCategory || (LICENSE_VEHICLE_MAP as any)[license.licenseType] || "auto",
        hourlyRate: license.hourlyRate || 50,
        expiryDate: license.expiryDate ? new Date(license.expiryDate).toISOString().split('T')[0] : "",
        isActive: license.isActive ?? true,
      })) : [{
        licenseType: 'LMV' as any,
        licenseNumber: "",
        licenseImage: "",
        vehicleCategory: "car",
        hourlyRate: 50,
        expiryDate: "",
        isActive: true,
      }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "licenses",
  });

  useEffect(() => {
    if (data) {
      form.reset({
        status: data.status || 'OFFLINE',
        idProof: data.idProof || "",
        licenses: data.licenses?.length > 0 ? data.licenses.map(license => ({
          licenseType: license.licenseType,
          licenseNumber: license.licenseNumber,
          licenseImage: license.licenseImage || "",
          vehicleCategory: license.vehicleCategory || (LICENSE_VEHICLE_MAP as any)[license.licenseType] || "auto",
          hourlyRate: license.hourlyRate || 50,
          expiryDate: license.expiryDate ? new Date(license.expiryDate).toISOString().split('T')[0] : "",
          isActive: license.isActive ?? true,
        })) : [{
          licenseType: 'LMV' as any,
          licenseNumber: "",
          licenseImage: "",
          vehicleCategory: "car",
          hourlyRate: 50,
          expiryDate: "",
          isActive: true,
        }],
      });
    }
  }, [data, form]);

  const handleLicenseTypeChange = (index: number, value: string) => {
    const vehicleCategory = (LICENSE_VEHICLE_MAP as any)[value] || "auto";
    form.setValue(`licenses.${index}.vehicleCategory`, vehicleCategory);
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    try {
      const result = await onSave(values);
      if (result.success) {
        console.log("Driving information updated successfully");
      } else {
        console.error("Failed to update driving information:", result.error);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* Status Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Current Status</h3>
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="OFFLINE">Offline</SelectItem>
                    <SelectItem value="AVAILABLE">Available</SelectItem>
                    <SelectItem value="UNAVAILABLE">Unavailable</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* ID Proof Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">ID Proof</h3>
          <FormField
            control={form.control}
            name="idProof"
            render={({ field }) => (
              <FormItem>
                <FormLabel>ID Proof URL</FormLabel>
                <FormControl>
                  <Input placeholder="https://example.com/id-proof.png" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Licenses Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Licenses</h3>
            <Button
              type="button"
              variant="outline"
              onClick={() => append({
                licenseType: 'LMV' as any,
                licenseNumber: "",
                licenseImage: "",
                vehicleCategory: "car",
                hourlyRate: 50,
                expiryDate: "",
                isActive: true,
              })}
            >
              Add License
            </Button>
          </div>

          {fields.map((field, index) => (
            <Card key={field.id} className="p-6 border">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-md font-medium">License {index + 1}</h4>
                  {fields.length > 1 && (
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => remove(index)}
                    >
                      Remove
                    </Button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name={`licenses.${index}.licenseType`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>License Type *</FormLabel>
                        <Select onValueChange={(value) => {
                          field.onChange(value);
                          handleLicenseTypeChange(index, value);
                        }} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select license type" />
                            </SelectTrigger>
                          </FormControl>
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
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`licenses.${index}.licenseNumber`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>License Number *</FormLabel>
                        <FormControl>
                          <Input placeholder="Your License Number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name={`licenses.${index}.licenseImage`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>License Image URL</FormLabel>
                        <FormControl>
                          <Input placeholder="https://example.com/license.png" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`licenses.${index}.vehicleCategory`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Vehicle Category</FormLabel>
                        <FormControl>
                          <Input {...field} disabled />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name={`licenses.${index}.hourlyRate`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Hourly Rate (₹) *</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="e.g., 250" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`licenses.${index}.expiryDate`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Expiry Date</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name={`licenses.${index}.isActive`}
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base font-normal">Active License</FormLabel>
                        <p className="text-sm text-muted-foreground">
                          Enable this license for ride assignments
                        </p>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </Card>
          ))}
        </div>

        {/* Read-only Stats */}
        {data && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Statistics</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 border rounded-lg">
                <p className="text-sm font-medium text-muted-foreground">Rating</p>
                <p className="text-2xl font-bold">{data.rating || 0}</p>
              </div>
              <div className="p-4 border rounded-lg">
                <p className="text-sm font-medium text-muted-foreground">Total Trips</p>
                <p className="text-2xl font-bold">{data.totalTrips || 0}</p>
              </div>
            </div>
          </div>
        )}

        <div className="flex gap-4">
          <Button
            type="submit"
            disabled={isSubmitting || isLoading}
            className="flex-1"
          >
            {isSubmitting || isLoading ? "Saving..." : "Save Driving Information"}
          </Button>
          <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default DrivingInformationForm;
