# TDAH and Autism Accessibility Rules

## 🧠 Primary Objective
Reduce cognitive fatigue, anxiety, and improve comprehension for neurodivergent users.

---

## 📐 1. Consistent Structure Rules

### Rule 1.1: Predictable Element Positioning
- **Requirement**: Repeat elements in the same order and location on every page
- **Implementation**: 
  - Navigation menus must maintain consistent positioning across all pages
  - Primary action buttons should appear in the same location relative to content
  - Form elements should follow consistent layout patterns
- **Validation**: Element positions should not vary by more than 8px between similar page types
- **WCAG Mapping**: Success Criterion 3.2.3 (Consistent Navigation)

### Rule 1.2: Consistent Terminology and Iconography
- **Requirement**: Use identical words and icons for recurring elements
- **Implementation**:
  - Maintain a design system lexicon for all UI text
  - Use the same icon consistently for the same action across the application
  - Avoid synonyms for interface elements (e.g., don't alternate between "Delete" and "Remove")
- **Validation**: Automated scan for terminology consistency across components
- **WCAG Mapping**: Success Criterion 3.2.4 (Consistent Identification)

---

## 📄 2. Content Clarity Rules

### Rule 2.1: Structured Layout Requirements
- **Requirement**: Organize content into short sections with clear information hierarchy
- **Implementation**:
  - Maximum 3-4 sentences per paragraph
  - One main idea per sentence
  - Use white space to separate content sections
  - Implement progressive disclosure for complex information
- **Validation**: Average sentence length ≤ 25 words, paragraph length ≤ 4 sentences
- **WCAG Mapping**: Success Criterion 3.1.5 (Reading Level)

### Rule 2.2: Descriptive Headings
- **Requirement**: Provide clear, descriptive headings that facilitate navigation
- **Implementation**:
  - Headings should describe the content that follows
  - Use action-oriented language where appropriate
  - Maintain logical heading hierarchy (h1 → h2 → h3)
  - Avoid generic headings like "More Information"
- **Validation**: Headings should form a meaningful outline when extracted
- **WCAG Mapping**: Success Criterion 2.4.6 (Headings and Labels)

### Rule 2.3: Simple Language Requirements
- **Requirement**: Use simple, literal language without metaphors or idioms
- **Implementation**:
  - Write at CEFR B1 level or below (approximately grade 8)
  - Avoid figurative language, sarcasm, or cultural references
  - Define technical terms when first introduced
  - Use active voice over passive voice
- **Validation**: Automated readability testing (Flesch-Kincaid Grade Level ≤ 8)
- **WCAG Mapping**: Success Criterion 3.1.3 (Unusual Words), 3.1.5 (Reading Level)

### Rule 2.4: Explicit Icons with Labels
- **Requirement**: Icons must be explicit and accompanied by visible text labels
- **Implementation**:
  - All functional icons require visible text labels
  - Avoid abstract or ambiguous iconography
  - Use universally recognized symbols when possible
  - Provide tooltips or descriptions for complex icons
- **Validation**: No standalone icons without text labels in interactive elements
- **WCAG Mapping**: Success Criterion 1.1.1 (Non-text Content)

### Rule 2.5: Simplified Numerical Information
- **Requirement**: Present numbers in rounded, simple formats
- **Implementation**:
  - Round numbers to avoid complex fractions and percentages where possible
  - Use "approximately" when exact precision isn't necessary
  - Present percentages as "X out of Y" when clearer
  - Avoid unnecessary decimal places
- **Validation**: Review numerical content for cognitive load
- **WCAG Mapping**: Success Criterion 3.1.5 (Reading Level)

### Rule 2.6: Descriptive Link Text
- **Requirement**: Links must have descriptive text and clear visual indication
- **Implementation**:
  - Link text should describe the destination or action
  - Avoid generic text like "click here" or "read more"
  - Underline links or provide consistent visual differentiation
  - Include context in link text rather than surrounding content only
- **Validation**: All links pass automated accessibility scanner for descriptive text
- **WCAG Mapping**: Success Criterion 2.4.4 (Link Purpose)

---

## 🔕 3. Distraction Reduction Rules

### Rule 3.1: Motion and Animation Control
- **Requirement**: Eliminate or control moving, blinking, or auto-playing content
- **Implementation**:
  - No auto-playing videos or audio
  - No blinking or flashing content (unless essential)
  - Animated content should be subtle and purposeful
  - Respect `prefers-reduced-motion` media query
- **Validation**: All animations can be disabled via user preference
- **WCAG Mapping**: Success Criterion 2.2.2 (Pause, Stop, Hide), 2.3.3 (Animation from Interactions)

### Rule 3.2: User Control Over Dynamic Content
- **Requirement**: Provide user controls to stop, pause, or hide dynamic content
- **Implementation**:
  - Pause/play buttons for any moving content
  - "Reduce motion" toggle in user preferences
  - Ability to disable non-essential animations
  - Static alternatives for animated content
- **Validation**: All dynamic content has accessible control mechanisms
- **WCAG Mapping**: Success Criterion 2.2.2 (Pause, Stop, Hide)

---

## 🧭 4. Memory Independence Rules

### Rule 4.1: Just-in-Time Instructions
- **Requirement**: Provide clear instructions at the moment they are needed
- **Implementation**:
  - Context-sensitive help appears near relevant form fields
  - Instructions visible during task execution, not just at the beginning
  - Step-by-step guidance for complex processes
  - Avoid requiring users to remember instructions from previous pages
- **Validation**: Critical instructions are visible during task execution
- **WCAG Mapping**: Success Criterion 3.3.2 (Labels or Instructions)

### Rule 4.2: Copy-Paste Support
- **Requirement**: Allow copy-paste for passwords, codes, and other input data
- **Implementation**:
  - Do not disable paste functionality on password fields
  - Enable copy-paste for verification codes
  - Support password managers and auto-fill
  - Provide clear feedback when copy-paste is successful
- **Validation**: All input fields support copy-paste unless security requires otherwise
- **WCAG Mapping**: Success Criterion 2.1.1 (Keyboard)

### Rule 4.3: Proactive Information Requirements
- **Requirement**: Inform users of required information before starting forms or processes
- **Implementation**:
  - List all required information at the beginning of forms
  - Provide checklists for document or data preparation
  - Show progress indicators with remaining requirements
  - Preview final requirements before starting multi-step processes
- **Validation**: Users can prepare all required information before beginning
- **WCAG Mapping**: Success Criterion 3.3.2 (Labels or Instructions)

### Rule 4.4: Smart Form Pre-filling
- **Requirement**: Pre-populate form fields with known information
- **Implementation**:
  - Use previously entered information when appropriate
  - Integrate with browser auto-fill capabilities
  - Provide clear indication of pre-filled vs. user-entered data
  - Allow easy modification of pre-filled information
- **Validation**: Known user information is automatically populated
- **WCAG Mapping**: Success Criterion 3.3.7 (Redundant Entry)

---

## ⏳ 5. Time Management Rules

### Rule 5.1: Flexible Time Limits
- **Requirement**: Remove time limits or allow users to adjust them
- **Implementation**:
  - Eliminate arbitrary session timeouts where possible
  - Provide warning before timeout with extension options
  - Allow users to set their own time preferences
  - Save progress automatically to prevent data loss
- **Validation**: Users can complete tasks without time pressure
- **WCAG Mapping**: Success Criterion 2.2.1 (Timing Adjustable)

### Rule 5.2: Form Persistence and Recovery
- **Requirement**: Allow users to save and resume form completion later
- **Implementation**:
  - Auto-save form progress every 30 seconds or on field blur
  - Provide "Save Draft" functionality for long forms
  - Restore form data after session interruption
  - Clear indication of saved vs. unsaved progress
- **Validation**: Form progress is preserved across sessions
- **WCAG Mapping**: Success Criterion 2.2.6 (Timeouts)

### Rule 5.3: Progress Indicators Over Time Estimates
- **Requirement**: Use concrete progress indicators instead of time estimates
- **Implementation**:
  - Show "Step X of Y" instead of "5 minutes remaining"
  - Use progress bars showing completion percentage
  - Indicate number of questions or fields remaining
  - Avoid subjective time estimates that may cause anxiety
- **Validation**: Progress is measured in concrete units, not time
- **WCAG Mapping**: Success Criterion 2.4.8 (Location)

---

## 📋 Implementation Checklist

### Design Phase
- [ ] Layout elements positioned consistently across similar page types
- [ ] Terminology and iconography documented in design system
- [ ] Content structured with clear hierarchy and short sections
- [ ] Icons paired with descriptive text labels
- [ ] Motion and animation minimized and controllable

### Development Phase
- [ ] `prefers-reduced-motion` media query implemented
- [ ] Copy-paste functionality enabled for all input fields
- [ ] Auto-save implemented for forms longer than 3 fields
- [ ] Progress indicators show concrete steps, not time estimates
- [ ] Known information pre-populated in forms

### Content Phase
- [ ] Language tested at grade 8 reading level or below
- [ ] Headings form meaningful outline structure
- [ ] Links contain descriptive text indicating destination/action
- [ ] Numbers rounded and simplified where appropriate
- [ ] Instructions provided at point of need

### Testing Phase
- [ ] Consistency validation across page types
- [ ] Form persistence tested across session interruptions
- [ ] Animation controls tested with assistive technology
- [ ] Cognitive load assessed with neurodivergent user testing
- [ ] Time-sensitive flows tested for flexibility

---

## 🔗 Related Resources

- [WCAG 2.2 Guidelines](https://www.w3.org/WAI/WCAG22/quickref/)
- [Cognitive Accessibility Guidance](https://www.w3.org/WAI/cognitive/)

---

*This document complements the comprehensive accessibility instructions and focuses specifically on TDAH and Autism considerations. Both documents should be used together for complete accessibility coverage.*
