import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { createSeedState, STORAGE_KEY } from '../data/seed';
import { nextTicketId } from '../lib/ticketId';
import { nextStatus } from '../lib/statusMachine';
import type {
  DemoState,
  Department,
  LocationInfo,
  Priority,
  Ticket,
  TicketStatus,
  User,
  Vehicle,
  VehicleStatus,
} from '../types';

interface CreateTicketInput {
  vehicleId: string;
  department: Department;
  issue: string;
  description: string;
  priority: Priority;
  location: LocationInfo;
  photos: string[];
}

interface DemoStoreValue {
  state: DemoState;
  currentUser: User | null;
  loginAs: (userId: string) => void;
  logout: () => void;
  resetDemo: () => void;
  createTicket: (input: CreateTicketInput) => Ticket;
  advanceTicketStatus: (ticketId: string, note?: string) => void;
  setTicketStatus: (ticketId: string, status: TicketStatus, note?: string) => void;
  assignTechnician: (ticketId: string, technicianId: string) => void;
  addTicketNote: (ticketId: string, text: string) => void;
  upsertVehicle: (vehicle: Vehicle) => void;
  getUser: (id: string) => User | undefined;
  getVehicle: (id: string) => Vehicle | undefined;
  ticketsForDriver: (driverId: string) => Ticket[];
  ticketsForTechnician: (tech: User) => Ticket[];
  vehiclesForDriver: (driverId: string) => Vehicle[];
}

const DemoStoreContext = createContext<DemoStoreValue | null>(null);

function loadState(): DemoState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return createSeedState();
    const parsed = JSON.parse(raw) as DemoState;
    if (!parsed.users?.length) return createSeedState();
    return parsed;
  } catch {
    return createSeedState();
  }
}

export function DemoStoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<DemoState>(() => loadState());

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const currentUser = useMemo(
    () => state.users.find((u) => u.id === state.currentUserId) ?? null,
    [state.users, state.currentUserId],
  );

  const loginAs = useCallback((userId: string) => {
    setState((s) => ({ ...s, currentUserId: userId }));
  }, []);

  const logout = useCallback(() => {
    setState((s) => ({ ...s, currentUserId: null }));
  }, []);

  const resetDemo = useCallback(() => {
    const fresh = createSeedState();
    setState(fresh);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(fresh));
  }, []);

  const getUser = useCallback(
    (id: string) => state.users.find((u) => u.id === id),
    [state.users],
  );

  const getVehicle = useCallback(
    (id: string) => state.vehicles.find((v) => v.id === id),
    [state.vehicles],
  );

  const createTicket = useCallback(
    (input: CreateTicketInput) => {
      const driverId = state.currentUserId!;
      const now = new Date().toISOString();
      const seq = state.ticketSeq + 1;
      const ticket: Ticket = {
        id: nextTicketId(seq),
        vehicleId: input.vehicleId,
        driverId,
        department: input.department,
        issue: input.issue,
        description: input.description,
        priority: input.priority,
        location: input.location,
        photos: input.photos,
        status: 'submitted',
        notes: [],
        statusHistory: [{ status: 'submitted', at: now, byUserId: driverId }],
        createdAt: now,
        updatedAt: now,
      };

      setState((s) => ({
        ...s,
        ticketSeq: seq,
        tickets: [ticket, ...s.tickets],
        vehicles: s.vehicles.map((v) =>
          v.id === input.vehicleId
            ? { ...v, status: 'breakdown' as VehicleStatus }
            : v,
        ),
      }));

      return ticket;
    },
    [state.currentUserId, state.ticketSeq],
  );

  const mutateTicket = useCallback(
    (
      ticketId: string,
      updater: (t: Ticket) => Ticket,
      vehicleStatus?: VehicleStatus,
    ) => {
      setState((s) => {
        const tickets = s.tickets.map((t) =>
          t.id === ticketId ? updater(t) : t,
        );
        const ticket = tickets.find((t) => t.id === ticketId);
        let vehicles = s.vehicles;
        if (ticket && vehicleStatus) {
          vehicles = s.vehicles.map((v) =>
            v.id === ticket.vehicleId ? { ...v, status: vehicleStatus } : v,
          );
        }
        return { ...s, tickets, vehicles };
      });
    },
    [],
  );

  const advanceTicketStatus = useCallback(
    (ticketId: string, note?: string) => {
      const userId = state.currentUserId ?? undefined;
      setState((s) => {
        const ticket = s.tickets.find((t) => t.id === ticketId);
        if (!ticket) return s;
        const n = nextStatus(ticket.status);
        if (!n) return s;
        const now = new Date().toISOString();
        const notes = note
          ? [
              ...ticket.notes,
              {
                id: `n-${Date.now()}`,
                authorId: userId ?? 'system',
                text: note,
                createdAt: now,
              },
            ]
          : ticket.notes;
        const updated: Ticket = {
          ...ticket,
          status: n,
          assignedTechnicianId:
            n === 'accepted' || n === 'team_assigned'
              ? ticket.assignedTechnicianId ?? userId
              : ticket.assignedTechnicianId,
          notes,
          statusHistory: [
            ...ticket.statusHistory,
            { status: n, at: now, byUserId: userId },
          ],
          updatedAt: now,
          resolvedAt:
            n === 'repair_completed' || n === 'closed'
              ? now
              : ticket.resolvedAt,
        };
        const vehicles =
          n === 'closed' || n === 'repair_completed'
            ? s.vehicles.map((v) =>
                v.id === ticket.vehicleId
                  ? { ...v, status: 'active' as VehicleStatus }
                  : v,
              )
            : s.vehicles;
        return {
          ...s,
          tickets: s.tickets.map((t) => (t.id === ticketId ? updated : t)),
          vehicles,
        };
      });
    },
    [state.currentUserId],
  );

  const setTicketStatus = useCallback(
    (ticketId: string, status: TicketStatus, note?: string) => {
      const userId = state.currentUserId ?? undefined;
      const now = new Date().toISOString();
      setState((s) => {
        const ticket = s.tickets.find((t) => t.id === ticketId);
        if (!ticket) return s;
        const updated: Ticket = {
          ...ticket,
          status,
          notes: note
            ? [
                ...ticket.notes,
                {
                  id: `n-${Date.now()}`,
                  authorId: userId ?? 'system',
                  text: note,
                  createdAt: now,
                },
              ]
            : ticket.notes,
          statusHistory: [
            ...ticket.statusHistory,
            { status, at: now, byUserId: userId },
          ],
          updatedAt: now,
          resolvedAt:
            status === 'repair_completed' || status === 'closed'
              ? now
              : ticket.resolvedAt,
          assignedTechnicianId:
            status === 'accepted' && !ticket.assignedTechnicianId
              ? userId
              : ticket.assignedTechnicianId,
        };
        const vehicles =
          status === 'closed' || status === 'repair_completed'
            ? s.vehicles.map((v) =>
                v.id === ticket.vehicleId
                  ? { ...v, status: 'active' as VehicleStatus }
                  : v,
              )
            : s.vehicles;
        return {
          ...s,
          tickets: s.tickets.map((t) => (t.id === ticketId ? updated : t)),
          vehicles,
        };
      });
    },
    [state.currentUserId],
  );

  const assignTechnician = useCallback(
    (ticketId: string, technicianId: string) => {
      const now = new Date().toISOString();
      const userId = state.currentUserId ?? undefined;
      mutateTicket(ticketId, (t) => {
        const alreadyAssigned = t.status !== 'submitted';
        const status: TicketStatus = alreadyAssigned
          ? t.status
          : 'team_assigned';
        return {
          ...t,
          assignedTechnicianId: technicianId,
          status,
          statusHistory:
            status !== t.status
              ? [
                  ...t.statusHistory,
                  { status, at: now, byUserId: userId },
                ]
              : t.statusHistory,
          updatedAt: now,
        };
      });
    },
    [mutateTicket, state.currentUserId],
  );

  const addTicketNote = useCallback(
    (ticketId: string, text: string) => {
      const userId = state.currentUserId ?? 'system';
      const now = new Date().toISOString();
      mutateTicket(ticketId, (t) => ({
        ...t,
        notes: [
          ...t.notes,
          { id: `n-${Date.now()}`, authorId: userId, text, createdAt: now },
        ],
        updatedAt: now,
      }));
    },
    [mutateTicket, state.currentUserId],
  );

  const upsertVehicle = useCallback((vehicle: Vehicle) => {
    setState((s) => {
      const exists = s.vehicles.some((v) => v.id === vehicle.id);
      return {
        ...s,
        vehicles: exists
          ? s.vehicles.map((v) => (v.id === vehicle.id ? vehicle : v))
          : [...s.vehicles, vehicle],
      };
    });
  }, []);

  const ticketsForDriver = useCallback(
    (driverId: string) =>
      state.tickets
        .filter((t) => t.driverId === driverId)
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
    [state.tickets],
  );

  const ticketsForTechnician = useCallback(
    (tech: User) =>
      state.tickets
        .filter(
          (t) =>
            t.department === tech.department &&
            (t.status === 'submitted' ||
              t.assignedTechnicianId === tech.id ||
              !t.assignedTechnicianId),
        )
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
    [state.tickets],
  );

  const vehiclesForDriver = useCallback(
    (driverId: string) =>
      state.vehicles.filter((v) => v.assignedDriverId === driverId),
    [state.vehicles],
  );

  const value = useMemo<DemoStoreValue>(
    () => ({
      state,
      currentUser,
      loginAs,
      logout,
      resetDemo,
      createTicket,
      advanceTicketStatus,
      setTicketStatus,
      assignTechnician,
      addTicketNote,
      upsertVehicle,
      getUser,
      getVehicle,
      ticketsForDriver,
      ticketsForTechnician,
      vehiclesForDriver,
    }),
    [
      state,
      currentUser,
      loginAs,
      logout,
      resetDemo,
      createTicket,
      advanceTicketStatus,
      setTicketStatus,
      assignTechnician,
      addTicketNote,
      upsertVehicle,
      getUser,
      getVehicle,
      ticketsForDriver,
      ticketsForTechnician,
      vehiclesForDriver,
    ],
  );

  return (
    <DemoStoreContext.Provider value={value}>
      {children}
    </DemoStoreContext.Provider>
  );
}

export function useDemoStore() {
  const ctx = useContext(DemoStoreContext);
  if (!ctx) throw new Error('useDemoStore must be used within DemoStoreProvider');
  return ctx;
}
