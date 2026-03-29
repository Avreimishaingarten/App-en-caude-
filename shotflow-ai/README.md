# ShotFlow AI

AI-powered photo and video organizer for iOS and Android. Scans your gallery, detects duplicates and similar media, picks the best shot automatically, enhances photos, applies style presets, and helps you safely free up storage.

## Tech Stack

- **Framework**: React Native + Expo (SDK 54)
- **Language**: TypeScript (strict mode)
- **Navigation**: Expo Router (file-based)
- **State**: Zustand
- **Backend**: Supabase (auth, storage, database)
- **Payments**: RevenueCat-ready structure
- **Analytics**: Abstracted analytics layer (PostHog-ready)

## Getting Started

### Prerequisites

- Node.js 18+
- Expo CLI (`npx expo`)
- iOS Simulator or Android Emulator (or Expo Go app)

### Installation

```bash
cd shotflow-ai
npm install
```

### Environment Variables

Copy the example env file:

```bash
cp .env.example .env
```

Fill in your Supabase credentials:

```
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### Running the App

```bash
npx expo start
```

Then press:
- `i` for iOS Simulator
- `a` for Android Emulator
- Scan QR code with Expo Go on your device

## Project Structure

```
shotflow-ai/
├── app/                          # Expo Router screens
│   ├── _layout.tsx               # Root layout
│   ├── index.tsx                 # Splash screen
│   ├── (onboarding)/             # Onboarding flow
│   │   ├── index.tsx             # 3-slide onboarding
│   │   └── permissions.tsx       # Permission request
│   ├── (tabs)/                   # Main tab navigation
│   │   ├── index.tsx             # Dashboard / Home
│   │   ├── scan.tsx              # Gallery scan
│   │   ├── enhance.tsx           # AI enhancement
│   │   └── presets.tsx           # Style presets
│   ├── review/                   # Review flow
│   │   ├── index.tsx             # Group review (best shot)
│   │   ├── confirm.tsx           # Cleanup confirmation
│   │   └── success.tsx           # Cleanup success
│   ├── enhance/                  # Enhance modal
│   ├── settings/                 # Settings
│   └── paywall/                  # Premium paywall
├── components/
│   ├── ui/                       # Base UI components
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Badge.tsx
│   │   ├── ProgressBar.tsx
│   │   └── IconSymbol.tsx
│   ├── cards/                    # Composite cards
│   │   ├── StatCard.tsx
│   │   ├── ActionCard.tsx
│   │   └── MediaGroupCard.tsx
│   └── layout/
│       └── ScreenContainer.tsx
├── features/                     # Core business logic
│   ├── scanner/                  # Gallery scanning orchestration
│   ├── similarity/               # Duplicate & similar photo detection
│   ├── best-shot/                # Quality scoring & best shot selection
│   ├── cleanup/                  # Safe deletion flow
│   ├── enhance/                  # Photo enhancement engine
│   └── presets/                  # Style preset management
├── lib/                          # Infrastructure modules
│   ├── supabase/                 # Supabase client
│   ├── analytics/                # Analytics abstraction
│   ├── permissions/              # Permission helpers
│   └── media/                    # Media library access
├── store/                        # Zustand state stores
│   ├── scanStore.ts
│   ├── cleanupStore.ts
│   └── userStore.ts
├── types/                        # TypeScript type definitions
├── constants/                    # Theme, presets, config
├── hooks/                        # Custom React hooks
└── assets/                       # Images, fonts
```

## Architecture

### Core Engines

All AI/scoring logic lives in `features/` and is structured as pure functions that can be swapped out for ML models later:

1. **Scanner** (`features/scanner/`) - Orchestrates the full scan pipeline
2. **Similarity Engine** (`features/similarity/`) - Groups photos by duplicates, similarity, blur, size
3. **Best Shot Engine** (`features/best-shot/`) - Scores photos on sharpness, brightness, faces, resolution
4. **Enhancement Engine** (`features/enhance/`) - Applies exposure, contrast, saturation, sharpness adjustments
5. **Preset Engine** (`features/presets/`) - Manages and applies style presets

### Scoring System

The best-shot scorer uses weighted criteria:

| Criterion | Weight |
|-----------|--------|
| Sharpness | 30% |
| Face quality | 20% |
| Brightness | 15% |
| Blur penalty | 15% |
| Resolution | 10% |
| Favorite bonus | 10% |

### Data Flow

```
Gallery → Scanner → Similarity Engine → Best Shot Scorer → Review UI → Cleanup
```

### Monetization

Free tier allows limited cleanup and enhancements. Premium unlocks everything. Structure is RevenueCat-ready with `SubscriptionState` tracked in Zustand and Supabase.

## Screens (16)

1. Splash
2. Onboarding 1 (Smart Scan)
3. Onboarding 2 (AI Best Shot)
4. Onboarding 3 (Safe Cleanup)
5. Permissions
6. Home Dashboard
7. Scan (idle / progress / results)
8. Enhance (photo picker + auto-enhance)
9. Presets (style application)
10. Review (group-by-group best shot selection)
11. Cleanup Confirmation
12. Cleanup Success
13. Settings
14. Paywall
15. Enhance Modal
16. Best Shot Detail (within Review)

## Database Schema (Supabase)

```sql
-- Users
create table users (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  display_name text,
  avatar_url text,
  subscription_tier text default 'free',
  subscription_expires_at timestamptz,
  created_at timestamptz default now()
);

-- Scan history (optional sync)
create table scan_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id),
  total_scanned int,
  duplicates_found int,
  similar_groups_found int,
  blurry_found int,
  large_videos_found int,
  estimated_savings_bytes bigint,
  completed_at timestamptz,
  created_at timestamptz default now()
);

-- Cleanup history (optional sync)
create table cleanup_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id),
  scan_session_id uuid references scan_sessions(id),
  items_deleted int,
  items_kept int,
  bytes_saved bigint,
  completed_at timestamptz,
  created_at timestamptz default now()
);
```

## TODO: v2 Roadmap

- [ ] Perceptual hashing for smarter similarity detection
- [ ] ML-based image quality scoring (TFLite / Core ML)
- [ ] Face detection for smile/eyes-open scoring
- [ ] AI-generated custom presets
- [ ] Smart albums (auto-organized collections)
- [ ] Cloud backup of enhanced photos
- [ ] Batch enhancement with preset application
- [ ] Video duplicate detection
- [ ] Widget for storage status
- [ ] RevenueCat integration
- [ ] PostHog analytics integration
- [ ] Push notifications for storage warnings
- [ ] Localization (i18n)
- [ ] Accessibility audit (a11y)
