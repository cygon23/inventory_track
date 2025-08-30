import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ClientDashboard from "./pages/ClientDashboard";
import StaffDashboard from "./pages/StaffDashboard";
import FieldDashboard from "./pages/FieldDashboard";
import { NavigationSwitcher } from "./components/NavigationSwitcher";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<NavigationSwitcher />} />
          {/* <Route path="/" element={<ClientDashboard />} /> */}
          <Route path='/client' element={<ClientDashboard />} />
          <Route path='/staff' element={<StaffDashboard />} />
          <Route path='/staff/clients' element={<StaffDashboard />} />
          <Route path='/staff/analytics' element={<StaffDashboard />} />
          <Route path='/field' element={<FieldDashboard />} />
          <Route path='/field/schedule' element={<FieldDashboard />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path='*' element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
