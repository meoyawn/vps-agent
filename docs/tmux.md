# Tmux Notes

## Codex TUI Recovery

When a Codex TUI is running inside `tmux`, run recovery commands on the host
where the `tmux` server lives, as the same Unix user that owns the session.
For this VPS, that usually means the `cursor` user.

Find panes:

```sh
tmux list-panes -a -F '#S:#I.#P #{pane_current_command}'
```

If the pane command is `node`, it may still be Codex. Codex runs through a
Node.js process.

Send keys to a pane:

```sh
tmux send-keys -t cursor:1.1 C-m
tmux send-keys -t cursor:1.1 Enter
```

If Enter only inserts newlines, Codex is still receiving input, but the prompt
is in multiline/editing behavior or the terminal path is translating keys in a
way Codex does not submit. In that state, more Enter variants may just add more
line breaks.

Do not use `C-c` unless it is acceptable to interrupt or exit the Codex TUI. It
can terminate the active Codex session.

Resume after a killed TUI:

```sh
codex resume --last
```

Resume and send the prompt without depending on TUI Enter:

```sh
codex resume --last "write learnings in docs/tmux.md"
```

If the most recent session is not the intended one, use the picker:

```sh
codex resume --all
```

Start a fresh `tmux` window when the old pane is wedged:

```sh
tmux new-window -t cursor -n codex
```

## Moshi And Ghostty

Moshi iOS, Ghostty, SSH, and `tmux` add several layers where Return, Escape,
Backspace, and modifier keys can be translated. If Return starts inserting
newlines in Codex instead of submitting, treat the TUI input path as unreliable
and resume Codex from a normal shell with the prompt passed as a command
argument.

Investigate later:

- Whether Moshi leaves orphaned `mosh-server` processes after disconnects.
- Whether the broken key behavior only appears through Moshi, only through
  Ghostty, or only inside nested `tmux`.
- Whether `tmux` has custom key bindings for `Enter`, `Escape`, `BSpace`, or
  `C-m`.

Useful checks:

```sh
tmux list-sessions
tmux list-panes -a -F '#S:#I.#P #{pane_current_command}'
tmux list-keys -T root
```
