// Self-hosted webfonts — bundled by Astro/Vite and served from the site's own origin.
//
// The approved Claude Design renders its display + body text in SYSTEM fonts
// (SF Pro / PingFang via -apple-system), and uses only Space Mono as a real webfont
// (eyebrows / dates / tags / code). We match that intent: --display and --sans are system
// stacks in global.css, so the only family we need to vendor is Space Mono.
//
// Google Fonts (fonts.googleapis.com / fonts.gstatic.com) is blocked/unreliable in mainland
// China, so Space Mono is vendored via @fontsource (same-origin) rather than a runtime <link>.
// The family name 'Space Mono' matches the --mono stack in global.css verbatim.

// Space Mono — eyebrows / dates / tags / code. Weights 400/700.
import '@fontsource/space-mono/400.css';
import '@fontsource/space-mono/700.css';
