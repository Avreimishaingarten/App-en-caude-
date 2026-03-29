export interface User {
  id: string;
  email: string;
  displayName?: string;
  avatarUrl?: string;
  createdAt: string;
  subscription: SubscriptionState;
}

export interface SubscriptionState {
  tier: SubscriptionTier;
  isActive: boolean;
  expiresAt?: string;
  purchaseType?: 'subscription' | 'one_time';
}

export type SubscriptionTier = 'free' | 'premium';

export interface SubscriptionLimits {
  maxCleanupActions: number;
  maxEnhancements: number;
  maxPresets: number;
  canReviewBestShots: boolean;
}

export const SUBSCRIPTION_LIMITS: Record<SubscriptionTier, SubscriptionLimits> = {
  free: {
    maxCleanupActions: 5,
    maxEnhancements: 3,
    maxPresets: 2,
    canReviewBestShots: true,
  },
  premium: {
    maxCleanupActions: Infinity,
    maxEnhancements: Infinity,
    maxPresets: Infinity,
    canReviewBestShots: true,
  },
};
