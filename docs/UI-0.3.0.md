# Robot Pulse 0.3.0 — Home and Leaderboard

The approved Home and Leaderboard references are preserved in `docs/reference-v0.3/`.
Four new original image files live in `game/assets/ui-v3/`: the two textless screen
layers, the shared navigation state layer, and a transparent sheet of six robot
finishes. They were derived from the supplied references using built-in image
generation. The alternative standalone Shop frame was rejected because its
geometry differed from the approved bottom navigation.

`game/src/menu-art.js` and `game/assets/ui-v3/manifest.json` define reusable sprite
rectangles for the battery, HUD, six navigation states, six robots, tabs, level
nodes, upgrade cards, Play button, podiums and ranking rows. CSS clips the original
PNGs; the source pixels are not destructively cropped. The fixed design size is
887 × 1774. Each whole screen scales proportionally to fit the available viewport,
with the hangar filling the remaining space and no scrolling on the menu screens.

All values, headings, buttons and labels are live HTML text with English and
Spanish translations. Only the ROBOT PULSE brand is painted into the art. The
battery uses the approved simple blank cyan cell with a single outlined white
digit centered over it. MAX changes to the real minutes until the next charge.
The same header and navigation components are shared with Shop.

Home launches/resumes/replays the existing playable level 1. The reference's
illustrative 10/11/12 numbers become 1/2/3 to match actual game availability.
Future levels and the four locked upgrades open the existing explanation.
Selecting an owned robot finish changes the Home character and personal ranking
character. The engine and queue rules are unchanged.

Leaderboard displays the real local score, sorts the player into the podium/list,
and pins the personal row. Monthly and all-time scores are stored separately;
the monthly value rolls over at UTC calendar-month boundaries while career best
survives. The timer counts down to that same boundary. Region filters select
different offline fixtures, with a visible local/sample-opponents note. There
is no multiplayer backend and no live worldwide ranking claim. Tapping a row
shows its score and this local-mode explanation.

Music, button effects, Shop demo purchases, saved games and EN/ES remain connected.
The app launcher icon is unchanged; this task concerns the two menu screens.

Validation: 14 existing engine/profile tests plus 3 monthly-ranking tests. Browser
and native Android checks exercise the illustrated menus, filters, actual rank
changes, battery digits 0–5, language switching, saved play, audio and Shop.
See `docs/VERIFICATION.md` for the completed build evidence and limitations.
