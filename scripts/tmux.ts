#!/usr/bin/env bun

import { $ } from "bun";
import { resolveAnsibleHost } from "./ansible-inventory.ts";

async function main(): Promise<0 | 1> {
  const [inventoryPath, target] = process.argv.slice(2);

  if (!inventoryPath || !target) {
    console.error("usage: tmux.ts <inventory path> <target>");
    return 1;
  }

  const ansibleHost = await resolveAnsibleHost(inventoryPath, target);

  if (!ansibleHost) {
    console.error(`target has no host with ansible_host: ${target}`);
    return 1;
  }

  const hostSpec = `agent@${ansibleHost}`;
  const remoteCommand =
    "exec tmux -T extkeys,hyperlinks new-session -A -s macos";

  await $`ssh -tt ${hostSpec} ${remoteCommand}`;
  return 0;
}

if (import.meta.main) {
  process.exitCode = await main();
}
