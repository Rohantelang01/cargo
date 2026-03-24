export interface HeroSectionProps {
  badge?: string;
  heading: string;
  description: string;
  image: {
    src: string;
    alt: string;
  };
}

export interface BookingFormData {
  pickup: string;
  dropoff: string;
  dateTime: string;
  role: "customer" | "driver" | "vehicle-owner";
}