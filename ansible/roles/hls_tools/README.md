# hls_tools

Installs Apple's HTTP Live Streaming Tools from the archive bundled in this role.

## Requirements

- x86_64 Ubuntu. Ubuntu 24.04 is Apple's supported target; later Ubuntu releases use the bundled ICU 74 compatibility package.
- An accepted Apple HLS Tools license agreement.

## Variables

- `hls_tools_archive_name`: bundled installer archive name.
- `hls_tools_archive_sha256`: expected SHA-256 archive checksum.
- `hls_tools_icu74_archive_name`: bundled Ubuntu 24 ICU compatibility package name.
- `hls_tools_icu74_archive_sha256`: expected ICU compatibility package checksum.
- `hls_tools_install_dir`: installer extraction directory.
- `hls_tools_mediastreamvalidator_path`: Media Stream Validator executable path.
- `hls_tools_license_accepted`: accepts Apple's license during unattended installation. Defaults to `true`.

## Example

```yaml
- hosts: vps
  become: true
  roles:
    - hls_tools
```

## Behavior

The role is idempotent once `mediastreamvalidator` exists. It supports Ansible check mode for its assertions and file tasks, but the installer itself is skipped only when the executable already exists. Remove the installed Apple packages with `deploy.sh -e` from `hls_tools_install_dir`.

## License

Role content is MIT-licensed. Apple HLS Tools remain subject to Apple's license agreement.
