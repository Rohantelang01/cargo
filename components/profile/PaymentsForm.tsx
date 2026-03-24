
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
import { useEffect, useState } from "react";
import { IWallet } from "@/types/profile";

const bankDetailsSchema = z.object({
    accountNumber: z.string().min(1, "Account number is required"),
    bankName: z.string().min(1, "Bank name is required"),
    ifscCode: z.string().min(1, "IFSC code is required"),
});

const paymentMethodSchema = z.object({
  type: z.enum(['upi', 'bank']),
  upiId: z.string().optional(),
  bankDetails: bankDetailsSchema.optional(),
});

const formSchema = z.object({
  paymentMethods: z.array(paymentMethodSchema),
});

interface PaymentsFormProps {
  data?: IWallet;
  onSave: (data: any) => Promise<{ success: boolean; error?: string }>;
  isLoading: boolean;
  onCancel: () => void;
}

const PaymentsForm = ({ data, onSave, isLoading, onCancel }: PaymentsFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      paymentMethods: data?.paymentMethods || [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "paymentMethods",
  });

  useEffect(() => {
    if (data?.paymentMethods) {
      form.reset({ paymentMethods: data.paymentMethods });
    }
  }, [data, form]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    try {
      await onSave({ paymentMethods: values.paymentMethods });
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="border-t pt-6 space-y-4">
          {fields.map((field, index) => (
            <div key={field.id} className="border-b pb-6 mb-6 space-y-4">
                <FormField
                control={form.control}
                name={`paymentMethods.${index}.type`}
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Payment Method Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl><SelectTrigger><SelectValue placeholder="Select a type" /></SelectTrigger></FormControl>
                        <SelectContent>
                        <SelectItem value="upi">UPI</SelectItem>
                        <SelectItem value="bank">Bank Account</SelectItem>
                        </SelectContent>
                    </Select>
                    <FormMessage />
                    </FormItem>
                )}
                />

                {form.watch(`paymentMethods.${index}.type`) === 'upi' && (
                <FormField
                    control={form.control}
                    name={`paymentMethods.${index}.upiId`}
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>UPI ID</FormLabel>
                        <FormControl><Input placeholder="yourname@upi" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                )}

                {form.watch(`paymentMethods.${index}.type`) === 'bank' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField control={form.control} name={`paymentMethods.${index}.bankDetails.bankName`} render={({ field }) => (<FormItem><FormLabel>Bank Name</FormLabel><FormControl><Input placeholder="e.g., State Bank of India" {...field} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name={`paymentMethods.${index}.bankDetails.accountNumber`} render={({ field }) => (<FormItem><FormLabel>Account Number</FormLabel><FormControl><Input placeholder="Your Account Number" {...field} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name={`paymentMethods.${index}.bankDetails.ifscCode`} render={({ field }) => (<FormItem><FormLabel>IFSC Code</FormLabel><FormControl><Input placeholder="Your IFSC Code" {...field} /></FormControl><FormMessage /></FormItem>)} />
                </div>
                )}

                <Button type="button" variant="destructive" onClick={() => remove(index)}>Remove Method</Button>
            </div>
            ))}
        </div>

        <Button
          type="button"
          variant="outline"
          onClick={() => append({ type: 'upi', upiId: '' })}
        >
          Add Payment Method
        </Button>

        <div className="flex gap-4 pt-8">
          <Button type="submit" disabled={isSubmitting || isLoading} className="flex-1">{isSubmitting || isLoading ? "Saving..." : "Save Payment Information"}</Button>
          <Button type="button" variant="outline" onClick={onCancel} className="flex-1">Cancel</Button>
        </div>
      </form>
    </Form>
  );
};

export default PaymentsForm;
