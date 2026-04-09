# DESIGN.md — 版式装配引擎 1921Editor

Inspired by Notion's warm editorial minimalism. A content editor UI should get out of the creator's way.

## 1. Visual Theme & Atmosphere

Warm, editorial, distraction-free. The design philosophy: a blank canvas that breathes.
Built on warm neutrals rather than cold grays or heavy gradients. White pages, warm surfaces,
whisper-weight borders, barely-there shadows. The single accent color (Blue `#0075de`) is used
sparingly — only for primary CTAs and interactive highlights.

**Key Characteristics:**
- Warm neutral palette: grays carry yellow-brown undertones (`#f6f5f4` warm white, `#31302e` warm dark)
- Near-black text via `rgba(0,0,0,0.95)` — not pure black, creating micro-warmth
- Ultra-thin borders: `1px solid rgba(0,0,0,0.1)` throughout — whisper-weight division
- Multi-layer shadow stacks with sub-0.05 opacity for barely-there depth
- Single accent: Blue `#0075de` for CTAs and interactive elements
- 8px base spacing unit
- No heavy gradients in UI chrome — only in rare decorative contexts

## 2. Color Palette & Roles

### Primary
- **Near-Black** `rgba(0,0,0,0.95)`: Primary text, headings
- **Pure White** `#ffffff`: Page background, card surfaces, button text on blue
- **Blue** `#0075de`: Primary CTA, link color, interactive accent

### Warm Neutral Scale
- **Warm White** `#f6f5f4`: Section backgrounds, sidebar fills, card alt surface
- **Warm Dark** `#31302e`: Dark surfaces
- **Warm Gray 500** `#615d59`: Secondary text, descriptions
- **Warm Gray 300** `#a39e98`: Placeholder, disabled, captions

### Semantic
- **Success** `#1aae39`: Positive badges, completion
- **Warning** `#dd5b00`: Attention indicators
- **Active Blue** `#005bab`: Button pressed state

### Shadows & Borders
- **Whisper Border** `1px solid rgba(0,0,0,0.1)`
- **Card Shadow** `rgba(0,0,0,0.04) 0px 4px 18px, rgba(0,0,0,0.027) 0px 2.025px 7.85px, rgba(0,0,0,0.02) 0px 0.8px 2.93px, rgba(0,0,0,0.01) 0px 0.175px 1.04px`

## 3. Typography

### Font Family
- **Primary**: `Inter, -apple-system, "SF Pro Text", "PingFang SC", "Microsoft YaHei", sans-serif`

### Hierarchy
| Role | Size | Weight | Letter Spacing | Line Height |
|------|------|--------|----------------|-------------|
| Display Hero | 48–64px | 700 | -1.5px to -2px | 1.00–1.04 |
| Section Heading | 32–40px | 700 | -0.75px | 1.10 |
| Card Title | 20–22px | 700 | -0.25px | 1.27 |
| Body Large | 18–20px | 600 | -0.125px | 1.40 |
| Body | 15–16px | 400 | normal | 1.50 |
| Nav / Button | 14–15px | 600 | normal | 1.33 |
| Caption | 12–14px | 400–500 | 0 to 0.125px | 1.43 |
| Badge | 11–12px | 600 | 0.125px | 1.33 |

## 4. Component Stylings

### Buttons

**Primary Blue**
- Background: `#0075de`
- Text: `#ffffff`
- Padding: `8px 16px`
- Radius: `4px`
- Hover: background `#005bab`
- Active: scale(0.97)

**Secondary**
- Background: `rgba(0,0,0,0.05)`
- Text: `rgba(0,0,0,0.95)`
- Padding: `8px 16px`
- Radius: `4px`
- Hover: background `rgba(0,0,0,0.08)`

**Ghost**
- Background: transparent
- Text: `rgba(0,0,0,0.95)`
- Hover: underline

**Pill Badge**
- Background: `#f2f9ff`
- Text: `#097fe8`
- Radius: `9999px`
- Padding: `4px 10px`
- Font: 12px weight 600

### Cards
- Background: `#ffffff`
- Border: `1px solid rgba(0,0,0,0.1)`
- Radius: `12px`
- Shadow: card shadow (4-layer, max opacity 0.04)
- Hover: shadow intensification

### Inputs
- Background: `#ffffff`
- Border: `1px solid rgba(0,0,0,0.15)`
- Radius: `6px`
- Padding: `8px 12px`
- Focus: `2px solid #0075de` outline, `box-shadow: 0 0 0 3px rgba(0,117,222,0.12)`
- Placeholder: `#a39e98`

### Navigation
- Clean white header, `1px solid rgba(0,0,0,0.1)` bottom border
- Logo left, nav links center/right
- Font: 15px weight 600, `rgba(0,0,0,0.7)`
- Hover: `rgba(0,0,0,0.95)`
- Primary CTA: Blue button right-aligned

### Step Indicators
- Completed: Blue filled circle with checkmark
- Active: Blue filled with white number
- Pending: White with `1px solid rgba(0,0,0,0.2)`, gray number
- Connecting line: `1px solid rgba(0,0,0,0.1)`

## 5. Layout Principles

### Spacing
- Base: 8px
- Scale: 4, 8, 12, 16, 24, 32, 48, 64, 80, 96px

### Grid
- Max content width: 1200px, centered
- Side padding: 24px (mobile) → 48px (desktop)
- Card grids: 1 col (mobile) → 2 col (tablet) → 3 col (desktop)

### Whitespace
- Generous vertical rhythm: 48–80px between sections
- Section alternation: white ↔ warm white (`#f6f5f4`)
- Content-first: compact body text, ample surrounding margin

## 6. Depth & Elevation

| Level | Treatment |
|-------|-----------|
| Flat | No shadow, no border |
| Whisper | `1px solid rgba(0,0,0,0.1)` |
| Card | 4-layer shadow, max opacity 0.04 |
| Float | 5-layer shadow, max opacity 0.08 |
| Focus | `2px solid #0075de` outline |

## 7. Do's and Don'ts

**Do:**
- Use warm neutrals throughout
- Single accent color (#0075de) for CTAs only
- Whisper borders everywhere
- Generous spacing and breathing room
- Simple flat buttons with 4px radius

**Don't:**
- Heavy gradient backgrounds in UI chrome
- Multiple competing accent colors
- Border radius > 16px on UI elements (only in decorative spots)
- Drop shadows heavier than 0.08 opacity
- Blue-gray tones — use warm grays only

## 8. Agent Prompt Guide

**Quick Color Reference:**
- CTA: `#0075de`
- Background: `#ffffff`
- Alt Background: `#f6f5f4`
- Heading: `rgba(0,0,0,0.95)`
- Body: `rgba(0,0,0,0.8)`
- Secondary: `#615d59`
- Muted: `#a39e98`
- Border: `1px solid rgba(0,0,0,0.1)`

**Use this system to generate:**
- Clean content editor UI
- Dashboard pages with card grids
- Forms and settings pages
- Multi-step workflow interfaces
