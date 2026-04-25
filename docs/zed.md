# Zed Remote Projects

Zed remote projects work against the VPS over SSH. They are useful for direct
editing on the remote workspace, but the Codex desktop app remains the primary
agent runtime for this repo.

## Current State

Zed remote can connect to the VPS and open projects under
`/home/cursor/workspace/`. Use the same SSH target as the Codex desktop app:

```sshconfig
Host devbox-agent
  HostName <your-vps-ip-or-hostname>
  User cursor
  IdentityFile ~/.ssh/id_rsa
  IdentitiesOnly yes
```

Zed runs the UI locally. Source files, terminals, tasks, language servers, and
debug sessions run on the VPS. Zed shells out to the local `ssh` binary, reads
matching options from `~/.ssh/config`, then starts or reconnects to its remote
server on the VPS.

Open the Remote Projects dialog with `ctrl-cmd-shift-o` on macOS or
`alt-ctrl-shift-o` on Linux, then connect to `devbox-agent` and choose the
project path. For direct CLI opens:

```sh
zed ssh://devbox-agent/home/cursor/workspace/
```

Avoid opening very broad paths such as `/` or `~`; Zed recommends opening a
specific project directory.

Zed stores remote connection metadata in local settings as `ssh_connections`.
When the remote server binary is missing or has the wrong version, Zed installs
the matching binary under `~/.zed_server` on the VPS. If the VPS cannot download
the binary directly, set `upload_binary_over_ssh` for the connection so Zed
downloads it locally and uploads it over SSH.

## Known Failure

Zed remote projects can orphan `codex-acp` on disconnect. After that, the session
can be bricked until the stale process tree is cleaned up.

See also:

- [orphaned Mosh sessions](orphaned-mosh.md)

## Debug

List possible orphaned Codex ACP processes:

```sh
ps -eo pid,ppid,pgid,sid,user,tty,lstart,etime,stat,command | grep codex-acp
```

Inspect a suspicious process tree:

```sh
pstree -aps ProcessPid
```

Check whether it still has a live terminal:

```sh
readlink -f /proc/ProcessPid/fd/0 /proc/ProcessPid/fd/1 /proc/ProcessPid/fd/2
```

Check active logins:

```sh
who -u
```

Only kill processes after confirming they belong to a stale disconnected Zed
remote session, not a live agent run:

```sh
kill ProcessPid
```
