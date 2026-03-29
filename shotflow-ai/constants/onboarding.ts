export interface OnboardingSlide {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
}

export const ONBOARDING_SLIDES: OnboardingSlide[] = [
  {
    id: 'scan',
    title: 'Smart Gallery Scan',
    subtitle: 'ShotFlow AI analyzes your entire photo library to find duplicates, similar shots, and blurry photos in seconds.',
    icon: 'scan',
  },
  {
    id: 'best-shot',
    title: 'AI Picks the Best Shot',
    subtitle: 'Our AI evaluates sharpness, lighting, and composition to recommend the best photo from every group of similar shots.',
    icon: 'star',
  },
  {
    id: 'cleanup',
    title: 'Free Up Storage Safely',
    subtitle: 'Review AI recommendations, keep what you love, and safely remove the rest. You are always in control.',
    icon: 'trash',
  },
];
