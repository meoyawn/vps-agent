# Pushing To GitHub From The VPS

The setup is intentionally narrow: Git push works from the managed `agent` user after you complete normal GitHub authentication on the VPS.

## Model

- Work in repositories under `/home/agent/workspace/`.
- Use GitHub SSH remotes such as `git@github.com:owner/repo.git`.
- Push as the `agent` user from the VPS session.

## SSH keys

Provisioning syncs keys from local `~/.ssh/` into `/home/agent/.ssh/`:

- Includes `id_*` private keys.
- Includes `*.pub` public keys.
- Excludes local `config`, `known_hosts*`, `authorized_keys`, and everything else.
- Rebuilds `/home/agent/.ssh/authorized_keys` from the synced public keys.

Remote GitHub host config is not generated. If you need a specific GitHub identity, manage it manually in the remote `agent` account.

## GitHub CLI

`gh` is installed, but provisioning does not log it in. Run this manually from the VPS when needed:

```sh
gh auth login --hostname github.com --git-protocol ssh
```
