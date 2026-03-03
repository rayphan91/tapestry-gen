# Concurrent Development - Tapestry + Pill Editor

Both applications now run simultaneously on different ports, so you can work on Tapestry and the Pill Editor at the same time.

## 🚀 Running Both Apps

### Tapestry V3 (Main App)
```bash
npm run dev
```
**URL:** http://localhost:5174/

### Social Pill Editor
```bash
npm run dev:pill
```
**URL:** http://localhost:5175/pill.html

## 📋 Current Status

✅ **Tapestry V3** is running on **http://localhost:5174/**
✅ **Pill Editor** is running on **http://localhost:5175/pill.html**

Both are currently live and accessible!

## ⚠️ Important URLs

| App | Correct URL |
|-----|-------------|
| Tapestry V3 | http://localhost:5174/ |
| Pill Editor | http://localhost:5175/pill.html ← **Note the /pill.html path!** |

## 🏗️ How It Works

### Separate Entry Points

**Tapestry V3:**
- Entry: `index.html` → `src/main.tsx` → `App.tsx`
- Shows MainLayout with canvas and sidebars
- URL: http://localhost:5174/

**Pill Editor:**
- Entry: `pill.html` → `src/pill.tsx` → `VideoEditor.tsx`
- Shows editor panel + canvas preview
- URL: http://localhost:5175/pill.html

### Configuration

**package.json scripts:**
```json
{
  "dev": "vite",              // Tapestry on default port
  "dev:pill": "vite --port 5175 --mode pill"  // Pill on 5175
}
```

**Why /pill.html path?**
- In Vite dev mode, custom HTML files are served at their file path
- index.html is served at root (/)
- pill.html is served at /pill.html
- This is normal Vite behavior for multi-page apps

## 🎨 Shared Resources

Both apps share:
- ✅ Wise Design System tokens (`src/styles/tokens.css`)
- ✅ Global styles and fonts
- ✅ React and dependencies
- ✅ Framer Motion & Lucide icons

## 📂 File Structure

```
Tapestry V3/
├── index.html              # Tapestry entry → localhost:5174/
├── pill.html               # Pill editor entry → localhost:5175/pill.html
├── src/
│   ├── main.tsx           # Tapestry bootstrap
│   ├── pill.tsx           # Pill editor bootstrap
│   ├── App.tsx            # Tapestry main app
│   ├── components/
│   │   ├── SocialPill/    # Pill editor components
│   │   ├── Layout/        # Tapestry layout
│   │   ├── Canvas/        # Tapestry canvas
│   │   └── Sidebar/       # Tapestry sidebars
│   └── styles/
│       ├── tokens.css     # Shared design system
│       └── global.css     # Shared global styles
```

## 🔄 Development Workflow

### Two Browser Tabs (Recommended)
1. Open http://localhost:5174/ for Tapestry
2. Open http://localhost:5175/pill.html for Pill Editor
3. Keep both tabs open, switch between them

### Starting Both Servers

**Option 1: Two Terminal Windows**
```bash
# Terminal 1
npm run dev

# Terminal 2
npm run dev:pill
```

**Option 2: Background Processes**
```bash
# Start both in background
npm run dev &
npm run dev:pill &

# Stop all
killall node
```

**Option 3: Process Manager (Recommended)**
Install `concurrently`:
```bash
npm install -D concurrently
```

Add to package.json:
```json
"dev:all": "concurrently \"npm run dev\" \"npm run dev:pill\""
```

Then run:
```bash
npm run dev:all
```

## 🎯 Use Cases

### Working on Tapestry
- Use http://localhost:5174/
- Edit canvas, layers, tools
- Main application development

### Working on Pill Editor
- Use http://localhost:5175/pill.html
- Edit motion graphics
- Test animations and styling
- Prepare for social media export

### Testing Integration
- Open both URLs in different tabs
- Copy pill component settings
- Test how pills would appear in Tapestry canvas

## 🔧 Quick Commands

```bash
# Start Tapestry only
npm run dev

# Start Pill Editor only
npm run dev:pill

# Stop background process
# Find process ID
lsof -i :5174  # or :5175
# Kill it
kill <PID>
```

## 📝 Notes

- Both apps hot-reload independently
- Changes to shared files (tokens.css, global.css) affect both
- Component changes only affect the app using them
- No conflicts - completely separate processes
- **Remember:** Pill editor is at /pill.html path!

## 🎨 Design System Sync

Both apps use the same Wise Design System:
- Same color tokens (no Tailwind!)
- Same typography
- Same spacing scale
- Same border radius values
- Same transition timings

Changes to `src/styles/tokens.css` automatically update both apps!

## 🚀 Benefits

✅ **No Switching**: Keep both apps open, switch browser tabs
✅ **Fast Iteration**: Test changes instantly in relevant app
✅ **Clean Separation**: Each app has its own entry point
✅ **Shared Assets**: One design system, two applications
✅ **Independent**: Changes don't break the other app

## ✅ Fixed Issues

- ❌ **Removed Tailwind CSS** - Was causing PostCSS errors
- ✅ **Pure Wise Design System** - All components use design tokens
- ✅ **No build errors** - Both servers start cleanly

---

**Happy concurrent development! 🎉**

**Quick Links:**
- [Tapestry V3](http://localhost:5174/)
- [Pill Editor](http://localhost:5175/pill.html)
