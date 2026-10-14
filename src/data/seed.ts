import type { DemoState, Ticket, User, Vehicle } from '../types';

export const SEED_USERS: User[] = [
  {
    id: 'u-driver-1',
    name: 'Ramesh Patil',
    role: 'driver',
    phone: '+919876543210',
    employeeId: 'DRV-1001',
  },
  {
    id: 'u-driver-2',
    name: 'Suresh Kadam',
    role: 'driver',
    phone: '+919876543211',
    employeeId: 'DRV-1002',
  },
  {
    id: 'u-tech-mech',
    name: 'Rajesh Mechanical',
    role: 'technician',
    phone: '+919811122233',
    employeeId: 'TECH-M01',
    department: 'mechanical',
  },
  {
    id: 'u-tech-elec',
    name: 'Amit Electrical',
    role: 'technician',
    phone: '+919811122244',
    employeeId: 'TECH-E01',
    department: 'electrical',
  },
  {
    id: 'u-tech-tyre',
    name: 'Vikram Tyre',
    role: 'technician',
    phone: '+919811122255',
    employeeId: 'TECH-T01',
    department: 'tyre',
  },
  {
    id: 'u-admin',
    name: 'Priya Supervisor',
    role: 'admin',
    phone: '+919900011122',
    employeeId: 'ADM-001',
  },
];

export const SEED_VEHICLES: Vehicle[] = [
  {
    id: 'v-1',
    registrationNumber: 'MH 12 AB 4587',
    type: 'Trailer Truck',
    manufacturer: 'Tata',
    model: 'Signa 4018',
    year: 2022,
    assignedDriverId: 'u-driver-1',
    status: 'breakdown',
    odometer: 84250,
  },
  {
    id: 'v-2',
    registrationNumber: 'MH 04 CD 1234',
    type: 'Container Truck',
    manufacturer: 'Ashok Leyland',
    model: '4825',
    year: 2021,
    assignedDriverId: 'u-driver-2',
    status: 'breakdown',
    odometer: 112400,
  },
];

const now = Date.now();
const hours = (h: number) => new Date(now - h * 3600_000).toISOString();

export const SEED_TICKETS: Ticket[] = [
  {
    id: 'BRK-2026-001020',
    vehicleId: 'v-2',
    driverId: 'u-driver-2',
    department: 'electrical',
    issue: 'Battery dead',
    description: 'Vehicle will not start. Battery appears drained at yard.',
    priority: 'high',
    location: {
      lat: 18.9388,
      lng: 72.8354,
      address: 'PSA Ameya CFS Yard, Navi Mumbai',
    },
    photos: [],
    status: 'submitted',
    notes: [],
    statusHistory: [{ status: 'submitted', at: hours(2), byUserId: 'u-driver-2' }],
    createdAt: hours(2),
    updatedAt: hours(2),
  },
  {
    id: 'BRK-2026-001015',
    vehicleId: 'v-1',
    driverId: 'u-driver-1',
    department: 'tyre',
    issue: 'Puncture',
    description: 'Rear left tyre puncture near expressway exit.',
    priority: 'normal',
    location: {
      lat: 18.8302,
      lng: 73.2567,
      address: 'Mumbai-Pune Expressway, Khalapur',
    },
    photos: [],
    status: 'repair_completed',
    assignedTechnicianId: 'u-tech-tyre',
    notes: [
      {
        id: 'n-1',
        authorId: 'u-tech-tyre',
        text: 'Replaced with spare and repaired puncture.',
        createdAt: hours(48),
      },
    ],
    statusHistory: [
      { status: 'submitted', at: hours(72), byUserId: 'u-driver-1' },
      { status: 'team_assigned', at: hours(71), byUserId: 'u-admin' },
      { status: 'accepted', at: hours(70), byUserId: 'u-tech-tyre' },
      { status: 'work_started', at: hours(68), byUserId: 'u-tech-tyre' },
      { status: 'repair_completed', at: hours(67), byUserId: 'u-tech-tyre' },
    ],
    createdAt: hours(72),
    updatedAt: hours(66),
    resolvedAt: hours(66),
  },
  {
    id: 'BRK-2026-001018',
    vehicleId: 'v-1',
    driverId: 'u-driver-1',
    department: 'mechanical',
    issue: 'Clutch problem',
    description: 'Clutch slipping under load on incline.',
    priority: 'emergency',
    location: {
      lat: 19.076,
      lng: 72.8777,
      address: 'JNPT Approach Road, Uran',
    },
    photos: [],
    status: 'team_assigned',
    assignedTechnicianId: 'u-tech-mech',
    notes: [],
    statusHistory: [
      { status: 'submitted', at: hours(5), byUserId: 'u-driver-1' },
      { status: 'team_assigned', at: hours(4.5), byUserId: 'u-admin' },
    ],
    createdAt: hours(5),
    updatedAt: hours(4.5),
  },
];

export function createSeedState(): DemoState {
  return {
    users: structuredClone(SEED_USERS),
    vehicles: structuredClone(SEED_VEHICLES),
    tickets: structuredClone(SEED_TICKETS),
    currentUserId: null,
    ticketSeq: 10254,
  };
}

export const DEMO_LOGIN_IDS = [
  'u-driver-1',
  'u-driver-2',
  'u-tech-mech',
  'u-tech-elec',
  'u-admin',
] as const;

export const STORAGE_KEY = 'psa-ameya-breakdown-demo-v2';
