# poi-plugin-auto-refresher

Avoid unwelcome nodes or edges by refreshing. Use at your own risk.

This works by matching edges or nodes according to some preset rules,
then call poi's own functionality to reload Flash.

For details about how configs are written, see [`docs/config.md`](docs/config.md)

## Changelog

### 0.3.1

- Update for react-bootstrap

- Use a different font in map picker if a map already contains some rules.

### 0.3.0

- UI and rework on underlying mechanism.

- Config import / export feature are removed due to rarely being used.

- Migrate to a file-based config (no action required for users)
