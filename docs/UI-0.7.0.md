# Robot Pulse visual and audio corrections 0.7.0

This version addresses the owner's screenshots and recording of 0.6.0. It keeps the approved puzzle, robot, opening and running mine animation, and changes the controls and transitions identified in that review.

## Requested corrections

1. Illustrated battery housing shared by the menus and the puzzle, with a live recharge countdown.
2. One gold coin with the pulse emblem for balances, rewards and collection.
3. Restore the original angular locked feature tile at the upper left of HOME.
4. Add a separate illustrated mine doorway beside the robot, available after the mining card is earned. Its name is translated by code.
5. Reduce dialog action height while retaining wide shapes and legible text.
6. Keep every action inside the frame's decorative rails and footer.
7. Center dialog titles and increase their design size from 24 to 30 pixels.
8. Remove the mismatched patch behind the in-game HUD.
9. Remove the additional Robot Pulse logos from SHOP and both LEADERBOARD views.
10. Recompose the victory frame's upper right corner without an unused close-button socket.
11. Replace the rectangular dragged scene fragment with an isolated transparent mining sprite.
12. Point a compact metal/cyan tutorial arrow at the mine's catalogue icon.
13. Reuse illustrated product frames in the construction catalogue.
14. Use matching illustrated plaques for the mining header, state and instructions.
15. Assemble the mine with phased components, climbing energy circuits and particles instead of a flat wipe.
16. Show stored gold separately from the coin payout, using a matching collection button.
17. Initial economy adjustment: one gold per minute, five coins per gold, storage for 120 gold (two hours, 600 coins). Previously stored gold above this capacity remains collectible at its original five-coin value. Overflow time is not banked for an immediate second payout after collection.
18. Package the owner's `game-ball-tap-2073.wav` unchanged for button taps. Music gain changes from 0.34 to 0.255, exactly 25 percent lower.
19. Digitize the first earned mining card with a discrete reveal, scan edge and small data particles before its existing diagonal sheen. Respect reduced motion.

## Compatibility

Package, preview signing certificate, profile key and first-level revision are preserved. The three approved mining animation modules remain byte-identical to their preview copies. Wagon filling remains visual and independent of the slower economy. No real purchases, advertisements, online ranking or new playable levels are introduced.

## Verification

Deterministic tests include legacy balances, capped storage, repeat collection and resumed production. Browser checks cover English and Spanish dialogs, touch drag/cancel, card claiming, collection, offline restoration and actual first-level victory. The Android release workflow checks the installed APK offline, including the supplied sound, reduced music volume, real elapsed production, native gestures and the existing signature. Final evidence and build identifiers are recorded after the release checks complete.
