# Instagram Liked Videos Player

A browser extension that allows you to play all your liked Instagram videos one after another, like a playlist.

## Features

- Automatically finds and plays all liked videos on Instagram
- Plays videos in sequence, automatically moving to the next video when one ends
- Automatically scrolls to load more videos when reaching the end of current videos
- Simple UI with start and stop buttons
- Works on the Instagram liked posts page

## Installation

### Chrome/Edge/Brave and other Chromium-based browsers:

1. Download or clone this repository
2. Create icon files (see the "Icon Setup" section below)
3. Open your browser and navigate to the extensions page:
   - Chrome: `chrome://extensions/`
   - Edge: `edge://extensions/`
   - Brave: `brave://extensions/`
4. Enable "Developer mode" (usually a toggle in the top-right corner)
5. Click "Load unpacked" and select the folder containing this extension
6. The extension should now appear in your browser toolbar

## Icon Setup

Before loading the extension, you need to create icon files:

1. Open the `generate_icons.html` file in your browser
2. Click the "Generate Icons" button to create simple Instagram-themed icons
3. Right-click on each canvas and save the images as:
   - `icon16.png` in the icons folder
   - `icon48.png` in the icons folder
   - `icon128.png` in the icons folder

Alternative: You can create your own icons or modify the `manifest.json` file to remove the icon requirement. See `icons/ICON_INSTRUCTIONS.md` for details.

## How to Use

1. Log in to your Instagram account
2. Click on the extension icon in your browser toolbar
3. Click the "Start Playback" button
4. The extension will navigate to your liked posts (if not already there) and start playing videos one after another
5. To stop playback, click the "Stop Playback" button

## Notes

- This extension only works on Instagram website, not the mobile app
- You must be logged in to your Instagram account
- Instagram's UI may change over time, which could potentially break this extension
- Videos will play with sound by default

## Privacy

This extension does not collect any data or send any information to external servers. All functionality is contained within your browser and Instagram's website.

## Troubleshooting

If the extension isn't working as expected:

1. Make sure you're logged into your Instagram account
2. Try refreshing the Instagram page
3. Check if you have any other extensions that might interfere with Instagram
4. Ensure your browser is up to date
5. Try disabling and re-enabling the extension
6. If you get an error about loading icons, follow the instructions in the "Icon Setup" section 