# Slice notes — merge and delivery (corrected)

Notes for syncing steppi with [earendil-works/pi](https://github.com/earendil-works/pi). **Do not** force-push `main` or push release tags casually; land work via **feature branch + PR**.

## Upstream sync (maintainers)

```bash
git remote add upstream https://github.com/earendil-works/pi.git 2>/dev/null || true
git fetch upstream main --tags
git checkout -b cursor/<topic>-295f
# merge or rebase upstream onto product branch as needed; open PR to donggrri/steppi main
```

## Provider packages

- `donggrri/pi-cursor-provider` — `/login cursor`
- `donggrri/pi-antigravity-bridge` — requires **`agy`** on `$PATH`
- **grok** — document **`grok` → xai** in [PROVIDER_WIRE.md](PROVIDER_WIRE.md); implement via `packages/steppi`, not a fictional `providerAliases` settings key

## Verification

```bash
npm install && npm run build
./packages/coding-agent/dist/cli.js --version
npm run test --workspace=@earendil-works/pi-coding-agent -- steppi-slice1-providers
```

Record optional live smoke in [SLICE.md](SLICE.md). Tag releases only after explicit product release policy—not as part of every upstream sync.
