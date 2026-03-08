export interface TutorialStep {
  id: string;
  title: string;
  content: string;
  target?: string; // CSS selector for highlighting
  position?: 'top' | 'bottom' | 'left' | 'right';
  showSkip?: boolean;
  showPrevious?: boolean;
  action?: 'next' | 'finish' | 'navigate';
  route?: string;
}

export const tutorialSteps: TutorialStep[] = [
  {
    id: 'welcome',
    title: 'Welcome to ImpactLink! 🎉',
    content: 'Welcome to the child welfare research hub that connects students, researchers, and agencies worldwide. Let\'s take a quick tour to help you get started and discover all the powerful features available to you.',
    showSkip: true,
    showPrevious: false,
    action: 'next'
  },
  {
    id: 'profile',
    title: 'Your Profile & Settings',
    content: 'Access your profile settings here to update your information, research interests, and collaboration preferences. A complete profile helps others find and connect with you more effectively.',
    target: '[data-tutorial="profile-menu"]',
    position: 'bottom',
    showSkip: true,
    showPrevious: true,
    action: 'next'
  },
  {
    id: 'directory',
    title: 'Discover the Directory',
    content: 'Browse profiles of students, researchers, and agencies from around the world. Use filters to find collaboration partners based on location, interests, and expertise areas.',
    target: '[data-tutorial="directory-nav"]',
    position: 'bottom',
    showSkip: true,
    showPrevious: true,
    action: 'navigate',
    route: '/directory'
  },
  {
    id: 'collaboration',
    title: 'Collaboration Hub',
    content: 'Post research questions, browse collaboration opportunities, and connect with like-minded professionals. Join discussion forums and participate in the global research community.',
    target: '[data-tutorial="collaboration-nav"]',
    position: 'bottom',
    showSkip: true,
    showPrevious: true,
    action: 'navigate',
    route: '/collaboration'
  },
  {
    id: 'resources',
    title: 'Resources & Learning',
    content: 'Access workshops, toolkits, reading lists, and submit your own research. Browse professional development resources and showcase your work to the community.',
    target: '[data-tutorial="resources-nav"]',
    position: 'bottom',
    showSkip: true,
    showPrevious: true,
    action: 'navigate',
    route: '/resources'
  },
  {
    id: 'data-tools',
    title: 'Data & Tools Repository',
    content: 'Discover curated datasets, assessment tools, and comprehensive ethics guidance. Access the data you need to support your research journey with proper IRB and ethics resources.',
    target: '[data-tutorial="data-tools-nav"]',
    position: 'bottom',
    showSkip: true,
    showPrevious: true,
    action: 'navigate',
    route: '/data-tools'
  },
  {
    id: 'events',
    title: 'Events & Networking',
    content: 'Stay updated with conferences, workshops, webinars, and funding opportunities. Register for events and connect with professionals in your field.',
    target: '[data-tutorial="events-nav"]',
    position: 'bottom',
    showSkip: true,
    showPrevious: true,
    action: 'navigate',
    route: '/events'
  },
  {
    id: 'complete',
    title: 'You\'re All Set! 🚀',
    content: 'Congratulations! You\'ve completed the ImpactLink tutorial. You\'re now ready to connect with researchers, access resources, and make a real impact in child welfare. Start exploring and building meaningful collaborations!',
    showSkip: false,
    showPrevious: true,
    action: 'finish'
  }
];

export const getTutorialStep = (stepId: string): TutorialStep | undefined => {
  return tutorialSteps.find(step => step.id === stepId);
};

export const getStepIndex = (stepId: string): number => {
  return tutorialSteps.findIndex(step => step.id === stepId);
};

export const getNextStep = (currentStepId: string): TutorialStep | undefined => {
  const currentIndex = getStepIndex(currentStepId);
  return currentIndex < tutorialSteps.length - 1 ? tutorialSteps[currentIndex + 1] : undefined;
};

export const getPreviousStep = (currentStepId: string): TutorialStep | undefined => {
  const currentIndex = getStepIndex(currentStepId);
  return currentIndex > 0 ? tutorialSteps[currentIndex - 1] : undefined;
};