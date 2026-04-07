# Linux User Strategy

## Users

- `root`: transport and provisioning user.
- `cursor`: runtime user for the agent, workspace, and user-scoped tools.

## Rules

1. Ansible connects to the VPS as `root`.
2. Ansible may use `root` for host-level changes only:
   package installation, user/group management, filesystem ownership, and system configuration.
3. Anything that reads or writes the workspace, installs per-user tooling, runs `agent`, or manages `tmux` must run as `cursor`.
4. Manual interactive work on the VPS should also happen as `cursor`, not `root`.

## Tmux

- The laptop connects to the VPS as `root`, then switches to `cursor` before starting or attaching to `tmux`.
- The `tmux` server and every shell, window, and pane inside it run as `cursor`.
- If a command inside that `tmux` session uses SSH, it uses the `cursor` account and `cursor`'s home directory unless explicitly escalated.

## Goal

`root` exists to apply configuration. `cursor` is the normal execution boundary. This keeps the writable workspace and the agent's tools away from the most privileged account and limits damage from mistakes or compromised tooling.
