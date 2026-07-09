---
version: alpha
name: EMBER & ASH
description: A premium, minimalist, and futuristic e-commerce platform for luxury custom furniture. 
  The visual language blends the raw organic beauty of nature with refined structural modernism. 
  Deep organic tones and a warm light-cream floor hold confident, elegant serif display type, 
  while product interfaces utilize generous spacing, strict 1px hairline borders, and tactile bouclé 
  and wood texture shots to create a "Warmth Meets Design" experience.

colors:
  # Primary Colors (Re-checked from Brand Guidelines Image 1)
  linen: "#DFD9CD"          # Light organic cream [Corrected RGB: 223, 217, 205]
  sand: "#AC9368"           # Warm timber tan [RGB: 171, 145, 103 / CMYK: 33, 39, 66, 5]
  sage: "#656C54"           # Grounding muted green [RGB: 102, 108, 85 / CMYK: 58, 44, 67, 23 - Main brand accent]
  
  # Secondary Colors (Re-checked from Brand Guidelines Image 2)
  beige: "#C1B59A"          # Muted gold-beige [RGB: 192, 181, 153 / CMYK: 26, 24, 41, 0]
  olive: "#6E6852"          # Deep brown-olive [RGB: 110, 104, 82 / CMYK: 53, 48, 67, 24]
  chinois-green: "#898C7C"  # Slate sage green [RGB: 137, 140, 124 / CMYK: 48, 37, 51, 6]
  highland: "#848E5F"       # Mossy olive green [RGB: 132, 142, 95 / CMYK: 50, 32, 72, 8]
  
  # UI Core Roles
  primary: "#656C54"        # Sage acts as the main brand accent color
  ink: "#1B1A17"            # Deep charcoal for maximum contrast serif headlines
  body: "#3D3A33"           # Soft charcoal for readable body copy
  muted: "#7A7568"          # Mid-tone gray-brown for captions and passive metadata
  canvas: "#FFFAF1"         # Universal warm pale-cream page floor (Light Beige)
  surface-card: "#FFFFFF"    # Pure white surface plates for interactive UI cards
  hairline: "#DFD9CD"        # Linen used for precise, minimal 1px borders
  on-primary: "#FFFFFF"      # White contrast text for active states/buttons

typography:
  display-lg:
    fontFamily: "'Rosehot', 'Didot', 'Bodoni MT', serif" # Premium high-contrast serif
    fontSize: 56px
    fontWeight: 500
    lineHeight: 1.10
    letterSpacing: -1.5px
  display-md:
    fontFamily: "'Rosehot', 'Didot', 'Bodoni MT', serif"
    fontSize: 36px
    fontWeight: 500
    lineHeight: 1.20
    letterSpacing: -0.5px
  body-md:
    fontFamily: "'Inter', sans-serif"                     # Clean geometric sans-serif for UI
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.60
    letterSpacing: 0
  button:
    fontFamily: "'Inter', sans-serif"
    fontSize: 14px
    fontWeight: 500
    lineHeight: 1
    letterSpacing: 0.05em                                # Tracked out for modern luxury feel
  caption:
    fontFamily: "'Inter', sans-serif"
    fontSize: 12px
    fontWeight: 400
    lineHeight: 1.40
    letterSpacing: 0

rounded:
  none: 0px                                              # Strict adherence to sharp structural architecture
  sm: 4px
  md: 8px
  lg: 24px                                               # Soft rounding specifically for organic curved sofa cards
  full: 9999px

spacing:
  xs: 4px
  sm: 8px
  md: 12px
  base: 16px
  lg: 24px
  xl: 40px
  section: 96px                                          # Generous whitespace for premium look

components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.button}"
    rounded: "{rounded.none}"                            # Architectural sharp corners
    padding: 14px 28px
  card-product:
    backgroundColor: "{colors.surface-card}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"                            # Strictly frame photography without rounded corners
    padding: 24px
  sidebar-nav-item-active:
    backgroundColor: "transparent"
    textColor: "{colors.primary}"
    typography: "{typography.button}"
    borderBottom: "2px solid {colors.primary}"
----

## Overview

EMBER & ASH operates as an editorial-grade luxury e-commerce interface where minimalism acts as an engineering principle. The layout philosophy treats the viewport like a gallery wall—trusting a warm, low-glare light cream floor `{colors.canvas}` to hold heavy ink typography without needing to fill whitespace with artificial blocks or heavy shadows.

The digital experience must feel as tactile as the custom furniture itself. We achieve this by anchoring user interaction with a grounded palette of Sage, Sand, and Linen, paired with raw product imagery that highlights the exquisite grain of solid woods and the heavy loops of bouclé fabrics.

**Key Characteristics:**
- **Strict Anti-Averaging:** No generic purple-blue gradients or bubbly, over-rounded cards. Layouts are grounded in sharp-edged architectural structures (`{rounded.none}`) paired with organic product curves.
- **Zero Drop Shadows:** Depth is engineered flat. Content matrices partition themselves cleanly via 1px `{colors.hairline}` borders, preserving a minimalist, high-end editorial rhythm.
- **High-Contrast Editorial Typography:** Large headings utilize the premium serif typeface Rosehot to signal custom craft, while functional content immediately falls back to highly legible, clean geometric sans-serif grids.

## Colors

### Brand & Accent
- **Sage** (`{colors.primary}` — #656C54): The visual core. Represents the organic flora underlying the brand ethos. Used intentionally on primary navigation states, active UI borders, and key checkout flows.
- **Sand** (`{colors.sand}` — #AC9368): Secondary accent. Evokes raw timber tones and warmth. Used on premium interactive tags or sub-branding moments.

### Surface & Hairlines
- **Canvas** (`{colors.canvas}` — #FFFAF1): The universal page floor. A deeply soothing, premium off-white that allows text to pop elegantly without causing the optical fatigue of pure #FFFFFF.
- **Surface Card** (`{colors.surface-card}` — #FFFFFF): Pure white modules engineered to float mathematically exactly half a step above the canvas background.
- **Hairline** (`{colors.hairline}` — #DFD9CD): Linen-toned 1px boundaries. Used to outline interactive cards, input frames, and section dividers without generating structural noise.

### Core Text
- **Ink** (`{colors.ink}` — #1B1A17): Absolute dark for structural headlines and high-priority branding.
- **Body** (`{colors.body}` — #3D3A33): Softer tone allocated for dense item descriptions and editorial blocks.

## Typography

### Principles
The typography scale deliberately enforces a stark contrast between structural serif headings and functional sans-serif system copy. Display ranks utilize tight tracking (`-1.5px`) because high-end serif titles must lock together like custom-jointed carpentry. Body copy expands tracking and increases line height to ensure absolute ease of reading alongside rich product visuals.

### Note on Font Substitutes
If the licensed face `Rosehot` is unavailable in the environment, fallback chains MUST immediately prioritize `Didot` or `Bodoni MT` to maintain the serif display weight. Never compromise by auto-rendering headings in standard system sans-serif font trees.

## Layout

### Whitespace Philosophy
Luxury is defined by breathing room. Sections are bounded by an expansive `{spacing.section}` scale to give product lines isolated prominence. Grid alignments must follow strict, unyielding alignment guides—the vertical edges of text items must align flush with product image borders to generate structural stability.

### Page Spacing (Product Catalog & Home Pages)
For major editorial layout interfaces—specifically the **Product Catalog/List page** and the **Homepage**—the design system enforces generous left and right horizontal padding. Elements must never touch the absolute screen edge or feel crowded. Desktop layouts must reserve wide, intentional outer borders (e.g., utilizing `px-6 md:px-12 lg:px-[96px]` or bounding content within a maximum width of `max-w-[1600px] mx-auto px-10`) to frame the product grids within premium whitespace.

## Elevation

### Surface Tiers
This system rejects traditional 3D volumetric rendering, blurs, and standard CSS drop shadows. 
- **Tier 1 (Base):** Universal page canvas (`{colors.canvas}`).
- **Tier 2 (Interactive):** Floating white plates (`{colors.surface-card}`) separated by a strict 1px solid `{colors.hairline}` border.

## Logo Design & Usage Rules
*(Verified from Brand Guideline Sheet 14)*

AI Agents writing code or assembling UI matrices must adhere strictly to the following brand boundaries regarding the logo artwork and wordmark:
- **X Do not stretch or compress:** The structural proportion of the overlapping `e + a` emblem must remain mathematically pristine.
- **X Do not bolden:** Never artificial-weight or bold the Rosehot type vectors.
- **X Do not resize any element:** Logo text and emblem must always scale together.
- **X Do not change the typeface:** Never substitute the logo signature font face.
- **X Do not use two different colors:** The wordmark and emblem must always execute in a single uniform color role per frame.
- **X Do not outline:** The emblem must render as solid shapes; never apply transparent fills with stroke outlines.

## Components

**`button-primary`**  
The signature custom interaction point. Renders with background `{colors.primary}`, text `{colors.on-primary}`, typography `{typography.button}`, with absolute sharp edges (`{rounded.none}`) and generous interior padding (14px × 28px).
- **Active / Press State:** Shift background slightly deeper to `{colors.olive}`.

**`card-product`**  
The visual display framework for individual chairs and sofas. Background `{colors.surface-card}`, framed tightly by a 1px solid `{colors.hairline}` perimeter. Typography within the card uses `{typography.display-md}` for the piece title and `{colors.body}` for materials specification copy. 

## Responsive Behavior

| Name | Width | Key Changes |
|---|---|---|
| Mobile | < 768px | Global padding shrinks to `{spacing.base}`; display headings compress from 56px to 32px; product detail grids stack into single-column layouts. |
| Desktop | ≥ 1024px | Full grid system active; sections isolated by `{spacing.section}`; sticky sidebar filtering panel remains locked to left boundary. |

## Known Gaps
- Micro-interaction animation transition curves are out of scope for this version.
- Dark-mode alternative color mappings are completely undocumented; the platform operates strictly on the warm luxury light canvas configuration.