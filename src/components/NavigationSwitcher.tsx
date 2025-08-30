import React from 'react';
import { Users, UserCheck, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export const NavigationSwitcher: React.FC = () => {
  const handleNavigate = (path: string) => {
    window.location.href = path;
  };

  const portals = [
    {
      id: "client",
      title: "Client Portal",
      description: "Track your safari journey and manage bookings",
      icon: Users,
      path: "/client",
      color: "safari-gradient",
    },
    {
      id: "staff",
      title: "Staff Dashboard",
      description: "Manage clients and view analytics",
      icon: UserCheck,
      path: "/staff",
      color: "sunset-gradient",
    },
    {
      id: "field",
      title: "Field Team",
      description: "Mobile interface for guides and drivers",
      icon: MapPin,
      path: "/field",
      color: "warm-gradient",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-earth flex items-center justify-center p-6">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <div className="w-12 h-12 safari-gradient rounded-xl flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">LT</span>
            </div>
            <h1 className="text-4xl font-bold text-foreground">Lion Track Safari</h1>
          </div>
          <p className="text-xl text-muted-foreground">
            Select your portal to access the system
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {portals.map((portal) => {
            const Icon = portal.icon;
            return (
              <Card 
                key={portal.id}
                className="safari-card cursor-pointer group hover:shadow-elevated transition-all duration-300"
                onClick={() => handleNavigate(portal.path)}
              >
                <CardContent className="p-8 text-center">
                  <div className={`w-16 h-16 ${portal.color} rounded-xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-8 h-8 text-primary-foreground" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-3">
                    {portal.title}
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    {portal.description}
                  </p>
                  <Button 
                    className={`w-full ${portal.color} text-primary-foreground hover:opacity-90`}
                  >
                    Access Portal
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="text-center mt-12 text-sm text-muted-foreground">
          <p>Demo system showcasing Lion Track Safari client journey tracking</p>
        </div>
      </div>
    </div>
  );
};