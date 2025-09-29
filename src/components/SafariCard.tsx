import React, { useRef, useEffect } from 'react';
import { Calendar, Users, MapPin, Clock } from 'lucide-react';
import { gsap } from 'gsap';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
type Client = {
  id: string;
  name: string;
  email: string;
  journeyStatus?: 'submitted' | 'confirmed' | 'arrived' | 'completed';
  journey_status?: 'submitted' | 'confirmed' | 'arrived' | 'completed';
  safariPackage?: string;
  safariDates?: { start: string; end: string };
  safari_package?: string | null;
  booking_date?: string | null;
  totalCost?: number;
  total_cost?: number;
  paidAmount?: number;
  paid_amount?: number;
  specialRequirements: string[];
}
import { JourneyTracker } from './JourneyTracker';

interface SafariCardProps {
  client: Client;
  onClick?: () => void;
  className?: string;
}

export const SafariCard: React.FC<SafariCardProps> = ({ 
  client, 
  onClick, 
  className = '' 
}) => {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!cardRef.current) return;

    // Entrance animation
    gsap.fromTo(cardRef.current, 
      { opacity: 0, y: 20, scale: 0.95 },
      { 
        opacity: 1, 
        y: 0, 
        scale: 1,
        duration: 0.6,
        ease: "power2.out"
      }
    );
  }, []);

  const handleMouseEnter = () => {
    if (cardRef.current) {
      gsap.to(cardRef.current, {
        y: -5,
        duration: 0.3,
        ease: "power2.out"
      });
    }
  };

  const handleMouseLeave = () => {
    if (cardRef.current) {
      gsap.to(cardRef.current, {
        y: 0,
        duration: 0.3,
        ease: "power2.out"
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'submitted': return 'bg-warning text-warning-foreground';
      case 'confirmed': return 'bg-primary text-primary-foreground';
      case 'arrived': return 'bg-accent-gold text-foreground';
      case 'completed': return 'bg-success text-success-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getDaysUntilSafari = () => {
    const safariDate = new Date((client.safariDates?.start ?? client.booking_date) as string);
    const today = new Date();
    const diffTime = safariDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const daysUntil = getDaysUntilSafari();

  return (
    <Card 
      ref={cardRef}
      className={`safari-card cursor-pointer transition-all duration-300 ${className}`}
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg font-semibold text-foreground">
              {client.name}
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              {client.email}
            </p>
          </div>
          <Badge className={getStatusColor(client.journeyStatus)}>
            {client.journeyStatus.charAt(0).toUpperCase() + client.journeyStatus.slice(1)}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Safari Package Info */}
        <div className="space-y-2">
          <h4 className="font-medium text-foreground">{client.safariPackage}</h4>
          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            <div className="flex items-center space-x-1">
              <Calendar className="w-4 h-4" />
              <span>{formatDate((client.safariDates?.start ?? client.booking_date) as string)}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Clock className="w-4 h-4" />
              <span>
                {daysUntil > 0 ? `${daysUntil} days` : daysUntil === 0 ? 'Today!' : 'Completed'}
              </span>
            </div>
          </div>
        </div>

        {/* Journey Progress */}
        <div>
          <h5 className="text-sm font-medium text-foreground mb-3">Journey Progress</h5>
          <JourneyTracker currentStatus={(client.journeyStatus ?? client.journey_status) as any} />
        </div>

        {/* Quick Stats */}
        <div className="pt-4 border-t border-border">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Total Cost</span>
              <div className="font-semibold text-foreground">
                ${((client.totalCost ?? client.total_cost) || 0).toLocaleString()}
              </div>
            </div>
            <div>
              <span className="text-muted-foreground">Payment Status</span>
              <div className={`font-semibold ${
                (client.paidAmount ?? client.paid_amount ?? 0) >= (client.totalCost ?? client.total_cost ?? 0)
                  ? 'text-success' 
                  : 'text-warning'
              }`}>
                {(client.paidAmount ?? client.paid_amount ?? 0) >= (client.totalCost ?? client.total_cost ?? 0) ? 'Paid' : 'Pending'}
              </div>
            </div>
          </div>
        </div>

        {/* Special Requirements */}
        {client.specialRequirements && client.specialRequirements.length > 0 && (
          <div className="pt-2">
            <div className="flex flex-wrap gap-1">
              {client.specialRequirements.slice(0, 2).map((req, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {req}
                </Badge>
              ))}
              {client.specialRequirements.length > 2 && (
                <Badge variant="outline" className="text-xs">
                  +{client.specialRequirements.length - 2} more
                </Badge>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};