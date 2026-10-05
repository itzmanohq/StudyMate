# StudyMate — Personal Study Productivity, Calendar & Streak PWA

StudyMate is a mobile-first, production-quality personal study productivity, reminder, alarm, event, calendar, and streak application built with **React 19, TypeScript, Vite, Tailwind CSS, Firebase Authentication (Google Sign-In), and Cloud Firestore**.

Designed with usability principles inspired by modern Android applications, Google Calendar, and Todoist, StudyMate helps students and professionals maintain study consistency, prevent procrastination, and organize exams, lectures, and assignments with zero clutter.

---

## 🌟 Key Features

### 1. 🔐 Google Authentication & Strict UID Data Isolation
- Seamless **Continue with Google** OAuth popup authentication.
- All user records are partitioned strictly under `/users/{uid}/...` in Cloud Firestore.
- Complete isolation: User 1 (Owner) and User 2 (Brother) each use their own Google account and personal device with zero cross-visibility.
- Database-level enforcement with `firestore.rules`.

### 2. ⏰ Intelligent Reminders & Multi-Interval Snooze
- Full CRUD for one-time and recurring study reminders (Daily, Weekdays, Weekends, Weekly, Monthly).
- **Non-Destructive Snoozing**: Snoozing an occurrence (5m, 10m, 15m, 30m, 1h, or custom) reschedules today's alarm without corrupting recurring rules.
- Priority levels: `Urgent` 🔴, `High` 🟠, `Medium` 🔵, `Low` ⚪.
- Synthesized Web Audio chimes and browser notification alerts.

### 3. 🛡️ Cryptographic Pattern Protection (Permanent Dismissal)
- 3x3 pattern lock security screen derived using client-side **Web Crypto API SHA-256** with application salt.
- Permanent dismissal of protected tasks requires pattern verification to eliminate impulsive cancellations.

### 4. 📚 Deep Focus Study Sessions & Live Stopwatch
- Real-time interactive focus timer with circular SVG progress ring, pause/resume, and session summary notes.
- Logging completed study sessions triggers celebratory confetti bursts and automatic streak updates.

### 5. 🔥 Advanced Streak Engine & Grace Days
- Real calculation engine that detects consecutive days, skips duplicate same-day logs, and prevents false increments.
- **Configurable Grace Days**: Automatically protects active streaks when taking an emergency rest day.
- 4-week activity heatmap visualization and unlockable productivity achievement badges.

### 6. 📅 Responsive Month Calendar & Day Agenda
- Month grid with color-coded dot indicators for study sessions (Emerald), reminders (Amber), and exams (Blue).
- Instant Day Agenda view for selected calendar dates with quick task scheduling.

### 7. ⏱️ Missed Reminders Catch-Up Engine
- If the browser was closed or the device was offline when an alarm was due, returning to the app presents an honest **Missed Tasks Alert**:
  `"You missed: Study Electronics at 7:00 PM [Complete] [Skip]"`

### 8. 📱 Progressive Web App (PWA) & Offline-First Persistence
- Web App Manifest (`manifest.json`) for Android home screen installation and standalone launch.
- Service Worker (`sw.js`) with offline caching and background notification click actions (`Complete`, `Snooze`).
- Cloud Firestore IndexedDB multi-tab persistence enabling offline read/write.

---

## 🛠️ Technology Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend Core** | React 19, TypeScript (Strict Mode), Vite |
| **Styling** | Tailwind CSS, Custom HSL Design Tokens, Class Dark Mode |
| **Icons** | Lucide React |
| **Date & Time** | date-fns v4 |
| **Audio Synthesizer** | Web Audio API (Zero external audio file dependency) |
| **Security** | Web Crypto API (SHA-256 derivation) |
| **Authentication** | Firebase Authentication (Google Sign-In) |
| **Database** | Cloud Firestore with subcollection isolation |
| **PWA & Offline** | Service Worker, Cache Storage, IndexedDB |
| **Deployment** | Vercel (SPA rewrite configuration) |

---

## 🚀 Getting Started Locally

### 1. Clone & Install Dependencies
```bash
git clone <repository-url>
cd remainder
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Populate `.env` with your Firebase project credentials:
```env
VITE_FIREBASE_API_KEY=AIzaSy...
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=1234567890
VITE_FIREBASE_APP_ID=1:1234567890:web:abcdef
VITE_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX
```

> **Note**: If you run StudyMate without Firebase credentials, the application automatically runs in **Local Multi-User Demo Mode** (with Alex Morgan and Sam Morgan profiles) so you can evaluate the entire feature set immediately!

### 3. Run Development Server
```bash
npm run dev
```
Open `http://localhost:5173` in your browser.

---

## 🗄️ Firestore Database Schema

All collections are scoped directly under each user's authenticated UID:

```
users/{uid}                              -> User Profile document
users/{uid}/reminders/{reminderId}       -> Study and general reminders
users/{uid}/events/{eventId}             -> Exams, lectures, and group studies
users/{uid}/studySessions/{sessionId}    -> Planned & logged focus sessions
users/{uid}/completionRecords/{recordId} -> Chronological completion history
users/{uid}/achievements/{achievementId} -> Unlocked & in-progress milestones
users/{uid}/streak/current               -> Streak counts, grace days, active dates
users/{uid}/settings/preferences         -> Theme, daily goal, pattern hash
users/{uid}/settings/notifications       -> Sound profile, snooze defaults
```

---

## 🛡️ Firestore Security Rules (`firestore.rules`)

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if false;
    }

    match /users/{userId}/{document=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

Deploy the rules to Firebase:
```bash
firebase deploy --only firestore:rules
```

---

## 🔔 Browser Notification Limitations & Behavior

Web platform notification limitations are handled honestly:
1. **Permission Flow**: StudyMate does NOT spam users with permission prompts on load. An informative onboarding banner explains notification benefits before requesting permission.
2. **Action Buttons**: Complete and Snooze buttons on system notifications are supported on Chromium/Android browsers. On browsers where notification action buttons are unsupported, tapping the notification opens StudyMate directly to the relevant task.
3. **PWA on iOS**: iOS Safari requires users to add the PWA to their Home Screen before Web Push notifications can be received.
4. **Offline Catch-Up**: Reminders scheduled while the browser was offline appear in the **Catch-Up Banner** upon reopening the application.

---

## 🚢 Deploying to Vercel

1. Push your repository to GitHub / GitLab / Bitbucket.
2. In Vercel, click **Add New Project** and select the repository.
3. In **Build and Output Settings**:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. In **Environment Variables**, add the `VITE_FIREBASE_*` variables from your `.env` file.
5. In Firebase Console (`Authentication > Settings > Authorized Domains`), add your Vercel deployment domain (e.g. `your-app.vercel.app`).
6. Click **Deploy**.

---

## 🧪 Build & Verification Commands

```bash
# Run TypeScript compilation check
npm run build

# Run local preview of production build
npm run preview
```

---

## 📄 License
MIT License. Built with ❤️ for productive scholars.
