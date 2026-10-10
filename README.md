# PSA AMEYA · Truck Breakdown App (Phase 1 Demo)

Frontend-only stakeholder demo for the fleet breakdown reporting workflow.

**Driver reports → department/technician acts → admin tracks**

## Run

```bash
cd psa-ameya-breakdown-demo
npm install
npm run dev
```

Open the URL Vite prints (usually `http://localhost:5173`).

## Demo personas

| Persona | Role |
|---|---|
| Ramesh Patil | Driver — report & track |
| Rajesh Mechanical | Technician — accept & update jobs |
| Amit Electrical | Technician — department filter |
| Priya Supervisor | Admin — dashboard & assign |

Use the top **Demo Mode** bar to switch personas or **Reset data**.

## Stack

Vite + React + TypeScript + React Router · mock store in `localStorage` · no backend.
