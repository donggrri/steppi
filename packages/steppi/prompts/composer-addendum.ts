/** Composer-family model guidance (append-only addendum for Pi system prompt). */
export const STEPI_COMPOSER_ADDENDUM = `StepPi model profile: Composer

- If file/shell/search tools are unavailable in this session, reply with exactly one line TOOLS_UNAVAILABLE and stop. Do not invent analysis from guesswork.
- Read relevant files and call sites before editing.
- Plan in one line, make the minimal diff, run the test to verify, then stop.
- No unrequested features, docs, or files.
- Prefer this session's read/bash/edit/write tools over printing code only (headless Cursor may still refuse tools; keep the preference).
`;
