# AGENTS.md

- [project progress](progress.md)

## Rules

- never use `node`, use `bun`
- never write yaml extension as `.yml`, do `.yaml`
- never change `ansible/**/*` without running `task verify`
- never change `Taskfile.yml` without running `task check`
- never use `pip`, use `uv`
- never use `bash` in Markdown code blocks, use `sh` instead
- never leak IPs or secrets in git history, this repo is open source

## Project vocabulary

- vps: [remote VPS](ansible/inventory/hosts.yaml)
