import React, { useEffect, useState } from 'react';
import { useTutorial } from '@/contexts/TutorialContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { X, ChevronLeft, ChevronRight, SkipForward } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface TargetRect {
  top: number;
  left: number;
  width: number;
  height: number;
}

export const TutorialOverlay: React.FC = () => {
  const {
    isActive,
    currentStep,
    currentStepIndex,
    totalSteps,
    nextStep,
    previousStep,
    skipTutorial,
    closeTutorial
  } = useTutorial();

  const [targetRect, setTargetRect] = useState<TargetRect | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });

  useEffect(() => {
    if (!isActive || !currentStep?.target) {
      setTargetRect(null);
      return;
    }

    const updateTargetPosition = () => {
      const target = document.querySelector(currentStep.target!);
      if (target) {
        const rect = target.getBoundingClientRect();
        const newTargetRect = {
          top: rect.top,
          left: rect.left,
          width: rect.width,
          height: rect.height
        };
        setTargetRect(newTargetRect);

        // Calculate tooltip position
        const padding = 16;
        const tooltipWidth = 400;
        const tooltipHeight = 200;
        
        let top = rect.bottom + padding;
        let left = rect.left + (rect.width / 2) - (tooltipWidth / 2);

        // Position based on step preference and viewport constraints
        switch (currentStep.position) {
          case 'top':
            top = rect.top - tooltipHeight - padding;
            break;
          case 'left':
            top = rect.top + (rect.height / 2) - (tooltipHeight / 2);
            left = rect.left - tooltipWidth - padding;
            break;
          case 'right':
            top = rect.top + (rect.height / 2) - (tooltipHeight / 2);
            left = rect.right + padding;
            break;
          default: // bottom
            top = rect.bottom + padding;
        }

        // Keep tooltip within viewport
        const maxLeft = window.innerWidth - tooltipWidth - padding;
        const maxTop = window.innerHeight - tooltipHeight - padding;
        
        left = Math.max(padding, Math.min(left, maxLeft));
        top = Math.max(padding, Math.min(top, maxTop));

        setTooltipPosition({ top, left });
      }
    };

    updateTargetPosition();
    window.addEventListener('resize', updateTargetPosition);
    window.addEventListener('scroll', updateTargetPosition);

    return () => {
      window.removeEventListener('resize', updateTargetPosition);
      window.removeEventListener('scroll', updateTargetPosition);
    };
  }, [isActive, currentStep]);

  const handleNext = () => {
    if (currentStep?.action === 'finish') {
      closeTutorial();
    } else {
      nextStep();
    }
  };

  if (!isActive || !currentStep) return null;

  const progressPercentage = ((currentStepIndex + 1) / totalSteps) * 100;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[9999]">
        {/* Backdrop with spotlight effect */}
        <div 
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          style={{
            background: targetRect 
              ? `radial-gradient(circle at ${targetRect.left + targetRect.width/2}px ${targetRect.top + targetRect.height/2}px, transparent ${Math.max(targetRect.width, targetRect.height)/2 + 20}px, rgba(0,0,0,0.7) ${Math.max(targetRect.width, targetRect.height)/2 + 40}px)`
              : 'rgba(0,0,0,0.7)'
          }}
          onClick={closeTutorial}
        />

        {/* Highlight box for targeted elements */}
        {targetRect && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute border-2 border-primary rounded-lg shadow-lg shadow-primary/25 pointer-events-none"
            style={{
              top: targetRect.top - 4,
              left: targetRect.left - 4,
              width: targetRect.width + 8,
              height: targetRect.height + 8,
            }}
          />
        )}

        {/* Tutorial tooltip */}
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.9 }}
          className="absolute z-[10000]"
          style={{
            top: targetRect ? tooltipPosition.top : '50%',
            left: targetRect ? tooltipPosition.left : '50%',
            transform: targetRect ? 'none' : 'translate(-50%, -50%)',
            width: targetRect ? '400px' : '500px',
            maxWidth: 'calc(100vw - 32px)'
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <Card className="shadow-2xl border-2">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CardTitle className="text-lg">{currentStep.title}</CardTitle>
                  <span className="text-sm text-muted-foreground">
                    {currentStepIndex + 1} of {totalSteps}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={closeTutorial}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <Progress value={progressPercentage} className="mt-2" />
            </CardHeader>

            <CardContent className="pb-4">
              <p className="text-sm text-muted-foreground leading-relaxed">
                {currentStep.content}
              </p>
            </CardContent>

            <CardFooter className="flex items-center justify-between pt-0">
              <div className="flex gap-2">
                {currentStep.showPrevious && currentStepIndex > 0 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={previousStep}
                    className="flex items-center gap-1"
                  >
                    <ChevronLeft className="h-3 w-3" />
                    Previous
                  </Button>
                )}
                {currentStep.showSkip && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={skipTutorial}
                    className="flex items-center gap-1 text-muted-foreground"
                  >
                    <Skip className="h-3 w-3" />
                    Skip Tutorial
                  </Button>
                )}
              </div>

              <Button
                onClick={handleNext}
                size="sm"
                className="flex items-center gap-1"
              >
                {currentStep.action === 'finish' ? (
                  'Get Started!'
                ) : (
                  <>
                    Next
                    <ChevronRight className="h-3 w-3" />
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
