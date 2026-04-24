# vps-agent

Run the agent on a VPS so you can **close the laptop** and get on with whatever else you are doing.

**vps-agent** is the Ansible side of that: provision an Ubuntu VPS with [Cursor Agent CLI](https://cursor.com/blog/cli) and a persistent shell session you can leave attached remotely.

## Prerequisites

### On laptop

- **[taskfile.dev](https://taskfile.dev/installation/)**.
- [**ansible-core**](https://docs.ansible.com/ansible/latest/installation_guide/intro_installation.html) and [**ansible-lint**](https://ansible.readthedocs.io/projects/lint/). Recommended with [uv](https://docs.astral.sh/uv/):

  ```sh
  uv tool install ansible-core
  uv tool install ansible-lint
  ```

- **[GitHub CLI](https://cli.github.com/) (`gh`)** — used during provisioning (registering SSH keys with GitHub).
- A working GitHub login for that CLI: **`gh auth status`** must succeed before you run playbooks that talk to GitHub.
- A local SSH key at **`~/.ssh/id_rsa`** with public key **`~/.ssh/id_rsa.pub`**. The playbook authorizes this public key for the `cursor` user so Codex can SSH to the VPS directly.
- A local SSH config entry for the Codex remote connection:

  ```sshconfig
  Host devbox-agent
    HostName <your-vps-ip-or-hostname>
    User cursor
    IdentityFile ~/.ssh/id_rsa
    IdentitiesOnly yes
  ```

### VPS

- Provision **ARM64 Ubuntu 24.04**.

## Apply config

1. An inventory file at **`ansible/inventory/hosts.yaml`**. It is gitignored on purpose. Copy the example and edit it for your VPS; the group must be **`vps`**—that is what the playbooks target.

   ```sh
   cp ansible/inventory/hosts.example.yaml ansible/inventory/hosts.yaml
   ```

2. Run **`task apply`** once the inventory exists.

## Workflow

Run **`task tmux`** from your machine. It SSHs to the first host in the `vps` inventory group and attaches to a **tmux** session as the `cursor` user (default session name `cursor`), creating it if missing. Do agent work inside that session; detach when you want your laptop back—the shell and session stay on the VPS.

- Clone repositories under **`~/workspace/`** on the VPS. That directory is created for the `cursor` user so project paths stay in one place.
- Use as many **tmux** windows (tab-like) or **panes** (splits in the same window) as you need—each can be a different repo or working tree—without juggling multiple SSH sessions.
- For Codex macOS app remote sessions, use the **`devbox-agent`** SSH host and choose a remote project folder under **`/home/cursor/workspace/`**. Verify the connection from the laptop with:

  ```sh
  ssh devbox-agent 'fish -lic "whoami; command -v bun; command -v codex; codex --version; test -d ~/workspace"'
  ```

## Maintenance

- **`task update-cursor-agent`** — Updates the Cursor agent on the already-provisioned host (separate playbook).

## Alternatives

- [Cursor self-hosted cloud agents](https://cursor.com/blog/self-hosted-cloud-agents) are undercooked: as of **April 4, 2026**, they could not even autocomplete files.
- [Agent Client Protocol (ACP)](https://agentclientprotocol.com/get-started/introduction#overview) remote agents are still **work in progress**.
