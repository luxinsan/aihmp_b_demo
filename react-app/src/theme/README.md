# Theme Rules

This project now uses a single theme chain for UI color work:

`Antd ConfigProvider token -> --q-* CSS variables -> workspace/page styles`

Rules:

- Add or change semantic colors in [AppThemeProvider.tsx](/Users/luxinsan/Documents/工作/iWork/Code/AI%20HMP/aihmp_b_demo/react-app/src/theme/AppThemeProvider.tsx:1).
- Consume `--q-*` variables in page-level or component-level CSS.
- Use legacy workspace variables like `--text`, `--line`, `--primary` only when touching existing root `styles.css` areas that still depend on them.
- Do not introduce new hard-coded `#xxxxxx` or `rgba(...)` business colors in feature styles.
- Decorative highlights, shadows, and white overlays are acceptable only when they are not semantic state colors.

Migration guidance:

- New page styles should define page aliases from `--q-*` only if the page needs a local token layer.
- When refactoring old workspace styles, prefer replacing direct colors with existing bridge vars first, then collapse to `--q-*` when the area is stable.
