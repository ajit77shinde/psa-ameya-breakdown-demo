import type { Department } from '../types';

export interface DepartmentMeta {
  id: Department;
  label: string;
  examples: string;
  color: string;
  icon: string;
}

export const DEPARTMENTS: DepartmentMeta[] = [
  {
    id: 'mechanical',
    label: 'Mechanical',
    examples: 'Engine, Fuel, Gear, etc.',
    color: 'var(--dept-mechanical)',
    icon: '🔧',
  },
  {
    id: 'electrical',
    label: 'Electrical',
    examples: 'Battery, Lights, Wiring, etc.',
    color: 'var(--dept-electrical)',
    icon: '⚡',
  },
  {
    id: 'tyre',
    label: 'Tyre',
    examples: 'Tyre Puncture, Replacement, etc.',
    color: 'var(--dept-tyre)',
    icon: '🛞',
  },
  {
    id: 'welding',
    label: 'Welding',
    examples: 'Body, Frame, Fabrication, etc.',
    color: 'var(--dept-welding)',
    icon: '🔨',
  },
  {
    id: 'suspension',
    label: 'Suspension',
    examples: 'Leaf Spring, Shock Absorber, etc.',
    color: 'var(--dept-suspension)',
    icon: '🛠',
  },
];

export const ISSUE_CATALOG: Record<Department, string[]> = {
  mechanical: [
    'Engine overheating',
    'Engine not starting',
    'Oil leakage',
    'Gear problem',
    'Clutch problem',
    'Brake problem',
    'Fuel problem',
    'Engine noise',
    'Other',
  ],
  electrical: [
    'Battery dead',
    'Self-start not working',
    'Lights not working',
    'Wiring problem',
    'Alternator',
    'Sensor failure',
    'Other',
  ],
  tyre: [
    'Puncture',
    'Tyre burst',
    'Tyre damaged',
    'Wheel problem',
    'Tyre pressure',
    'Spare tyre required',
    'Other',
  ],
  welding: [
    'Body damage',
    'Chassis welding',
    'Container issue',
    'Bracket repair',
    'Fabrication',
    'Structural damage',
    'Other',
  ],
  suspension: [
    'Leaf spring',
    'Shock absorber',
    'Suspension noise',
    'Axle-related issue',
    'Suspension breakdown',
    'Other',
  ],
};

export function getDepartmentMeta(id: Department): DepartmentMeta {
  return DEPARTMENTS.find((d) => d.id === id)!;
}
