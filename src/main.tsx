import React from 'react';
import { Buffer } from 'buffer';

window.Buffer = Buffer;

import * as Sentry from '@sentry/react';
import ReactDOM from 'react-dom/client';
import {
  createRoutesFromChildren,
  matchRoutes,
  useLocation,
  useNavigationType,
  RouterProvider,
} from 'react-router-dom';

import { router } from './routes/router';
import './styles/index.scss';
import { Config } from '@/lib/config';

Sentry.init({
  dsn: Config.sentry_dsn,
  integrations: [
    Sentry.breadcrumbsIntegration({ console: false }),
    Sentry.browserTracingIntegration(),
    Sentry.replayIntegration({
      maskAllText: false,
      blockAllMedia: false,
    }),
    Sentry.reactRouterV6BrowserTracingIntegration({
      useEffect: React.useEffect,
      useLocation,
      useNavigationType,
      createRoutesFromChildren,
      matchRoutes,
    }),
    Sentry.feedbackIntegration({
      colorScheme: 'system',
      isNameRequired: false,
      isEmailRequired: false,
      showBranding: false,
    }),
  ],
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0,
  tracePropagationTargets: ['localhost', /^https:\/\/yourserver\.io\/api/],
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
});

ReactDOM.createRoot(document.getElementById('root')).render(
  // <React.StrictMode>
  <RouterProvider router={router}></RouterProvider>, //{' '}
  // </React.StrictMode>,
);
