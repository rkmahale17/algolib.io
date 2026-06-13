---
name: integration-react-native
description: "Install and configure PostHog analytics SDK in React Native applications, including event tracking, feature flags, user identification, and error tracking. Use when the user needs to add PostHog analytics, session recording, or feature flags to a React Native app."
metadata:
  author: PostHog
  version: 1.9.5
---

# PostHog Integration for React Native

Set up PostHog analytics in a React Native application: install the SDK, configure the provider, implement event tracking, identify users, and add error tracking.

## Workflow

Follow these steps in order:

1. `basic-integration-1.0-begin.md` - PostHog Setup - Begin **Start here**
2. `basic-integration-1.1-edit.md` - PostHog Setup - Edit
3. `basic-integration-1.2-revise.md` - PostHog Setup - Revise
4. `basic-integration-1.3-conclude.md` - PostHog Setup - Conclusion

## Reference files

- `references/EXAMPLE.md` - React Native example project code
- `references/react-native.md` - React Native SDK docs
- `references/identify-users.md` - User identification docs

## Framework guidelines

- Install `posthog-react-native` and its required peer dependency `react-native-svg`
- Use `react-native-config` to load `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` from `.env` (embedded at build time, not runtime)
- Place `PostHogProvider` INSIDE `NavigationContainer` for React Navigation v7 compatibility

Minimal provider setup:

```tsx
import PostHog, { PostHogProvider } from 'posthog-react-native';
import Config from 'react-native-config';

const posthogClient = new PostHog(Config.POSTHOG_PROJECT_TOKEN, {
  host: Config.POSTHOG_HOST,
});

// Inside your App component, wrap content within NavigationContainer:
<NavigationContainer>
  <PostHogProvider client={posthogClient}>
    {/* app content */}
  </PostHogProvider>
</NavigationContainer>
```

## Identifying users

Identify users during login and signup events. Pass the client-side session and distinct ID using `X-POSTHOG-DISTINCT-ID` and `X-POSTHOG-SESSION-ID` headers to maintain frontend/backend correlation. Refer to `references/identify-users.md` and `references/EXAMPLE.md` for the correct pattern.

## Error tracking

Add PostHog error tracking around critical user flows and API boundaries. Capture errors with `posthog.capture('$exception', { $exception_message: error.message })`.

## Verification

After completing the integration:

1. Run the app and trigger a test event
2. Confirm the event appears in the PostHog project dashboard within 60 seconds
3. Verify user identification by checking the "Persons" tab for the identified user
