---
name: CivicConnect Citizen Portal
colors:
  surface: '#f8f9ff'
  surface-dim: '#cbdbf5'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff4ff'
  surface-container: '#e5eeff'
  surface-container-high: '#dce9ff'
  surface-container-highest: '#d3e4fe'
  on-surface: '#0b1c30'
  on-surface-variant: '#3f4944'
  inverse-surface: '#213145'
  inverse-on-surface: '#eaf1ff'
  outline: '#6f7974'
  outline-variant: '#bfc9c2'
  surface-tint: '#226a53'
  primary: '#004331'
  on-primary: '#ffffff'
  primary-container: '#0d5c46'
  on-primary-container: '#8cd2b6'
  inverse-primary: '#8ed5b9'
  secondary: '#545f73'
  on-secondary: '#ffffff'
  secondary-container: '#d5e0f8'
  on-secondary-container: '#586377'
  tertiary: '#003d60'
  on-tertiary: '#ffffff'
  tertiary-container: '#005583'
  on-tertiary-container: '#8ccaff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#aaf1d4'
  primary-fixed-dim: '#8ed5b9'
  on-primary-fixed: '#002117'
  on-primary-fixed-variant: '#00513d'
  secondary-fixed: '#d8e3fb'
  secondary-fixed-dim: '#bcc7de'
  on-secondary-fixed: '#111c2d'
  on-secondary-fixed-variant: '#3c475a'
  tertiary-fixed: '#cce5ff'
  tertiary-fixed-dim: '#93ccff'
  on-tertiary-fixed: '#001d31'
  on-tertiary-fixed-variant: '#004b73'
  background: '#f8f9ff'
  on-background: '#0b1c30'
  surface-variant: '#d3e4fe'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 3.5rem
    fontWeight: '700'
    lineHeight: 4rem
    letterSpacing: -0.025em
  display-lg-mobile:
    fontFamily: Inter
    fontSize: 2.25rem
    fontWeight: '700'
    lineHeight: 2.75rem
    letterSpacing: -0.02em
  headline-xl:
    fontFamily: Inter
    fontSize: 2.5rem
    fontWeight: '600'
    lineHeight: 3rem
    letterSpacing: -0.02em
  headline-xl-mobile:
    fontFamily: Inter
    fontSize: 1.875rem
    fontWeight: '600'
    lineHeight: 2.25rem
    letterSpacing: -0.015em
  headline-lg:
    fontFamily: Inter
    fontSize: 2rem
    fontWeight: '600'
    lineHeight: 2.5rem
    letterSpacing: -0.015em
  headline-md:
    fontFamily: Inter
    fontSize: 1.5rem
    fontWeight: '600'
    lineHeight: 2rem
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Inter
    fontSize: 1.25rem
    fontWeight: '600'
    lineHeight: 1.75rem
    letterSpacing: -0.005em
  body-lg:
    fontFamily: Inter
    fontSize: 1.125rem
    fontWeight: '400'
    lineHeight: 1.75rem
    letterSpacing: 0em
  body-md:
    fontFamily: Inter
    fontSize: 1rem
    fontWeight: '400'
    lineHeight: 1.5rem
    letterSpacing: 0em
  body-sm:
    fontFamily: Inter
    fontSize: 0.875rem
    fontWeight: '400'
    lineHeight: 1.25rem
    letterSpacing: 0.005em
  label-lg:
    fontFamily: Inter
    fontSize: 0.875rem
    fontWeight: '600'
    lineHeight: 1.25rem
    letterSpacing: 0.01em
  label-md:
    fontFamily: Inter
    fontSize: 0.75rem
    fontWeight: '600'
    lineHeight: 1rem
    letterSpacing: 0.02em
  label-sm:
    fontFamily: Inter
    fontSize: 0.6875rem
    fontWeight: '600'
    lineHeight: 0.875rem
    letterSpacing: 0.03em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  gutter: 1.5rem
  gutter-sm: 1rem
  gutter-lg: 2rem
  margin: 1.5rem
  margin-sm: 1rem
  margin-lg: 3rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.5rem
---

## Brand & Style

The design system projects institutional integrity, radical transparency, and effortless civic utility. Designed for broad resident demographics—from tech-savvy digital natives filing park maintenance requests to senior citizens applying for property permits—the visual tone replaces bureaucratic intimidation with welcoming efficiency.

The visual style is **Corporate / Modern** anchored in civic accessibility:
- **Tone**: Dependable, dignified, transparent, and approachable.
- **Visual Direction**: Crisp typographic rhythm, structured surface hierarchies, intentional whitespace, and strictly functional color accents.
- **Accessibility Baseline**: WCAG 2.1 AAA target compliance across all critical reading tasks and input paths, with non-text elements maintaining minimum 3:1 contrast against backdrops.

## Colors

The palette grounds public administration in dependable, nature-inspired greens and architectural navies:

- **Primary (`#0D5C46` - Civic Emerald)**: Anchor for primary actions, navigation wayfinding, key affirmations, and official portal branding.
- **Secondary (`#1E293B` - Slate Navy)**: Structural frame, deep text headers, high-emphasis navigation bars, and grounding borders.
- **Tertiary (`#0284C7` - Sky Blue)**: Applied strictly to informational callouts, active focus indicators, and "In Progress" lifecycles.
- **Neutral (`#64748B` - Slate Gray)**: Manages intermediate text, muted iconography, and secondary structure.

### Semantic Status Colors
- **Pending / Action Required**: Amber (`#D97706` fill on `#FFFBEB` background, border `#FDE68A`).
- **Assigned / Triage**: Indigo (`#4F46E5` fill on `#EEF2FF` background, border `#C7D2FE`).
- **In Progress**: Sky Blue (`#0284C7` fill on `#F0F9FF` background, border `#BAE6FD`).
- **Resolved / Closed**: Emerald (`#0D5C46` fill on `#ECFDF5` background, border `#A7F3D0`).
- **Critical / Hazard**: Crimson (`#DC2626` fill on `#FEF2F2` background, border `#FECACA`).

### Surface Architecture
- Background Canvas: `#F8FAFC` (Cool Off-White)
- Surface Default: `#FFFFFF` (Pure White)
- Surface Subdued: `#F1F5F9` (Muted Foundation)
- Text High-Emphasis: `#0F172A`
- Text Low-Emphasis: `#475569`

## Typography

Typography prioritizes legibility, systematic scanability, and predictable optical weight. 

- **Font Family**: Inter delivers a neutral, tall x-height design that retains character distinction at micro scales (e.g., ticket timestamps, municipal codes) and provides robust legibility across screen types.
- **Rhythm & Line Spacing**: Body copy uses comfortable line heights (1.5x minimum) to reduce reading fatigue in policy descriptions, service agreements, and civic notices.
- **Form Scaling**: Large displays compress letter spacing slightly to maintain cohesive sightlines, while labels and micro-metadata apply extended tracking to maximize legibility.

## Layout & Spacing

The portal employs a fluid 12-column responsive layout system bound by a maximum readable content width of 1280px (`80rem`).

### Form Factor Behavior
- **Mobile (< 640px)**: 4-column layout. Margin collapses to `margin-sm` (`1rem`) to maximize touch real estate. Vertical flow is prioritized; status cards and request items span full width.
- **Tablet (640px – 1023px)**: 8-column layout. Margin transitions to `margin` (`1.5rem`). Multi-column form layouts collapse to single or dual inputs.
- **Desktop (1024px+)**: 12-column layout. Margin expands to `margin-lg` (`3rem`). Side navigation or persistent civic status summaries occupy 3–4 columns; core service interactions occupy the remaining 8–9 columns.

### Spacing Tokens
- `space-xs` (`0.25rem`): Inline badge padding, icon-to-text offsets.
- `space-sm` (`0.5rem`): Compact form field internals, vertical button label offsets.
- `space-md` (`1rem`): Standard container padding, list item separation.
- `space-lg` (`1.5rem`): Card body padding, inter-section grouping.
- `space-xl` (`2.5rem`): Major municipal department panels and structural segment splits.

## Elevation & Depth

To sustain institutional trust, the design system minimizes deep, floaty shadows in favor of **low-contrast outlines** paired with **tonal layers** and subtle ambient occlusion.

- **Level 0 (Flat Ground)**: Used on basic canvas surfaces (`#F8FAFC`). No border, no shadow.
- **Level 1 (Interactive Surface / Default Card)**: Pure white background (`#FFFFFF`) framed with a crisp structural hairline border (`1px solid #E2E8F0`). Subdued shadow: `0 1px 3px 0 rgba(15, 23, 42, 0.05)`.
- **Level 2 (Hover / Active Cards / Dropdowns)**: Surface remains white with an augmented hairline (`1px solid #CBD5E1`) and a calm ambient lift: `0 4px 6px -1px rgba(15, 23, 42, 0.07), 0 2px 4px -2px rgba(15, 23, 42, 0.05)`.
- **Level 3 (Modals / Emergency Banners / Floating Dialogs)**: High-emphasis elevation: `0 20px 25px -5px rgba(15, 23, 42, 0.1), 0 8px 10px -6px rgba(15, 23, 42, 0.06)`, framed by a distinct structural outline (`1px solid #94A3B8`).

Backdrops for modals utilize a tinted Slate Navy veil: `rgba(30, 41, 59, 0.45)` with a `4px` blur filter.

## Shapes

The design system uses a **Soft** shape language (`roundedness: 1`), providing an approachable feel without losing institutional stability.

- **Base Radius (`rounded`, 0.25rem / 4px)**: Checkboxes, text inputs, form controls, inline code blocks, and micro tags.
- **Container Radius (`rounded-lg`, 0.5rem / 8px)**: Service cards, dialog containers, notification banners, and primary CTA buttons.
- **Hero/Modal Radius (`rounded-xl`, 0.75rem / 12px)**: Municipal service hubs, dashboard metric groups, and modal wrappers.
- **Pill Exceptions (`9999px`)**: Reserved exclusively for semantic status pills and user profile avatars to distinguish them from actionable containers.

## Components

### Buttons
- **Primary**: Deep Civic Emerald (`#0D5C46`) background, white label, `rounded-lg`, minimum touch area of `44px × 44px`. Hover darkens to `#0A4736`. Focus state renders a sharp `2px` offset ring in Tertiary Sky Blue (`#0284C7`).
- **Secondary**: Slate Navy border (`1px solid #CBD5E1`), background transparent/white, text Slate Navy (`#1E293B`). Hover shifts background to `#F8FAFC`.
- **Destructive**: Crimson (`#DC2626`) fill or outline for irrevocable municipal actions (e.g., withdraw permit).

### Chips & Badges
- **Status Chips**: Height `24px`, pill-shaped (`9999px`), `0.75rem` font weight 600. Includes an explicit text label paired with a `6px` solid status circle for accessibility:
  - *Pending*: Amber background (`#FFFBEB`), amber text (`#D97706`).
  - *Assigned*: Indigo background (`#EEF2FF`), indigo text (`#4F46E5`).
  - *In Progress*: Sky Blue background (`#F0F9FF`), sky blue text (`#0284C7`).
  - *Resolved*: Emerald background (`#ECFDF5`), emerald text (`#0D5C46`).

### Input Fields & Form Controls
- **Text Inputs**: Height `44px`, base radius `0.25rem`, border `1px solid #CBD5E1`, background `#FFFFFF`. Focus ring: `2px solid #0284C7` with no glow. Mandatory labels rest permanently above the field; helper text and inline validation errors sit below.
- **Checkboxes & Radios**: Size `20px × 20px`, high-contrast border (`#94A3B8`). Selected state triggers `#0D5C46` background with a crisp white tick mark.

### Cards
- **Service & Request Cards**: Built with `rounded-lg`, Level 1 elevation, and a distinct left edge status accent (a `4px` vertical border indicating status when representing filed tickets). Internal padding set to `space-lg`.

### Status Steppers
- A linear pipeline detailing municipal request progression:
  - **Completed Step**: Civic Emerald dot with a white checkmark icon; solid `#0D5C46` connection line.
  - **Active Step**: Tertiary Sky Blue dot with an outer double ring pulse; dashed line following.
  - **Upcoming Step**: Muted gray dot (`#E2E8F0`) with Slate Navy number label; solid light gray connecting line.