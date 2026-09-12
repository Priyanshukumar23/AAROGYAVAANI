---
name: Clinical Direct
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
  on-surface-variant: '#43474d'
  inverse-surface: '#213145'
  inverse-on-surface: '#eaf1ff'
  outline: '#74777e'
  outline-variant: '#c4c6ce'
  surface-tint: '#49607e'
  primary: '#000f22'
  on-primary: '#ffffff'
  primary-container: '#0a2540'
  on-primary-container: '#768dad'
  inverse-primary: '#b0c8eb'
  secondary: '#006398'
  on-secondary: '#ffffff'
  secondary-container: '#5bb8fe'
  on-secondary-container: '#00476e'
  tertiary: '#001209'
  on-tertiary: '#ffffff'
  tertiary-container: '#002a1b'
  on-tertiary-container: '#1a9e70'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d2e4ff'
  primary-fixed-dim: '#b0c8eb'
  on-primary-fixed: '#001c37'
  on-primary-fixed-variant: '#314865'
  secondary-fixed: '#cce5ff'
  secondary-fixed-dim: '#93ccff'
  on-secondary-fixed: '#001d31'
  on-secondary-fixed-variant: '#004b73'
  tertiary-fixed: '#85f8c4'
  tertiary-fixed-dim: '#68dba9'
  on-tertiary-fixed: '#002114'
  on-tertiary-fixed-variant: '#005137'
  background: '#f8f9ff'
  on-background: '#0b1c30'
  surface-variant: '#d3e4fe'
typography:
  display-kiosk:
    fontFamily: Plus Jakarta Sans
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
  display-kiosk-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 36px
    fontWeight: '700'
    lineHeight: 44px
  headline-xl:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
  headline-xl-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 26px
    fontWeight: '600'
    lineHeight: 34px
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-xl:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '400'
    lineHeight: 30px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-touch:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
  label-triage:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '700'
    lineHeight: 16px
    letterSpacing: 0.05em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  touch-min-patient: 4rem
  touch-min-staff: 2.75rem
  kiosk-edge-margin: 3rem
  tablet-edge-margin: 2rem
  gutter-kiosk: 2rem
  gutter-compact: 1rem
  component-gap-lg: 1.5rem
  component-gap-sm: 0.75rem
---

## Brand & Style

This design system delivers an institutional-grade, highly legible interface engineered for bilingual and multilingual hospital environments across India. Designed for high-stress, high-throughput settings—ranging from premier tertiary research hospitals to bustling district civil facilities—the aesthetic prioritizes institutional trust, clarity, and zero cognitive overhead.

### Design Movements & Tone
- **Clinical Minimalist & Institutional Functionalism:** Prioritizes stark visual hierarchy, ample negative space, and absolute legibility over decorative flourishes. Glassmorphism, blurred scrims, neon accents, and heavy drop shadows are prohibited.
- **Physical Touch Reliability:** Employs high-contrast tactile feedback states, generous structural boundaries, and reinforced hit areas tailored specifically to public kiosk displays and tablet surfaces used by patients of varying digital literacy.
- **Emotional Stance:** Calm, authoritative, clinical, and reassuring. The visual structure reduces medical anxiety and provides unmistakable triage comprehension in public spaces.

## Colors

The palette is engineered around high luminance contrast (WCAG AAA for text and essential interactive states). Medical status colors are strictly functional and reserved for diagnostic feedback and emergency triage indicators.

### Functional Palette Structure
- **Primary Canvas (`#0A2540` - Deep Clinical Navy):** The structural anchor used for institutional framing, persistent kiosk banners, high-priority touch actions, and critical identification badges.
- **Secondary Interactive (`#0284C7` - Trust Medical Blue):** Used for standard patient inputs, directional cues, audio prompts, and active selection states.
- **Neutral Foundation:**
  - Surface Background: `#F8FAFC` (Clean Hospital Slate Light)
  - Surface Card / Modal: `#FFFFFF` (Sterile White)
  - Surface Active / Container: `#F1F5F9` (Subtle Recessed Neutral)
  - High-Contrast Text: `#0F172A` (Slate 900)
  - Secondary Text / Subtext: `#334155` (Slate 700)
  - Border & Dividers: `#CBD5E1` (Structural Slate 300)
- **Clinical Status & Triage Accents:**
  - **Triage P1 (Immediate / Resuscitation):** `#DC2626` (Clinical Crimson)
  - **Triage P2 (Urgent / High Priority):** `#D97706` (Clinical Amber)
  - **Triage P3 (Stable / Routine Intake):** `#059669` (Clinical Emerald)
  - **System Notice / Clinical Audio:** `#0284C7` (Trust Medical Blue)

## Typography

Typography prioritizes legibility at standing reading distances (1–1.5 meters from public touchscreens) and under varying indoor hospital lighting.

- **Primary Heading Face (`Plus Jakarta Sans`):** Provides sturdy, geometric clarity with open letterforms and clear counters, preventing optical closure for non-native English script users and the elderly.
- **Body & Touch Label Face (`Inter`):** Utilizes neutral, systematic proportions with tall x-heights and distinct letterforms (such as unambiguous numerals and disambiguated `l` vs `1` vs `I`).
- **Language Extensibility:** Supports fallback rendering for Indian languages (Devanagari, Tamil, Telugu, Kannada, Bengali, etc.) while preserving vertical line-height metrics to prevent clipping during live language toggling.

## Layout & Spacing

The layout is built on a responsive fixed-column system configured for physical kiosk proportions (typically 21" to 32" vertical or horizontal touch displays) and clinician administrative tablets.

### Layout Mechanics
- **Kiosk Mode (Large Touch Displays, Landscape & Portrait):**
  - **Grid:** 8-column layout (portrait) or 12-column layout (landscape).
  - **Gutters:** `2rem` (32px) fixed.
  - **Margins:** `3rem` (48px) safe boundary from physical kiosk bezels to eliminate edge mistouches.
  - **Vertical Zone Allocation:** Top 12% reserved for high-visibility institutional header and language switcher. Bottom 15% anchored exclusively for primary navigation ("Back", "Next", "Call Attendant").
- **Staff / Tablet View:**
  - **Grid:** 8-column fluid grid.
  - **Gutters:** `1rem` (16px).
  - **Margins:** `2rem` (32px).
- **Physical Reach Rule:** All primary interactive patient controls reside within a central "comfort strike zone" (between 900mm and 1300mm from floor level equivalent on standing screen dimensions).

## Elevation & Depth

This system avoids floating physics, ambient blur, and deep atmospheric drop shadows. Depth is communicated strictly through surface layering and high-definition architectural borders.

- **Base Layer (L0):** `#F8FAFC` (Clean clinical floor/chassis background).
- **Container / Card Tier (L1):** `#FFFFFF` paired with an explicit `1px` structural outline (`#CBD5E1`). Zero shadow. This creates definitive contrast against the base canvas.
- **Interactive Raised Tier (L2 - Touch Selection):** `#FFFFFF` with a `2px` outline (`#0284C7`) and an immediate `0px 4px 12px rgba(10, 37, 64, 0.08)` drop to signify intentional patient selection.
- **Overlay & Emergency Triage Layer (L3):** `#FFFFFF` with a high-contrast `2px` perimeter in `#0A2540` or corresponding Triage color, supported by a `0px 8px 24px rgba(15, 23, 42, 0.16)` scrim.

## Shapes

The design uses tight, controlled corner radiuses (`roundedness: 1`). Soft curves (8px standard) guide the eye and prevent the visual fatigue of harsh rectangular edges, while avoiding pill shapes that read as informal or consumer-entertainment oriented.

- **Kiosk Touch Panels & Large Cards:** `12px` (0.75rem).
- **Standard Buttons & Form Controls:** `8px` (0.5rem).
- **Status Tags, Language Badges & Triage Flags:** `4px` (0.25rem).
- **Strict Prohibition:** Full circular (50% / pill) buttons are prohibited for functional clinical actions to ensure unambiguous text and icon containment.

## Components

### 1. Interactive Buttons
- **Patient Kiosk Primary:** Minimum physical height of `64px` (`touch-min-patient`). Background: `#0A2540`; Text: `#FFFFFF`; Typography: `label-touch`. Active state shifts immediately to `#0284C7` with a tactile 2px inset ring.
- **Patient Kiosk Secondary / Back:** Minimum height `64px`. Background: `#FFFFFF`; Border: `2px solid #CBD5E1`; Text: `#0F172A`.
- **Clinician / Staff Buttons:** Height `44px` (`touch-min-staff`). Condensed padding (`0.75rem 1.25rem`) optimized for desktop and tablet clinical charting.

### 2. Symptom Selection Chips (Tile Cards)
- **Touch Targets:** Minimum size `120px` height by fluid width.
- **Visuals:** Centered high-contrast vector icon (`36px`), secondary dual-language label (`body-md`), and a persistent unselected checkbox indicator in the top right corner.
- **Selected State:** Border switches from `1px solid #CBD5E1` to `3px solid #0284C7` with a background fill shift to `#F0F9FF`.

### 3. Patient Intake Input Fields
- **Touch Specifications:** Minimum input field height `64px` on kiosk; text displayed at `body-xl` (`20px`).
- **Structure:** Crisp `2px solid #94A3B8` border on `#FFFFFF` field. When active/focused, border changes to `2px solid #0284C7` with an auxiliary clear button (`48px` hit target) and on-screen keyboard trigger.
- **Error State:** Immediate `2px solid #DC2626` outline with high-contrast inline error description text beneath the field (`#DC2626`).

### 4. Checkboxes & Radio Controls
- **Hit Envelopes:** Sizing never falls below `64px x 64px` combined surface area on patient displays.
- **Element Sizing:** Checkbox and radio indicators themselves are rendered at an enlarged `28px x 28px` with clear, bold selection graphics (`3px` check stroke).

### 5. Triage Priority Badges
- **P1 (Immediate / Critical):** Background `#FEF2F2`, Border `1.5px solid #DC2626`, Text `#991B1B`.
- **P2 (Urgent):** Background `#FFFBEB`, Border `1.5px solid #D97706`, Text `#92400E`.
- **P3 (Non-Urgent / Routine):** Background `#ECFDF5`, Border `1.5px solid #059669`, Text `#065F46`.
- **Typography:** `label-triage` uppercase with unambiguous clinical designation labels (e.g., `PRIORITY 1 - RESUSCITATION`).

### 6. Multilingual Language Selector
- **Placement:** Top right corner of the kiosk frame, permanently docked.
- **Design:** Groupedsegmented controls or large touch tiles (`56px` height per locale). Text displayed in original native script (e.g., "English", "हिन्दी", "தமிழ்") at `18px` bold, preventing transliteration confusion.

### 7. Audio & Speech-to-Text Clinical Prompts
- **Prominent Assistive Tile:** Highlighted in `#F0F9FF` container with `2px solid #0284C7`. Displays a high-contrast speaker/mic icon, live audio wave animation, and instant text transcript displayed at `body-lg` to assist low-literacy or visually impaired patients.