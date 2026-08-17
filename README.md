# ⏸️ Pause Point for Chrome v3

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

## 🚀 Installation & Setup Guide

### Option 1: Quick Install (For End Users)

1. **Download the Extension:**
   - Download the latest **`PausePoint_v3.zip`** from the [GitHub Releases](https://github.com/saisuhaskaviti/ThinkNeuroBrowserExtension/releases) page (or from the project repository).
   - Extract/unzip the `.zip` archive to a folder on your computer.

2. **Load into Your Browser:**
   - Open Google Chrome (or any Chromium browser like Brave, Edge, Arc, or Opera).
   - In the address bar, go to:
     - **Chrome:** `chrome://extensions`
     - **Brave:** `brave://extensions`
     - **Edge:** `edge://extensions`
   - In the top-right corner, toggle **Developer mode** to **ON**.
   - Click the **Load unpacked** button in the top-left corner.
   - Select the unzipped `ThinkNeuroBrowserExtension` folder.

3. **Start Mindful Browsing!**
   - Click the extension puzzle icon in your browser toolbar and pin **Pause Point v3**.
   - Click the Pause Point icon on any site to add or remove it from your pause list.

---

### Option 2: Developer Setup (For Modifying or Contributing)

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/saisuhaskaviti/ThinkNeuroBrowserExtension.git
   cd ThinkNeuroBrowserExtension
   ```

2. **Install Development Dependencies (Optional for Tailwind CSS compilation):**
   ```bash
   npm install
   ```

3. **Building / Customizing Tailwind CSS:**
   - If you edit `input.css` or add custom Tailwind utility classes to HTML files, re-compile `styles.css` by running:
     ```bash
     npx tailwindcss -i ./input.css -o ./styles.css
     ```

4. **Generating Icons:**
   - To regenerate icon assets (`icon16.png`, `icon48.png`, `icon128.png`) from `icon.svg`:
     ```bash
     node generate-icon.js
     ```

5. **Reloading Changes:**
   - Go to `chrome://extensions` and click the **Reload (↺)** icon on the Pause Point v3 card.

---

## ❓ Frequently Asked Questions & Troubleshooting

<details>
<summary><b>Why didn't a website trigger the pause screen?</b></summary>
Make sure the domain (e.g., <code>reddit.com</code>) is added to your <b>Paused Sites</b> list. Click the extension toolbar icon to quickly add the current site, or open Settings to manage your full list.
</details>

<details>
<summary><b>Why did my timer reset when I closed the tab?</b></summary>
Pause Point v3 enforces <b>strict tab-bound sessions</b>. Timers are tied exclusively to the specific tab where they were started. Closing a tab invalidates the active session so you aren't tempted to open endless duplicate tabs.
</details>

<details>
<summary><b>How do I change the color theme or enable dark mode?</b></summary>
Click the settings gear in the toolbar popup or open <code>chrome://extensions</code> $\rightarrow$ <b>Extension options</b>. You can toggle Light/Dark mode and choose from 8 Material You color palettes.
</details>

---

## 📄 License

Distributed under the MIT License. Built with mindful design principles.
