# Codex Ansible Role Implementation Plan

## Success Criteria

- Create a new `codex` role under `ansible/roles/codex`.
- Role manages Codex config for `{{ agent_user }}` at `{{ agent_home }}/.codex/config.toml`.
- Role merges useful local macOS Codex preferences with current remote VPS Codex config.
- Role manages `{{ agent_home }}/.codex/hooks.json` with the requested caveman `SessionStart` hook.
- Apply the role from `ansible/vps.yaml`.
- Add smoke checks in `ansible/verify.yaml` that prove managed Codex files exist and are not empty.
- Do not change `Taskfile.yaml`.
- Do not run `task apply`, `task verify`, or equivalent live VPS verification until a human does the required pre-step.

## Observations

- `ansible/group_vars/all/main.yaml` already defines the user and paths needed by the role:
  `agent_user`, `agent_group`, `agent_home`, `agent_workspace_root`, and `agent_path`.
- Existing roles follow the layout `ansible/roles/<role>/tasks/main.yaml`, with optional `defaults`,
  `files`, and `templates`.
- `ansible/vps.yaml` already installs Codex globally through Bun before verification, but Codex config
  is not currently managed.
- `ansible/verify.yaml` already checks `codex --version` and Codex PATH behavior, so new smoke tests
  can focus on managed config artifacts.
- Local macOS config contains machine-local paths and marketplace cache paths that should not be copied
  verbatim to VPS.
- Remote VPS config contains the correct VPS project paths under `/home/cursor/...`.

## Merged Config Target

Manage `config.toml` with these rules:

- Keep VPS execution preference:
  `model = "gpt-5.5"` and `model_reasoning_effort = "xhigh"`.
- Add portable local preferences:
  `personality = "pragmatic"` and `project_doc_fallback_filenames = ["CLAUDE.md"]`.
- Merge feature flags:
  `multi_agent = true`, `remote_connections = true`, `remote_control = true`,
  `codex_hooks = true`, and `goals = true`.
- Keep remote project trust entries:
  `/home/cursor/workspace/responsible2`, `/home/cursor/workspace/vps-agent`,
  `/home/cursor/workspace/agent`, `/home/cursor/.codex`,
  `/home/cursor/workspace/recurring`, and `/home/cursor/workspace/responsible`.
- Keep `[tui.model_availability_nux]` with `"gpt-5.5" = 4`.
- Enable compatible plugins already used on the VPS:
  `gmail@openai-curated` and `github@openai-curated`.
- Add portable MCP servers from local config:
  `code-review-graph` via `uvx code-review-graph serve`, and
  `openaiDeveloperDocs` via `https://developers.openai.com/mcp`.
- Do not include local macOS project trust paths, local plugin cache paths, marketplace timestamps,
  or the commented local macOS `notify` command.

## Files To Add

- `ansible/roles/codex/defaults/main.yaml`
  - Define:
    `codex_config_dir`, `codex_config_path`, `codex_hooks_path`,
    `codex_model`, `codex_model_reasoning_effort`, `codex_personality`,
    `codex_project_doc_fallback_filenames`, `codex_trusted_projects`,
    and `codex_enabled_plugins`.
- `ansible/roles/codex/templates/config.toml.j2`
  - Render the merged TOML deterministically from defaults.
  - Quote all paths and plugin names.
  - Keep comments only where they explain `remote_connections` plus `remote_control`.
- `ansible/roles/codex/files/hooks.json`
  - Store the requested `SessionStart` hook JSON exactly, except for formatting if needed.
- `ansible/roles/codex/tasks/main.yaml`
  - Ensure `{{ codex_config_dir }}` exists with owner `{{ agent_user }}`,
    group `{{ agent_group }}`, and mode `0755`.
  - Template `config.toml` to `{{ codex_config_path }}` with mode `0644`.
  - Copy `hooks.json` to `{{ codex_hooks_path }}` with mode `0644`.

## Files To Edit

- `ansible/vps.yaml`
  - Import the new `codex` role after fish configuration and before cursor-scoped tooling, or after
    cursor-scoped tooling if the role should run only once all Codex-related directories and PATH
    tooling are already present.
  - Prefer after fish and before cursor-scoped tooling because the role only writes files under
    `{{ agent_home }}` and does not depend on Codex binary installation.
- `ansible/verify.yaml`
  - Add `stat` tasks for `{{ agent_home }}/.codex/config.toml` and
    `{{ agent_home }}/.codex/hooks.json`.
  - Assert both files:
    exist, are regular files, are owned by `{{ agent_user }}`, have mode `0644`,
    and have `size > 0`.
  - Place checks near the existing Codex verification tasks.

## Implementation Steps

1. Create `ansible/roles/codex/defaults/main.yaml` with Codex paths and merged config data.
2. Create `ansible/roles/codex/tasks/main.yaml` using `file`, `template`, and `copy`.
3. Create `ansible/roles/codex/templates/config.toml.j2`.
4. Create `ansible/roles/codex/files/hooks.json`.
5. Wire role into `ansible/vps.yaml` with `ansible.builtin.import_role`.
6. Add non-empty file smoke checks to `ansible/verify.yaml`.
7. Run only local static checks that do not apply to VPS if needed, such as YAML/TOML/JSON inspection.
8. Stop before `task apply`, `task verify`, or live smoke tests until human confirms the VPS is ready.

## Human Pre-Step Before Verification

Human needs to complete the required external step before agent runs live verification. Current request
does not specify the exact pre-step, so implementation should leave verification pending and report that
`task verify` was intentionally not run.

After human confirms readiness, run:

```sh
task verify
```

## Residual Questions

- Should VPS also enable `documents`, `spreadsheets`, `presentations`, and `browser-use` plugins in
  `config.toml`, even though current remote config only enables Gmail and GitHub?
- Should the role verify or install MCP dependencies for `code-review-graph`, or should Codex launch
  `uvx code-review-graph serve` on demand?
