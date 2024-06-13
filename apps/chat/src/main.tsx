import * as ReactDOM from 'react-dom/client';

import App from './app/app';

import './styles.scss';
import * as Sentry from "@sentry/react";

Sentry.init({
	dsn: process.env.NX_CHAT_SENTRY_DNS,
	integrations: [
		Sentry.browserTracingIntegration(),
		Sentry.replayIntegration(),
	],
	// Performance Monitoring
	tracesSampleRate: 1.0, // Capture 100% of the transactions
	// Set 'tracePropagationTargets' to control for which URLs distributed tracing should be enabled
	tracePropagationTargets: [/^\//, /^\//],
	// Session Replay
	replaysSessionSampleRate: 0.1, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
	replaysOnErrorSampleRate: 1.0, // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
});

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(
	<App />
);
