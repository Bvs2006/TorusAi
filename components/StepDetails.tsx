'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore'
import { db } from '@/utils/firebase/client'
import type { Feature, Project, Stack } from '@/types'

interface StepDetailsProps {
  phaseId: number
  projectId?: string
}

type StepData = {
  id: string;
  title: string;
  tool: string;
  why: string;
  guide: string;
  prompt: string;
  expected: string;
  tips: string[];
  beforeStart?: string[];
  verify?: string[];
  toolGuide?: string[];
  ideGuide?: string[];
  handoff?: string;
  documentation?: string;
};

type PhaseData = {
  title: string;
  steps: StepData[];
};

const PHASES: PhaseData[] = [
  {
    title: 'Setup ide',
    steps: [
      {
        id: '1',
        title: 'Configure Cursor / Windsurf',
        tool: 'Cursor IDE',
        why: 'AI-first IDE speeds up coding and understands your entire codebase out of the box.',
        guide: 'Download Cursor, open your empty project folder, and use CMD/CTRL + L or CMD/CTRL + I to start prompting the AI directly within the editor.',
        prompt: 'I am starting a new project. What are the best settings and extensions to install for a Next.js, Firebase, and TailwindCSS stack?',
        expected: 'A list of recommended settings, extensions, and a quick-start checklist.',
        tips: ['Make sure to log in to enable premium AI models.', 'Use the Composer feature for multi-file edits.'],
        beforeStart: ['Create or open the project folder.', 'Confirm Git is installed.', 'Keep your project idea and stack notes nearby.'],
        toolGuide: ['Open Cursor or Windsurf.', 'Open the project folder from File > Open Folder.', 'Use the AI chat or composer panel to ask setup questions.'],
        ideGuide: ['Keep the terminal panel open inside the IDE.', 'Save recommended settings in the workspace if needed.', 'Create a short setup note in README.md for teammates.'],
        verify: ['The project folder opens without permission issues.', 'AI chat/composer can access the workspace.', 'You can run terminal commands inside the IDE.'],
        handoff: 'Commit editor settings or document them in the README so teammates can match the setup.',
        documentation: 'https://docs.cursor.com/'
      },
      {
        id: '2',
        title: 'Create Project Work Plan',
        tool: 'Cursor Chat',
        why: 'A clear work plan helps you know which files, features, and routes you will build before touching code.',
        guide: 'Paste your project idea and ask Cursor to split it into frontend screens, backend APIs, database models, and testing tasks.',
        prompt: 'Create a development work plan for this project. Separate it into Frontend UI screens, Backend API routes, Database models, Authentication, AI features, and Testing. For each item, mention the files I should create or edit.',
        expected: 'A clear feature-wise checklist that separates UI work from backend work.',
        tips: ['Keep this plan open while coding.', 'Update it when requirements change.'],
        beforeStart: ['Open the project idea or documentation.', 'Know the target users.', 'Know the main features.'],
        toolGuide: ['Open Cursor Chat.', 'Paste the project idea and stack.', 'Ask for a file-by-file development plan.'],
        ideGuide: ['Create a TODO.md or notes file.', 'Paste the generated plan into it.', 'Use it to track progress through each phase.'],
        verify: ['Frontend screens are listed.', 'Backend routes are listed.', 'Database/auth/AI tasks are listed.'],
        handoff: 'Share the work plan with teammates before parallel development starts.',
        documentation: 'https://docs.cursor.com/chat/overview'
      }
    ]
  },
  {
    title: 'Environment Setup',
    steps: [
      {
        id: '1',
        title: 'Initialize Next.js Project',
        tool: 'v0.dev / Terminal',
        why: 'Fastest way to get a complete Next.js boilerplate with Tailwind and TypeScript.',
        guide: 'Open your terminal in Cursor, paste the prompt below to get the exact command to run, and follow the setup instructions.',
        prompt: 'Generate the terminal commands to create a new Next.js 14 app with App Router, TailwindCSS, and TypeScript. Also include the command to install Firebase, Lucide React, and Framer Motion.',
        expected: 'Exact terminal commands to run and file structure overview.',
        tips: ['Always choose App Router when prompted by create-next-app.', 'Keep your package.json clean and organized.'],
        beforeStart: ['Install Node.js and npm.', 'Choose a clear project folder name.', 'Decide which environment variables are needed.'],
        toolGuide: ['Ask the AI tool for exact terminal commands.', 'Copy only the commands that match your chosen stack.', 'Run commands one by one so errors are easy to identify.'],
        ideGuide: ['Paste commands into the IDE terminal.', 'After setup, open package.json and verify dependencies.', 'Create .env.local and add only local development keys.'],
        verify: ['npm install completes successfully.', 'npm run dev starts without errors.', 'The homepage opens in the browser.'],
        handoff: 'Share setup commands and required environment variable names with the team.',
        documentation: 'https://nextjs.org/docs'
      },
      {
        id: '2',
        title: 'Create Folder Structure',
        tool: 'Cursor Composer',
        why: 'A clean structure makes frontend components, backend routes, utilities, and database code easier to maintain.',
        guide: 'Ask Cursor to create the recommended folders for app routes, components, API routes, lib utilities, and database helpers.',
        prompt: 'Create a clean folder structure for a Next.js App Router project. Include folders for frontend pages, reusable UI components, API routes, backend utilities, database helpers, auth helpers, and shared types. Explain what each folder is for.',
        expected: 'Organized folders for frontend and backend development.',
        tips: ['Do not create unused folders just for decoration.', 'Keep shared types in one place.'],
        beforeStart: ['Know the app routes.', 'Know the backend features.', 'Open the project root in the IDE.'],
        toolGuide: ['Use Cursor Composer.', 'Ask it to generate folder structure only.', 'Review before accepting file creation.'],
        ideGuide: ['Create app, components, lib, utils, types, and api folders as needed.', 'Move related code into the right folders.', 'Check imports after moving files.'],
        verify: ['Frontend pages have a clear place.', 'Backend API routes have a clear place.', 'Shared utilities are not duplicated.'],
        handoff: 'Tell the team where UI components, APIs, and utilities should be added.',
        documentation: 'https://nextjs.org/docs/app/building-your-application/routing'
      },
      {
        id: '3',
        title: 'Configure Environment Variables',
        tool: 'Cursor IDE',
        why: 'Environment variables keep API keys and service credentials out of source code.',
        guide: 'Create .env.local and .env.example. Add public frontend keys separately from private backend keys.',
        prompt: 'Help me create .env.local and .env.example for this project. Separate NEXT_PUBLIC client variables from server-only secrets. Include comments explaining each variable.',
        expected: 'Safe environment variable setup for frontend and backend services.',
        tips: ['Never commit .env.local.', 'Only expose variables with NEXT_PUBLIC when the browser needs them.'],
        beforeStart: ['Collect Firebase/Supabase/API provider keys.', 'Check .gitignore.', 'Know which keys are client-safe.'],
        toolGuide: ['Ask Cursor to draft env files.', 'Review every variable name.', 'Do not paste real secrets into chat if avoidable.'],
        ideGuide: ['Create .env.example with placeholder values.', 'Create .env.local with real local values.', 'Restart the dev server after env changes.'],
        verify: ['.env.local is ignored by Git.', '.env.example is safe to commit.', 'The app reads env values correctly.'],
        handoff: 'Share .env.example with the team and explain where to get real keys.',
        documentation: 'https://nextjs.org/docs/app/building-your-application/configuring/environment-variables'
      }
    ]
  },
  {
    title: 'Frontend Development',
    steps: [
      {
        id: '1',
        title: 'Create Layout & Navigation',
        tool: 'v0.dev',
        why: 'v0 generates stunning, accessible, and responsive React UI components instantly.',
        guide: 'Go to v0.dev, paste the prompt to generate the layout, and copy the resulting React component code into your project.',
        prompt: 'Create a modern, responsive sidebar navigation and top header layout for a SaaS dashboard. Use Tailwind CSS and Lucide React icons. It should have a dark mode aesthetic with glassmorphism effects.',
        expected: 'A fully functional React component with Tailwind classes that you can copy directly into your layout.tsx file.',
        tips: ['Ask v0 to iterate on the design if it does not match exactly.', 'Ensure you have the required lucide-react icons installed.'],
        beforeStart: ['List the main pages users need.', 'Decide navigation labels.', 'Check existing colors and typography.'],
        toolGuide: ['Open v0.dev or your AI IDE.', 'Paste the UI prompt and mention your stack, styling, and layout needs.', 'Ask for React components using Tailwind and accessible markup.'],
        ideGuide: ['Copy the generated component into the correct file in app or components.', 'Install any missing packages or icons.', 'Replace placeholder text and test the UI in the browser.'],
        verify: ['Navigation links work.', 'Layout does not break on mobile.', 'Repeated UI pieces are components, not copied blocks.'],
        handoff: 'Capture screenshots of the main UI states and note any unfinished screens.',
        documentation: 'https://v0.dev/faq'
      },
      {
        id: '2',
        title: 'Implement Feature UI Screens',
        tool: 'v0.dev / Cursor',
        why: 'Feature screens are where users actually interact with the product, so each major feature needs a clear UI flow.',
        guide: 'For each feature, create the frontend screen first: forms, buttons, empty states, loading states, and result views.',
        prompt: 'Implement the frontend UI for this feature: [FEATURE NAME]. Create a responsive Next.js page/component using Tailwind CSS. Include form inputs, primary actions, loading state, empty state, success state, and error state. Do not connect real backend logic yet; use placeholder data.',
        expected: 'A working frontend UI for the selected feature using placeholder data.',
        tips: ['Build one feature screen at a time.', 'Keep form labels clear and actions obvious.'],
        beforeStart: ['Choose one feature.', 'List user inputs.', 'List expected result display.'],
        toolGuide: ['Use v0 for initial UI or Cursor for app-specific components.', 'Mention the exact feature name.', 'Ask for responsive behavior.'],
        ideGuide: ['Add the generated UI into the correct app route or component file.', 'Replace mock copy with project-specific text.', 'Run the page and inspect desktop/mobile layout.'],
        verify: ['The feature UI renders.', 'Buttons and inputs are visible.', 'Loading/error/empty states exist.'],
        handoff: 'Tell the backend developer what data this UI needs and what action the button should call.',
        documentation: 'https://nextjs.org/docs/app/building-your-application/rendering/client-components'
      },
      {
        id: '3',
        title: 'Connect UI State and Validation',
        tool: 'Cursor Composer',
        why: 'Frontend state and validation make the feature usable before backend integration.',
        guide: 'Add local state, client-side validation, disabled buttons, and clear error messages for the feature UI.',
        prompt: 'Improve this feature UI by adding React state, form validation, disabled submit state, loading indicator, error messages, and a clean success result area. Keep backend calls as a placeholder function for now.',
        expected: 'Interactive frontend UI that validates input and handles user actions cleanly.',
        tips: ['Validate required fields before calling the API.', 'Keep error messages short and helpful.'],
        beforeStart: ['Open the feature component.', 'Know required fields.', 'Know invalid input cases.'],
        toolGuide: ['Select the component in Cursor.', 'Ask for state and validation only.', 'Avoid adding backend logic in this step.'],
        ideGuide: ['Accept changes carefully.', 'Check imports and use client directive if needed.', 'Test input and button behavior in the browser.'],
        verify: ['Invalid form cannot submit.', 'Loading state appears.', 'Success/error state displays correctly.'],
        handoff: 'The UI is now ready to connect with backend API routes.',
        documentation: 'https://react.dev/reference/react/useState'
      }
    ]
  },
  {
    title: 'Backend Development',
    steps: [
      {
        id: '1',
        title: 'Design API Architecture',
        tool: 'Cursor Composer',
        why: 'Cursor can see your frontend code and perfectly match the backend API structure to it.',
        guide: 'Open Cursor Composer (CMD/CTRL + I), reference your frontend files, and ask it to build the corresponding Next.js API routes.',
        prompt: 'Look at my frontend components in the /app folder. Generate the Next.js API route handlers (Route Handlers in the App Router) needed to support fetching and updating this data.',
        expected: 'Complete API route files (route.ts) with proper HTTP methods (GET, POST) and error handling.',
        tips: ['Specify if you need Edge runtime or Node.js runtime.', 'Ask for Zod validation for all incoming POST requests.'],
        beforeStart: ['Write the data each page needs.', 'Name the API routes clearly.', 'Decide request and response shapes.'],
        toolGuide: ['Use Cursor Composer or Windsurf chat with relevant frontend files selected.', 'Ask the tool to create route.ts handlers for the exact data flow.', 'Request validation, error handling, and typed responses.'],
        ideGuide: ['Review each generated route before accepting changes.', 'Place route files under the correct app/api folder.', 'Call the API from the frontend and inspect the response in the browser console.'],
        verify: ['Each route returns useful status codes.', 'Invalid input is rejected.', 'Frontend can call the routes successfully.'],
        handoff: 'Document each endpoint with method, body, response, and error cases.',
        documentation: 'https://docs.cursor.com/composer/overview'
      },
      {
        id: '2',
        title: 'Develop Feature Backend API',
        tool: 'Cursor Composer',
        why: 'Every interactive feature needs backend logic to receive requests, validate data, and return reliable responses.',
        guide: 'Create the backend route for the feature that the frontend UI will call. Include request validation and clear JSON responses.',
        prompt: 'Develop the backend for this feature: [FEATURE NAME]. Create a Next.js App Router API route. It should accept the frontend request body, validate required fields, run the business logic, and return JSON with success, data, and error messages. Include proper status codes.',
        expected: 'A backend API route for the selected feature.',
        tips: ['Keep API responses consistent.', 'Return useful errors for the frontend.'],
        beforeStart: ['Know the frontend request body.', 'Know the expected response shape.', 'Know whether database access is needed.'],
        toolGuide: ['Use Cursor Composer with the frontend component selected.', 'Ask it to create the matching API route.', 'Request validation and error handling.'],
        ideGuide: ['Place the route in app/api/[feature]/route.ts.', 'Review server-only imports.', 'Test the route with the frontend or a REST client.'],
        verify: ['POST/GET route works.', 'Invalid data returns 400.', 'Server errors return a safe message.'],
        handoff: 'Share the endpoint path, request body, and response shape with the frontend developer.',
        documentation: 'https://nextjs.org/docs/app/building-your-application/routing/route-handlers'
      },
      {
        id: '3',
        title: 'Connect Frontend to Backend',
        tool: 'Cursor IDE',
        why: 'The feature is complete only when the UI calls the backend and displays real results.',
        guide: 'Replace placeholder functions in the frontend with fetch calls to your API route.',
        prompt: 'Connect this frontend feature UI to the backend API route. Replace placeholder data with a fetch call, handle loading, success, and error states, and display the backend response in the UI.',
        expected: 'Frontend feature connected to real backend API behavior.',
        tips: ['Handle network errors.', 'Keep the UI responsive while waiting.'],
        beforeStart: ['Backend route is working.', 'Frontend UI has placeholder submit function.', 'Know the API path.'],
        toolGuide: ['Select the frontend component and route file.', 'Ask Cursor to connect them.', 'Review fetch method and body carefully.'],
        ideGuide: ['Update the frontend submit handler.', 'Check browser network tab.', 'Confirm response data appears in the UI.'],
        verify: ['Button calls the backend.', 'Real response appears.', 'Errors are shown to the user.'],
        handoff: 'The feature now has both UI and backend behavior ready for database integration or testing.',
        documentation: 'https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API'
      }
    ]
  },
  {
    title: 'Database Integration',
    steps: [
      {
        id: '1',
        title: 'Setup Firebase Firestore',
        tool: 'Firebase Console / Cursor',
        why: 'Firebase provides a seamless NoSQL database with real-time listeners and easy Next.js integration.',
        guide: 'Create a project in the Firebase Console, get your config, and use Cursor to generate the connection and utility files.',
        prompt: 'I need to connect my Next.js App Router project to Firebase Firestore. Generate the firebase/client.ts initialization file, and provide a utility function to fetch a collection of items.',
        expected: 'A configured firebase initialization script and data fetching utilities.',
        tips: ['Ensure your Firebase config variables are stored in .env.local', 'Do not expose your private Admin SDK keys in the client code.'],
        beforeStart: ['Create the Firebase project.', 'Add required env variables.', 'Sketch the collections or tables.'],
        toolGuide: ['Open Firebase Console to create the project and copy config values.', 'Ask Cursor to generate client/admin utility files using your exact env variable names.', 'Ask for sample read/write helper functions.'],
        ideGuide: ['Add Firebase config to .env.local.', 'Place client code in a client utility file and admin code only on the server.', 'Run one test read and one test write from the app.'],
        verify: ['Client config loads.', 'A test read succeeds.', 'A test write appears in the database console.'],
        handoff: 'Record collection names, required fields, and security rules assumptions.',
        documentation: 'https://firebase.google.com/docs/firestore'
      },
      {
        id: '2',
        title: 'Create Data Model for Feature',
        tool: 'Cursor Chat',
        why: 'A clear data model prevents confusion between frontend fields, backend payloads, and database records.',
        guide: 'Define the collection/table fields for each feature and map them to frontend form values.',
        prompt: 'Design the database model for this feature: [FEATURE NAME]. Include fields, types, required values, example document/row, indexes if needed, and how the frontend form maps to the backend payload.',
        expected: 'Feature-specific data model with fields and example records.',
        tips: ['Use predictable field names.', 'Include created_at and updated_at when useful.'],
        beforeStart: ['Know the feature inputs.', 'Know what must be saved.', 'Know who owns the data.'],
        toolGuide: ['Ask Cursor for schema/model design.', 'Include the feature UI and API route context.', 'Ask for examples.'],
        ideGuide: ['Add shared TypeScript types if needed.', 'Update backend route to use the model.', 'Keep field names consistent across UI/API/database.'],
        verify: ['Model covers all UI fields.', 'Backend payload matches model.', 'Example record is valid.'],
        handoff: 'Share the model with frontend and backend developers so naming stays consistent.',
        documentation: 'https://firebase.google.com/docs/firestore/data-model'
      },
      {
        id: '3',
        title: 'Implement Backend Data Operations',
        tool: 'Cursor Composer',
        why: 'Backend routes should save and fetch real feature data, not just return mock responses.',
        guide: 'Add database read/write logic to the backend route and keep client-side code away from private credentials.',
        prompt: 'Update this backend API route to use the database for [FEATURE NAME]. Add create/read/update operations as needed, validate the request, save the record, fetch records for the current user, and return safe JSON responses.',
        expected: 'Backend feature route connected to real database operations.',
        tips: ['Do not expose admin credentials to the browser.', 'Handle missing records clearly.'],
        beforeStart: ['Database config works.', 'Feature API route exists.', 'Data model is defined.'],
        toolGuide: ['Select the API route and database utility files.', 'Ask Cursor to add database operations.', 'Request server-only code.'],
        ideGuide: ['Place database calls in server utilities or route handlers.', 'Run the route and check the database console.', 'Fix security rules or permissions if needed.'],
        verify: ['Create operation saves data.', 'Fetch operation returns saved data.', 'Invalid access is blocked.'],
        handoff: 'The feature now has persistent backend data and is ready for auth/security checks.',
        documentation: 'https://firebase.google.com/docs/firestore/query-data/get-data'
      }
    ]
  },
  {
    title: 'Authentication',
    steps: [
      {
        id: '1',
        title: 'Implement Firebase Auth',
        tool: 'Cursor IDE',
        why: 'Cursor can perfectly integrate Firebase Auth state into your Next.js application using React Context.',
        guide: 'Ask Cursor to generate an AuthProvider context and the login/signup API routes.',
        prompt: 'Write a complete Firebase Authentication flow for Next.js App Router. Create an AuthContext provider, a useAuth hook, and a Login page component with Google Sign-in and Email/Password options using TailwindCSS.',
        expected: 'AuthContext file, useAuth hook, and a beautifully styled Login page component.',
        tips: ['Remember to enable Google and Email providers in your Firebase Console.', 'Use middleware.ts to protect private routes.'],
        beforeStart: ['Enable auth providers.', 'Define public and private routes.', 'Decide where logged-in users should land.'],
        toolGuide: ['Enable providers in Firebase Console first.', 'Ask Cursor to generate AuthProvider, login page, session handling, and route protection.', 'Tell the AI which routes are public and private.'],
        ideGuide: ['Add generated auth files into utils, app auth routes, and middleware as appropriate.', 'Test signup, login, logout, and protected route redirects.', 'Keep secrets on the server and public config in client-safe env vars.'],
        verify: ['Signup and login work.', 'Logout clears session.', 'Private pages redirect unauthenticated users.'],
        handoff: 'Document test accounts, redirect behavior, and protected route rules.',
        documentation: 'https://firebase.google.com/docs/auth'
      },
      {
        id: '2',
        title: 'Protect Frontend Routes',
        tool: 'Cursor IDE',
        why: 'Private UI pages should not be accessible without a valid session.',
        guide: 'Add route protection so dashboard, planner, and user data pages redirect unauthenticated users.',
        prompt: 'Protect the frontend routes in this Next.js app. Add middleware or server-side checks so unauthenticated users are redirected to login, authenticated users can access the dashboard, and logged-in users are redirected away from login/signup pages.',
        expected: 'Frontend route protection for private pages.',
        tips: ['Test logged-in and logged-out states.', 'Avoid flashing private content before redirect.'],
        beforeStart: ['List public routes.', 'List private routes.', 'Know session cookie or auth state method.'],
        toolGuide: ['Ask Cursor to inspect current auth setup.', 'Request route protection only.', 'Review redirect paths.'],
        ideGuide: ['Update middleware or layout checks.', 'Test routes in a private browser window.', 'Confirm redirects work after refresh.'],
        verify: ['Logged-out users cannot see private pages.', 'Logged-in users can access dashboard.', 'Login/signup redirect correctly.'],
        handoff: 'Document which routes are public and private.',
        documentation: 'https://nextjs.org/docs/app/building-your-application/routing/middleware'
      },
      {
        id: '3',
        title: 'Connect Backend to Current User',
        tool: 'Cursor Composer',
        why: 'Backend work must save and fetch data for the correct authenticated user.',
        guide: 'Update backend API routes to read the current user/session and filter database operations by user ID.',
        prompt: 'Update my backend API routes so they use the authenticated user session. Save new records with user_id, fetch only the current user’s records, and return 401 for unauthenticated requests.',
        expected: 'Backend routes that respect user authentication and data ownership.',
        tips: ['Never trust userId from the browser if a secure session is available.', 'Return 401 for missing session.'],
        beforeStart: ['Auth session works.', 'Database records include user ownership field.', 'API routes exist.'],
        toolGuide: ['Select auth utilities and API routes in Cursor.', 'Ask for current-user enforcement.', 'Request safe 401/403 handling.'],
        ideGuide: ['Update API route session checks.', 'Add user_id filters to database queries.', 'Test with two different users if possible.'],
        verify: ['Unauthenticated requests fail.', 'User sees only their data.', 'New records include user_id.'],
        handoff: 'Backend feature work is now secure enough for user-specific testing.',
        documentation: 'https://firebase.google.com/docs/auth/admin/manage-cookies'
      }
    ]
  },
  {
    title: 'AI Feature Integration',
    steps: [
      {
        id: '1',
        title: 'Connect LLM API',
        tool: 'Groq / Cursor',
        why: 'Groq provides incredibly fast AI inference which is essential for responsive AI features.',
        guide: 'Get your API key from Groq Console, and ask Cursor to build an AI route handler.',
        prompt: 'Create a Next.js API route that connects to the Groq API (using the groq-sdk). It should take a user prompt from the request body, send it to the llama3-70b-8192 model, and return the streaming response.',
        expected: 'An API route handling the Groq connection and returning a readable stream.',
        tips: ['Use the AI SDK by Vercel (ai package) for easy UI streaming.', 'Always handle rate limits gracefully.'],
        beforeStart: ['Create an AI provider API key.', 'Store the key only on the server.', 'Define the exact user input and AI output.'],
        toolGuide: ['Open Groq Console and create an API key.', 'Ask Cursor to build a server-only API route for the AI request.', 'Request loading states, error states, and fallback handling.'],
        ideGuide: ['Add the API key to .env.local, never to client components.', 'Put provider calls inside app/api routes or server utilities.', 'Connect the frontend form to the route and test a real prompt.'],
        verify: ['API returns an AI response.', 'Loading and error states are visible.', 'Missing API key fails with a clear message.'],
        handoff: 'Write the prompt purpose, model name, rate-limit assumptions, and fallback behavior.',
        documentation: 'https://console.groq.com/docs/quickstart'
      },
      {
        id: '2',
        title: 'Build AI Feature UI',
        tool: 'v0.dev / Cursor',
        why: 'AI features need clear input areas, progress feedback, and readable output sections.',
        guide: 'Create the frontend UI for the AI feature, including prompt input, generate button, loading state, result view, and error state.',
        prompt: 'Implement the frontend UI for this AI feature: [AI FEATURE NAME]. Include a prompt textarea, settings if needed, generate button, loading state, error state, and a polished result card. Use Tailwind CSS and keep it responsive.',
        expected: 'Frontend UI for submitting AI prompts and displaying AI results.',
        tips: ['Make loading state obvious.', 'Show AI output in a readable format.'],
        beforeStart: ['Define user input.', 'Define AI output format.', 'Know where the feature lives in the app.'],
        toolGuide: ['Use v0 for UI or Cursor for existing app integration.', 'Mention the exact AI feature.', 'Ask for loading and error states.'],
        ideGuide: ['Add UI into the correct app page/component.', 'Keep API call as placeholder first.', 'Verify layout on desktop and mobile.'],
        verify: ['User can type input.', 'Generate button is clear.', 'Output area is ready.'],
        handoff: 'Frontend AI UI is ready to connect with the AI backend route.',
        documentation: 'https://react.dev/learn/responding-to-events'
      },
      {
        id: '3',
        title: 'Develop AI Backend Logic',
        tool: 'Cursor Composer',
        why: 'AI calls must run on the backend so API keys stay secure and prompts can be controlled.',
        guide: 'Create or update an API route that receives frontend input, builds the system prompt, calls the AI provider, and returns structured output.',
        prompt: 'Develop the backend for this AI feature: [AI FEATURE NAME]. Create a Next.js API route that receives user input, validates it, builds a strong system prompt, calls the Groq API, handles provider errors, and returns structured JSON for the frontend.',
        expected: 'Secure backend route for the AI feature.',
        tips: ['Keep API keys server-only.', 'Return structured JSON when the UI expects structured data.'],
        beforeStart: ['AI API key is configured.', 'Frontend input shape is known.', 'Expected AI output is known.'],
        toolGuide: ['Select existing AI utilities and API routes.', 'Ask Cursor to add provider call and validation.', 'Request fallback behavior if available.'],
        ideGuide: ['Place AI code in app/api or lib server utilities.', 'Test route with sample input.', 'Connect frontend fetch after route works.'],
        verify: ['Route returns AI output.', 'Missing input returns 400.', 'Provider errors show safe messages.'],
        handoff: 'AI backend is ready for frontend integration and testing.',
        documentation: 'https://console.groq.com/docs/quickstart'
      }
    ]
  },
  {
    title: 'Testing',
    steps: [
      {
        id: '1',
        title: 'Write Core Unit Tests',
        tool: 'Cursor Chat',
        why: 'AI is excellent at generating repetitive unit tests and finding edge cases.',
        guide: 'Select your critical utility functions or components, and ask Cursor to generate Jest or Vitest tests for them.',
        prompt: 'Generate comprehensive unit tests for this utility function using Vitest. Include tests for edge cases, null inputs, and expected successful outputs.',
        expected: 'A complete .test.ts file covering all branches of your function.',
        tips: ['Review the generated tests to ensure they are testing actual logic, not just mocking everything.', 'Keep tests fast and isolated.'],
        beforeStart: ['Choose the most important functions or flows.', 'Confirm the test command.', 'Prepare sample valid and invalid inputs.'],
        toolGuide: ['Select the function or component in the IDE.', 'Ask AI to generate focused tests for success, failure, and edge cases.', 'Ask it to avoid over-mocking the logic being tested.'],
        ideGuide: ['Create the generated test file beside the source or in the project test folder.', 'Run the test command in the IDE terminal.', 'Fix failing tests only after confirming the test expectation is correct.'],
        verify: ['Tests fail before the fix when possible.', 'Tests pass locally.', 'Manual smoke test still works.'],
        handoff: 'Share the test command and list any remaining untested risks.',
        documentation: 'https://docs.cursor.com/chat/overview'
      },
      {
        id: '2',
        title: 'Test Frontend Feature Flow',
        tool: 'Cursor Chat',
        why: 'Frontend testing confirms users can complete the feature without broken UI states.',
        guide: 'Ask AI to create a manual test checklist for each feature UI and then run through it in the browser.',
        prompt: 'Create a manual frontend QA checklist for this feature: [FEATURE NAME]. Include normal flow, empty input, invalid input, loading state, success state, error state, and mobile layout checks.',
        expected: 'Feature-specific frontend QA checklist.',
        tips: ['Test in a fresh browser session.', 'Resize the screen to mobile width.'],
        beforeStart: ['Frontend feature is connected.', 'Dev server is running.', 'Know success and failure cases.'],
        toolGuide: ['Ask Cursor for a QA checklist.', 'Include the exact feature name.', 'Ask for edge cases.'],
        ideGuide: ['Run the app locally.', 'Follow the checklist in the browser.', 'Fix UI bugs immediately or record them.'],
        verify: ['Main UI flow works.', 'Errors show clearly.', 'Mobile layout is usable.'],
        handoff: 'Attach the checklist results to your project notes.',
        documentation: 'https://nextjs.org/docs/app/building-your-application/testing'
      },
      {
        id: '3',
        title: 'Test Backend Feature Flow',
        tool: 'Cursor IDE',
        why: 'Backend testing confirms APIs, validation, auth, and database operations behave correctly.',
        guide: 'Test each feature API with valid and invalid requests, including unauthenticated access if auth is used.',
        prompt: 'Create backend tests or a backend QA checklist for this feature API: [API ROUTE]. Include valid request, missing fields, invalid data, unauthenticated request, database success, and database failure cases.',
        expected: 'Backend test plan or test file for the feature API.',
        tips: ['Test status codes.', 'Check database side effects.'],
        beforeStart: ['API route exists.', 'Database is connected if needed.', 'Auth behavior is known.'],
        toolGuide: ['Ask Cursor to generate tests or a route QA checklist.', 'Provide the route code.', 'Request edge cases and expected status codes.'],
        ideGuide: ['Add test files or run manual API checks.', 'Use browser network tab or REST client.', 'Fix backend errors before UI polish.'],
        verify: ['Valid request succeeds.', 'Invalid request fails safely.', 'Database changes are correct.'],
        handoff: 'Backend feature is ready for final polish after API checks pass.',
        documentation: 'https://nextjs.org/docs/app/building-your-application/routing/route-handlers'
      }
    ]
  },

  {
    title: 'Documentation',
    steps: [
      {
        id: '1',
        title: 'Generate README.md',
        tool: 'Cursor Composer',
        why: 'Cursor has full context of your completed project and can write accurate documentation automatically.',
        guide: 'Ask Cursor to review your codebase and draft a professional README.',
        prompt: 'Review my entire codebase and generate a comprehensive README.md. Include a project description, feature list, tech stack, local setup instructions, and deployment guide.',
        expected: 'A beautifully formatted markdown file documenting your project.',
        tips: ['Add screenshots of your application to the README.', 'Include a license and contact information.'],
        beforeStart: ['Collect setup commands.', 'List environment variables.', 'Note deployment and demo steps.'],
        toolGuide: ['Ask Cursor Composer to inspect the codebase before writing documentation.', 'Request a README with setup, features, stack, env variables, and deployment steps.', 'Ask it to keep commands accurate and remove outdated sections.'],
        ideGuide: ['Review the generated README in the IDE preview.', 'Replace placeholders with real project links and screenshots.', 'Run setup steps once from the documentation to verify accuracy.'],
        verify: ['A new developer can run the project from the README.', 'Screenshots and links are accurate.', 'Known limitations are included.'],
        handoff: 'Keep documentation updated after every major feature change.',
        documentation: 'https://docs.cursor.com/composer/overview'
      },
      {
        id: '2',
        title: 'Document Frontend and Backend Features',
        tool: 'Cursor Composer',
        why: 'Feature documentation helps evaluators and teammates understand what was built and how it works.',
        guide: 'For every feature, write what UI was implemented and what backend work supports it.',
        prompt: 'Create feature documentation for this project. For each feature, include: frontend UI implemented, backend/API work implemented, database collections/tables used, authentication rules, and how to test it.',
        expected: 'Feature-wise frontend and backend documentation.',
        tips: ['Keep descriptions short but specific.', 'Mention file paths where helpful.'],
        beforeStart: ['List completed features.', 'Know UI pages.', 'Know backend routes.'],
        toolGuide: ['Ask Cursor to inspect codebase and summarize features.', 'Request frontend/backend separation.', 'Ask it to include test steps.'],
        ideGuide: ['Add the output to PROJECT_DOCUMENTATION.md or README.md.', 'Check file paths and route names.', 'Remove anything that was not actually implemented.'],
        verify: ['Each feature has UI notes.', 'Each feature has backend notes.', 'Testing steps are included.'],
        handoff: 'This documentation is ready for project review or submission.',
        documentation: 'https://www.markdownguide.org/basic-syntax/'
      },
      {
        id: '3',
        title: 'Prepare Final Demo Guide',
        tool: 'Cursor Chat',
        why: 'A demo guide helps you confidently present the project and explain frontend/backend work.',
        guide: 'Write a short demo script that explains the problem, shows each feature UI, and mentions the backend work behind it.',
        prompt: 'Write a final demo guide for this project. Include opening explanation, feature demo order, what to click on each screen, what backend/API work supports each feature, and closing conclusion.',
        expected: 'Presentation-ready demo flow.',
        tips: ['Practice once before presenting.', 'Keep the demo order simple.'],
        beforeStart: ['App runs locally.', 'Demo data is ready.', 'Main features work.'],
        toolGuide: ['Ask Cursor for a demo script.', 'Mention target audience.', 'Ask for concise speaking points.'],
        ideGuide: ['Save the demo guide in documentation.', 'Open the app and follow the script.', 'Adjust any unclear steps.'],
        verify: ['Demo can be completed without confusion.', 'Frontend work is explained.', 'Backend work is explained.'],
        handoff: 'Use this guide during review, viva, or project presentation.',
        documentation: 'https://www.markdownguide.org/basic-syntax/'
      }
    ]
  }
];

export default function StepDetails({ phaseId, projectId }: StepDetailsProps) {
  const phase = PHASES[phaseId - 1] || PHASES[0]
  const [completedSteps, setCompletedSteps] = useState<Record<string, boolean>>({})
  const [project, setProject] = useState<Project | null>(null)
  const [features, setFeatures] = useState<Feature[]>([])
  const [architectureTools, setArchitectureTools] = useState<any[]>([])

  useEffect(() => {
    if (!projectId) return
    Promise.all([
      getDoc(doc(db as any, 'projects', projectId)),
      getDocs(query(collection(db as any, 'features'), where('project_id', '==', projectId)))
    ]).then(([projectSnap, featureSnap]) => {
      const projectData = projectSnap.exists() ? ({ id: projectSnap.id, ...projectSnap.data() } as Project) : null
      if (projectData) setProject(projectData)
      const loadedFeatures = featureSnap.docs
        .map((d: any) => ({ id: d.id, ...d.data() }))
        .sort((a: Feature, b: Feature) => (a.sort_order || 0) - (b.sort_order || 0))
      setFeatures(loadedFeatures as Feature[])

      if (projectData) {
        const cacheKey = `torus-architecture-tools:${projectId}`
        try {
          const cached = sessionStorage.getItem(cacheKey)
          if (cached) {
            const parsed = JSON.parse(cached)
            if (Array.isArray(parsed.tools)) setArchitectureTools(parsed.tools)
          }
        } catch {
          sessionStorage.removeItem(cacheKey)
        }

        fetch('/api/ai/recommend-tools', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            projectIdea: projectData.idea,
            features: loadedFeatures,
            platform: projectData.platform,
            stack: projectData.stack || {},
          })
        }).then(res => res.json())
          .then(data => {
            if (Array.isArray(data.tools)) {
              setArchitectureTools(data.tools)
              sessionStorage.setItem(cacheKey, JSON.stringify({ tools: data.tools, generatedAt: Date.now() }))
            }
          })
          .catch(() => {})
      }
    })
  }, [projectId])

  // Error Assistant Modal State
  const [showErrorModal, setShowErrorModal] = useState(false)
  const [errorText, setErrorText] = useState('')
  const [language, setLanguage] = useState('TypeScript/Next.js')
  const [context, setContext] = useState('')
  const [result, setResult] = useState<{ explanation: string; steps: string[]; fixedPrompt: string; relatedDocs?: string } | null>(null)
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState<string | null>(null)

  async function handleFix(e: React.FormEvent) {
    e.preventDefault()
    if (!errorText.trim()) { alert('⚠️ Paste an error message first'); return }
    setLoading(true); setResult(null)
    try {
      const res = await fetch('/api/ai/fix', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: errorText, language, context, stack: project?.stack })
      })
      const data = await res.json()
      setResult(data)
    } catch (err) {
      alert('Something went wrong. Try again.')
    }
    setLoading(false)
  }

  async function copyText(text: string, key: string) {
    await navigator.clipboard.writeText(text)
    setCopied(key)
    setTimeout(() => setCopied(null), 2500)
  }

  function copyPrompt(p: string) {
    navigator.clipboard.writeText(p)
    alert('Prompt copied')
  }

  function openTool(toolName: string) {
    const lower = toolName.toLowerCase()
    let url = 'https://google.com/search?q=' + encodeURIComponent(toolName)
    
    if (lower.includes('cursor')) url = 'https://cursor.com'
    else if (lower.includes('windsurf')) url = 'https://codeium.com/windsurf'
    else if (lower.includes('v0')) url = 'https://v0.dev'
    else if (lower.includes('firebase')) url = 'https://console.firebase.google.com'
    else if (lower.includes('groq')) url = 'https://console.groq.com'
    else if (lower.includes('vercel')) url = 'https://vercel.com'
    
    window.open(url, '_blank')
  }

  const completedCount = phase.steps.filter(s => completedSteps[s.id]).length
  const mustFeatures = features.filter(f => f.priority === 'must')
  const featureFocus = mustFeatures.length ? mustFeatures : features
  const primaryFeature = featureFocus[0]
  const featureNames = featureFocus.slice(0, 5).map(f => f.name)
  const allFeatureText = featureNames.length ? featureNames.join(', ') : 'the selected project features'
  const projectName = project?.name || 'this project'
  const projectIdea = project?.idea || 'the project idea'
  const projectPlatform = project?.platform || 'the target platform'
  const experienceLevel = project?.experience || 'your current'

  function stackName(key: keyof Stack, fallback: string) {
    return project?.stack?.[key]?.name || fallback
  }

  function getPhaseTool(stepTool: string) {
    if (phaseId === 3) return stackName('frontend', stepTool)
    if (phaseId === 4) return stackName('backend', stepTool)
    if (phaseId === 5) return stackName('database', stepTool)
    if (phaseId === 6) return stackName('auth', stepTool)
    if (phaseId === 7) return stackName('ai', stepTool)
    return stepTool
  }

  function apiSlug() {
    const name = primaryFeature?.name || 'feature'
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'feature'
  }

  function slugForFeature(feature?: Feature) {
    const name = feature?.name || 'feature'
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'feature'
  }

  function phaseToolLayer() {
    if (phaseId === 3) return 'Frontend'
    if (phaseId === 4) return 'Backend'
    if (phaseId === 5) return 'Data'
    if (phaseId === 7) return 'Backend'
    if (phaseId === 8) return 'DevOps'
    if (phaseId === 9) return 'DevOps'
    return ''
  }

  function architectureToolForPhase(stepTool: string) {
    const layer = phaseToolLayer()
    const matching = architectureTools.find((tool: any) => layer && String(tool.layer || '').toLowerCase() === layer.toLowerCase())
      || architectureTools.find((tool: any) => String(tool.name || '').toLowerCase().includes(getPhaseTool(stepTool).toLowerCase()))
      || architectureTools[0]

    return matching || {
      name: getPhaseTool(stepTool),
      layer: layer || 'General',
      reason: `Use ${getPhaseTool(stepTool)} for this phase.`,
      configuration: 'Follow the selected architecture and project stack.',
    }
  }

  function architectureToolSummary(stepTool: string) {
    if (!architectureTools.length) {
      return `Recommended tool for this phase: ${getPhaseTool(stepTool)}.`
    }

    const layer = phaseToolLayer()
    const relevant = architectureTools
      .filter((tool: any) => !layer || String(tool.layer || '').toLowerCase() === layer.toLowerCase())
      .slice(0, 3)
    const tools = (relevant.length ? relevant : architectureTools.slice(0, 3))
      .map((tool: any) => `${tool.name}${tool.layer ? ` (${tool.layer})` : ''}: ${tool.reason || tool.description || 'Recommended from architecture.'}`)
      .join('; ')

    return `Architecture AI tools to consider: ${tools}.`
  }

  function withProjectContext(text: string) {
    const selectedFeature = primaryFeature?.name || 'the selected feature'
    const selectedDescription = primaryFeature?.description || 'the feature described in the project plan'
    const replaced = text
      .replace(/\[FEATURE NAME\]/g, selectedFeature)
      .replace(/\[AI FEATURE NAME\]/g, selectedFeature)
      .replace(/\[API ROUTE\]/g, `/api/${apiSlug()}`)

    if (!features.length && !project) return replaced
    return `${replaced}

Project context:
- Project name: ${projectName}
- Project idea: ${projectIdea}
- Target platform: ${projectPlatform}
- Developer experience: ${experienceLevel}
- Main feature for this step: ${selectedFeature} - ${selectedDescription}
- Selected features from previous step: ${allFeatureText}
- Frontend stack: ${stackName('frontend', 'selected frontend stack')}
- Backend stack: ${stackName('backend', 'selected backend stack')}
- Database: ${stackName('database', 'selected database')}
- Authentication: ${stackName('auth', 'selected auth provider')}
- AI tool/provider: ${stackName('ai', 'selected AI provider')}
- Architecture AI tools: ${architectureToolSummary(getPhaseTool('Cursor'))}`
  }

  function shortText(text: string) {
    return withProjectContext(text).split('\n\nProject context:')[0]
  }

  function phaseFocus() {
    const feature = primaryFeature?.name || 'the first core feature'
    const dbName = stackName('database', 'your selected database')
    const authName = stackName('auth', 'your selected auth provider')
    const aiName = stackName('ai', 'your selected AI provider')

    switch (phaseId) {
      case 1:
        return `Set up the solo developer workspace for "${projectName}" before coding. Keep the idea, target users, stack, and feature list visible so every prompt is grounded in this exact project.`
      case 2:
        return `Create the actual ${projectPlatform} foundation for "${projectName}" using ${stackName('frontend', 'the selected frontend stack')} and ${stackName('backend', 'the selected backend stack')}.`
      case 3:
        return `Build user-facing screens for ${allFeatureText}. Start with "${feature}" so the interface proves the main user flow early.`
      case 4:
        return `Implement backend routes and business logic that support ${allFeatureText}, starting with the API behavior behind "${feature}".`
      case 5:
        return `Design the ${dbName} data model for ${allFeatureText}, including fields, ownership, relationships, and read/write flow.`
      case 6:
        return `Use ${authName} to protect private screens and make sure each user's data for ${allFeatureText} is isolated.`
      case 7:
        return `Connect ${aiName} only where it improves "${projectName}", especially around "${feature}" if that feature needs generation, analysis, suggestions, or automation.`
      case 8:
        return `Test the complete solo developer path for "${projectName}": UI actions, API responses, database writes, auth checks, and AI behavior.`
      case 9:
        return `Prepare submission-ready documentation and a demo script that explains "${projectName}" through its real features: ${allFeatureText}.`
      default:
        return `Build "${projectName}" around its actual idea and selected features: ${allFeatureText}.`
    }
  }

  function contextualGuide(step: StepData) {
    const tool = getPhaseTool(step.tool)
    const feature = primaryFeature?.name || 'the active feature'
    const base = shortText(step.guide)

    return `${base} For "${projectName}", focus this step on ${allFeatureText}. Use ${tool} with the project idea "${projectIdea}" and ask for output that matches ${projectPlatform}, ${stackName('frontend', 'your frontend')}, ${stackName('backend', 'your backend')}, ${stackName('database', 'your database')}, and ${stackName('auth', 'your auth')}. If the generated result is generic, ask the tool to rewrite it specifically for "${feature}" and the feature list above.`
  }

  function contextualExpected(step: StepData) {
    if (phaseId === 3) return `Working UI for ${allFeatureText}, with screens, states, and copy that match "${projectName}".`
    if (phaseId === 4) return `API/business logic that supports ${allFeatureText}, with typed request/response shapes and error handling.`
    if (phaseId === 5) return `A ${stackName('database', 'database')} model for ${allFeatureText}, including ownership fields and test data.`
    if (phaseId === 6) return `Protected routes and user-specific access rules for "${projectName}".`
    if (phaseId === 7) return `A useful AI flow for "${projectName}" that connects frontend input to a server-side AI route.`
    return `${shortText(step.expected)} The result should be specific to "${projectName}", not a reusable template.`
  }

  function contextualBeforeStart(step: StepData) {
    const items = [...(step.beforeStart || [])]
    return [
      `Confirm the idea: ${projectIdea}`,
      `Keep these features in scope: ${allFeatureText}`,
      `Use the selected stack: ${stackName('frontend', 'frontend')}, ${stackName('backend', 'backend')}, ${stackName('database', 'database')}, ${stackName('auth', 'auth')}`,
      ...items.slice(0, 2),
    ]
  }

  function contextualVerify(step: StepData) {
    const items = [...(step.verify || [step.expected])]
    return [
      `The output mentions "${projectName}" or its real feature names, not placeholder app names.`,
      `At least one core feature is covered: ${allFeatureText}.`,
      ...items.slice(0, 2),
    ]
  }

  function contextualToolGuide(step: StepData) {
    const items = [...(step.toolGuide || [])]
    return [
      `Open ${getPhaseTool(step.tool)} and paste the ready-made prompt with project context included.`,
      `Ask for files, routes, schemas, and UI states for "${projectName}" specifically.`,
      ...items.slice(0, 2),
    ]
  }

  function contextualIdeGuide(step: StepData) {
    const items = [...(step.ideGuide || [])]
    return [
      `Apply generated code only to files that belong to "${projectName}" and this phase.`,
      `Rename placeholder entities to match ${allFeatureText}.`,
      ...items.slice(0, 2),
    ]
  }

  function contextualHandoff(step: StepData) {
    return `${step.handoff || 'Commit the completed work and write down anything the next phase depends on.'} Note what changed for "${projectName}", which feature was completed, and what is still pending.`
  }

  function phaseFeatureWork(feature: Feature) {
    const featureName = feature.name
    const featureDescription = feature.description || 'No extra description provided.'
    const route = slugForFeature(feature)

    if (phaseId === 3) {
      return `Frontend UI work for "${featureName}": create or update the page/component route for /${route}; include all forms, input labels, primary buttons, secondary links, empty state, loading state, error state, success state, and responsive mobile layout. If this feature is login/auth, include email/password fields, sign in button, sign up link, forgot password link, validation messages, and disabled loading button. If this feature is dashboard, include metric cards, recent activity/list/table area, navigation actions, and empty data state.`
    }
    if (phaseId === 4) {
      return `Backend work for "${featureName}": create /api/${route} route handlers with GET/POST or the methods this feature needs; validate the request body, return typed JSON, handle auth/session if needed, and connect the route shape to the frontend UI.`
    }
    if (phaseId === 5) {
      return `Database work for "${featureName}": design fields, ownership/user_id, timestamps, status fields, indexes, and sample seed data in ${stackName('database', 'the selected database')}; map every UI input to a stored field.`
    }
    if (phaseId === 6) {
      return `Authentication and permission work for "${featureName}": decide which screens/routes are public or protected, add redirects, session checks, user-owned reads/writes, and permission error states.`
    }
    if (phaseId === 7) {
      return `AI integration work for "${featureName}": only add AI where it improves the feature; create a server-side AI route, define prompt inputs/outputs, loading/error UI, rate-limit/error fallback behavior, and keep API keys server-only.`
    }
    if (phaseId === 8) {
      return `Testing work for "${featureName}": test the full user flow, invalid input, loading state, empty state, API error state, database persistence, and auth restrictions if protected.`
    }
    if (phaseId === 9) {
      return `Documentation/demo work for "${featureName}": document the UI route, API endpoint, database fields, auth rules, AI behavior if used, and exact demo clicks.`
    }
    if (phaseId === 2) {
      return `Environment/setup work for "${featureName}": create the route folder, component placeholder, API placeholder, types, and env variable notes needed before implementation.`
    }
    return `Planning work for "${featureName}": break it into UI, backend, database, auth, AI, test, and demo tasks.`
  }

  function featurePrompt(step: StepData, feature: Feature, index: number) {
    const tool = architectureToolForPhase(step.tool)
    const route = slugForFeature(feature)
    return `You are my AI coding assistant in ${tool.name}. Build the next implementation slice for my project.

Project: ${projectName}
Idea: ${projectIdea}
Platform: ${projectPlatform}
Developer level: ${experienceLevel}
Phase: ${phase.title}
Step: ${step.title}
Feature ${index + 1}: ${feature.name}
Feature description: ${feature.description || 'Use the feature name and project idea to infer the required behavior.'}

Selected stack:
- Frontend: ${stackName('frontend', 'selected frontend stack')}
- Backend: ${stackName('backend', 'selected backend stack')}
- Database: ${stackName('database', 'selected database')}
- Auth: ${stackName('auth', 'selected auth provider')}
- AI provider: ${stackName('ai', 'selected AI provider')}

Architecture tool context:
- Recommended tool: ${tool.name}
- Layer: ${tool.layer || phaseToolLayer() || 'General'}
- Why: ${tool.reason || tool.description || 'Recommended by the architecture guide.'}
- Setup/configuration: ${tool.configuration || 'Use the project architecture and existing stack.'}

Exact work to do:
${phaseFeatureWork(feature)}

Expected files/artifacts:
- Frontend route/component for /${route} if this phase touches UI.
- API route /api/${route} if this phase touches backend logic.
- Shared TypeScript types for request/response/data model where useful.
- Clear loading, success, error, and empty states where the user interacts.
- Do not invent unrelated features. Use only this feature plus the project context.

Definition of done:
- The output is specific to "${feature.name}", not a generic template.
- It explains which files to create or edit.
- It includes implementation steps and code-level constraints.
- It lists how I should verify the feature in the browser or API test.`
  }

  function featureGuideLabel() {
    if (!primaryFeature) return 'Feature-specific guidance will appear after you generate or select features.'
    if (phaseId === 3) return `Frontend work: implement UI for "${primaryFeature.name}" and prepare screens for ${allFeatureText}.`
    if (phaseId === 4) return `Backend work: develop API/business logic for "${primaryFeature.name}" and connect it to the UI.`
    if (phaseId === 5) return `Database work: design and persist data for "${primaryFeature.name}" using ${stackName('database', 'your database')}.`
    if (phaseId === 6) return `Auth work: protect "${primaryFeature.name}" and user-owned data with ${stackName('auth', 'your auth provider')}.`
    if (phaseId === 7) return `AI work: use ${stackName('ai', 'your AI provider')} for AI behavior related to "${primaryFeature.name}".`
    if (phaseId === 8) return `Testing work: verify frontend and backend flows for ${allFeatureText}.`
    if (phaseId === 9) return `Documentation work: explain UI, backend, database, and AI implementation for ${allFeatureText}.`
    return `Project features from the previous step: ${allFeatureText}.`
  }

  return (
    <div>
      <h2 style={{ fontSize: 24, fontFamily: 'Syne, sans-serif', fontWeight: 800 }}>{phase.title}</h2>
      <div style={{ marginTop: 8, color: '#6b7280', fontSize: 14 }}>
        {phaseFocus()}
      </div>

      <div style={{ marginTop: 18, background: '#f0fdfa', border: '1px solid #99f6e4', borderRadius: 12, padding: 16 }}>
        <div style={{ fontSize: 12, fontWeight: 800, color: '#0f766e', textTransform: 'uppercase', marginBottom: 8 }}>
          Connected to your previous steps
        </div>
        <div style={{ fontSize: 14, color: '#134e4a', lineHeight: 1.6 }}>{featureGuideLabel()}</div>
        {featureFocus.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 12 }}>
            {featureFocus.slice(0, 6).map(f => (
              <span key={f.id} style={{ fontSize: 12, color: '#115e59', background: '#ccfbf1', border: '1px solid #99f6e4', borderRadius: 999, padding: '5px 9px' }}>
                {f.name}
              </span>
            ))}
          </div>
        )}
      </div>

      <div style={{ marginTop: 18, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12 }}>
        {[
          { label: 'Prepare', text: 'Check tools, keys, files, and context first.' },
          { label: 'Build', text: 'Use the prompt, then review every generated change.' },
          { label: 'Verify', text: 'Run the app and confirm the expected output.' },
          { label: 'Handoff', text: 'Commit or document what changed for the next phase.' },
        ].map(item => (
          <div key={item.label} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 10, padding: 14 }}>
            <div style={{ fontSize: 12, fontWeight: 800, color: '#0f766e', marginBottom: 5 }}>{item.label}</div>
            <div style={{ fontSize: 12, color: '#475569', lineHeight: 1.45 }}>{item.text}</div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 24, display: 'grid', gap: 24 }}>
        {phase.steps.map((s, idx) => (
          <div key={s.id} style={{ background: '#fff', padding: 24, borderRadius: 12, boxShadow: '0 10px 30px rgba(0,0,0,0.05)', border: '1px solid #e5e7eb' }}>
            
            {/* Header section */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid #f3f4f6', paddingBottom: 16, marginBottom: 16 }}>
              <div>
                <div style={{ fontSize: 12, color: '#3b82f6', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4 }}>
                  Step {idx + 1}
                </div>
                <div style={{ fontSize: 18, fontWeight: 800, color: '#111827', marginBottom: 4 }}>
                  {s.title}
                </div>
                <div style={{ color: '#6b7280', fontSize: 13, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ fontWeight: 600, color: '#374151' }}>Tool:</span> {getPhaseTool(s.tool)}
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={() => setCompletedSteps(prev => ({ ...prev, [s.id]: !prev[s.id] }))} style={{ padding: '8px 12px', borderRadius: 8, background: completedSteps[s.id] ? '#10b981' : '#f3f4f6', color: completedSteps[s.id] ? '#fff' : '#374151', border: '1px solid', borderColor: completedSteps[s.id] ? '#059669' : '#e5e7eb', fontSize: 13, fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }}>
                  {completedSteps[s.id] ? '✓ Completed' : 'Mark Completed'}
                </button>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 24 }}>
              {/* Why this tool */}
              <div style={{ background: '#f8fafc', padding: 16, borderRadius: 8, border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#475569', textTransform: 'uppercase', marginBottom: 6 }}>Why this tool is best</div>
                <div style={{ fontSize: 14, color: '#334155', lineHeight: 1.5 }}>{shortText(s.why)}</div>
              </div>
              
              {/* Expected Output */}
              <div style={{ background: '#f0fdf4', padding: 16, borderRadius: 8, border: '1px solid #bbf7d0' }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#166534', textTransform: 'uppercase', marginBottom: 6 }}>Expected Output</div>
                <div style={{ fontSize: 14, color: '#15803d', lineHeight: 1.5 }}>{contextualExpected(s)}</div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 24 }}>
              <div style={{ background: '#fff7ed', padding: 16, borderRadius: 8, border: '1px solid #fed7aa' }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#9a3412', textTransform: 'uppercase', marginBottom: 8 }}>Before you start</div>
                <ul style={{ margin: 0, paddingLeft: 18, color: '#7c2d12', fontSize: 13, display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {contextualBeforeStart(s).map((item, i) => <li key={i}>{item}</li>)}
                </ul>
              </div>
              <div style={{ background: '#ecfeff', padding: 16, borderRadius: 8, border: '1px solid #a5f3fc' }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#155e75', textTransform: 'uppercase', marginBottom: 8 }}>Verification checklist</div>
                <ul style={{ margin: 0, paddingLeft: 18, color: '#164e63', fontSize: 13, display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {contextualVerify(s).map((item, i) => <li key={i}>{item}</li>)}
                </ul>
              </div>
            </div>

            {/* AI Integration Guide Section */}
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontSize: 14, fontWeight: 800, color: '#111827', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: '#3b82f6', color: '#fff', width: 24, height: 24, borderRadius: '50%', fontSize: 12 }}>✨</span>
                AI Tool Integration Guide
              </div>
              <div style={{ color: '#4b5563', fontSize: 14, lineHeight: 1.6, background: '#eff6ff', padding: 16, borderRadius: 8, borderLeft: '4px solid #3b82f6' }}>
                {contextualGuide(s)}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 24 }}>
              <div style={{ background: '#eef2ff', padding: 16, borderRadius: 8, border: '1px solid #c7d2fe' }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#3730a3', textTransform: 'uppercase', marginBottom: 8 }}>How to use {getPhaseTool(s.tool)}</div>
                <ol style={{ margin: 0, paddingLeft: 18, color: '#312e81', fontSize: 13, display: 'flex', flexDirection: 'column', gap: 7 }}>
                  {contextualToolGuide(s).map((item, i) => <li key={i}>{item}</li>)}
                </ol>
              </div>
              <div style={{ background: '#f0fdf4', padding: 16, borderRadius: 8, border: '1px solid #bbf7d0' }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#166534', textTransform: 'uppercase', marginBottom: 8 }}>Add the output to your IDE</div>
                <ol style={{ margin: 0, paddingLeft: 18, color: '#14532d', fontSize: 13, display: 'flex', flexDirection: 'column', gap: 7 }}>
                  {contextualIdeGuide(s).map((item, i) => <li key={i}>{item}</li>)}
                </ol>
              </div>
            </div>

            {/* Prompt Block */}
            <div style={{ marginBottom: 24 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#475569', textTransform: 'uppercase' }}>Ready-made Prompt</div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button onClick={() => openTool(getPhaseTool(s.tool))} style={{ padding: '6px 12px', background: '#0f172a', color: '#fff', border: 'none', borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
                    Open {getPhaseTool(s.tool)} ↗
                  </button>
                  <button onClick={() => copyPrompt(withProjectContext(s.prompt))} style={{ padding: '6px 12px', background: '#fff', color: '#374151', border: '1px solid #d1d5db', borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
                    Copy Prompt
                  </button>
                </div>
              </div>
              <div style={{ background: '#0f172a', color: '#e2e8f0', padding: 20, borderRadius: 8, fontSize: 14, fontFamily: 'monospace', lineHeight: 1.6, overflowX: 'auto', border: '1px solid #334155' }}>
                {withProjectContext(s.prompt)}
              </div>

              {featureFocus.length > 0 && (
                <div style={{ marginTop: 18 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 800, color: '#0f766e', textTransform: 'uppercase' }}>Feature-specific prompts</div>
                      <div style={{ fontSize: 12, color: '#64748b', marginTop: 3 }}>
                        Use these after the master prompt so every feature gets concrete UI, API, database, auth, AI, test, or documentation work.
                      </div>
                    </div>
                    <button
                      onClick={() => copyPrompt(featureFocus.slice(0, 5).map((feature, featureIdx) => featurePrompt(s, feature, featureIdx)).join('\n\n---\n\n'))}
                      style={{ padding: '6px 12px', background: '#ecfeff', color: '#155e75', border: '1px solid #a5f3fc', borderRadius: 6, fontSize: 12, fontWeight: 700, cursor: 'pointer' }}
                    >
                      Copy All Feature Prompts
                    </button>
                  </div>

                  <div style={{ display: 'grid', gap: 12 }}>
                    {featureFocus.slice(0, 5).map((feature, featureIdx) => {
                      const prompt = featurePrompt(s, feature, featureIdx)
                      const tool = architectureToolForPhase(s.tool)
                      return (
                        <div key={`${s.id}-${feature.id || feature.name}`} style={{ border: '1px solid #cbd5e1', borderRadius: 10, overflow: 'hidden', background: '#f8fafc' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', borderBottom: '1px solid #e2e8f0', gap: 12 }}>
                            <div>
                              <div style={{ fontSize: 13, fontWeight: 800, color: '#0f172a' }}>
                                {featureIdx + 1}. {feature.name}
                              </div>
                              <div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>
                                Tool: {tool.name} {tool.layer ? `- ${tool.layer}` : ''}
                              </div>
                            </div>
                            <button
                              onClick={() => copyPrompt(prompt)}
                              style={{ padding: '6px 10px', background: '#fff', color: '#334155', border: '1px solid #cbd5e1', borderRadius: 6, fontSize: 12, fontWeight: 700, cursor: 'pointer', flexShrink: 0 }}
                            >
                              Copy
                            </button>
                          </div>
                          <div style={{ background: '#111827', color: '#d1d5db', padding: 14, fontSize: 12, fontFamily: 'monospace', lineHeight: 1.55, whiteSpace: 'pre-wrap', maxHeight: 260, overflowY: 'auto' }}>
                            {prompt}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
              {/* Tips & Warnings */}
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#b45309', textTransform: 'uppercase', marginBottom: 8 }}>Tips & Warnings</div>
                <ul style={{ margin: 0, paddingLeft: 20, color: '#78350f', fontSize: 13, display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {s.tips.map((tip, i) => (
                    <li key={i}>{tip}</li>
                  ))}
                </ul>
              </div>

              {/* Documentation */}
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#475569', textTransform: 'uppercase', marginBottom: 8 }}>Tool Documentation</div>
                {s.documentation ? (
                  <a href={s.documentation} target="_blank" rel="noreferrer" style={{ color: '#3b82f6', fontSize: 14, fontWeight: 600, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>
                    Read Official Docs
                  </a>
                ) : (
                  <div style={{ color: '#6b7280', fontSize: 13, background: '#f3f4f6', padding: '8px 12px', borderRadius: 6, display: 'inline-block' }}>
                    No specific documentation link provided.
                  </div>
                )}
              </div>
            </div>

            <div style={{ marginTop: 24, padding: 16, background: '#f8fafc', borderRadius: 8, border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#334155', textTransform: 'uppercase', marginBottom: 6 }}>Handoff note</div>
              <div style={{ fontSize: 13, color: '#475569', lineHeight: 1.5 }}>{contextualHandoff(s)}</div>
            </div>

            {/* Error Fixer Link */}
            <div style={{ marginTop: 24, padding: 16, background: '#fff1f2', borderRadius: 8, border: '1px solid #ffe4e6', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#be123c', marginBottom: 4 }}>Got an error during this step?</div>
                <div style={{ fontSize: 13, color: '#9f1239' }}>Use our AI Error Fix Assistant to instantly debug and generate a fix prompt.</div>
              </div>
              <button onClick={() => setShowErrorModal(true)} style={{ padding: '8px 16px', background: '#e11d48', color: '#fff', fontSize: 12, fontWeight: 600, border: 'none', borderRadius: 6, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6, transition: 'all 0.2s', boxShadow: '0 2px 10px rgba(225,29,72,.2)' }}>
                <span>🔧</span> Ask Error Bot ↗
              </button>
            </div>

          </div>
        ))}
      </div>

      {phaseId < PHASES.length && (
        <div style={{ marginTop: 32, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link
            href={`/planner/architecture/guide?project=${projectId}`}
            style={{
              padding: '10px 18px', background: '#f3f4f6', color: '#374151',
              borderRadius: '8px', fontSize: '13px', fontWeight: 600, textDecoration: 'none',
              border: '1px solid #e5e7eb'
            }}
          >
            ← Back to All Phases
          </Link>
          <Link 
            href={`/planner/architecture/guide/step/${phaseId + 1}?project=${projectId}`} 
            aria-disabled={completedCount < phase.steps.length}
            style={{ 
              padding: '12px 24px', background: completedCount < phase.steps.length ? '#94a3b8' : '#0f766e', 
              border: 'none', borderRadius: '10px', color: '#fff', fontFamily: 'Syne, sans-serif', 
              fontSize: '14px', fontWeight: 800, textDecoration: 'none', display: 'inline-flex', 
              alignItems: 'center', gap: '8px', boxShadow: '0 4px 14px rgba(15,118,110,.2)' 
            }}
          >
            Next Phase →
          </Link>
        </div>
      )}

      {phaseId === PHASES.length && (
        <div style={{ marginTop: 32, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link
            href={`/planner/architecture/guide?project=${projectId}`}
            style={{
              padding: '10px 18px', background: '#f3f4f6', color: '#374151',
              borderRadius: '8px', fontSize: '13px', fontWeight: 600, textDecoration: 'none',
              border: '1px solid #e5e7eb'
            }}
          >
            ← Back to All Phases
          </Link>
          <Link 
            href={`/planner/deploy?project=${projectId}`} 
            style={{ 
              padding: '12px 24px', background: 'linear-gradient(135deg, #365f62, #83b9bd)', 
              border: 'none', borderRadius: '10px', color: '#fff', fontFamily: 'Syne, sans-serif', 
              fontSize: '14px', fontWeight: 800, textDecoration: 'none', display: 'inline-flex', 
              alignItems: 'center', gap: '8px', boxShadow: '0 4px 20px rgba(66,127,131,.28)' 
            }}
          >
            Continue to Deployment Guide →
          </Link>
        </div>
      )}

      {/* Error Fixer Modal */}
      {showErrorModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', animation: 'fadeIn 0.2s ease-out' }}>
          <div style={{ background: '#fff', width: '100%', maxWidth: '700px', maxHeight: '90vh', overflowY: 'auto', borderRadius: '16px', boxShadow: '0 20px 40px rgba(0,0,0,0.2)', padding: '32px', position: 'relative' }}>
            <button onClick={() => setShowErrorModal(false)} style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: '#6b7280' }}>×</button>
            
            <h2 style={{ fontFamily: 'Syne, sans-serif', fontSize: '24px', fontWeight: 800, marginBottom: '6px', color: '#172326' }}>🔧 Error Fix Assistant</h2>
            <p style={{ color: '#6b7280', fontSize: '13px', marginBottom: '24px' }}>Paste your error message to get a plain-English explanation and fix prompt.</p>

            <form onSubmit={handleFix}>
               <textarea placeholder="Paste your full error message here..." value={errorText} onChange={e => setErrorText(e.target.value)} style={{ width: '100%', minHeight: '120px', padding: '12px', border: '1px solid #d1d5db', borderRadius: '8px', marginBottom: '16px', fontFamily: 'monospace', fontSize: '13px', resize: 'vertical' }} />
               <div style={{ marginBottom: '24px' }}>
                 <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>Context (optional)</label>
                 <input value={context} onChange={e => setContext(e.target.value)} placeholder="What were you trying to do?" style={{ width: '100%', padding: '10px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '13px' }} />
               </div>
               <button type="submit" disabled={loading || !errorText.trim()} style={{ width: '100%', padding: '12px', background: '#e11d48', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: 700, cursor: loading || !errorText.trim() ? 'not-allowed' : 'pointer', opacity: (!errorText.trim() || loading) ? 0.7 : 1 }}>
                 {loading ? 'Analyzing Error...' : 'Analyze & Fix Error'}
               </button>
            </form>

            {result && (
              <div style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '16px', animation: 'fadeIn 0.3s ease-out' }}>
                <div style={{ background: '#f3f4f6', padding: '16px', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
                  <div style={{ fontWeight: 700, color: '#1f2937', marginBottom: '8px', fontSize: '14px' }}>💡 What went wrong</div>
                  <div style={{ fontSize: '13px', color: '#4b5563', lineHeight: '1.6' }}>{result.explanation}</div>
                </div>
                <div style={{ background: '#f0fdf4', padding: '16px', borderRadius: '8px', border: '1px solid #bbf7d0' }}>
                  <div style={{ fontWeight: 700, color: '#166534', marginBottom: '8px', fontSize: '14px' }}>✨ Fixed Prompt (Paste to IDE)</div>
                  <div style={{ background: '#0f172a', color: '#e2e8f0', padding: '14px', borderRadius: '8px', fontFamily: 'monospace', fontSize: '13px', whiteSpace: 'pre-wrap', position: 'relative', border: '1px solid #334155' }}>
                    <button onClick={() => copyText(result.fixedPrompt, 'prompt')} style={{ position: 'absolute', top: '8px', right: '8px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', padding: '4px 10px', borderRadius: '6px', fontSize: '11px', cursor: 'pointer', fontWeight: 600 }}>{copied === 'prompt' ? '✓ Copied!' : 'Copy'}</button>
                    {result.fixedPrompt}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  )
}
