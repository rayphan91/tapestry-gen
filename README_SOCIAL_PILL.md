# Social Media Pill Component - Wise Design System

A dynamic motion graphics pill component built with the **Wise Design System from Tapestry V2**. Perfect for social media video generators with real-time editing and smooth animations.

## 🎬 Live Demo

Visit: **http://localhost:5174/**

## ✨ Features Built to Spec

### ✅ Editable Content & Auto-Width
- Type in the sidebar text input
- Pill width **automatically and smoothly** expands/contracts
- Precise fit to text content
- No manual calculations needed

### ✅ Perfect Centering
- Pill remains **perfectly centered** on canvas (horizontal + vertical)
- Grows **outward from center point**
- Red crosshair shows exact center alignment
- Uses flexbox for natural centering

### ✅ The 'Pill' Look
- `border-radius: var(--radius-full)` for perfect semicircles
- Consistent horizontal padding (`var(--space-sm)`)
- Professional social media aesthetic
- Ends remain semicircular at all widths

### ✅ Layout Animation
- Framer Motion's **`layout` prop** for fluid width changes
- **No snapping** - smooth spring physics
- Spring settings: `stiffness: 400, damping: 25`
- Natural, realistic motion

### ✅ Icon Anchor
- Circular icon container (**fixed 32px × 32px**)
- Icon: 18px with 2.5px stroke width
- Text flows around icon naturally
- Uses `layout="position"` to stay fixed during resize

### ✅ State Driven Editor View
**Left Panel (Editor):**
- Text input with live sync
- Icon selector (10 Lucide icons)
- Color pickers (pill, icon circle, text)
- Quick preset buttons

**Right Panel (Canvas):**
- Full-screen preview with grid background
- Center crosshair marker
- Canvas dimension indicator (1920×1080)

## 🎨 Wise Design System Integration

All components use design tokens from Tapestry V2:

### Colors
```css
--color-interactive-primary: #163300  /* Dark green */
--color-primary: #9fe870              /* Bright green */
--color-text-primary: #163300         /* Text dark green */
--color-text-secondary: #454745       /* Gray text */
--color-surface: #ffffff              /* White */
--color-border: #ecefeb               /* Light border */
--color-bg-light: #f2f6ef             /* Light background */
--color-interactive-neutral: #e2f6d5  /* Neutral green */
```

### Typography
```css
--font-display: 'Wise Sans'  /* Headings */
--font-body: 'Inter'          /* Body text */

--font-size-xs: 12px
--font-size-sm: 14px
--font-size-base: 16px
--font-size-lg: 20px
--font-size-xl: 24px
--font-size-2xl: 34px

--font-weight-normal: 400
--font-weight-medium: 500
--font-weight-semibold: 600
--font-weight-bold: 700
```

### Spacing & Layout
```css
--space-xs: 10px
--space-sm: 20px
--space-md: 40px

--radius-sm: 4px
--radius-md: 8px
--radius-lg: 16px
--radius-full: 9999px

--transition-fast: 150ms ease
--transition-base: 250ms ease
```

## 🏗️ Component Architecture

### SocialPill Component

**File:** [src/components/SocialPill/SocialPill.tsx](src/components/SocialPill/SocialPill.tsx)

```tsx
interface SocialPillProps {
  text: string;           // Display text
  icon?: LucideIcon;      // Icon component from lucide-react
  iconColor?: string;     // Icon circle background
  pillColor?: string;     // Pill background
  textColor?: string;     // Text color
}
```

**Key Implementation:**
```tsx
<motion.div
  layout  // Automatic smooth width animation
  className="social-pill"
  style={{ backgroundColor: pillColor }}
>
  {/* Fixed icon - stays in place */}
  <motion.div layout="position" className="social-pill__icon">
    <Icon />
  </motion.div>

  {/* Dynamic text - moves smoothly */}
  <motion.span layout="position" className="social-pill__text">
    {text}
  </motion.span>
</motion.div>
```

### VideoEditor Component

**File:** [src/components/SocialPill/VideoEditor.tsx](src/components/SocialPill/VideoEditor.tsx)

Uses Wise Design System layout patterns:
- Grid layout: `380px | 1fr`
- Design tokens for all colors/spacing
- Matching Tapestry V2 UI patterns
- Custom scrollbar styling

## 🎯 Usage Examples

### Basic Usage

```tsx
import { SocialPill } from '@/components/SocialPill';
import { Sparkles } from 'lucide-react';

function MyComponent() {
  return (
    <SocialPill
      text="Hello World"
      icon={Sparkles}
      pillColor="var(--color-interactive-primary)"
      iconColor="var(--color-primary)"
      textColor="var(--color-primary)"
    />
  );
}
```

### With Design System Presets

```tsx
// Wise Green (Default)
<SocialPill
  text="Design"
  icon={Sparkles}
  pillColor="#163300"
  iconColor="#9fe870"
  textColor="#9fe870"
/>

// Using CSS Variables
<SocialPill
  text="Motion"
  icon={Zap}
  pillColor="var(--color-interactive-primary)"
  iconColor="var(--color-primary)"
  textColor="var(--color-primary)"
/>
```

### Dynamic State

```tsx
const [text, setText] = useState('Your Text');

return (
  <>
    <input
      value={text}
      onChange={(e) => setText(e.target.value)}
      className="control-input"
    />
    <SocialPill text={text} />
  </>
);
```

## 🎨 Available Icons

10 carefully selected icons from Lucide React:
- **Move Right** (double arrows - default)
- **Sparkles** - Magic/creativity
- **Zap** - Energy/speed
- **Heart** - Love/like
- **Star** - Favorite/featured
- **Trending Up** - Growth/success
- **Award** - Achievement
- **Rocket** - Launch/startup
- **Target** - Goal/focus
- **Check Circle** - Complete/verified

## 🎨 Color Presets (Wise Design System)

### Wise Green (Default)
```css
Pill: #163300  /* --color-interactive-primary */
Icon: #9fe870  /* --color-primary */
Text: #9fe870  /* --color-primary */
```

### Classic
```css
Pill: #000000
Icon: #ffffff
Text: #ffffff
```

### Blue
```css
Pill: #3b82f6
Icon: #dbeafe
Text: #ffffff
```

### Pink
```css
Pill: #ec4899
Icon: #fce7f3
Text: #ffffff
```

## 🛠️ Technical Details

### Animation Specifications
```tsx
// Layout animation (width changes)
transition={{
  layout: {
    type: 'spring',
    stiffness: 400,  // Responsive
    damping: 25,     // Smooth, not bouncy
  }
}}

// Initial animation
initial={{ scale: 0.8, opacity: 0 }}
animate={{ scale: 1, opacity: 1 }}
transition={{
  type: 'spring',
  stiffness: 300,
  damping: 20,
}}
```

### Canvas Centering
```tsx
<div className="canvas-area">  {/* Flexbox parent */}
  <SocialPill />  {/* Automatically centered */}
</div>
```

```css
.canvas-area {
  display: flex;
  align-items: center;      /* Vertical center */
  justify-content: center;  /* Horizontal center */
}
```

### Why This Works

1. **`layout` prop**: Framer Motion automatically animates size changes
2. **Flexbox centering**: Parent uses `display: flex; align-items: center; justify-content: center`
3. **`layout="position"`**: Child elements move smoothly during parent resize
4. **`inline-flex`**: Pill only takes width it needs (auto-sizing)
5. **Spring physics**: Natural motion that feels good

## 📂 File Structure

```
src/components/SocialPill/
├── SocialPill.tsx      # Core animated pill (Framer Motion + Wise tokens)
├── SocialPill.css      # Styles using design tokens
├── VideoEditor.tsx     # Editor/canvas layout (Wise design patterns)
├── VideoEditor.css     # Editor styles (all design tokens)
└── index.ts            # Exports

Design system tokens loaded from:
src/styles/tokens.css   # Wise Design System (from Tapestry V2)
```

## 🎓 Design System References

### Tapestry V2 Sources
- **design-tokens.css** - All color/typography/spacing tokens
- **layout.css** - 3-column grid patterns, panel styles
- **Button.css** - Button component patterns

### Key Design Patterns Used
- ✅ CSS custom properties for all values
- ✅ Wise Sans for headings (display font)
- ✅ Inter for body text
- ✅ Semantic color names (`--color-interactive-primary`)
- ✅ Consistent spacing scale
- ✅ Border radius tokens
- ✅ Transition timing tokens
- ✅ Custom scrollbar styling

## 🔄 Switching Views

Edit [src/main.tsx](src/main.tsx):

```tsx
// Show Video Editor (social media pill)
const CurrentApp = VideoEditor;

// Show Main Tapestry App
const CurrentApp = App;
```

## ✅ Meets All Requirements

| Requirement | Status | Implementation |
|------------|--------|----------------|
| Editable content & auto-width | ✅ | Input field → real-time pill resize |
| Perfect centering | ✅ | Flexbox + red crosshair marker |
| Pill look (rounded-full) | ✅ | `var(--radius-full)` design token |
| Layout animation (no snap) | ✅ | Framer Motion `layout` prop |
| Icon anchor | ✅ | Fixed 32px circle with `layout="position"` |
| State driven editor | ✅ | Sidebar + canvas split view |
| **Wise Design System** | ✅ | All design tokens from Tapestry V2 |

## 🚀 Next Steps

### Integration Ideas
1. Add to Tapestry canvas as exportable layer
2. Timeline animation editor
3. Multiple pills with stacking
4. Save/load preset templates
5. Custom font selection
6. Drop shadow and glow effects

---

**Built with the Wise Design System from Tapestry V2** 🎨
