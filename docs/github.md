# Pushing To GitHub From The VPS

This project configures the VPS so users can push repository changes to GitHub
without copying controller GitHub CLI state onto the host.

The setup is intentionally narrow: Git push works from the managed `cursor`
environment, while personal SSH keys stay off the VPS. A local gitignored
GitHub token variable is used to authenticate `gh` for the `cursor` user and
register the VPS SSH key.

## What This Enables

- Work in repositories under `/home/cursor/workspace/`.
- Use GitHub SSH remotes such as `git@github.com:owner/repo.git`.
- Push as the `cursor` user from the VPS session.

This does not make the VPS a place for personal SSH keys or ad hoc SSH keys.

## How Access Works

- Ansible generates a host-local Ed25519 key at
  `/home/cursor/.ssh/id_github_vps_ed25519`.
- SSH for `github.com` is pinned to that key with `IdentitiesOnly yes`.
- The private key stays on the VPS.
- `gh` is authenticated for the `cursor` user from local gitignored variable
  `vault_github_token`.
- The public key is registered with GitHub by `gh ssh-key add`.
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
