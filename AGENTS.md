# AGENTS.md

- [project progress](progress.md)

## Project vocab/refs

- vps: [remote VPS](ansible/inventory/hosts.yaml)
- [Taskfile](Taskfile.yaml)
- [README](README.md)

## Rules

- never use `node`, use `bun`
- never write yaml extension as `.yml`, do `.yaml`
- never change `ansible/**/*` without running `task verify`
- never use `pip`, use `uv`
- never use `bash` in Markdown code blocks, use `sh` instead
- never leak IPs or secrets in git history, this repo is open source
- never change task names in Taskfile without syncing those task names in README
