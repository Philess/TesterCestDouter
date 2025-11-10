# Accessibility Rules for Neurodiverse Users

## Core Accessibility Principles (WCAG 2.1 AA)

### 1. Perceivable
- **Text Alternatives**: Provide text alternatives for non-text content
- **Captions and Alternatives**: Provide captions and other alternatives for multimedia
- **Adaptable**: Create content that can be presented in different ways
- **Distinguishable**: Make it easy for users to see and hear content

### 2. Operable
- **Keyboard Accessible**: Make all functionality available from a keyboard
- **Enough Time**: Provide users enough time to read and use content
- **Seizures and Physical Reactions**: Do not design content in a way that is known to cause seizures
- **Navigable**: Provide ways to help users navigate, find content, and determine where they are
- **Input Modalities**: Make it easier for users to operate functionality through various inputs

### 3. Understandable
- **Readable**: Make text content readable and understandable
- **Predictable**: Make web pages appear and operate in predictable ways
- **Input Assistance**: Help users avoid and correct mistakes

### 4. Robust
- **Compatible**: Maximize compatibility with current and future user agents, including assistive technologies

## Specific Guidelines for Neurodiverse Users

### Color and Visual Design
- **Sufficient Contrast**: Minimum 4.5:1 for normal text, 3:1 for large text
- **Color Independence**: Never use color as the only means of conveying information
- **Reduce Visual Clutter**: Minimize unnecessary decorative elements
- **Consistent Visual Patterns**: Use consistent layouts and navigation patterns

### Interactive Elements
- **Clear Focus Indicators**: Visible focus states for all interactive elements (minimum 2px outline)
- **Large Click/Touch Targets**: Minimum 44x44 pixels for touch targets
- **Adequate Spacing**: Sufficient spacing between interactive elements to prevent accidental activation
- **Button Labels**: All buttons must have clear, descriptive labels or aria-labels

### Motion and Animation
- **Reduced Motion**: Respect prefers-reduced-motion settings
- **No Auto-play**: Avoid auto-playing animations or sounds
- **Pause Controls**: Provide controls to pause/stop moving content
- **Limit Flashing**: Avoid flashing content that could trigger seizures (max 3 flashes per second)

### Content Structure
- **Semantic HTML**: Use proper heading hierarchy (h1, h2, h3, etc.)
- **Landmark Regions**: Use ARIA landmarks or HTML5 semantic elements (header, nav, main, footer)
- **Skip Links**: Provide skip navigation links for keyboard users
- **Consistent Navigation**: Keep navigation consistent across pages

### Forms and Input
- **Clear Labels**: All form inputs must have associated labels
- **Error Messages**: Clear, helpful error messages with suggestions for correction
- **Required Fields**: Clearly indicate required fields (not just with color or asterisks)
- **Input Purpose**: Use autocomplete attributes where appropriate

### Dynamic Content
- **ARIA Live Regions**: Announce dynamic content changes to screen readers
- **Loading States**: Provide clear loading indicators and feedback
- **Status Messages**: Announce important status changes
- **No Sudden Changes**: Avoid unexpected context changes without user action

### Text and Readability
- **Font Size**: Minimum 16px for body text, scalable to 200% without loss of functionality
- **Line Height**: Minimum 1.5 for body text
- **Line Length**: Optimal 50-75 characters per line
- **Text Alignment**: Left-aligned for LTR languages (avoid full justification)
- **Plain Language**: Use simple, clear language; avoid jargon

### Cognitive Load
- **Progressive Disclosure**: Break complex tasks into smaller steps
- **Clear Instructions**: Provide clear, step-by-step instructions
- **Confirmation**: Request confirmation for destructive actions
- **Undo/Redo**: Allow users to reverse actions when possible
- **Time Limits**: Avoid time limits or provide options to extend them

### Sensory Considerations
- **Multiple Cues**: Use multiple sensory cues (visual, auditory, haptic) for important information
- **Sound Control**: Provide volume controls and mute options
- **No Audio-Only Content**: Provide text transcripts for audio content
- **Customization**: Allow users to customize their experience (colors, fonts, sounds)

## Testing Checklist

### Keyboard Navigation
- [ ] All interactive elements accessible via keyboard
- [ ] Tab order is logical and predictable
- [ ] Focus visible at all times
- [ ] No keyboard traps
- [ ] Escape key closes modals/dialogs

### Screen Reader Testing
- [ ] All images have appropriate alt text
- [ ] All buttons have descriptive labels
- [ ] Form inputs have associated labels
- [ ] Dynamic content updates announced
- [ ] Error messages are announced

### Visual Testing
- [ ] Sufficient color contrast ratios
- [ ] Content readable with 200% zoom
- [ ] Content reflows without horizontal scrolling
- [ ] Focus indicators visible and clear
- [ ] No flashing content

### Cognitive Testing
- [ ] Instructions are clear and simple
- [ ] Error messages are helpful
- [ ] No unexpected changes of context
- [ ] Time limits can be extended or disabled
- [ ] Consistent navigation patterns

### Motor Skills Testing
- [ ] Click/touch targets are at least 44x44px
- [ ] Adequate spacing between interactive elements
- [ ] No precise timing required for interactions
- [ ] Alternative input methods supported
