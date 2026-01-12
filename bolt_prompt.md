Create a complete web application from scratch called "ProofPols".

Subtitle: "Making trust inspectable"

Purpose:
A demo interface for a trust analysis system that evaluates:
1) Authenticity (origin of content)
2) Credibility (truth of claims)

TECH CONSTRAINTS:
- Use only pure HTML, CSS, and vanilla JavaScript.
- No frameworks, no libraries, no CDN dependencies.
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
- Centered container with max-width
- Card-based layout for:
  - Input area
  - Each result panel
- Subtle shadows and rounded corners
- Plenty of whitespace

Theme:
- Light/Dark mode toggle in top-right corner.
- Default to system preference.
- Persist user preference in localStorage.
- Light mode: white background, light gray cards, dark text.
- Dark mode: near-black background, dark gray cards, light text.

Typography:
- Clear hierarchy: title > section headers > body text > muted helper text.
- Professional sans-serif font stack (system fonts only).

Interactions:
- Hover/focus states on buttons.
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
- Add analytics, tracking, or external requests.
- Add backend code.
- Add marketing fluff.
- Add gamification, badges, or scores.

The final result should look like a real professional product demo suitable for judges and stakeholders.
