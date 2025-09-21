# PDF Tools Website Design Guidelines

## Design Approach
**Reference-Based Approach** - Drawing inspiration from productivity tools like Notion and Asana, combined with utility-focused design patterns from successful SaaS platforms. This balances professional functionality with approachable user experience.

## Core Design Elements

### Color Palette
**Light Mode:**
- Primary: 220 85% 45% (Professional blue for trust and reliability)
- Secondary: 220 15% 95% (Light gray backgrounds)
- Accent: 15 85% 55% (Warm orange for CTAs and progress indicators)
- Text: 220 25% 15% (Dark charcoal for readability)

**Dark Mode:**
- Primary: 220 75% 65% (Lighter blue for contrast)
- Secondary: 220 25% 12% (Dark gray backgrounds)
- Accent: 15 80% 60% (Slightly brighter orange)
- Text: 220 15% 90% (Light gray text)

### Typography
- **Primary Font:** Inter (Google Fonts) - Clean, modern sans-serif for UI elements
- **Secondary Font:** JetBrains Mono (Google Fonts) - For file names and technical text
- **Hierarchy:** Text-2xl for page titles, text-lg for section headers, text-base for body text

### Layout System
**Tailwind Spacing Units:** Consistent use of 4, 6, 8, 12, 16, 24 for margins, padding, and gaps
- Container max-width: 7xl (1280px)
- Grid systems: 2-3 columns on desktop, single column on mobile
- Generous whitespace with py-12 for major sections

### Component Library

**Navigation:**
- Clean header with logo, tool categories dropdown, and user account
- Sticky navigation with subtle shadow on scroll
- Breadcrumb navigation for tool workflows

**Tool Cards:**
- Grid layout with hover elevation (shadow-lg)
- Icon + title + brief description format
- Rounded corners (rounded-xl) with subtle borders

**File Upload Areas:**
- Large drag-and-drop zones with dashed borders
- Clear visual feedback for hover and active states
- Progress bars with the accent color for processing

**Forms and Inputs:**
- Consistent form styling with focus states
- File input styling to match drag-and-drop aesthetic
- Button hierarchy: Primary (filled), Secondary (outline), Tertiary (ghost)

**Data Display:**
- Clean tables for file lists with alternating row colors
- Status indicators using color-coded badges
- Download buttons with clear iconography

## Visual Treatment

**Gradients:** Subtle gradients from primary to slightly darker shade for hero sections and important CTAs. Use sparingly to maintain professional appearance.

**Background Treatments:** Light geometric patterns or subtle textures in secondary areas. Hero section with minimal gradient overlay on light background imagery.

**Shadows:** Layered shadow system using shadow-sm for subtle elevation, shadow-lg for interactive elements, and shadow-2xl for modals.

## Images

**Hero Section:** Medium-sized hero (not full viewport) featuring abstract document/file processing imagery - flowing documents, transformation graphics, or geometric patterns representing file conversion. Professional stock photography showing productivity themes.

**Tool Icons:** Use Heroicons library for consistent iconography throughout all PDF tools and navigation elements.

**Illustrations:** Minimal line-art style illustrations for empty states and process explanations, maintaining the clean aesthetic.

The design emphasizes clarity, trustworthiness, and efficiency - essential for users processing important documents while maintaining visual appeal through strategic use of color and modern layout principles.