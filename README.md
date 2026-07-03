# vps-agent

Run the agent on a VPS so you can close your laptop.

**vps-agent** provisions an Ubuntu 24.04 ARM64 or x86_64 VPS for agent work, focused on [Codex remote connections](https://developers.openai.com/codex/remote-connections). It also sets up a persistent **tmux** shell, **mosh** support, tightened [**sshd** defaults](ansible/roles/sshd/), Docker, Bun, uv, Task, mise, Omnara, and local Codex skills/plugins.

## Prerequisites

### On laptop

- **[taskfile.dev](https://taskfile.dev/installation/)**.
- [**ansible-core**](https://docs.ansible.com/ansible/latest/installation_guide/intro_installation.html) and [**ansible-lint**](https://ansible.readthedocs.io/projects/lint/). Recommended with [uv](https://docs.astral.sh/uv/):

  ```sh
  uv tool install ansible-core
  uv tool install ansible-lint
  ```

- Local SSH config and keys under **`~/.ssh/`**. Provisioning syncs SSH files while excluding `known_hosts*`, `authorized_keys`, and sockets, then builds `/home/agent/.ssh/authorized_keys` from the synced public keys.
- Local Git config at **`~/.gitconfig`**. Provisioning syncs it to the agent user so commits have the same author identity.
- Local fish config under **`~/.config/fish/`** if you want it mirrored to the VPS.
- Local Codex skills/plugins under **`~/.codex/skills/`** and **`~/.codex/plugins/`** if you want them mirrored to the VPS.
- A local SSH config entry for the Codex remote connection:

  ```sshconfig
  Host devbox-agent
    HostName <your-vps-ip-or-hostname>
    User agent
    IdentityFile ~/.ssh/id_ed25519
    IdentitiesOnly yes
  ```

### VPS

- Provision **Ubuntu 24.04** on **ARM64** or **x86_64**.

## Apply config

1. Create an inventory file at **`ansible/inventory/hosts.yaml`**. It is gitignored on purpose. Copy the example and edit it for your VPS; the group must be **`vps`** because the playbooks target that group.

   ```sh
   cp ansible/inventory/hosts.example.yaml ansible/inventory/hosts.yaml
   ```

2. Run **`task apply`** once the inventory is ready.

3. Run **`task verify`** after provisioning changes.

## Workflow

Priorities:

1. Codex desktop app.
2. `tmux`.
3. `mosh` + `tmux`.
4. Zed remote projects.

For Codex remote sessions, use the **`devbox-agent`** SSH host and choose a remote project folder under **`/home/agent/workspace/`**. Verify the connection from the laptop with:

```sh
ssh devbox-agent 'fish -lic "whoami; command -v bun; command -v codex; codex --version; test -d ~/workspace"'
```

- Clone repositories under **`~/workspace/`** on the VPS. That directory is created for the `agent` user so project paths stay in one place.
- Manual login is expected for `gh`, Codex, and Omnara after provisioning.
- Use as many **tmux** windows (tab-like) or **panes** (splits in the same window) as you need, each in a different repo or working tree.
- Use **mosh** when mobile or unstable networking matters, then attach to **tmux** inside it. See [orphaned Mosh notes](docs/orphaned-mosh.md) if disconnects leave stale sessions.
- Zed remote projects are supported, but lowest priority here. Current tooling is still undercooked: Zed remote can orphan `codex-acp` on disconnect and brick the session. See [Zed notes](docs/zed.md).

If sessions wedge or disconnected agents leave processes behind, look in [docs](docs/). Known cases include Codex desktop app leaving orphaned processes on disconnect and `codex` inside `tmux` sometimes breaking; see [tmux notes](docs/tmux.md).

### Linux user vs tmux session

For shell sessions, run **`task tmux`**; [Taskfile](Taskfile.yaml) connects as Linux user `agent` and attaches tmux session `macos`.

For Moshi/mosh clients, rely on the Linux user being `agent`, not on a fixed tmux session name. Mobile clients may attach existing tmux sessions without giving us full control over the session name.

## Maintenance

- **`task update`** — Updates packages and user-scoped tools on the already-provisioned host.
