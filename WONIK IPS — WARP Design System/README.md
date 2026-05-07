# WONIK IPS — WARP Design System

## Overview

**Company:** WONIK IPS (워닉아이피에스)  
**Product:** WARP — Semiconductor Equipment Control Software  
**Audience:** Customer-site equipment engineers operating semiconductor manufacturing tools  
**UI Paradigm:** Light-mode industrial interface at 1920×1080. Prioritizes clarity, precision, and trust. No consumer-style decoration.

WARP is an MES/equipment controller UI used on the factory floor. Engineers monitor and control semiconductor process chambers (PMC1–3), load ports (LPT1–3), vacuum transfer modules (VTM), and UPC units in real time. The UI shows equipment schematics (PNG diagram overlays), status readouts, recipe/process data tables, and macro execution controls.

## Sources

- **Figma file:** `Lightmode.fig` (mounted as VFS at `/Page-1/Frame-264/` — 1 page, 1 top-level frame "Frame 264", 1920×1080)
- No codebase provided

---

## CONTENT FUNDAMENTALS

**Tone:** Technical, neutral, precise. No warmth or personality. Every string is a label or a value.

**Casing:**
- Module names: ALL CAPS — `PMC1`, `LPT2`, `VTM1`, `MACRO`, `STEP`, `WARP`, `ADMIN`
- UI labels: Title Case or UPPERCASE — `Load Port Information`, `Wafer Mapping Information`, `Chamber Mode`
- Status values: Title Case — `Ready`, `Manual`, `Auto`, `Init`, `No State`, `Not Connected`
- Sub-labels: lower or upper depending on field — `CJob Name`, `Carrier ID`, `Status`, `Acess Mode`

**Language:** Korean product (WONIK IPS), but all UI strings are in English.  
**No emoji.** No decorative copy. No explanatory prose in the UI.

**Data patterns:**
- Numeric values: fixed decimal (`0.000`, `2500.000`, `5500 / 10000`)
- Time: `2025-11-25 08:26` (ISO-adjacent, local)
- Ratios: `0 / 0`, `16 / 5` (current / max)
- Placeholders: `ㅡㅡ` (Korean dash, used for null/unset values)
- Status: always paired with a colored dot or background chip

---

## VISUAL FOUNDATIONS

### Color System

**Background layers:**
| Role | Value | Usage |
|---|---|---|
| Canvas bg | `#E8E8EA` (`rgb(236,236,238)`) | Main screen background |
| Panel bg | `#FEFEFE` (`rgb(254,254,254)`) | Data table/card background |
| Panel header | `#F4F5F5` (`rgb(244,245,245)`) | Card header strip |
| Inset bg | `#F5F5F5` (`rgb(245,245,245)`) | Nested panel tints |
| Toolbar dark | `#1E1E21` (`rgb(30,30,33)`) | Top toolbar, dark panel bg |
| Toolbar header dark | `#252528` (`rgb(37,37,40)`) | Dark panel header strip |

**Borders:**
| Role | Value |
|---|---|
| Light border | `#E1E1E4` (`rgb(225,225,228)`) |
| Mid border | `#D4D4D8` (`rgb(212,212,216)`) |
| Dark border | `#5C5C5C` (`rgb(92,92,92)`) |
| Dark panel border | `#52525C` (`rgb(82,82,92)`) |

**Primary:**
| Role | Value |
|---|---|
| Primary blue | `#2B7FFF` (`rgb(43,127,255)`) |
| Blue light bg | `#DBEAFe` (`rgb(219,234,254)`) |
| Blue stroke | `#BBDCff` (`rgb(187,220,255)`) |
| Blue pale | `#EAF3FF` (`rgb(234,243,255)`) |
| Selected border | `#415BC6` (`rgb(65,91,198)`) |

**Text:**
| Role | Value | Usage |
|---|---|---|
| Text primary (light panels) | `#71717B` (`rgb(113,113,123)`) | Most labels |
| Text secondary | `#5C5C66` (`rgb(92,92,102)`) | Sub-labels, values |
| Text dim | `#52525C` (`rgb(82,82,92)`) | Tertiary |
| Text on dark | `#D9D9DC` (`rgb(217,217,220)`) | Labels on dark toolbar |
| Text on dark (values) | `#E0E0E3` (`rgb(224,224,227)`) | Values on dark bg |

**Status colors:**
| Status | Dot/Icon | Text | Background |
|---|---|---|---|
| Ready / OK | `#07895E` (green) | `#00D492` | — |
| Warning / Manual | `#FE9A00` (amber) | `#D09804` | — |
| Init | — | `#5C5C66` | `#FFFFAC` (`rgb(255,255,172)`) |
| Alarm | — | red | `#FFE2E2` (`rgb(255,226,226)`) |
| Abort | — | red | `#FFCACA` (`rgb(255,202,202)`) |
| Processed | — | purple | `#F3E8FF` (`rgb(243,232,255)`) |
| Aborted | — | purple | `#E9D1FF` (`rgb(233,209,255)`) |

### Typography

**Font family:** Segoe UI (brand font, `fonts/segoeui.ttf`) with Inter as fallback  
**Line height:** 100% (tight, industrial)  
**No bold weights** observed in the Figma source

| Scale | Size | Color | Usage |
|---|---|---|---|
| micro | 8px | `#5C5C66` | Sensor readout values, tiny status text |
| label-sm | 10px | `#D9D9DC` / `#71717B` | Tab labels, icon captions, sub-labels |
| label | 12px | `#E0E0E3` / `#71717B` | Primary labels, values, dot+text status |
| title-sm | 14px | `#5C5C66` | Section label text (e.g. "WARP") |

### Layout & Spacing

- **Canvas:** 1920×1080, fixed, no scroll
- **Top toolbar height:** 67px (dark)
- **Bottom bar height:** ~80px
- **Panel border-radius:** 10px
- **Panel header border-radius:** `10px 10px 0 0`
- **Cell padding (table):** ~4–6px horizontal, ~4px vertical
- **Gap between toolbar items:** 16–22px
- **Status cell height:** 20px

### Cards / Panels

- Background: `#FEFEFE`, border: `1px solid #E1E1E4`, border-radius: 10px
- Header strip: `#F4F5F5`, top-radius 10px, border: `1px solid #E1E1E4`
- Header height: ~40px
- Table cells: 1px borders, no background alternation — all white
- Dark panel: `#1E1E21` bg, `1px solid #52525C` border, `10px` radius

### Shadows & Elevation

No box-shadows observed. Elevation conveyed through border contrast only.

### Borders

- All panels: 1px solid, no double-borders
- Dark toolbar items: `1px solid #52525C`
- Selected/active mode item: `2px solid #415BC6`
- Table cells: `1px solid #E1E1E4`

### Corner Radii

- Cards/panels: 10px
- Status chips: 0px (rectangular)
- Status dots: 50% (circle, 4–5px diameter)
- Toolbar icon buttons: 5–10px

### Iconography

See ICONOGRAPHY section below.

### Backgrounds / Imagery

- Equipment schematics: raster PNG images overlaid on gray canvas (not SVG-drawn)
- No photographic imagery, no gradients, no textures
- Diagrams are technical line-art rendered as PNGs (see `assets/`)

### Animation

None observed. No transitions, easing, or hover animations visible in Figma.

### Hover / Press States

Not explicitly defined in Figma. Assumed: subtle background tint shift (convention for industrial UI). No bounce/scale effects.

---

## ICONOGRAPHY

**System:** Custom icon set. Icons are SVG paths embedded inline or loaded as PNG sprites.  
**Style:** Monoline, filled shapes. Simple geometric forms. Functional (no decorative icons).  
**Color:** Inherit from parent or use `#D4D4D8` (gray, inactive) / `#2B7FFF` (blue, active).  
**Emoji:** Never used.  
**Unicode:** `→` used as a navigation arrow in text labels.  
**Sizes:** 12–44px depending on context. Toolbar icons ~24–36px + caption.

Toolbar buttons follow a consistent pattern: icon on top (~30–44px), text label below (10px Inter). Active state uses blue fill `#2B7FFF`; inactive uses gray `#D4D4D8`.

**Available assets:**
- `assets/logo-wonik-ips.png` — Company logo (185×31px)
- `assets/equipment-diagram-main.png` — Main equipment schematic overlay
- `assets/equipment-diagram-secondary.png` — Secondary schematic
- `assets/equipment-diagram-tertiary.png` — Tertiary schematic
- `assets/icon-shield-badge.svg` — Admin/security badge icon
- `assets/icon-alert.svg` — Alert/warning indicator

---

## FILE INDEX

```
README.md                        ← This file
SKILL.md                         ← Agent skill descriptor
colors_and_type.css              ← CSS variables: colors, type, spacing, components

assets/
  logo-wonik-ips.png             ← WONIK IPS logo
  equipment-diagram-main.png     ← Equipment schematic (main)
  equipment-diagram-secondary.png
  equipment-diagram-tertiary.png
  icon-shield-badge.svg
  icon-alert.svg

preview/
  colors-base.html               ← Background & surface colors
  colors-primary.html            ← Primary blue scale
  colors-status.html             ← Status/semantic colors
  type-scale.html                ← Typography scale
  type-specimens.html            ← Label patterns
  spacing-tokens.html            ← Spacing, radii, borders
  components-panels.html         ← Cards and data panels
  components-status.html         ← Status indicators & dots
  components-toolbar.html        ← Toolbar buttons
  components-table.html          ← Data table rows
  brand-logo.html                ← Logo usage

ui_kits/warp/
  README.md                      ← UI kit notes
  index.html                     ← Full WARP interface prototype
  Toolbar.jsx
  DataPanel.jsx
  StatusIndicator.jsx
  EquipmentCanvas.jsx
```
