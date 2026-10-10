import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { DemoBar } from './components/DemoBar';
import { RequireAuth } from './components/RequireAuth';
import { DemoStoreProvider } from './store/DemoStore';
import { Login } from './pages/Login';
import { DriverHome } from './pages/driver/Home';
import { ReportWizard } from './pages/driver/ReportWizard';
import {
  DriverComplaintDetail,
  DriverComplaints,
} from './pages/driver/Complaints';
import { DriverVehicle } from './pages/driver/Vehicle';
import { DriverHistory } from './pages/driver/History';
import { TechDashboard, TechProfile } from './pages/tech/Dashboard';
import { TechTicketDetail } from './pages/tech/TicketDetail';
import { AdminLayout } from './pages/admin/Layout';
import { AdminDashboard } from './pages/admin/Dashboard';
import { AdminBreakdowns } from './pages/admin/Breakdowns';
import { AdminVehicles } from './pages/admin/Vehicles';
import { AdminPeople } from './pages/admin/People';
import { AdminDepartments } from './pages/admin/Departments';

export default function App() {
  return (
    <DemoStoreProvider>
      <BrowserRouter>
        <div className="app-root">
          <DemoBar />
          <Routes>
            <Route path="/" element={<Login />} />

            <Route
              path="/driver"
              element={
                <RequireAuth role="driver">
                  <DriverHome />
                </RequireAuth>
              }
            />
            <Route
              path="/driver/report"
              element={
                <RequireAuth role="driver">
                  <ReportWizard />
                </RequireAuth>
              }
            />
            <Route
              path="/driver/complaints"
              element={
                <RequireAuth role="driver">
                  <DriverComplaints />
                </RequireAuth>
              }
            />
            <Route
              path="/driver/complaints/:ticketId"
              element={
                <RequireAuth role="driver">
                  <DriverComplaintDetail />
                </RequireAuth>
              }
            />
            <Route
              path="/driver/vehicle"
              element={
                <RequireAuth role="driver">
                  <DriverVehicle />
                </RequireAuth>
              }
            />
            <Route
              path="/driver/history"
              element={
                <RequireAuth role="driver">
                  <DriverHistory />
                </RequireAuth>
              }
            />

            <Route
              path="/tech"
              element={
                <RequireAuth role="technician">
                  <TechDashboard />
                </RequireAuth>
              }
            />
            <Route
              path="/tech/profile"
              element={
                <RequireAuth role="technician">
                  <TechProfile />
                </RequireAuth>
              }
            />
            <Route
              path="/tech/tickets/:ticketId"
              element={
                <RequireAuth role="technician">
                  <TechTicketDetail />
                </RequireAuth>
              }
            />

            <Route
              path="/admin"
              element={
                <RequireAuth role="admin">
                  <AdminLayout />
                </RequireAuth>
              }
            >
              <Route index element={<AdminDashboard />} />
              <Route path="breakdowns" element={<AdminBreakdowns />} />
              <Route path="vehicles" element={<AdminVehicles />} />
              <Route path="people" element={<AdminPeople />} />
              <Route path="departments" element={<AdminDepartments />} />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </BrowserRouter>
    </DemoStoreProvider>
  );
}
