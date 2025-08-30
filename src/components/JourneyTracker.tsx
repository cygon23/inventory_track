import React, { useEffect, useRef } from 'react';
import { Check, Clock, Plane, Camera } from 'lucide-react';
import { gsap } from 'gsap';
import { journeyStages } from '@/data/mockData';

interface JourneyTrackerProps {
  currentStatus: 'submitted' | 'confirmed' | 'arrived' | 'completed';
  className?: string;
}

const statusIcons = {
  submitted: Clock,
  confirmed: Check,
  arrived: Plane,
  completed: Camera
};

export const JourneyTracker: React.FC<JourneyTrackerProps> = ({ 
  currentStatus, 
  className = '' 
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const stepsRef = useRef<(HTMLDivElement | null)[]>([]);
  const connectorsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (!containerRef.current) return;

    // Animate the journey tracker on mount
    const tl = gsap.timeline();
    
    tl.from(containerRef.current, {
      opacity: 0,
      y: 20,
      duration: 0.6,
      ease: "power2.out"
    });

    // Animate each step with staggered timing
    stepsRef.current.forEach((step, index) => {
      if (step) {
        const currentIndex = journeyStages.findIndex(stage => stage.id === currentStatus);
        const isCompleted = index <= currentIndex;
        const isActive = index === currentIndex;

        if (isCompleted || isActive) {
          tl.to(step, {
            scale: 1.1,
            duration: 0.3,
            ease: "back.out(1.7)"
          }, index * 0.2)
          .to(step, {
            scale: 1,
            duration: 0.3,
            ease: "power2.out"
          });
        }
      }
    });

    // Animate connectors
    connectorsRef.current.forEach((connector, index) => {
      if (connector) {
        const currentIndex = journeyStages.findIndex(stage => stage.id === currentStatus);
        if (index < currentIndex) {
          tl.to(connector, {
            scaleX: 1,
            duration: 0.5,
            ease: "power2.out"
          }, index * 0.2 + 0.3);
        }
      }
    });
  }, [currentStatus]);

  const getStepStatus = (index: number) => {
    const currentIndex = journeyStages.findIndex(stage => stage.id === currentStatus);
    if (index < currentIndex) return 'completed';
    if (index === currentIndex) return 'active';
    return 'pending';
  };

  return (
    <div ref={containerRef} className={`w-full ${className}`}>
      <div className="flex items-center justify-between relative">
        {journeyStages.map((stage, index) => {
          const Icon = statusIcons[stage.id as keyof typeof statusIcons];
          const stepStatus = getStepStatus(index);
          
          return (
            <React.Fragment key={stage.id}>
              <div className="flex flex-col items-center relative z-10">
                <div
                  ref={el => stepsRef.current[index] = el}
                  className={`journey-step ${stepStatus}`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <div className="mt-3 text-center">
                  <div className={`text-sm font-medium ${
                    stepStatus === 'pending' ? 'text-muted-foreground' : 'text-foreground'
                  }`}>
                    {stage.name}
                  </div>
                  <div className={`text-xs mt-1 ${
                    stepStatus === 'pending' ? 'text-muted-foreground' : 'text-muted-foreground'
                  }`}>
                    {stage.description}
                  </div>
                </div>
              </div>
              
              {index < journeyStages.length - 1 && (
                <div
                  ref={el => connectorsRef.current[index] = el}
                  className={`journey-connector ${
                    getStepStatus(index) === 'completed' ? 'completed' : ''
                  }`}
                  style={{ transformOrigin: 'left', transform: `scaleX(${getStepStatus(index) === 'completed' ? 1 : 0})` }}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};