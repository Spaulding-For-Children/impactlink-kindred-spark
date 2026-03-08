import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { tutorialSteps, TutorialStep, getNextStep, getPreviousStep } from '@/config/tutorialSteps';
import { useNavigate, useLocation } from 'react-router-dom';

interface TutorialContextType {
  isActive: boolean;
  currentStep: TutorialStep | null;
  currentStepIndex: number;
  totalSteps: number;
  startTutorial: () => void;
  nextStep: () => void;
  previousStep: () => void;
  skipTutorial: () => void;
  closeTutorial: () => void;
  isLoading: boolean;
}

const TutorialContext = createContext<TutorialContextType | undefined>(undefined);

export const TutorialProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isActive, setIsActive] = useState(false);
  const [currentStep, setCurrentStep] = useState<TutorialStep | null>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Check if user needs tutorial on auth state change
  useEffect(() => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    const checkTutorialStatus = async () => {
      try {
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('tutorial_completed')
          .eq('user_id', user.id)
          .single();

        if (error) {
          console.error('Error checking tutorial status:', error);
          setIsLoading(false);
          return;
        }

        // Auto-start tutorial if not completed and not on auth pages
        if (!profile?.tutorial_completed && !location.pathname.includes('/auth') && !location.pathname.includes('/create-profile')) {
          setTimeout(() => {
            startTutorial();
          }, 1000); // Small delay to ensure page is fully loaded
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error('Error in checkTutorialStatus:', error);
        setIsLoading(false);
      }
    };

    checkTutorialStatus();
  }, [user, location.pathname]);

  const startTutorial = useCallback(() => {
    setCurrentStep(tutorialSteps[0]);
    setCurrentStepIndex(0);
    setIsActive(true);
  }, []);

  const nextStep = useCallback(() => {
    if (!currentStep) return;

    const nextStepData = getNextStep(currentStep.id);
    
    if (nextStepData) {
      // Handle navigation if step requires it
      if (nextStepData.action === 'navigate' && nextStepData.route) {
        navigate(nextStepData.route);
        // Small delay to let navigation complete before showing next step
        setTimeout(() => {
          setCurrentStep(nextStepData);
          setCurrentStepIndex(currentStepIndex + 1);
        }, 500);
      } else {
        setCurrentStep(nextStepData);
        setCurrentStepIndex(currentStepIndex + 1);
      }
    } else {
      // No more steps, finish tutorial
      finishTutorial();
    }
  }, [currentStep, currentStepIndex, navigate]);

  const previousStep = useCallback(() => {
    if (!currentStep) return;

    const prevStepData = getPreviousStep(currentStep.id);
    
    if (prevStepData) {
      // Handle navigation if previous step had a route
      if (prevStepData.route && location.pathname !== prevStepData.route) {
        navigate(prevStepData.route);
        setTimeout(() => {
          setCurrentStep(prevStepData);
          setCurrentStepIndex(currentStepIndex - 1);
        }, 500);
      } else {
        setCurrentStep(prevStepData);
        setCurrentStepIndex(currentStepIndex - 1);
      }
    }
  }, [currentStep, currentStepIndex, navigate, location.pathname]);

  const finishTutorial = useCallback(async () => {
    if (!user) return;

    try {
      // Mark tutorial as completed in database
      const { error } = await supabase
        .from('profiles')
        .update({ tutorial_completed: true })
        .eq('user_id', user.id);

      if (error) {
        console.error('Error updating tutorial status:', error);
      }
    } catch (error) {
      console.error('Error in finishTutorial:', error);
    }

    closeTutorial();
  }, [user]);

  const skipTutorial = useCallback(() => {
    finishTutorial();
  }, [finishTutorial]);

  const closeTutorial = useCallback(() => {
    setIsActive(false);
    setCurrentStep(null);
    setCurrentStepIndex(0);
  }, []);

  const contextValue: TutorialContextType = {
    isActive,
    currentStep,
    currentStepIndex,
    totalSteps: tutorialSteps.length,
    startTutorial,
    nextStep,
    previousStep,
    skipTutorial,
    closeTutorial,
    isLoading
  };

  return (
    <TutorialContext.Provider value={contextValue}>
      {children}
    </TutorialContext.Provider>
  );
};

export const useTutorial = () => {
  const context = useContext(TutorialContext);
  if (context === undefined) {
    throw new Error('useTutorial must be used within a TutorialProvider');
  }
  return context;
};