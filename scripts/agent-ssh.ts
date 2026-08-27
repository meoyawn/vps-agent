#!/usr/bin/env bun

import { $ } from "bun";
import { resolveAnsibleHost } from "./ansible-inventory.ts";

async function main(): Promise<0 | 1> {
  const [inventoryPath, target, ...sshArgs] = process.argv.slice(2);

  if (!inventoryPath || !target) {
    console.error(
      "usage: agent-ssh.ts <inventory path> <target> [remote command...]",
    );
    return 1;
  }

  const ansibleHost = await resolveAnsibleHost(inventoryPath, target);

  if (!ansibleHost) {
    console.error(`target has no host with ansible_host: ${target}`);
    return 1;
  }

  const home = process.env.HOME;

  if (!home) {
    console.error("HOME is not set");
    return 1;
  }

  const controlDir = `${home}/.ssh/controlmasters`;
  const controlPath = `${controlDir}/vps-agent-%C`;
  const hostSpec = `agent@${ansibleHost}`;

  await $`mkdir -p ${controlDir}`;
  await $`chmod 700 ${controlDir}`;
  await $`ssh \
    -o ControlMaster=auto \
    -o ControlPersist=10m \
    -o ControlPath=${controlPath} \
    -o ServerAliveInterval=30 \
    -o ServerAliveCountMax=3 \
    ${hostSpec} ${sshArgs}`;

  return 0;
}

if (import.meta.main) {
  process.exitCode = await main();
}
