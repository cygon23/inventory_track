import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, 
  MessageSquare, 
  Users, 
  Calendar, 
  UserCheck, 
  MapPin, 
  DollarSign, 
  BarChart3, 
  Settings,
  Car,
  Headphones,
  FileText,
  Shield,
  Route
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { rolePermissions as rolePermissionsConst } from '@/lib/constants';
import { Badge } from '@/components/ui/badge';

interface DashboardSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  isMobile: boolean;
}

const DashboardSidebar: React.FC<DashboardSidebarProps> = ({ isOpen, onClose, isMobile }) => {
  const { user: currentUser } = useAuth();
  const location = useLocation();

  // Fallback if user not ready
  if (!currentUser) {
    return (
      <aside className={cn(
        "fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-card border-r border-border transition-transform duration-300 z-40",
        isMobile ? (isOpen ? "translate-x-0" : "-translate-x-full") : "translate-x-0"
      )}>
        <div className="p-4 text-sm text-muted-foreground">Loading...</div>
      </aside>
    );
  }

  const allMenuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      path: `/${getRolePrefix(currentUser.role)}/dashboard`,
      permission: 'dashboard'
    },
    {
      id: 'messages',
      label: 'Messages',
      icon: MessageSquare,
      path: `/${getRolePrefix(currentUser.role)}/messages`,
      permission: 'messages',
      badge: undefined
    },
    {
      id: 'customers',
      label: 'Customers',
      icon: Users,
      path: `/${getRolePrefix(currentUser.role)}/customers`,
      permission: 'customers'
    },
    {
      id: 'bookings',
      label: 'Bookings',
      icon: Calendar,
      path: `/${getRolePrefix(currentUser.role)}/bookings`,
      permission: 'bookings'
    },
    {
      id: 'my_trips',
      label: 'My Trips',
      icon: Route,
      path: `/driver/trips`,
      permission: 'my_trips'
    },
    {
      id: 'trips',
      label: 'Trip Management',
      icon: MapPin,
      path: `/operations/trips`,
      permission: 'trips'
    },
    {
      id: 'drivers',
      label: 'Driver Assignment',
      icon: Car,
      path: `/operations/drivers`,
      permission: 'drivers'
    },
    {
      id: 'vehicles',
      label: 'Vehicle Management',
      icon: Car,
      path: `/operations/vehicles`,
      permission: 'vehicles'
    },
    {
      id: 'payments',
      label: 'Payments',
      icon: DollarSign,
      path: `/finance/payments`,
      permission: 'payments'
    },
    {
      id: 'invoices',
      label: 'Invoicing',
      icon: FileText,
      path: `/finance/invoices`,
      permission: 'invoices'
    },
    {
      id: 'support',
      label: 'Customer Support',
      icon: Headphones,
      path: `/support/tickets`,
      permission: 'support'
    },
    {
      id: 'faq',
      label: 'FAQ Management',
      icon: FileText,
      path: `/support/faq`,
      permission: 'faq'
    },
    {
      id: 'staff',
      label: 'Staff Management',
      icon: UserCheck,
      path: `/${getRolePrefix(currentUser.role)}/staff`,
      permission: 'staff'
    },
    {
      id: 'reports',
      label: 'Reports',
      icon: BarChart3,
      path: `/${getRolePrefix(currentUser.role)}/reports`,
      permission: 'reports'
    },
    {
      id: 'settings',
      label: 'System Settings',
      icon: Settings,
      path: `/admin/settings`,
      permission: 'settings'
    },
    {
      id: 'users',
      label: 'User Management',
      icon: Shield,
      path: `/admin/users`,
      permission: 'users'
    },
    {
      id: 'forensic',
      label: 'Forensic Monitoring',
      icon: Shield,
      path: `/admin/forensic`,
      permission: 'forensic'
    },
    {
      id: 'attendance',
      label: 'Attendance',
      icon: UserCheck,
      path: `/${getRolePrefix(currentUser.role)}/attendance`,
      permission: 'attendance'
    }
  ];

  function getRolePrefix(role: string): string {
    const prefixMap: { [key: string]: string } = {
      'super_admin': 'admin',
      'admin': 'admin',
      'admin_helper': 'admin',
      'booking_manager': 'booking',
      'operations_coordinator': 'operations',
      'driver': 'driver',
      'finance_officer': 'finance',
      'customer_service': 'support'
    };
    return prefixMap[role] || 'admin';
  }

  const userPermissions = rolePermissionsConst[currentUser.role] || [];
  const visibleMenuItems = allMenuItems.filter(item => {
    if (currentUser.role === 'super_admin') return true;
    return userPermissions.includes(item.permission);
  });

  const isActive = (path: string) => location.pathname === path;

  return (
    <aside className={cn(
      "fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-card border-r border-border transition-transform duration-300 z-40",
      isMobile ? (isOpen ? "translate-x-0" : "-translate-x-full") : "translate-x-0"
    )}>
      <div className="p-4">
        <nav className="space-y-2">
          {visibleMenuItems.length === 0 && (
            <div className="text-sm text-muted-foreground px-3 py-2">No menu items for role.</div>
          )}
          {visibleMenuItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.id}
                to={item.path}
                onClick={isMobile ? onClose : undefined}
                className={cn(
                  "flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors",
                  isActive(item.path)
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent"
                )}
              >
                <Icon className="h-5 w-5" />
                <span className="flex-1">{item.label}</span>
                {item.badge && (
                  <Badge variant="secondary" className="ml-auto text-xs">
                    {item.badge}
                  </Badge>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>
    </aside>
  );
};

export default DashboardSidebar;