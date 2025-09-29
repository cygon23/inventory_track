// Role and journey constants shared across the app

export const rolePermissions: Record<string, string[]> = {
  super_admin: ['dashboard', 'messages', 'customers', 'bookings', 'staff', 'reports', 'settings', 'users', 'forensic', 'attendance'],
  admin: ['dashboard', 'messages', 'customers', 'bookings', 'staff', 'reports', 'forensic', 'attendance'],
  admin_helper: ['dashboard', 'messages', 'customers', 'bookings', 'attendance'],
  booking_manager: ['dashboard', 'messages', 'customers', 'bookings', 'attendance'],
  operations_coordinator: ['dashboard', 'messages', 'trips', 'drivers', 'vehicles', 'attendance'],
  driver: ['dashboard', 'my_trips', 'reports', 'attendance'],
  finance_officer: ['dashboard', 'payments', 'invoices', 'reports', 'messages', 'attendance'],
  customer_service: ['dashboard', 'messages', 'support', 'faq', 'attendance']
}

export const roleColors: Record<string, string> = {
  super_admin: 'bg-gradient-safari text-white',
  admin: 'bg-primary text-primary-foreground',
  admin_helper: 'bg-primary-glow text-white',
  booking_manager: 'bg-accent-gold text-foreground',
  operations_coordinator: 'bg-accent-rust text-white',
  driver: 'bg-success text-success-foreground',
  finance_officer: 'bg-warning text-warning-foreground',
  customer_service: 'bg-secondary text-secondary-foreground'
}

export const journeyStages = [
  { id: 'submitted', name: 'Submitted', description: 'Booking request submitted' },
  { id: 'confirmed', name: 'Confirmed', description: 'Booking confirmed and paid' },
  { id: 'arrived', name: 'Arrived', description: 'Client arrived in Tanzania' },
  { id: 'completed', name: 'Completed', description: 'Safari completed successfully' }
]

