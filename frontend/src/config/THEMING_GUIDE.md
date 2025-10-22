# Sector Theming System Guide

## Overview

The Sector Theming System provides a comprehensive, dynamic theming solution for the multi-sector CMS. It enables automatic theme detection based on user sector assignment and smooth theme transitions.

## Architecture

### Core Components

1. **themes.js** - Central theme configuration
2. **SectorThemeProvider** - React context provider for theme management
3. **useSectorTheme** - Custom hook for accessing theme functionality
4. **CSS Custom Properties** - Dynamic theme variables

## Usage

### 1. Basic Setup

The `SectorThemeProvider` is already integrated into `App.jsx`:

```jsx
import { SectorThemeProvider } from './context/SectorThemeProvider';

function App() {
  return (
    <AuthProvider>
      <SectorThemeProvider>
        {/* Your app content */}
      </SectorThemeProvider>
    </AuthProvider>
  );
}
```

### 2. Using the Theme Hook

```jsx
import { useSectorTheme } from '../hooks/useSectorTheme';

function MyComponent() {
  const { currentSector, currentTheme, changeSector, isTransitioning } = useSectorTheme();

  return (
    <div>
      <h1>Current Sector: {currentTheme.name}</h1>
      <button onClick={() => changeSector('healthcare')}>
        Switch to Healthcare
      </button>
    </div>
  );
}
```

### 3. Using Theme Colors

#### CSS Custom Properties (Recommended)

```jsx
// Use Tailwind utility classes
<div className="bg-theme-primary text-white">
  Primary colored background
</div>

<p className="text-theme-text-secondary">
  Secondary text color
</p>
```

#### Direct Theme Access

```jsx
import { useSectorTheme } from '../hooks/useSectorTheme';

function MyComponent() {
  const { currentTheme } = useSectorTheme();

  return (
    <div style={{ backgroundColor: currentTheme.colors.primary }}>
      Custom styled element
    </div>
  );
}
```

### 4. Using Theme Utilities

```jsx
import { 
  getThemeColor, 
  getThemeGradient, 
  getTypography,
  getSpacing 
} from '../config/themes';

// Get specific color
const primaryColor = getThemeColor('banking', 'primary');

// Get gradient classes
const gradientClasses = getThemeGradient('healthcare', 'hero');

// Get typography value
const fontSize = getTypography('logistics', 'fontSizes', 'xl');

// Get spacing value
const spacing = getSpacing('content', 'lg');
```

## Available Theme Properties

### Colors
- `primary` - Main brand color
- `secondary` - Secondary brand color
- `accent` - Accent/highlight color
- `background` - Page background color
- `surface` - Card/surface background color
- `text` - Primary text color
- `textSecondary` - Secondary text color
- `border` - Border color
- `success`, `warning`, `error`, `info` - Status colors

### Typography
- `fontSizes` - xs, sm, base, lg, xl, 2xl, 3xl, 4xl, 5xl
- `fontWeights` - light, normal, medium, semibold, bold, extrabold
- `lineHeights` - tight, normal, relaxed, loose
- `letterSpacing` - tight, normal, wide, wider

### Spacing
- xs (4px), sm (8px), md (16px), lg (24px), xl (32px), 2xl (48px), 3xl (64px), 4xl (96px)

### Border Radius
- none, sm, md, lg, xl, 2xl, full

### Shadows
- sm, md, lg, xl

### Gradients
- primary, secondary, accent, hero

## Tailwind CSS Integration

### Custom Utility Classes

```css
/* Background colors */
.bg-theme-primary
.bg-theme-secondary
.bg-theme-accent
.bg-theme-background
.bg-theme-surface

/* Text colors */
.text-theme-primary
.text-theme-secondary
.text-theme-accent
.text-theme-text
.text-theme-text-secondary

/* Border colors */
.border-theme-primary
.border-theme-border
```

### DaisyUI Themes

Each sector has a corresponding DaisyUI theme:
- `banking` - Professional blue theme
- `healthcare` - Clean green theme
- `logistics` - Dynamic orange theme
- `content` - Creative purple theme

## Automatic Theme Detection

The `SectorThemeProvider` automatically detects the user's sector from `AuthContext` and applies the appropriate theme:

```jsx
// In AuthContext
const { sector } = useAuth(); // { code: 'banking', name: 'Banking & Finance', ... }

// SectorThemeProvider automatically applies the banking theme
```

## Theme Transitions

Theme changes include smooth transitions:

```css
/* Automatically applied during theme changes */
body.theme-transitioning * {
  transition: background-color 0.3s ease-in-out,
              color 0.3s ease-in-out,
              border-color 0.3s ease-in-out;
}
```

## Adding a New Sector Theme

1. Add sector to `SECTORS` constant in `themes.js`:

```javascript
export const SECTORS = {
  BANKING: 'banking',
  HEALTHCARE: 'healthcare',
  LOGISTICS: 'logistics',
  CONTENT: 'content',
  NEW_SECTOR: 'new-sector' // Add new sector
};
```

2. Add theme configuration to `SECTOR_THEMES`:

```javascript
export const SECTOR_THEMES = {
  // ... existing themes
  [SECTORS.NEW_SECTOR]: {
    id: 'new-sector',
    name: 'New Sector',
    description: 'Description of new sector',
    colors: {
      primary: '#hexcolor',
      secondary: '#hexcolor',
      // ... other colors
    },
    typography: { /* ... */ },
    spacing: { /* ... */ },
    borderRadius: { /* ... */ },
    gradients: { /* ... */ },
    shadows: { /* ... */ },
    fonts: { /* ... */ },
    logo: 'new-sector',
    icon: '🆕',
    daisyTheme: 'new-sector'
  }
};
```

3. Add DaisyUI theme to `tailwind.config.js`:

```javascript
daisyui: {
  themes: [
    {
      'new-sector': {
        "primary": "#hexcolor",
        "secondary": "#hexcolor",
        // ... other DaisyUI theme properties
      }
    }
  ]
}
```

## Best Practices

1. **Use CSS Custom Properties** - Prefer `bg-theme-primary` over direct color values
2. **Avoid Hardcoded Colors** - Always use theme colors for consistency
3. **Test All Sectors** - Ensure your components work with all sector themes
4. **Respect Transitions** - Don't interrupt theme transitions
5. **Accessibility** - Ensure sufficient color contrast in all themes

## Examples

See `ThemeDemo.jsx` for comprehensive examples of:
- Sector switching
- Color palette display
- Typography usage
- Component theming
- Responsive design with themes

## Troubleshooting

### Theme not applying
- Ensure `SectorThemeProvider` wraps your component tree
- Check that sector code is valid
- Verify CSS custom properties are loaded

### Transition issues
- Check `ANIMATION_DURATIONS` in themes.js
- Ensure `theme-transitioning` class is properly applied/removed

### Color inconsistencies
- Verify all colors are defined in theme configuration
- Check for hardcoded colors in components
- Ensure Tailwind config includes theme colors

## API Reference

### useSectorTheme()

Returns:
- `currentSector` (string) - Current sector code
- `currentTheme` (object) - Current theme configuration
- `isTransitioning` (boolean) - Whether theme is transitioning
- `changeSector(sectorCode)` - Function to change sector
- `getThemeForSector(sectorCode)` - Get theme for specific sector
- `applyTheme(sectorCode)` - Apply theme to document

### Theme Utility Functions

- `getTheme(sector)` - Get theme object for sector
- `applyThemeColors(theme)` - Apply theme colors to CSS variables
- `getThemeColor(sector, colorKey)` - Get specific color value
- `getThemeGradient(sector, gradientKey)` - Get gradient classes
- `getTypography(sector, category, key)` - Get typography value
- `getSpacing(sector, size)` - Get spacing value
- `getBorderRadius(sector, size)` - Get border radius value
- `getShadow(sector, size)` - Get shadow value
- `isSectorValid(sector)` - Check if sector exists
- `getDaisyTheme(sector)` - Get DaisyUI theme name
- `getThemeStyles(sector)` - Get inline styles object
