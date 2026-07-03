# Pushing To GitHub From The VPS

The setup is intentionally narrow: Git push works from the managed `agent` user after you complete normal GitHub authentication on the VPS.

## Model

- Work in repositories under `/home/agent/workspace/`.
- Use GitHub SSH remotes such as `git@github.com:owner/repo.git`.
- Push as the `agent` user from the VPS session.

## SSH keys

Provisioning syncs SSH config and keys from local `~/.ssh/` into `/home/agent/.ssh/`:

- Includes `config`.
- Includes private keys, including nonstandard names such as `id_*` and `*_ed25519`.
- Includes `*.pub` public keys.
- Excludes `known_hosts*`, `authorized_keys`, sockets, and socket-like files.
- Rebuilds `/home/agent/.ssh/authorized_keys` from the synced public keys.

Provisioning preserves the synced SSH config, so GitHub host rules with `IdentityFile ~/.ssh/<key-name>` work on the VPS.

## Git config

Provisioning syncs local `~/.gitconfig` to `/home/agent/.gitconfig` so commits have the same author identity on the VPS. Keep local paths in that file portable, such as `~/.gitignore`, if the same value should work on both machines.

## GitHub CLI

`gh` is installed, but provisioning does not log it in. Run this manually from the VPS when needed:

```sh
gh auth login --hostname github.com --git-protocol ssh
```
