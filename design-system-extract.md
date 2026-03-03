# Design System Extract - Money Transfer Hero Section

Extracted from Figma: ☀️ Ray's Space
Node ID: 4017-2466 (_Background)

## Overview

This is a hero section for a money transfer service with a bright green background (#9fe870), featuring app store ratings, a bold headline, descriptive copy, a currency converter interface, and CTA buttons.

---

## 1. Color Palette

### Primary Colors

- **Bright Green (Background)**: `#9fe870` / `rgb(159, 232, 112)`
  - Used for: Main background, button text (on dark button)

- **Dark Green (Text/Controls)**: `#163300` / `rgb(22, 51, 0)`
  - Used for: All text content, primary interactive elements, button backgrounds

- **White**: `#ffffff` / `rgb(255, 255, 255)`
  - Used for: Currency converter background, avatar backgrounds

### Supporting Colors

- **Light Gray/Off-White**: `#ecefeb` / `rgb(236, 239, 235)`
  - Used for: Borders, subtle separators

- **Very Light Green**: `#eff1ed` / `rgb(239, 241, 237)`
  - Used for: Secondary surfaces

- **Black**: `#0e0f0c` / `rgb(14, 15, 12)`
  - Used for: Borders, strong contrast elements

### Design Tokens (from Figma Variables)

```css
--color-background-neutral: #163300
--color-background-screen: #ffffff
--color-content-primary: #0e0f0c
--color-content-secondary: #454745
--color-interactive-accent: #9fe870
--color-interactive-primary: #163300
--color-border-neutral: #0e0f0c
```

---

## 2. Typography

### Font Families

1. **Wise Sans** - Display/Heading font (bold, 700)
2. **Inter** - Body text and labels (semi-bold, 600)

### Text Styles

#### App Store Rating Badge
- **Font**: Inter
- **Size**: 14px (App Store) / 16px (Google Play)
- **Weight**: 600 (Semi-bold)
- **Line Height**: 22px / 24px
- **Letter Spacing**: 0.14px / 0.16px
- **Color**: #163300 (Dark green)

#### Main Headline
- **Text**: "Send money globally for less"
- **Font**: Wise Sans
- **Size**: 96px
- **Weight**: 700 (Bold)
- **Line Height**: 84px (tight leading)
- **Color**: #163300 (Dark green)
- **Treatment**: Large, bold, attention-grabbing

#### Subheading/Body Copy
- **Text**: "Move your money where it matters..."
- **Font**: Inter
- **Size**: 20px
- **Weight**: 600 (Semi-bold)
- **Line Height**: 28px
- **Letter Spacing**: -0.1px (slightly tighter)
- **Color**: #163300 (Dark green)

#### Currency Labels (GBP, EUR)
- **Font**: Wise Sans
- **Size**: 34.56px
- **Weight**: 700 (Bold)
- **Line Height**: 46.66px
- **Letter Spacing**: -0.48px
- **Color**: #163300 (Dark green)

#### Amount Display ($123.32, £123.32)
- **Font**: Wise Sans
- **Size**: 57.6px
- **Weight**: 700 (Bold)
- **Line Height**: 60.48px
- **Color**: #163300 (Dark green)

#### Button Text
- **Font**: Inter
- **Size**: 16px
- **Weight**: 600 (Semi-bold)
- **Line Height**: 24px
- **Letter Spacing**: -0.176px
- **Colors**:
  - Primary button: #9fe870 (bright green) on dark background
  - Secondary button: #163300 (dark green)

---

## 3. Layout & Spacing

### Container Structure

#### Main Background Frame
- **Size**: 1440px × 711px (desktop)
- **Layout**: Vertical flex (column)
- **Padding**: 60px (top/bottom), 100px (left/right)
- **Gap**: 10px
- **Alignment**: Center (both axes)

#### Content Frame
- **Size**: 1240px × 591px
- **Layout**: Vertical flex
- **Gap**: 60px
- **Alignment**: Center (counter-axis)

#### Text & Buttons Section
- **Size**: 1240px × 591px
- **Layout**: Vertical flex
- **Gap**: 40px
- **Alignment**: Center (both axes)

### Spacing System

Based on extracted spacing tokens:
- **Space-7 (Marketing)**: 60px - Used between major sections
- **Component Gap**: 40px - Between text and interactive elements
- **Item Spacing**: 10px - Between closely related items

---

## 4. Components

### Rating Badges
- Two badges side by side
- App Store (Apple icon) and Google Play (Play icon)
- Stars (★) + platform + review count
- Compact, inline format

### Currency Converter
- White background cards with rounded corners
- Two rows: Top (GBP → $123.32), Bottom (EUR → £123.32)
- Flag icons + currency code dropdown
- Large amount display
- Swap arrow between the two rows

### Primary CTA Button
- **Text**: "Send money"
- **Background**: Dark green (#163300)
- **Text Color**: Bright green (#9fe870)
- **Border Radius**: Fully rounded (pill shape)
- **Padding**: Generous horizontal padding
- **Size**: 16px font, 24px line height

### Secondary CTA Button
- **Text**: "Compare our prices"
- **Background**: Transparent or light
- **Text Color**: Dark green (#163300)
- **Border Radius**: Fully rounded (pill shape)

---

## 5. Design Patterns

### Visual Hierarchy
1. **Primary**: Large headline (96px) - immediate attention
2. **Secondary**: Subheading (20px) - context and value prop
3. **Tertiary**: Interactive elements (currency converter + buttons)
4. **Supporting**: Rating badges at top

### Color Usage Strategy
- **High contrast**: Dark green text (#163300) on bright green background (#9fe870)
- **Inversion for emphasis**: Bright green text on dark green button (primary CTA)
- **White for interaction**: Currency converter uses white background for clarity

### Spacing Strategy
- **Generous padding**: 100px horizontal margins for breathing room
- **Consistent gaps**: 60px between major sections, 40px within sections
- **Tight headline leading**: 84px line height on 96px text creates visual density

---

## 6. Component Breakdown

### Hero Section Structure
```
Background (1440×711, bright green #9fe870)
└── Content Container (1240×591, centered)
    └── Text & Buttons
        ├── Rating Badges Row
        │   ├── App Store Badge
        │   └── Google Play Badge
        ├── Headline
        ├── Subheading
        ├── Currency Converter
        │   ├── From Currency (GBP → $123.32)
        │   ├── Swap Icon
        │   └── To Currency (EUR → £123.32)
        └── CTA Buttons
            ├── Primary: "Send money" (dark bg, bright text)
            └── Secondary: "Compare our prices" (link style)
```

---

## 7. Responsive Considerations

The design is currently at 1440px desktop width. For responsive implementation:

- **Padding**: Reduce 100px horizontal padding on smaller screens
- **Headline**: Scale down from 96px to 48-60px on mobile
- **Currency Converter**: May stack vertically or reduce size
- **Button**: Full width on mobile

---

## 8. Implementation Notes

### CSS Custom Properties Recommendation
```css
:root {
  /* Colors */
  --color-bg-primary: #9fe870;
  --color-text-primary: #163300;
  --color-surface: #ffffff;
  --color-border: #ecefeb;

  /* Typography */
  --font-display: 'Wise Sans', sans-serif;
  --font-body: 'Inter', sans-serif;

  /* Spacing */
  --space-xs: 10px;
  --space-md: 40px;
  --space-lg: 60px;
  --space-xl: 100px;

  /* Layout */
  --container-max-width: 1440px;
  --content-max-width: 1240px;
}
```

### Key Design Decisions
1. **Unconventional color choice**: Bright green (#9fe870) is bold and attention-grabbing
2. **Readability**: Dark green (#163300) provides excellent contrast on bright background
3. **Typography hierarchy**: Massive 96px headline creates strong visual impact
4. **White converter UI**: Separates interactive element from colorful background
5. **Rounded buttons**: Pill-shaped buttons feel friendly and modern

---

## Summary

This design uses a bold, high-energy color palette with a bright green background to create a memorable hero section. The typography hierarchy is strong with a very large headline (96px Wise Sans Bold), and the layout is centered and spacious with generous padding. The currency converter interface stands out with its white background against the bright green, making it the clear interactive focal point after the headline.
