# Moshi Notification Plan

## Goal

Use Moshi webhook notifications for completed Codex turns and explicit "need input" states.

This is separate from [moshi.md](moshi.md), which owns the iPhone terminal path, Mosh transport, UFW exposure, and `tmux` workflow.

## Notification Flow

```sh
codex -> codex-moshi-notify -> Moshi webhook API -> Moshi iPhone push notification
```

`codex-moshi-notify` is a planned VPS-side helper script.

Script behavior:

- Read Codex notify JSON from stdin.
- Extract last assistant message when present.
- Send compact title and message to Moshi webhook.
- Read token from `MOSHI_WEBHOOK_TOKEN`.
- Fail quietly if token is unset.

## Moshi Setup

- Open Moshi Settings.
- Open Notifications.
- Enable notifications.
- Copy webhook token.
- Store token only on the VPS, not in this repo.

## Codex Config

Codex config target:

```toml
notify = ["/home/cursor/bin/codex-moshi-notify"]
```

## Manual Acceptance Check

Run from VPS:

```sh
curl -s -X POST https://api.getmoshi.app/api/webhook \
  -H "Content-Type: application/json" \
  -d '{"token":"REDACTED","title":"Codex","message":"Moshi test"}'
```

Then confirm iPhone receives a Moshi push notification and opens the relevant Moshi session.

## Repo Work Plan

1. Add `codex-moshi-notify` script management without committing token.
2. Add verify checks for notification script presence.
3. Run `task verify`.
4. Trigger Moshi webhook from VPS and confirm push delivery on iPhone.

## Non-Goals

- Do not commit Moshi webhook tokens.
- Do not commit IP addresses or private connection details.
