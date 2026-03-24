export type PaginationMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type ApiListResponse<T> = {
  success: boolean;
  data: T[];
  meta: PaginationMeta;
};

export type ApiItemResponse<T> = {
  success: boolean;
  data: T;
};

export type ApiErrorResponse = {
  success: false;
  code?: string;
  message: string;
  errors?: Record<string, string>;
};

export type LoadingState = "idle" | "loading" | "success" | "error";

export type AdminUserRole = "passenger" | "driver" | "owner" | "admin";

export type AdminUserStatusFilter = "active" | "blocked";

export type AdminUserListItem = {
  id: string;
  name: string;
  email: string;
  phone: string;
  roles: AdminUserRole[];
  isActive: boolean;
  createdAt?: string;
};

export type AdminUserDetail = AdminUserListItem & {
  profileImage?: string;
};

export type AdminBookingStatus =
  | "REQUESTED"
  | "ACCEPTED"
  | "ENROUTE"
  | "STARTED"
  | "COMPLETED"
  | "CANCELLED"
  | "requested"
  | "accepted"
  | "enroute"
  | "started"
  | "completed"
  | "cancelled";

export type AdminBookingListItem = {
  id: string;
  status: AdminBookingStatus;
  bookingType?: string;
  passenger?: {
    id: string;
    name: string;
    email: string;
    phone?: string;
  };
  driver?: {
    id: string;
    name: string;
    email: string;
  };
  scheduledDateTime?: string;
  createdAt?: string;
  fare?: {
    estimatedFare?: number;
    finalFare?: number;
    platformFee?: number;
  };
};

export type AdminStats = {
  usersCount: number;
  bookingsCount: number;
  activeDriversCount: number;
  revenue: number;
};
