export type Role = 'driver' | 'technician' | 'admin';

export type Department =
  | 'mechanical'
  | 'electrical'
  | 'tyre'
  | 'welding'
  | 'suspension';

export type Priority = 'emergency' | 'high' | 'normal';

export type TicketStatus =
  | 'submitted'
  | 'team_assigned'
  | 'accepted'
  | 'work_started'
  | 'repair_completed';

export type VehicleStatus = 'active' | 'breakdown' | 'maintenance';

export interface User {
  id: string;
  name: string;
  role: Role;
  phone: string;
  employeeId: string;
  department?: Department;
}

export interface Vehicle {
  id: string;
  registrationNumber: string;
  type: string;
  manufacturer: string;
  model: string;
  year: number;
  assignedDriverId: string;
  status: VehicleStatus;
  odometer: number;
}

export interface LocationInfo {
  lat: number;
  lng: number;
  address: string;
}

export interface TicketNote {
  id: string;
  authorId: string;
  text: string;
  createdAt: string;
}

export interface StatusEvent {
  status: TicketStatus;
  at: string;
  byUserId?: string;
}

export interface Ticket {
  id: string;
  vehicleId: string;
  driverId: string;
  department: Department;
  issue: string;
  description: string;
  priority: Priority;
  location: LocationInfo;
  photos: string[];
  voiceNote?: string;
  status: TicketStatus;
  assignedTechnicianId?: string;
  notes: TicketNote[];
  statusHistory: StatusEvent[];
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
}

export interface DemoState {
  users: User[];
  vehicles: Vehicle[];
  tickets: Ticket[];
  currentUserId: string | null;
  ticketSeq: number;
}
