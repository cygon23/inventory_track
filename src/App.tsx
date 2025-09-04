import React, { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./components/auth/LoginPage";
import DashboardLayout from "./components/layout/DashboardLayout";
import AdminDashboard from "./components/dashboard/AdminDashboard";
import BookingManagerDashboard from "./components/dashboard/BookingManagerDashboard";
import DriverDashboard from "./components/dashboard/DriverDashboard";
import OperationsDashboard from "./components/dashboard/OperationsDashboard";
import CentralizedMessages from "./components/messaging/CentralizedMessages";
import BookingManagement from "./components/booking/BookingManagement";
import { NavigationSwitcher } from "./components/NavigationSwitcher";
import NotFound from "./pages/NotFound";
import { User, mockCurrentUser } from "./data/mockUsers";
import CustomerManagement from "./components/customer/CustomerManagement";
import TripManagement from "./components/operations/TripManagement";
import DriverAssignment from "./components/operations/DriverAssignment";
import VehicleManagement from "./components/operations/VehicleManagement";

const queryClient = new QueryClient();

const App = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  if (!currentUser) {
    return (
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path='/nav' element={<NavigationSwitcher />} />
              <Route path='*' element={<LoginPage onLogin={handleLogin} />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path='/nav' element={<NavigationSwitcher />} />
            <Route
              path='/'
              element={
                <Navigate
                  to={`/${getRolePrefix(currentUser.role)}/dashboard`}
                  replace
                />
              }
            />

            {/* Admin Routes */}
            <Route
              path='/admin'
              element={
                <DashboardLayout
                  currentUser={currentUser}
                  onLogout={handleLogout}
                />
              }>
              <Route
                path='dashboard'
                element={<AdminDashboard currentUser={currentUser} />}
              />
              <Route
                path='messages'
                element={<CentralizedMessages currentUser={currentUser} />}
              />
              <Route
                path='customers'
                element={<CustomerManagement currentUser={currentUser} />}
              />
              <Route
                path='bookings'
                element={<BookingManagement currentUser={currentUser} />}
              />
              <Route
                path='staff'
                element={<div>Staff Management (Coming Soon)</div>}
              />
              <Route
                path='reports'
                element={<div>Reports (Coming Soon)</div>}
              />
              <Route
                path='settings'
                element={<div>System Settings (Coming Soon)</div>}
              />
              <Route
                path='users'
                element={<div>User Management (Coming Soon)</div>}
              />
            </Route>

            {/* Booking Manager Routes */}
            <Route
              path='/booking'
              element={
                <DashboardLayout
                  currentUser={currentUser}
                  onLogout={handleLogout}
                />
              }>
              <Route
                path='dashboard'
                element={<BookingManagerDashboard currentUser={currentUser} />}
              />
              <Route
                path='messages'
                element={<CentralizedMessages currentUser={currentUser} />}
              />
              <Route
                path='customers'
                element={<CustomerManagement currentUser={currentUser} />}
              />
              <Route
                path='bookings'
                element={<BookingManagement currentUser={currentUser} />}
              />
            </Route>

            {/* Operations Routes */}
            <Route
              path='/operations'
              element={
                <DashboardLayout
                  currentUser={currentUser}
                  onLogout={handleLogout}
                />
              }>
              <Route
                path='dashboard'
                element={<OperationsDashboard currentUser={currentUser} />}
              />
              <Route
                path='messages'
                element={<CentralizedMessages currentUser={currentUser} />}
              />
              <Route
                path='trips'
                element={<TripManagement currentUser={currentUser} />}
              />
              <Route
                path='drivers'
                element={<DriverAssignment currentUser={currentUser} />}
              />
              <Route
                path='vehicles'
                element={<VehicleManagement currentUser={currentUser} />}
              />
            </Route>

            {/* Driver Routes */}
            <Route
              path='/driver'
              element={
                <DashboardLayout
                  currentUser={currentUser}
                  onLogout={handleLogout}
                />
              }>
              <Route
                path='dashboard'
                element={<DriverDashboard currentUser={currentUser} />}
              />
              <Route path='trips' element={<div>My Trips (Coming Soon)</div>} />
              <Route
                path='reports'
                element={<div>Trip Reports (Coming Soon)</div>}
              />
            </Route>

            {/* Finance Routes */}
            <Route
              path='/finance'
              element={
                <DashboardLayout
                  currentUser={currentUser}
                  onLogout={handleLogout}
                />
              }>
              <Route
                path='dashboard'
                element={<AdminDashboard currentUser={currentUser} />}
              />
              <Route
                path='payments'
                element={<div>Payment Management (Coming Soon)</div>}
              />
              <Route
                path='invoices'
                element={<div>Invoice Management (Coming Soon)</div>}
              />
              <Route
                path='reports'
                element={<div>Financial Reports (Coming Soon)</div>}
              />
            </Route>

            {/* Customer Service Routes */}
            <Route
              path='/support'
              element={
                <DashboardLayout
                  currentUser={currentUser}
                  onLogout={handleLogout}
                />
              }>
              <Route
                path='dashboard'
                element={<AdminDashboard currentUser={currentUser} />}
              />
              <Route
                path='messages'
                element={<CentralizedMessages currentUser={currentUser} />}
              />
              <Route
                path='tickets'
                element={<div>Support Tickets (Coming Soon)</div>}
              />
              <Route
                path='faq'
                element={<div>FAQ Management (Coming Soon)</div>}
              />
            </Route>

            <Route path='*' element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

function getRolePrefix(role: string): string {
  const prefixMap: { [key: string]: string } = {
    super_admin: "admin",
    admin: "admin",
    admin_helper: "admin",
    booking_manager: "booking",
    operations_coordinator: "operations",
    driver: "driver",
    finance_officer: "finance",
    customer_service: "support",
  };
  return prefixMap[role] || "admin";
}

export default App;
