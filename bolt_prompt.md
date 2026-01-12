Create a complete web application from scratch called "ProofPols".

Subtitle: "Making trust inspectable"

Purpose:
A demo interface for a trust analysis system that evaluates:
1) Authenticity (origin of content)
2) Credibility (truth of claims)

TECH CONSTRAINTS:
- Use only pure HTML, CSS, and vanilla JavaScript.
- You MAY import lucide icons via their official CDN for icons only.
- No other frameworks or libraries.
- Everything must run locally in the browser.
- Organize code into:
  - index.html
  - style.css
  - app.js

FUNCTIONALITY:

INPUT:
- Allow the user to input:
  - Text (textarea)
  - Image upload
  - Audio upload
  - Video upload
- Only one input active at a time (auto-disable others when one is used).

PROCESS:
- When user clicks "Analyze", simulate a backend call with a timeout.
- During processing show a loading spinner and disable input.

OUTPUT:
Show two independent result panels side by side (stack on mobile):

Panel 1: Authenticity
- Verdict: Likely Real / Likely AI / Likely Edited / Uncertain
- Confidence percentage
- Bullet list of evidence
- Bullet list of limitations

Panel 2: Credibility
- Verdict: Likely True / Likely False / Mixed / Uncertain
- Confidence percentage
- Bullet list of evidence
- Bullet list of limitations

DESIGN:

Branding:
- App name: ProofPols
- Subtitle under name: "Making trust inspectable"

Layout:
- Centered container with max-width.
- Card-based layout for:
  - Input area
  - Each result panel
- Use soft shadows, layered depth, and rounded corners.
- Maintain generous whitespace.

Theme:
- Light/Dark mode toggle in top-right corner.
- Default to system preference.
- Persist user preference in localStorage.
- Light mode:
  - Soft off-white background with subtle gradient or noise texture.
  - Cards in very light gray/white with gentle shadows.
- Dark mode:
  - Near-black background with subtle deep-blue or graphite gradient.
  - Cards in dark charcoal with gentle highlights.

Background:
- Add a subtle multi-tone gradient or radial glow behind the main container.
- Avoid busy or animated backgrounds.

Typography:
- Clear hierarchy: title > section headers > body text > muted helper text.
- Use system UI fonts only (no Google Fonts).

Icons:
- Use lucide icons consistently for:
  - Input mode selector (text, image, audio, video)
  - Analyze button
  - Result panels
  - Evidence and limitation lists
- Icons should be subtle and muted, not colorful or dominant.

Interactions:
- Hover/focus states on buttons and cards.
- Smooth fade/slide animation when results appear.
- Visual confidence indicator (progress bar or meter).

Accessibility:
- Sufficient color contrast in both themes.
- Focus styles for keyboard navigation.

CONTENT:
- Use realistic placeholder results and evidence text.
- Do not overpromise or claim certainty.
- Always show some uncertainty.

DO NOT:
- Add analytics, tracking, or external requests besides lucide.
- Add backend code.
- Add marketing fluff.
- Add gamification, badges, or scores.

The final result should look like a premium, trustworthy enterprise product demo suitable for judges and stakeholders.
