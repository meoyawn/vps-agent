# Pushing To GitHub From The VPS

This project configures the VPS so users can push repository changes to GitHub
without turning the host into a general-purpose GitHub credential store.

The setup is intentionally narrow: Git push works from the managed `cursor`
environment, while broad tokens and personal SSH keys stay off the VPS.

## What This Enables

- Work in repositories under `/home/cursor/workspace/`.
- Use GitHub SSH remotes such as `git@github.com:owner/repo.git`.
- Push as the `cursor` user from the VPS session.

This does not make the VPS a place for personal GitHub tokens, broad account
credentials, or ad hoc SSH keys.

## How Access Works

- Ansible generates a host-local Ed25519 key at
  `/home/cursor/.ssh/id_github_vps_ed25519`.
- SSH for `github.com` is pinned to that key with `IdentitiesOnly yes`.
- The private key stays on the VPS.
- The public key is registered with GitHub by `gh ssh-key add`.
- Controller `gh` auth is copied into the `cursor` GitHub CLI config only long
  enough to register the public key, with `no_log: true`, then removed again.
- GitHub host keys are pinned in `/home/cursor/.ssh/known_hosts`.

## User Flow

Connect to the managed `cursor` environment:

```sh
task tmux
```

Inside the VPS session:

```sh
cd ~/workspace/repo
git status
git diff
git push
```
