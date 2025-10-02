import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import LoginPage from "./components/auth/LoginPage";
import DashboardLayout from "./components/layout/DashboardLayout";
import ErrorBoundary from "./components/ErrorBoundary";
import AdminDashboard from "./components/dashboard/AdminDashboard";
import BookingManagerDashboard from "./components/dashboard/BookingManagerDashboard";
import DriverDashboard from "./components/dashboard/DriverDashboard";
import OperationsDashboard from "./components/dashboard/OperationsDashboard";
import CentralizedMessages from "./components/messaging/CentralizedMessages";
import BookingManagement from "./components/booking/BookingManagement";
import { NavigationSwitcher } from "./components/NavigationSwitcher";
import NotFound from "./pages/NotFound";
import CustomerManagement from "./components/customer/CustomerManagement";
import TripManagement from "./components/operations/TripManagement";
import DriverAssignment from "./components/operations/DriverAssignment";
import VehicleManagement from "./components/operations/VehicleManagement";
import MyTrips from "./components/driver/MyTrips";
import TripReports from "./components/driver/TripReports";
import PaymentManagement from "./components/finance/PaymentManagement";
import InvoiceManagement from "./components/finance/InvoiceManagement";
import FinancialReports from "./components/finance/FinancialReports";
import SupportTickets from "./components/support/SupportTickets";
import FAQManagement from "./components/support/FAQManagement";
import StaffManagement from "./components/admin/StaffManagement";
import Reports from "./components/admin/Reports";
import SystemSettings from "./components/admin/SystemSettings";
import UserManagement from "./components/admin/UserManagement";
import ForensicMonitoring from "./components/admin/ForensicMonitoring";
import AttendanceManagement from "./components/staff/AttendanceManagement";
import { Loader2 } from "lucide-react";

const queryClient = new QueryClient();

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className='min-h-screen bg-gradient-warm flex items-center justify-center'>
        <div className='flex items-center space-x-2'>
          <div className='animate-spin rounded-full h-6 w-6 border-b-2 border-primary'></div>
          <span>Loading...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to='/login' replace />;
  }

  return <>{children}</>;
};

// Main App Routes Component
const AppRoutes: React.FC = () => {
  const { user, loading } = useAuth();

  return (
    <Routes>
      <Route path='/nav' element={<NavigationSwitcher />} />
      <Route path='/login' element={<LoginPage />} />
      <Route
        path='/'
        element={
          loading ? (
            <div className='min-h-screen flex items-center justify-center'>
              <Loader2 className='h-6 w-6 animate-spin' />
            </div>
          ) : user ? (
            <Navigate to={`/${getRolePrefix(user.role)}/dashboard`} replace />
          ) : (
            <Navigate to='/login' replace />
          )
        }
      />

      {/* Admin Routes */}
      <Route
        path='/admin'
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }>
        <Route path='dashboard' element={<AdminDashboard />} />
        <Route path='messages' element={<CentralizedMessages />} />
        <Route path='customers' element={<CustomerManagement />} />
        <Route path='bookings' element={<BookingManagement />} />
        <Route path='staff' element={<StaffManagement />} />
        <Route path='reports' element={<Reports />} />
        <Route path='settings' element={<SystemSettings />} />
        <Route path='users' element={<UserManagement />} />
        <Route path='forensic' element={<ForensicMonitoring />} />
        <Route path='attendance' element={<AttendanceManagement />} />
      </Route>

      {/* Booking Manager Routes */}
      <Route
        path='/booking'
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }>
        <Route path='dashboard' element={<BookingManagerDashboard />} />
        <Route path='messages' element={<CentralizedMessages />} />
        <Route path='customers' element={<CustomerManagement />} />
        <Route path='bookings' element={<BookingManagement />} />
        <Route path='attendance' element={<AttendanceManagement />} />
      </Route>

      {/* Operations Routes */}
      <Route
        path='/operations'
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }>
        <Route path='dashboard' element={<OperationsDashboard />} />
        <Route path='messages' element={<CentralizedMessages />} />
        <Route path='trips' element={<TripManagement />} />
        <Route path='drivers' element={<DriverAssignment />} />
        <Route path='vehicles' element={<VehicleManagement />} />
        <Route path='attendance' element={<AttendanceManagement />} />
      </Route>

      {/* Driver Routes */}
      <Route
        path='/driver'
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }>
        <Route path='dashboard' element={<DriverDashboard />} />
        <Route path='trips' element={<MyTrips />} />
        <Route path='reports' element={<TripReports />} />
        <Route path='attendance' element={<AttendanceManagement />} />
      </Route>

      {/* Finance Routes */}
      <Route
        path='/finance'
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }>
        <Route path='dashboard' element={<AdminDashboard />} />
        <Route path='payments' element={<PaymentManagement />} />
        <Route path='invoices' element={<InvoiceManagement />} />
        <Route path='reports' element={<FinancialReports />} />
        <Route path='messages' element={<CentralizedMessages />} />
        <Route path='attendance' element={<AttendanceManagement />} />
      </Route>

      {/* Customer Service Routes */}
      <Route
        path='/support'
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }>
        <Route path='dashboard' element={<AdminDashboard />} />
        <Route path='messages' element={<CentralizedMessages />} />
        <Route path='tickets' element={<SupportTickets />} />
        <Route path='faq' element={<FAQManagement />} />
        <Route path='attendance' element={<AttendanceManagement />} />
      </Route>

      <Route
        path='*'
        element={user ? <NotFound /> : <Navigate to='/login' replace />}
      />
    </Routes>
  );
};

// Main App Component
const App = () => {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AuthProvider>
              <AppRoutes />
            </AuthProvider>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

function getRolePrefix(role: string): string {
  const prefixMap: { [key: string]: string } = {
    super_admin: "admin",
    admin: "admin",
    booking_manager: "booking",
    operations_coordinator: "operations",
    driver: "driver",
    finance_officer: "finance",
    customer_service: "support",
  };
  return prefixMap[role] || "admin";
}

export default App;
