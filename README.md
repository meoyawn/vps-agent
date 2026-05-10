# vps-agent

Run the agent on a VPS so you can close your laptop.

**vps-agent** provisions an Ubuntu VPS for agent work, focused on [Codex remote connections](https://developers.openai.com/codex/remote-connections). It also sets up a persistent **tmux** shell, **mosh** support, tightened [**sshd** defaults](ansible/roles/sshd/), [Zed remote projects](https://zed.dev/docs/remote-development), and [Cursor Agent CLI](https://cursor.com/blog/cli).

## Prerequisites

### On laptop

- **[taskfile.dev](https://taskfile.dev/installation/)**.
- [**ansible-core**](https://docs.ansible.com/ansible/latest/installation_guide/intro_installation.html) and [**ansible-lint**](https://ansible.readthedocs.io/projects/lint/). Recommended with [uv](https://docs.astral.sh/uv/):

  ```sh
  uv tool install ansible-core
  uv tool install ansible-lint
  ```

- A GitHub token encrypted with Ansible Vault as **`vault_github_token`**.
  It is used during provisioning to authenticate `gh` for the `cursor` user
  and register the VPS SSH key with GitHub.
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

2. A local GitHub token file at **`.secrets/github-token`**. The `.secrets/`
   directory is gitignored; keep the plaintext token there only long enough to
   create or update the Ansible Vault value.

   The token must be able to run `gh ssh-key add`. A classic token needs
   `admin:public_key`; add `repo` if the VPS should use `gh` with private
   repositories.

   ```sh
   mkdir -p .secrets
   $EDITOR .secrets/github-token
   ```

3. A vault password file outside this repository. For example:

   ```sh
   mkdir -p ../vault
   $EDITOR ../vault/vps-agent.txt
   ```

4. Encrypt the token into **`ansible/group_vars/all/vault.yaml`**. This vault
   file is machine-local and gitignored, like the inventory file. Do not commit
   it; each user should create their own encrypted token file.

   ```sh
   ANSIBLE_VAULT_PASSWORD_FILE=../vault/vps-agent.txt ansible-vault encrypt_string --stdin-name vault_github_token --output ansible/group_vars/all/vault.yaml < .secrets/github-token
   ```

5. Export **`ANSIBLE_VAULT_PASSWORD_FILE`** before running tasks that read
   vaulted variables.

   In fish:

   ```fish
   set -x ANSIBLE_VAULT_PASSWORD_FILE ../vault/vps-agent.txt
   ```

   In POSIX shells:

   ```sh
   export ANSIBLE_VAULT_PASSWORD_FILE=../vault/vps-agent.txt
   ```

6. Run **`task apply`** once the inventory and vault are ready.

## Workflow

Priorities:

1. Codex desktop app.
2. `tmux`.
3. `mosh` + `tmux`.
4. Zed remote projects.

For Codex remote sessions, use the **`devbox-agent`** SSH host and choose a remote project folder under **`/home/cursor/workspace/`**. Verify the connection from the laptop with:

```sh
ssh devbox-agent 'fish -lic "whoami; command -v bun; command -v codex; codex --version; test -d ~/workspace"'
```

- Clone repositories under **`~/workspace/`** on the VPS. That directory is created for the `cursor` user so project paths stay in one place. GitHub SSH remotes support `git clone`, `git pull`, and `git push`; see [Pushing To GitHub From The VPS](docs/github.md).
- Use as many **tmux** windows (tab-like) or **panes** (splits in the same window) as you need—each can be a different repo or working tree—without juggling multiple SSH sessions.
- Use **mosh** when mobile or unstable networking matters, then attach to **tmux** inside it. See [orphaned Mosh notes](docs/orphaned-mosh.md) if disconnects leave stale sessions.
- Zed remote projects are supported, but lowest priority here. Current tooling is still undercooked: Zed remote can orphan `codex-acp` on disconnect and brick the session. See [Zed notes](docs/zed.md).
- Cursor Agent CLI is installed for users who still want `agent` on the VPS.

If sessions wedge or disconnected agents leave processes behind, look in [docs](docs/). Known cases include Codex desktop app leaving orphaned processes on disconnect and `codex` inside `tmux` sometimes breaking; see [tmux notes](docs/tmux.md).

### Linux user vs tmux session

For shell sessions, run **`task tmux`**; [Taskfile](Taskfile.yaml) connects as Linux user `cursor` and attaches tmux session `macos`.

For Moshi/mosh clients, rely on the Linux user being `cursor`, not on a fixed tmux session name. Mobile clients may attach existing tmux sessions without giving us full control over the session name.

## Maintenance

- **`task update`** — Updates packages on the already-provisioned host (separate playbook).

## Alternatives

- [Cursor self-hosted cloud agents](https://cursor.com/blog/self-hosted-cloud-agents) are undercooked: as of **April 4, 2026**, they could not even autocomplete files.
- [Agent Client Protocol (ACP)](https://agentclientprotocol.com/get-started/introduction#overview) remote agents are still **work in progress**.
