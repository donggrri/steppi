# Glossary

## steppi

The product built as a Pi-engine fork/workspace at this repo. Day-to-day UI is the **dashboard TUI**. Not a rename of dmuxai.

## Provider

A selectable model/agent backend inside steppi/Pi. Slice 1 providers are exactly three: **cursor**, **antigravity**, and **grok**.

## Dashboard TUI

The product UI for early slices: Pi's **default agent TUI** (extend only as needed). Provider selection and status use Pi's stock UI mechanisms first; do not invent a parallel steppi-only chrome for picking providers. Still must surface selected provider among cursor/antigravity/grok and turn/run status (FR-114/115). Not a web UI.

## Stock Pi packages

Packages shipped by upstream `earendil-works/pi`. steppi must keep them usable; steppi work is additive (providers, builtins, optional TUI package).

## Cursor (provider)

Provider id `cursor`. Runs turns through the **Cursor SDK** (not a fake HTTP stand-in for the Cursor CLI).

## Antigravity (provider)

Provider id `antigravity`. Prefer an existing Pi-compatible package; if intent does not match, create a steppi package that drives Antigravity **headless**.

## Grok (provider)

Provider id `grok`. User **logs in** via a flow entered from the dashboard TUI; after success, turns use that account. Reuse an existing auth module internally when one matches; do not silently fall back to another provider on auth failure.

## Pi defaults

Unless steppi explicitly extends or replaces a behavior, steppi follows upstream Pi's stock UX, strings, session/credential conventions, and TUI mechanisms. steppi additions stay additive.

