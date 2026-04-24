# Ansible Notes

## Blast Radius Search

Use text search as source of truth for Ansible variable renames. The
code-review graph is tree-sitter based and does not currently index
Ansible YAML/Jinja variable references well enough for this job.

1. List top-level vars from the vars file:

   ```sh
   rg --pcre2 -o '^[A-Za-z_][A-Za-z0-9_]*(?=:)' ansible/group_vars/all/main.yaml
   ```

2. Search exact variable references across Ansible:

   ```sh
   rg -n '\b(cursor_user|cursor_home|cursor_path)\b' ansible
   ```

3. Count refs per variable and identify external consumers:

   ```sh
   fish -lc 'for v in (rg --pcre2 -o "^[A-Za-z_][A-Za-z0-9_]*(?=:)" ansible/group_vars/all/main.yaml)
       set files (rg -l --fixed-strings $v ansible --glob "!ansible/group_vars/all/main.yaml" | string join ", ")
       set total (rg -o --pcre2 "\\b$v\\b" ansible | wc -l | string trim)
       set outside (rg -o --pcre2 "\\b$v\\b" ansible --glob "!ansible/group_vars/all/main.yaml" | wc -l | string trim)
       printf "%-42s total=%-3s outside=%-3s %s\n" $v $total $outside $files
   end'
   ```

4. Count refs per consumer file:

   ```sh
   fish -lc 'set pattern "cursor_user|cursor_home|cursor_path"
   for f in (rg -l --pcre2 "\\b($pattern)\\b" ansible --glob "!ansible/group_vars/all/main.yaml" | sort)
       set count (rg -o --pcre2 "\\b($pattern)\\b" $f | wc -l | string trim)
       printf "%3s %s\n" $count $f
   end'
   ```

5. Check derived vars inside the vars file, because renames must update both
   keys and Jinja references:

   ```sh
   rg -n '\{\{[^}]+\}\}' ansible/group_vars/all/main.yaml
   ```

After changing anything under `ansible/**/*`, run:

```sh
task verify
```
