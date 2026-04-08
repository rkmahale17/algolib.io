<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into RulCode.com — a React + Vite + React Router v6 algorithm learning platform. PostHog is initialized in `src/main.tsx` with `PostHogProvider` and `PostHogErrorBoundary` wrapping the app. Events are captured across 8 files covering user authentication, content engagement, game interactions, and feedback. Users are identified at sign-up and sign-in using `posthog.identify()` and `posthog.reset()` on sign-out.

| Event | Description | File |
|-------|-------------|------|
| `user_signed_up` | User creates a new account via email/password | `src/pages/Auth.tsx` |
| `user_signed_in` | User signs in via email or Google OAuth | `src/pages/Auth.tsx` |
| `user_signed_out` | User signs out of the application | `src/components/Navbar.tsx` |
| `algorithm_viewed` | User views an algorithm detail page | `src/pages/AlgorithmDetail.tsx` |
| `algorithm_code_copied` | User copies a code snippet (with language property) | `src/components/CopyCodeButton.tsx` |
| `algorithm_shared` | User shares an algorithm page (native share or clipboard) | `src/components/ShareButton.tsx` |
| `game_selected` | User clicks a game card in the games lobby | `src/pages/Games.tsx` |
| `sort_hero_level_completed` | User completes a Sort Hero level (with score, grade, moves, errors) | `src/components/sortHero/VictoryModal.tsx` |
| `blind75_problem_clicked` | User clicks a Blind 75 problem card (with difficulty, category) | `src/pages/Blind75.tsx` |
| `feedback_submitted` | User submits feedback via GitHub issues | `src/pages/Feedback.tsx` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- **Dashboard — Analytics basics**: https://us.posthog.com/project/373590/dashboard/1442721
- **Sign Ups & Sign Ins Over Time**: https://us.posthog.com/project/373590/insights/AvtrELwg
- **Game Selection → Level Completed Funnel**: https://us.posthog.com/project/373590/insights/AdAMtsbG
- **Top Algorithms Viewed**: https://us.posthog.com/project/373590/insights/TNVgqQMm
- **Algorithm Code Copied by Language**: https://us.posthog.com/project/373590/insights/9HWvWpD3
- **Full User Activation Funnel** (Sign Up → Game → Level): https://us.posthog.com/project/373590/insights/gxl8PFtY

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
