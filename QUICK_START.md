# Quick Start - Social Media Pill Editor

## 🎯 What You Have

A **social media video generator** style component with:
- Live editor sidebar (left)
- Real-time canvas preview (right)
- Auto-resizing pill that stays perfectly centered
- Smooth spring animations

## 🚀 View It Now

**Development server running at: http://localhost:5174/**

## 🎮 How to Use

### 1. Edit Text
Type in the "Text Content" field on the left → Watch the pill resize smoothly on the canvas

### 2. Change Icon
Select from dropdown → Icon updates instantly with rotation animation

### 3. Customize Colors
Use color pickers or hex inputs to change:
- Pill background
- Icon circle color
- Text color

### 4. Quick Presets
Click preset buttons for instant color themes:
- **Wise Green**: Brand colors (#163300 / #9fe870)
- **Classic**: Black and white
- **Blue**: Social media blue
- **Pink**: Instagram-style pink

## ✨ Key Features Working

✅ **Auto-Width**: Pill expands/contracts as you type
✅ **Perfect Centering**: Grows outward from center (see red crosshair)
✅ **Smooth Animation**: Spring physics, no snapping
✅ **Icon Anchor**: Fixed-size icon circle (32px × 32px)
✅ **Real-time Preview**: Instant feedback as you edit

## 🎨 Try These

1. Type: "Hello World" → "Hi" → "This is a longer message"
   - Watch smooth width animation
   - Notice it stays centered

2. Switch icons rapidly
   - See smooth rotation transitions

3. Change colors on the fly
   - Live updates, no lag

## 📁 Core Files

- [SocialPill.tsx](src/components/SocialPill/SocialPill.tsx) - The animated pill
- [VideoEditor.tsx](src/components/SocialPill/VideoEditor.tsx) - Editor + Canvas UI
- [README_SOCIAL_PILL.md](README_SOCIAL_PILL.md) - Full documentation

## 🔧 Switch Back to Main App

Edit `src/main.tsx` line 7:
```tsx
const CurrentApp = App; // instead of VideoEditor
```

---

**Ready to create social media content! 🎬**
