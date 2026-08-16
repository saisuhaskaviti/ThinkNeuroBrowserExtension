# ⏸️ Pause Point v3

> **Combat mindless scrolling with intentional friction — inspired by Google's Android 17 Digital Wellbeing.**

Pause Point is a Chrome Extension (Manifest V3) built for high school and college students. Instead of imposing rigid, frustrating site blocks, Pause Point introduces **intentional friction**, encouraging mindfulness, physical resets, and conscious focus choices.

---

## ✨ Features

### 🧘 Material 3 Breathing Screen
- **Organic Breathing Blob:** Features a smooth 8-second breathing animation cycle (4s expansion / 4s contraction) driven by custom cubic-bezier keyframes.
- **Synchronized Mindfulness:** Alternates text labels (*"Breathe in"* / *"Breathe out"*) in sync with peak animation keyframes to help you pause and reset.

### 📈 Escalating Delay
- **Dynamic Impulse Friction:** Tracks visit frequency to blocked sites in a 15-minute sliding window.
- **Progressive Duration:** 1st visit = **10s**, 2nd visit = **20s**, 3rd visit = **30s**, 4th+ visit = **45s**.
- **Visual Badge:** The status pill dynamically highlights when an escalated pause is active (e.g., `instagram.com • Escalated Pause (20s)`).

### 🔒 Tab-Bound Timed Sessions & Tab Closure Protection
- **Flexible Options:** Choose between preset chips (**5 min**, **15 min**, **30 min**) or type a **Custom Timer**.
- **Strict Tab Binding:** Session bypasses are bound to the specific `tabId`. 
- **Tab Closure Cleanup:** Closing a tab immediately invalidates its bypass token. Re-opening the website—even 5 seconds later—triggers the pause screen again.
- **No Cross-Tab Leaks:** Opening a blocked domain in a new tab will always prompt a fresh pause screen.

### ⏱️ Draggable Floating Timer Overlay
- **Live Countdown:** Injects a sleek floating pill onto active pages showing `MM:SS left`.
- **Fully Draggable:** Click and drag the timer pill anywhere on the screen.
- **Time's Up Redirect:** Turns red upon expiry and automatically redirects the tab to a dedicated **"Time's Up!"** pause screen.

### 🎯 Smart Focus Recommendations & Escape Destinations
- **Open Tabs First:** Recommends your currently open productive tabs (marked with a bright `OPEN TAB` pill).
- **History Fallback:** Fills remaining recommendation slots with your top non-blacklisted sites from `chrome.history`.
- **Multiple Escape Destinations:** Configure custom escape URLs (Canvas, Notion, Google) in Settings. Clicking *"Don't open"* presents an interactive modal to pick your focus destination.

### 🧮 Anti-Bypass Lock (Friction Step)
- **Impulse Prevention:** Attempting to remove a domain from your blacklist triggers a randomized **Math Challenge** (e.g., `34 + 27 = ?`).
- Solves the problem of impulse unblocking.

### 📊 Mindful Progress Dashboard
- **Analytics:** Tracks **Rescued Sessions**, **Impulse Triggers**, **Focus Rate %**, and **Phantom Closed Tabs**.
- **Daily EST Reset:** Automatically clears stats daily at **12:00 AM EST**.
- **Toolbar Badge:** Displays your current **Rescued Sessions** count right inside the extension toolbar popup.

### 👻 Phantom Tab Killer
- **Tab Hoarding Prevention:** Background worker runs an alarm every 30 seconds.
- **Silent Cleanup:** Automatically detects blacklisted tabs left sitting inactive in the background for **> 3 minutes** and silently closes them.
- **Toggle Control:** Can be enabled or disabled anytime in Settings.

### 💧 Physical Micro-Tasks (Anti-Sedentary Friction)
- **15 Physical Prompts:** Includes physical resets such as drinking water, wrist stretches, neck tilts, shoulder rolls, 20-20-20 eye breaks, and grounding exercises.
- **Randomized 7s Rotation:** Prompts are shuffled on page load and cycle every 7 seconds with smooth fade transitions.

### 🎨 Material You Theming & Dark Mode
- **8 Curated Color Themes:** Lime, Periwinkle, Rose, Mint, Amber, Teal, Violet, Sky.
- **Light & Dark Mode:** Dedicated Light and Dark theme palettes with zero FOUC (Flash of Unstyled Content).

---

## 🛠️ Tech Stack

- **Manifest Version:** Chrome Extension Manifest V3
- **Logic:** Vanilla JavaScript (ES6+ `async/await`, Service Workers, Content Scripts)
- **APIs Used:** `chrome.storage.local`, `chrome.webNavigation`, `chrome.tabs`, `chrome.history`, `chrome.alarms`
- **Styling:** Tailwind CSS v3 & Vanilla CSS Variables

---

## 📁 File Structure

```text
ThinkNeuroBrowserExtension/
├── manifest.json         # Extension Manifest V3 configuration
├── background.js        # Background Service Worker (Navigation interceptor, tab cleanup, alarms)
├── timer-overlay.js      # Content script for draggable countdown timer overlay
├── pause.html            # Breather page overlay HTML
├── pause.js              # Pause page logic (Breathing cycle, escalating delay, micro-tasks)
├── options.html          # Settings page HTML (Blacklist, Escape URLs, Stats, Appearance)
├── options.js            # Settings page logic (Anti-Bypass lock, stats rendering, theme switcher)
├── popup.html            # Toolbar popup interface HTML
├── popup.js              # Toolbar popup logic (Quick domain toggle, active timer check)
├── theme.js              # Material You theme engine (8 color palettes, Light/Dark mode)
├── input.css             # Tailwind source CSS & custom animations
├── styles.css            # Compiled production CSS
├── generate-icon.js      # Node script to generate PNG icons using Jimp
├── icon16.png            # 16x16 Extension icon
├── icon48.png            # 48x48 Extension icon
├── icon128.png           # 128x128 Extension icon
└── PausePoint_v3.zip     # Distribution zip package
```

---

## 🚀 Installation Guide

### Option 1: Load Unpacked (Development / Testing)
1. Download or clone this repository to your local machine.
2. Open Google Chrome and navigate to `chrome://extensions`.
3. Enable **Developer mode** in the top-right corner.
4. Click **Load unpacked** in the top-left corner.
5. Select the `ThinkNeuroBrowserExtension` folder.

### Option 2: Install from `.zip`
1. Download [PausePoint_v3.zip](PausePoint_v3.zip).
2. Extract the `.zip` file to a folder on your computer.
3. Open `chrome://extensions` in Chrome.
4. Enable **Developer mode** $\rightarrow$ Click **Load unpacked** $\rightarrow$ Select the extracted folder.

---

## 📄 License

Distributed under the MIT License. Built with mindful design principles.
