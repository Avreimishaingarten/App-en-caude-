type EventProperties = Record<string, string | number | boolean>;

interface AnalyticsProvider {
  track(event: string, properties?: EventProperties): void;
  identify(userId: string, traits?: EventProperties): void;
  screen(name: string, properties?: EventProperties): void;
}

class Analytics implements AnalyticsProvider {
  private enabled = false;

  enable() {
    this.enabled = true;
  }

  disable() {
    this.enabled = false;
  }

  track(event: string, properties?: EventProperties) {
    if (!this.enabled) return;
    // Replace with PostHog or other provider
    if (__DEV__) {
      console.log('[Analytics] track:', event, properties);
    }
  }

  identify(userId: string, traits?: EventProperties) {
    if (!this.enabled) return;
    if (__DEV__) {
      console.log('[Analytics] identify:', userId, traits);
    }
  }

  screen(name: string, properties?: EventProperties) {
    if (!this.enabled) return;
    if (__DEV__) {
      console.log('[Analytics] screen:', name, properties);
    }
  }
}

export const analytics = new Analytics();
