"use client";

import Image from "next/image";
import { FileText } from "lucide-react";
import type { ILicense } from "@/types/driver";
import { licenseStatusClass, isLicenseExpired } from "./CardHelpers";

interface LicenseImageProps {
  lic: ILicense;
}

export function LicenseImage({ lic }: LicenseImageProps) {
  const formatDate = (dateString?: string) => {
    if (!dateString) return null;
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <div className="flex gap-3">
      {/* License Image */}
      <div className="relative h-16 w-28 rounded-md border border-border bg-muted overflow-hidden">
        {lic.licenseImage ? (
          <Image
            src={lic.licenseImage}
            alt="License"
            fill
            className="object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
              const fallback = target.nextElementSibling as HTMLElement;
              if (fallback) fallback.style.display = 'flex';
            }}
          />
        ) : null}
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-muted hidden">
          <FileText className="h-4 w-4 text-muted-foreground mb-1" />
          <span className="text-xs text-muted-foreground">No image</span>
        </div>
      </div>

      {/* License Details */}
      <div className="flex-1 space-y-1">
        <div className="font-medium text-sm">{lic.licenseType}</div>
        <div className="font-mono text-[11px] text-muted-foreground">
          {lic.licenseNumber}
        </div>
        {lic.expiryDate && (
          <div className="text-xs text-muted-foreground">
            Valid till: {formatDate(lic.expiryDate)}
          </div>
        )}
        <div className="text-sm font-semibold text-emerald-600">
          ₹{lic.hourlyRate}/hr
        </div>
        <div className={`inline-block px-2 py-0.5 text-xs font-medium rounded border ${licenseStatusClass(lic)}`}>
          {lic.isActive && !isLicenseExpired(lic) ? 'Active' : 'Inactive'}
        </div>
      </div>
    </div>
  );
}
