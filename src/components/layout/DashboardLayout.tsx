import React from 'react';
import { Outlet } from 'react-router-dom';
import DashboardSidebar from './DashboardSidebar';
import DashboardHeader from './DashboardHeader';
import { User } from '@/data/mockUsers';

interface DashboardLayoutProps {
  currentUser: User;
  onLogout: () => void;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ currentUser, onLogout }) => {
  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader currentUser={currentUser} onLogout={onLogout} />
      
      <div className="flex">
        <DashboardSidebar currentUser={currentUser} />
        
        <main className="flex-1 p-6 ml-64">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;