# omnara

Installs the Omnara CLI for the existing agent user on supported Ubuntu hosts.
The role uses Omnara's upstream installer and exposes the binary through the
agent user's `~/.local/bin` directory.

## Requirements

- Ubuntu 24.04 on amd64 or arm64.
- The target host must have `curl` and `bash` available.
- Network access to the Omnara installer and release server.

## Variables

- `omnara_install_url`: Upstream CLI installer URL. Defaults to
  `https://omnara.com/install.sh`.
- `omnara_agent_user`: User that owns the CLI. Defaults to `agent_user`.
- `omnara_agent_group`: Group that owns the CLI. Defaults to `agent_group`.
- `omnara_agent_home`: User home directory. Defaults to `agent_home`.
- `omnara_agent_path`: PATH passed to the installer and CLI. Defaults to
  `agent_path`.
- `omnara_install_dir`: Installation directory. Defaults to
  `~/.omnara/bin` for the selected agent user.
- `omnara_binary_path`: Installed binary path.
- `omnara_binary_link_path`: Stable executable link under `~/.local/bin`.
- `omnara_version`: Release version, or `latest`.
- `omnara_arch`: Optional `x64` or `arm64` architecture override.
- `omnara_release_url`: Release server base URL.
- `omnara_no_service`: Skip Omnara's background service when `true`.

## Example

```yaml
- name: Install Omnara
  hosts: vps
  become: true
  roles:
    - omnara
```

## Behavior

The role is idempotent once `omnara_binary_path` exists. It supports check mode
for the link task; the upstream installer is skipped in check mode when the
binary already exists. The Omnara machine daemon documented at
<https://docs.omnara.com/machines/connect> requires a separately created,
one-time machine token and is not enabled automatically by this role.

To roll back, stop or remove the Omnara user service if enabled, then remove
`omnara_install_dir` and `omnara_binary_link_path` for the agent user.

## License

Role content is MIT-licensed. Omnara remains subject to its own license and
service terms.
