# Review Notes - Round 2

## Issue: Inspiration image still has white/light background
- The invert + hue-rotate + screen blend mode approach is not working well
- The image still appears with a light/grey background that clashes with the dark theme
- Need a different approach: use CSS filter to darken the background or use a dark overlay

## Fix approach:
- Remove the invert/hue-rotate approach
- Instead, place the image on a dark background div
- Use mix-blend-mode: lighten (which will make white areas transparent against dark bg)
- Or simply use a dark background container and let the teal/gold colors pop
