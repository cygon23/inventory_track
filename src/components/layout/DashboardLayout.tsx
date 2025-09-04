import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import DashboardSidebar from './DashboardSidebar';
import DashboardHeader from './DashboardHeader';
import { User } from '@/data/mockUsers';
import { useIsMobile } from '@/hooks/use-mobile';

interface DashboardLayoutProps {
  currentUser: User;
  onLogout: () => void;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ currentUser, onLogout }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isMobile = useIsMobile();

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader 
        currentUser={currentUser} 
        onLogout={onLogout}
        onMenuClick={() => setSidebarOpen(!sidebarOpen)}
        isMobile={isMobile}
      />
      
      <div className="flex">
        <DashboardSidebar 
          currentUser={currentUser} 
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          isMobile={isMobile}
        />
        
        <main className={`flex-1 p-4 md:p-6 transition-all duration-300 ${
          isMobile ? 'ml-0' : 'md:ml-64'
        }`}>
          <Outlet />
        </main>
      </div>
      
      {/* Mobile overlay */}
      {isMobile && sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default DashboardLayout;