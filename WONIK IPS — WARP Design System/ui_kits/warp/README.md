# WARP UI Kit

Pixel-faithful recreation of the WARP semiconductor equipment control interface (1920×1080).

## Contents

| File | Description |
|---|---|
| `index.html` | Full WARP interface — interactive prototype (PM tab switching, status updates) |
| `Toolbar.jsx` | Top dark toolbar: logo panel, user/module panel, macro panel, run controls, function buttons |
| `DataPanel.jsx` | Light/dark panel with header strip and table rows |
| `StatusIndicator.jsx` | Dot+label, state chips, wafer slot grid, chamber state list |
| `EquipmentCanvas.jsx` | Center equipment schematic canvas with PNG overlay |

## Design source
- Figma: `Lightmode.fig`, Page-1, Frame 264 (1920×1080)
- Font: Inter (Google Fonts)
- All colors from `../../colors_and_type.css`

## Notes
- Equipment diagrams are raster PNGs — not SVG. See `../../assets/`.
- No production logic: all state is simulated/static.
- Bottom toolbar icons use inline SVG approximations (no icon font in source).
