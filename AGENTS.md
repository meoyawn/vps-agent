# AGENTS.md

## Project vocab/refs

- vps: [remote VPS](ansible/inventory/hosts.yaml)
- [Taskfile](Taskfile.yaml)
- [README](README.md)

## Rules

- Never install CLI tools as npm packages. Treat npm package installation as a high security risk. Install pinned native binaries and verify their checksums instead.
- `nub` / `nubx` are already provisioned by Ansible. Do not replace them with `npx`, `bunx`, or another package runner.
- Keep existing Bun-backed repository tooling unchanged; do not use Bun for Node/T3 workflows.
- never write yaml extension as `.yml`, do `.yaml`
- never skip running `task verify` after `ansible/**/*` change
- never run `task verify` when working with `git`
- never use `pip`, use `uv`
- never use `bash` in Markdown code blocks, use `sh` instead
- never leak IPs or secrets in git history, this repo is open source
- never change task names in Taskfile without syncing those task names in README
