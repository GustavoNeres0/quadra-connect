export enum ProfileType {
  COMPANY = "COMPANY",
  CUSTOMER = "CUSTOMER",
  ADMIN = "ADMIN",
}

export enum ReservationStatus {
  PENDING = "PENDING",
  CONFIRMED = "CONFIRMED",
  REJECTED = "REJECTED",
  CANCELLED = "CANCELLED",
  COMPLETED = "COMPLETED",
}

export interface AuthUser {
  id: string;
  email: string | null;
  role: "LOCATOR" | "CUSTOMER" | "ADMIN";
  profileType: ProfileType;
  companyId: string | null;
  customerId: string | null;
}

export interface AuthResponse {
  accessToken: string;
  user: AuthUser;
}

export interface Category {
  id: string;
  name: string;
}

export interface Unit {
  id: string;
  companyId: string;
  categoryId: string;
  name: string;
  description: string | null;
  address: string;
  city: string;
  state: string;
  pricePerHour: string; // a API retorna como string (Decimal do Prisma)
  requiresConfirmation: boolean;
  bailValue: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Reservation {
  id: string;
  customerId: string;
  unitId: string;
  startTime: string; // ISO datetime
  endTime: string;   // ISO datetime
  status: ReservationStatus;
  totalPrice: string;
  bailPaid: boolean;
  isSplit: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CustomerProfile {
  id: string;
  userId: string;
  name: string;
  cpf: string;
  phone: string | null;
  createdAt: string;
  updatedAt: string;
}