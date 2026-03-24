
"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
import { useEffect, useState } from "react";
import { IUser } from "@/types/driver";
import dynamic from 'next/dynamic';

const Map = dynamic(() => import('../common/Map'), {
  ssr: false,
  loading: () => <p>Loading map...</p>,
});

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  phone: z.string().min(10, { message: "Phone number must be at least 10 digits." }),
  age: z.coerce.number().min(18, { message: "You must be at least 18 years old." }),
  gender: z.string().min(1, {message: "Gender is required"}),
  profileImage: z.string().url({ message: "Please enter a valid URL." }).optional().or(z.literal("")),
  permanentAddress: z.object({
    addressLine1: z.string().min(5, { message: "Address line 1 is required." }),
    addressLine2: z.string().optional(),
    village: z.string().optional(),
    tehsil: z.string().optional(),
    district: z.string().min(2, { message: "District is required." }),
    state: z.string().min(2, { message: "State is required." }),
    pincode: z.string().regex(/^\d{6}$/, { message: "Pincode must be 6 digits." }),
    coordinates: z.object({
      lat: z.number(),
      lng: z.number(),
    }).optional()
  }),
});

interface PersonalInformationFormProps {
  profile: IUser;
  onSave: (data: any) => void;
  onCancel: () => void;
}

const PersonalInformationForm = ({ profile, onSave, onCancel }: PersonalInformationFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mapPosition, setMapPosition] = useState<[number, number] | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: profile?.name || "",
      phone: profile?.phone || "",
      age: profile?.age || 18,
      gender: profile?.gender || "",
      profileImage: profile?.profileImage || "",
      permanentAddress: {
        addressLine1: profile?.permanentAddress?.addressLine1 || "",
        addressLine2: profile?.permanentAddress?.addressLine2 || "",
        village: profile?.permanentAddress?.village || "",
        tehsil: profile?.permanentAddress?.tehsil || "",
        district: profile?.permanentAddress?.district || "",
        state: profile?.permanentAddress?.state || "",
        pincode: profile?.permanentAddress?.pincode || "",
        coordinates: profile?.permanentAddress?.coordinates || { lat: 0, lng: 0 },
      },
    },
  });

  useEffect(() => {
    if (profile) {
      const initialPos = profile.permanentAddress?.coordinates;
      if (initialPos?.lat && initialPos?.lng) {
        setMapPosition([initialPos.lat, initialPos.lng]);
      } else {
        setMapPosition([21.1458, 79.0882]); // Default to Nagpur
      }
    }
  }, [profile]);

  const handleLocationSelect = async (lat: number, lng: number) => {
    setMapPosition([lat, lng]);
    form.setValue("permanentAddress.coordinates", { lat, lng });
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
      const addressData = await response.json();
      const { address } = addressData;
      form.setValue("permanentAddress.addressLine1", address.road || "");
      form.setValue("permanentAddress.village", address.village || "");
      form.setValue("permanentAddress.tehsil", address.county || "");
      form.setValue("permanentAddress.district", address.state_district || "");
      form.setValue("permanentAddress.state", address.state || "");
      form.setValue("permanentAddress.pincode", address.postcode || "");
    } catch (error) {
      console.error("Error fetching address:", error);
    }
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    try {
      await onSave(values);
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
       <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField control={form.control} name="name" render={({ field }) => (<FormItem><FormLabel>Name *</FormLabel><FormControl><Input placeholder="Your Name" {...field} /></FormControl><FormMessage /></FormItem>)} />
          <FormField control={form.control} name="phone" render={({ field }) => (<FormItem><FormLabel>Phone *</FormLabel><FormControl><Input placeholder="Your Phone Number" {...field} /></FormControl><FormMessage /></FormItem>)} />
          <FormField control={form.control} name="age" render={({ field }) => (<FormItem><FormLabel>Age *</FormLabel><FormControl><Input type="number" placeholder="Your Age" {...field} /></FormControl><FormMessage /></FormItem>)} />
          <FormField control={form.control} name="gender" render={({ field }) => (<FormItem><FormLabel>Gender *</FormLabel><FormControl><Input placeholder="Your Gender" {...field} /></FormControl><FormMessage /></FormItem>)} />
          <FormField control={form.control} name="profileImage" render={({ field }) => (<FormItem className="md:col-span-2"><FormLabel>Profile Image URL</FormLabel><FormControl><Input placeholder="https://example.com/image.png" {...field} /></FormControl><FormMessage /></FormItem>)} />
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Permanent Address</h3>
          <div className="relative h-64 md:h-80 w-full">{mapPosition && <Map onLocationSelect={handleLocationSelect} position={mapPosition} />}</div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField control={form.control} name="permanentAddress.addressLine1" render={({ field }) => (<FormItem className="md:col-span-2"><FormLabel>Address Line 1 *</FormLabel><FormControl><Input placeholder="House No, Street Name" {...field} /></FormControl><FormMessage /></FormItem>)} />
            <FormField control={form.control} name="permanentAddress.addressLine2" render={({ field }) => (<FormItem className="md:col-span-2"><FormLabel>Address Line 2</FormLabel><FormControl><Input placeholder="Apartment, suite, etc. (optional)" {...field} /></FormControl><FormMessage /></FormItem>)} />
            <FormField control={form.control} name="permanentAddress.village" render={({ field }) => (<FormItem><FormLabel>Village/Town</FormLabel><FormControl><Input placeholder="Village or Town" {...field} /></FormControl><FormMessage /></FormItem>)} />
            <FormField control={form.control} name="permanentAddress.tehsil" render={({ field }) => (<FormItem><FormLabel>Tehsil</FormLabel><FormControl><Input placeholder="Tehsil" {...field} /></FormControl><FormMessage /></FormItem>)} />
            <FormField control={form.control} name="permanentAddress.district" render={({ field }) => (<FormItem><FormLabel>District *</FormLabel><FormControl><Input placeholder="District" {...field} /></FormControl><FormMessage /></FormItem>)} />
            <FormField control={form.control} name="permanentAddress.state" render={({ field }) => (<FormItem><FormLabel>State *</FormLabel><FormControl><Input placeholder="State" {...field} /></FormControl><FormMessage /></FormItem>)} />
            <FormField control={form.control} name="permanentAddress.pincode" render={({ field }) => (<FormItem><FormLabel>Pincode *</FormLabel><FormControl><Input placeholder="6-digit Pincode" {...field} /></FormControl><FormMessage /></FormItem>)} />
          </div>
        </div>
        <div className="flex gap-4">
          <Button type="submit" disabled={isSubmitting} className="flex-1">{isSubmitting ? "Saving..." : "Save Personal Information"}</Button>
          <Button type="button" variant="outline" onClick={onCancel} className="flex-1">Cancel</Button>
        </div>
      </form>
    </Form>
  );
};

export default PersonalInformationForm;
