
# Color Customization Guide

## Quick Color Changes

All colors are centralized in `client/src/index.css` at the top of the file.

### Brand Colors (Line 6-9)
Change these 4 variables to update your brand everywhere:

```css
--brand-mint: #b1f2d6;      /* Light theme background, dark theme text */
--brand-forest: #002e22;     /* Dark theme background, light theme text */
--brand-emerald: #03d47c;    /* Primary action color (buttons) */
--brand-pine: #085239;       /* Accent areas like #screener */
```

### Theme Colors
The HSL values below automatically adapt based on brand colors:

**Light Theme** (`:root` section, lines 11-29)
- `--background`: Page background color
- `--foreground`: Main text color
- `--primary`: Button/link colors
- `--muted`: Subtle backgrounds
- `--card`: Card backgrounds

**Dark Theme** (`.dark` section, lines 31-49)
- Same variables but inverted for dark mode

## How to Make Changes

### Example 1: Change the light theme background
```css
/* Line 12 - make it lighter or darker */
--background: 154 71% 95%;  /* Lighter */
--background: 154 71% 85%;  /* Darker */
```

### Example 2: Change primary button color
Update the brand emerald color:
```css
--brand-emerald: #00ff88;  /* Brighter green */
```

Then update the HSL value:
```css
--primary: 160 100% 50%;  /* Adjust to match */
```

### Example 3: Swap light/dark backgrounds
Just swap the values between `:root` and `.dark` sections.

## Tips
- HSL format: `hue saturation% lightness%`
- Higher lightness = lighter color
- Keep contrast between background/foreground for readability
- Test both light and dark modes after changes
