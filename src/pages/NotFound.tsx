import React, { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { Home, MapPin, Compass, ArrowLeft, Binoculars } from "lucide-react";
import { gsap } from "gsap";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import safariHero from '@/assets/safari-hero.jpg';

const NotFound = () => {
  const location = useLocation();
  const containerRef = useRef<HTMLDivElement>(null);
  const elementsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );

    // GSAP animation for page entrance
    if (containerRef.current) {
      const tl = gsap.timeline();
      
      tl.from(containerRef.current, {
        opacity: 0,
        duration: 0.8,
        ease: "power2.out"
      });

      elementsRef.current.forEach((element, index) => {
        if (element) {
          tl.from(element, {
            opacity: 0,
            y: 30,
            duration: 0.6,
            ease: "power2.out"
          }, index * 0.2);
        }
      });

      // Floating animation for the binoculars icon
      const binocularsIcon = containerRef.current.querySelector('.binoculars-icon');
      if (binocularsIcon) {
        gsap.to(binocularsIcon, {
          y: -10,
          duration: 2,
          repeat: -1,
          yoyo: true,
          ease: "power2.inOut"
        });
      }
    }
  }, [location.pathname]);

  const navigationOptions = [
    {
      icon: Home,
      label: "Client Dashboard",
      description: "Track your safari journey",
      path: "/",
      color: "safari-gradient"
    },
    {
      icon: MapPin,
      label: "Staff Portal",
      description: "Manage clients and bookings",
      path: "/staff",
      color: "sunset-gradient"
    },
    {
      icon: Compass,
      label: "Field Team",
      description: "Mobile safari operations",
      path: "/field",
      color: "warm-gradient"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-earth flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Safari Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-10"
        style={{ backgroundImage: `url(${safariHero})` }}
      />
      
      <div ref={containerRef} className="max-w-4xl w-full relative z-10">
        {/* Main 404 Content */}
        <div ref={el => elementsRef.current[0] = el} className="text-center mb-12">
          <div className="relative mb-8">
            <Binoculars className="binoculars-icon w-24 h-24 text-primary mx-auto mb-6" />
            <div className="absolute -top-2 -right-2 w-6 h-6 safari-gradient rounded-full animate-pulse"></div>
          </div>
          
          <h1 className="text-6xl md:text-8xl font-bold text-primary mb-4">
            404
          </h1>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Lost in the Wilderness?
          </h2>
          <p className="text-xl text-muted-foreground mb-2">
            Looks like you've wandered off the safari trail!
          </p>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Don't worry, even the most experienced safari guides sometimes lose their way. 
            Let's get you back to exploring the amazing world of Lion Track Safari.
          </p>
        </div>

        {/* Quick Actions */}
        <div ref={el => elementsRef.current[1] = el} className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {navigationOptions.map((option, index) => {
            const Icon = option.icon;
            return (
              <Card 
                key={option.path}
                className="safari-card cursor-pointer group hover:shadow-elevated transition-all duration-300"
                onClick={() => window.location.href = option.path}
              >
                <CardContent className="p-6 text-center">
                  <div className={`w-12 h-12 ${option.color} rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">
                    {option.label}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {option.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Back Button */}
        <div ref={el => elementsRef.current[2] = el} className="text-center">
          <Button 
            onClick={() => window.history.back()}
            className="safari-gradient text-primary-foreground hover:opacity-90 px-8 py-3"
            size="lg"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Take Me Back to Safety
          </Button>
        </div>

        {/* Safari Wisdom */}
        <div ref={el => elementsRef.current[3] = el} className="mt-12 text-center">
          <Card className="safari-card bg-primary/5 border-primary/20">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-foreground mb-3">
                🦁 Safari Wisdom
              </h3>
              <blockquote className="text-muted-foreground italic">
                "In the safari of life, getting lost is just another way of discovering something amazing. 
                But for now, let's get you back on the right path!"
              </blockquote>
              <p className="text-sm text-muted-foreground mt-3">
                - The Lion Track Safari Team
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Error Details for Debugging */}
        <div ref={el => elementsRef.current[4] = el} className="mt-8 text-center">
          <details className="inline-block text-left">
            <summary className="cursor-pointer text-sm text-muted-foreground hover:text-foreground">
              Technical Details (for developers)
            </summary>
            <div className="mt-2 p-4 bg-muted rounded-lg text-sm text-muted-foreground">
              <p><strong>Attempted URL:</strong> {location.pathname}</p>
              <p><strong>Error Code:</strong> 404 - Page Not Found</p>
              <p><strong>Timestamp:</strong> {new Date().toLocaleString()}</p>
            </div>
          </details>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
