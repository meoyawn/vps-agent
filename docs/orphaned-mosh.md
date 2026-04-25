# Orphaned Mosh Sessions

Some Mosh clients can leave a stale `mosh-server` and child login shell on the host after disconnect. The client shows no active session, but the server still reports an old login and UDP listener.

## Stale Shape

- `mosh-server` is reparented to PID 1.
- Child login shell remains attached to an old `pts/N`.
- `who` still shows `user pts/N ... (mosh [PID])`.
- `mosh-server` stdio points at `/dev/null`.
- `ss` shows a Mosh UDP listener, commonly in `60000-61000`.
- No matching `tmux` session or window exists.

## Check

Find the old login:

```sh
who -u
```

Inspect the `mosh-server` and child shell:

```sh
ps -o pid,ppid,pgid,sid,user,tty,lstart,etime,stat,command -p MoshPid,ShellPid
pstree -aps MoshPid
readlink -f /proc/MoshPid/fd/0 /proc/MoshPid/fd/1 /proc/MoshPid/fd/2
```

Find the UDP listener:

```sh
ss -aenp | grep mosh-server
```

Confirm the stale session is outside active work:

```sh
tmux ls
tmux list-windows -a
```

## Cleanup

Only kill sessions known to be stale. Kill `mosh-server` first:

```sh
kill MoshPid
```

Recheck. If the old `pts/N` login remains, kill the shell tied to that stale login:

```sh
who -u
kill ShellPid
```

## Verify

```sh
who -u
sudo ss -aenp | grep mosh-server
tmux ls
tmux list-windows -a
```

Expected result:

- Old `pts/N` is gone from `who`.
- Stale Mosh UDP listener is gone from `ss`.
- Relevant `tmux` sessions are still present.
