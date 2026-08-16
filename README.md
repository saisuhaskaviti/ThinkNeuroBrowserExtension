# ⏸️ Pause Point v3

[![Manifest](https://img.shields.io/badge/Manifest-V3-blue.svg)](https://developer.chrome.com/docs/extensions/mv3/)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-yellow.svg)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Styling](https://img.shields.io/badge/Tailwind-CSS_v3-38B2AC.svg)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

> **A Chrome extension to help you stop mindless scrolling.** 
> Inspired by Android 17's Digital Wellbeing features, built for your desktop browser.

Pause Point v3 is a lightweight Chrome Extension made for high school and college students. Instead of completely blocking websites—which is easy to bypass the second you get frustrated—Pause Point adds a simple pause. It stops you before you open a distracting site and gives you a moment to breathe, stretch, or rethink your choice.

---

## ✨ How It Works & Core Features

### ⚙️ Smart Pauses & Delays
- **Escalating Delays:** If you keep trying to visit blocked sites within a 15-minute window, your wait time gets longer (10s $\rightarrow$ 20s $\rightarrow$ 30s $\rightarrow$ 45s).
- **Anti-Bypass Math Lock:** Want to remove a site from your blocklist? You'll have to solve a quick math problem first (like `34 + 27 = ?`). This stops you from impulsively unblocking sites when you're supposed to be working.
- **Healthy Micro-Tasks:** While you wait for the timer, the screen fades through 15 random physical prompts (like "Take a sip of water" or "Look away from the screen for 20 seconds").

### 🔒 Tab-Specific Timers
- **Strict Tab Rules:** If you choose to unblock a site and start a timer, that session is tied strictly to that specific tab. If you open the same site in a new tab, you'll hit the pause screen again.
- **Instant Reset on Close:** If you close a tab, your unblocked session ends immediately. Re-opening the website right after will trigger the pause screen again.
- **Phantom Tab Killer:** Runs in the background and silently closes distracting tabs if you leave them open and inactive for more than 3 minutes.

### 🎨 Clean UI & Focus Tools
- **Draggable Timer:** Adds a floating, movable countdown timer (`MM:SS`) to your screen while you're on a blocked site. When the time is up, it automatically redirects you.
- **Breathing Animation:** A smooth 8-second breathing animation that tells you when to "Breathe in" and "Breathe out" while you wait.
- **Smart Redirects:** If you click "Don't open," the extension recommends jumping to one of your already-open productivity tabs, or a safe site from your history.
- **Custom Themes:** Choose from 8 different color themes. It automatically matches your computer's Light or Dark mode.

---

## 🛠️ Tech Stack

- **Extension Core:** Manifest V3 API
- **Logic:** Vanilla JavaScript (Service Workers, Content Scripts)
- **Chrome APIs:** `storage.local`, `webNavigation`, `tabs`, `history`, `alarms`
- **Styling:** Tailwind CSS v3

---

## 📁 File Structure

```text
ThinkNeuroBrowserExtension/
├── manifest.json         # Extension settings and permissions
├── background.js         # Service Worker (Runs in background, handles tab cleanup and alarms)
├── timer-overlay.js      # Script that adds the floating timer to your page
├── pause.html            # The HTML for the pause/breathing screen
├── pause.js              # The logic for the pause screen (delays, animations, tasks)
├── options.html          # Settings page HTML
├── options.js            # Settings logic (managing blocklist, math lock, stats)
├── popup.html            # Toolbar popup HTML
├── popup.js              # Toolbar logic (quick toggles, showing active timers)
├── theme.js              # Handles color themes and dark mode
├── input.css             # Tailwind source CSS
├── styles.css            # Compiled production CSS
├── generate-icon.js      # Script to generate the extension icons
├── icon*.png             # Extension icons (16/48/128px)
└── PausePoint_v3.zip     # Ready-to-install zip file