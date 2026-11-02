# Ryze

Ryze (formerly Form & Fuel) is a buildless responsive fitness site. Serve `dist` over HTTP; no installation or secret keys are required.

The production interface uses a graphite and botanical green design, an original SVG training illustration, Inter body text, Plus Jakarta Sans headings, and an Explore → Plan → Fuel → Reflect navigation sequence. Large colored horizontal nutrition cards replace the circular gauges. Existing local data remains under the same `form-fuel-v1` storage key.

## Features

- Keyboard-accessible proportional front/back/both SVG map: 13 muscle groups and 40 anatomical subdivisions, including the neck.
- Exercise instructions, suggested sets, and muscle growth explanations.
- Routine builder using goals, experience, equipment, days, session time, emphasis and movement exclusions. Includes sets, reps, rest, time budgets, weekly scheduling, progression, local save and JSON export.
- Adult Mifflin–St Jeor calculator, goal adjustments, and local saved targets.
- Daily calorie, protein, and carbohydrate progress cards; date-based meal history.
- Camera/gallery photos and on-device CLIP food matching in a Web Worker.
- Food and gram-based estimates with fully editable meal macros.
- Configurable in-app reminders and optional browser notifications while open.
- Local browser persistence and JSON export.

## Limits

The photo model downloads from Hugging Face through Transformers.js on first use. Network access, WebAssembly support, sufficient memory and storage are needed. The model suggests foods from a limited list. It does not estimate grams or ingredients. Users confirm portions and review nutrition values. The manual food builder remains available if model download or inference fails. Photo recognition does not upload meal images to a backend.

Data stays in localStorage for the current origin. Routines use a separate `form-fuel-routines-v1` key. There is no account, cloud sync, or closed-browser push service. JSON exports are readable references/backups; automatic import is not included. Food composition values are typical approximate cooked-food values and vary by recipe.

## Local preview

Run `node preview.cjs` and open http://localhost:4173.

## Validation

Run node tests/routines.cjs for routine equipment, duration, exclusion, variation and persistence schema checks.


## Meal and movement experience

Whole-dish search includes zhajiang mian, chicken rice and adjustable bowl templates. Any dish name can be entered with manual nutrition or reused from recent meals. Recipe estimates show cooked ingredient weights and scale by servings; they are approximate, not restaurant or AI nutrition analysis. Existing meal data is preserved.

The hero dumbbell supports pointer drag, touch swipe and arrow keys. Scroll-driven background contours and momentum respect reduced-motion preferences. Every explorer and routine exercise has a position reference; photos are bundled locally from the public-domain Free Exercise DB (attribution in dist/exercise-images), with original diagrams for bird dog and chin nod. Playback alternates two still positions. Photographed equipment variations are labeled; routine-specific instructions remain visible.


## Calendar

Saving a routine adds its recurring weekday sessions from today. The calendar preserves dated routine/target versions and snapshots completed sessions under form-fuel-calendar-v1. Select a day for meal totals, target status, workout exercises, and recorded session burn. Calories/carbs count as hit within ±5%; protein counts as hit at or above target. Older dates without a stored target version explicitly use current targets for comparison.

Workout completion requires a past or present date. Burn is a gross session estimate using MET × 3.5 × kg / 200 × actual minutes, or a user-entered tracker value. Missing weight leaves burn unestimated; planned workouts never count as completed. Burn is not subtracted from nutrition targets. Calendar export is separate from nutrition journal export. Run node tests/calendar.cjs for date, scheduling, nutrition, and burn checks.


## Redline interface and recovery tracking

Black and red styling, compact routine studio dialog, and an original real 3D dumbbell with unlimited horizontal/vertical orbit. Three.js 0.180.0 is bundled locally under MIT (dist/vendor/THREE-LICENSE.txt). WebGL is required for the model; drag/swipe or use arrow keys, Home and Reset view. Rendering is demand-driven and inertia stops offscreen, in background tabs and with reduced motion.

The optional activity/recovery panel stores user-selected calorie-burn and sleep targets and dated sleep records under form-fuel-wellness-v1. Burn comes from calendar workout completion records, never from food calories. Sleep is attributed to the wake-up date and can be edited or removed. Goal changes apply from today; prior dates retain historical targets. Existing nutrition and routine keys are preserved. Calendar details display sleep and burn-goal status as well.


## Dashboard popups and My Workout

Calendar and Daily Fuel are moved intact into accessible native dialogs, preserving all existing event handlers, logging controls and storage. Header, journey, routine-footer and My Workout links open the matching dashboard. My Workout reads the saved routine, shows each session with sets/reps/rest and demonstrations, and updates after routine saves. Phone layouts support scrolling inside dialogs.

Account-based cloud storage and direct Google login are not configured in this static release. The account-provider question is pending; no Google login button or account-sync claim is shown. Progress remains browser-local until a real identity/database backend is configured and tested.



## Google accounts and cloud saving

Firebase Google Authentication and Firestore are connected to the form-and-fuel project. The account panel offers Google popup sign-in, sign-out, save status, retry, a local JSON backup, and an explicit import of guest progress into an empty account. All four application stores are isolated by Firebase UID before app initialization. Original guest keys are preserved. Account data is cached on the device; sign out on shared devices. Analytics is not initialized.

Cloud snapshots include meal photos and are split into documents below users/{uid}/progress, committed atomically with a revision guard. Conflicting writes stop rather than replacing a newer cloud revision. Back up and load the cloud copy to resolve conflicts; automatic merging is not implemented. Offline edits remain local and retry when connected. Wait for the account panel to say all progress is saved before closing. Reload on another device to load the latest cloud copy. Local backup JSON is for reference/recovery; no automatic import of backup files is offered.

Firebase console prerequisites: Google provider enabled, production site domain authorized, default Firestore database created, and published rules allowing request.auth.uid == userId under users/{userId}/{document=**}. The Firebase client config is public; no service-account key belongs in this repository. The Site's existing owner-only hosting gate remains in place.

Run node tests/accounts.cjs for account isolation, chunk roundtrip including photos, stale revision rejection, offline retention, concurrent local edits, and pending-data protection. Actual Google login and two-device sync must also be verified by the account owner in production.


## Nutrition and personal meal library update
Nutrition now includes a strength goal (maintenance energy), a modest 5% muscle-gain surplus, a 15% fat-loss deficit, 1.8 g/kg protein (2.0 during fat loss), 25% energy from dietary fat and remaining energy from carbs. These are explained starting choices with source links in the calculator. Existing targets are preserved until recalculated. Fat is optional in meal records; missing historical fat is shown as unknown. Personal dishes are stored inside the existing account-scoped fuel record and sync with other progress. Daily Fuel includes date navigation and meal editing/removal. Six additional explorer exercises and beveled, labeled 3D dumbbell plates are included.

## Selected-date wellness targets and daily burn
Activity/recovery targets now default to the selected Daily Fuel day and expose an explicit effective date. Entries apply inclusively from that date until the next saved target version. Existing earlier and later versions remain intact. Total daily burn can be recorded, edited or removed separately from workout burn, with no automatic food-target adjustment. Sleep and daily-burn edits preserve other fields in the same date record. Run node tests/wellness.cjs for date and independent-record regression checks.


## Ryze branding and interface

The current interface uses quiet black surfaces, red actions, readable system typography, and the supplied Ryze mountain wordmark. The desktop 3D dumbbell remains interactive; mobile prioritizes the training tools and defaults to a single body view. The background gym walkthrough is no longer loaded. Existing `form-fuel-*` storage keys and Firebase resource names are intentionally retained so the rebrand preserves saved progress and cloud compatibility.


## Training architecture design preview

Open `dist/architecture-preview/performance.html` through your web server. This black and lavender interactive prototype follows `design.md` and uses temporary sample data; it does not connect to the production account. The production entry point remains `dist/index.html`.
