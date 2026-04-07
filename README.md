# vps-agent

Run the agent on a VPS so you can **close the laptop** and get on with whatever else you are doing.

**vps-agent** is the Ansible side of that: provision an Ubuntu VPS with [Cursor AgentCLI](https://cursor.com/blog/cli) and a persistent shell session you can leave attached remotely.

## What you need first

1. A VPS you can SSH into (Ubuntu 24.04 ARM64 is what this repo assumes).
2. An inventory file at **`ansible/inventory/hosts.yaml`**. It is gitignored on purpose; create it locally and fill in your host. The group must be **`vps`**—that is what the playbooks target. Minimal shape:

   ```yaml
   all:
     children:
       vps:
         hosts:
           my-vps:
             ansible_host: 203.0.113.10
             ansible_user: root
   ```

3. Run **`task apply`** once the inventory exists.

## How you actually use it: [taskfile.dev](https://taskfile.dev)

Tasks live in [`Taskfile.yml`](Taskfile.yml). The ones that matter day to day:

- **`task apply`** — Runs the main playbook (`ansible/vps.yaml`) once; provisions the agent environment on the VPS.
- **`task update-cursor-agent`** — Updates the Cursor agent on the already-provisioned host (separate playbook).
- **`task tmux`** — **This is the workflow.** SSHs to the first host in the `vps` group and attaches or creates a tmux session as the `cursor` user (default session name `cursor`). Run your agent work there; detach when you want your machine back.

Everything else (`lint`, `verify`, `smoke`, …) is there for hygiene and confidence. **`task tmux`** is how this setup is meant to feel in practice: persistent shell, persistent session, laptop optional.

## Why this repo exists (Apr 2026)

- [Cursor self-hosted cloud agents](https://cursor.com/blog/self-hosted-cloud-agents) are undercooked: as of **April 4, 2026**, they could not even autocomplete files.
- [Agent Client Protocol (ACP)](https://agentclientprotocol.com/get-started/introduction#overview) remote agents are still **work in progress**.
