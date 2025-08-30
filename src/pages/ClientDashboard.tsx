import React, { useEffect, useRef } from 'react';
import { Calendar, FileText, MessageSquare, Clock, MapPin, Heart } from 'lucide-react';
import safariHero from '@/assets/safari-hero.jpg';
import { gsap } from 'gsap';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Layout } from '@/components/Layout';
import { JourneyTracker } from '@/components/JourneyTracker';
import { mockClients } from '@/data/mockData';

const ClientDashboard: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  
  // Using first client as current user
  const currentClient = mockClients[0];

  useEffect(() => {
    if (!containerRef.current) return;

    const tl = gsap.timeline();
    
    // Animate container
    tl.from(containerRef.current, {
      opacity: 0,
      y: 20,
      duration: 0.8,
      ease: "power2.out"
    });

    // Stagger card animations
    cardsRef.current.forEach((card, index) => {
      if (card) {
        tl.from(card, {
          opacity: 0,
          y: 30,
          duration: 0.6,
          ease: "power2.out"
        }, index * 0.1);
      }
    });
  }, []);

  const getDaysUntilSafari = () => {
    const safariDate = new Date(currentClient.safariDates.start);
    const today = new Date();
    const diffTime = safariDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getPaymentProgress = () => {
    return (currentClient.paidAmount / currentClient.totalCost) * 100;
  };

  const daysUntil = getDaysUntilSafari();
  const paymentProgress = getPaymentProgress();

  const preparationTasks = [
    { task: 'Passport validity check', completed: true },
    { task: 'Travel insurance', completed: true },
    { task: 'Vaccination requirements', completed: false },
    { task: 'Pack safari gear', completed: false },
    { task: 'Download offline maps', completed: false }
  ];

  const completedTasks = preparationTasks.filter(task => task.completed).length;
  const preparationProgress = (completedTasks / preparationTasks.length) * 100;

  return (
    <Layout userType="client">
      <div ref={containerRef} className="space-y-6">
        {/* Welcome Header with Hero Image */}
        <div className="relative safari-card overflow-hidden">
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-20"
            style={{ backgroundImage: `url(${safariHero})` }}
          />
          <div className="relative p-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground">
                  Welcome back, {currentClient.name.split(' ')[0]}!
                </h1>
                <p className="text-muted-foreground mt-2">
                  Your {currentClient.safariPackage} adventure awaits
                </p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-primary">
                  {daysUntil > 0 ? `${daysUntil} days` : daysUntil === 0 ? 'Today!' : 'Active'}
                </div>
                <div className="text-sm text-muted-foreground">
                  {daysUntil > 0 ? 'until departure' : 'Safari in progress'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Safari Countdown Card */}
        {daysUntil > 0 && (
          <Card ref={el => cardsRef.current[0] = el} className="safari-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Clock className="w-5 h-5 text-primary" />
                <span>Safari Countdown</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center space-y-4">
                <div className="text-4xl font-bold text-primary safari-glow">
                  {daysUntil}
                </div>
                <div className="text-lg text-muted-foreground">
                  Days until your adventure begins
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="p-3 bg-secondary rounded-lg">
                    <div className="text-muted-foreground">Departure</div>
                    <div className="font-semibold">
                      {new Date(currentClient.safariDates.start).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="p-3 bg-secondary rounded-lg">
                    <div className="text-muted-foreground">Return</div>
                    <div className="font-semibold">
                      {new Date(currentClient.safariDates.end).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Journey Progress */}
        <Card ref={el => cardsRef.current[1] = el} className="safari-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <MapPin className="w-5 h-5 text-primary" />
              <span>Your Safari Journey</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <JourneyTracker currentStatus={currentClient.journeyStatus} />
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Payment Status */}
          <Card ref={el => cardsRef.current[2] = el} className="safari-card">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Payment Status</span>
                <Badge className={paymentProgress === 100 ? "bg-success" : "bg-warning"}>
                  {paymentProgress === 100 ? 'Paid' : 'Pending'}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progress</span>
                  <span>{paymentProgress.toFixed(0)}%</span>
                </div>
                <Progress value={paymentProgress} className="h-2" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Paid</span>
                  <span className="font-semibold">${currentClient.paidAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total</span>
                  <span className="font-semibold">${currentClient.totalCost.toLocaleString()}</span>
                </div>
                {paymentProgress < 100 && (
                  <div className="flex justify-between text-warning">
                    <span>Remaining</span>
                    <span className="font-semibold">
                      ${(currentClient.totalCost - currentClient.paidAmount).toLocaleString()}
                    </span>
                  </div>
                )}
              </div>
              {paymentProgress < 100 && (
                <Button className="w-full safari-gradient">
                  Complete Payment
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Preparation Checklist */}
          <Card ref={el => cardsRef.current[3] = el} className="safari-card">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Preparation Checklist</span>
                <Badge variant="outline">
                  {completedTasks}/{preparationTasks.length}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Completion</span>
                  <span>{preparationProgress.toFixed(0)}%</span>
                </div>
                <Progress value={preparationProgress} className="h-2" />
              </div>
              <div className="space-y-3">
                {preparationTasks.map((task, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                      task.completed 
                        ? 'bg-success border-success text-success-foreground' 
                        : 'border-border'
                    }`}>
                      {task.completed && <span className="text-xs">✓</span>}
                    </div>
                    <span className={`text-sm ${
                      task.completed ? 'text-muted-foreground line-through' : 'text-foreground'
                    }`}>
                      {task.task}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card ref={el => cardsRef.current[4] = el} className="safari-card cursor-pointer hover:shadow-elevated transition-all">
            <CardContent className="p-6 text-center">
              <FileText className="w-8 h-8 text-primary mx-auto mb-3" />
              <h3 className="font-semibold text-foreground mb-2">View Documents</h3>
              <p className="text-sm text-muted-foreground">Itinerary, vouchers & travel docs</p>
            </CardContent>
          </Card>

          <Card ref={el => cardsRef.current[5] = el} className="safari-card cursor-pointer hover:shadow-elevated transition-all">
            <CardContent className="p-6 text-center">
              <MessageSquare className="w-8 h-8 text-primary mx-auto mb-3" />
              <h3 className="font-semibold text-foreground mb-2">Contact Support</h3>
              <p className="text-sm text-muted-foreground">Chat with our safari experts</p>
            </CardContent>
          </Card>

          <Card ref={el => cardsRef.current[6] = el} className="safari-card cursor-pointer hover:shadow-elevated transition-all">
            <CardContent className="p-6 text-center">
              <Heart className="w-8 h-8 text-primary mx-auto mb-3" />
              <h3 className="font-semibold text-foreground mb-2">Share Experience</h3>
              <p className="text-sm text-muted-foreground">Photos & reviews from your trip</p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Communications */}
        <Card ref={el => cardsRef.current[7] = el} className="safari-card">
          <CardHeader>
            <CardTitle>Recent Updates</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {currentClient.communications.slice(0, 3).map((comm) => (
                <div key={comm.id} className="flex items-start space-x-3 p-3 bg-secondary rounded-lg">
                  <MessageSquare className="w-4 h-4 text-primary mt-1" />
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="text-sm font-medium">{comm.sender}</span>
                      <Badge variant="outline" className="text-xs">
                        {comm.type}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{comm.content}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(comm.timestamp).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default ClientDashboard;