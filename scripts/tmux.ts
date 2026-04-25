#!/usr/bin/env bun

import { $ } from "bun";
import inventory from "../ansible/inventory/hosts.yaml" with { type: "yaml" };

async function main(): Promise<0 | 1> {
  const children = inventory.all?.children ?? {};
  const target = Object.keys(children)[0];

  if (!target) {
    console.error("inventory has no children");
    return 1;
  }

  const hosts = children[target]?.hosts;
  const [hostName] = Object.keys(hosts ?? {});

  if (!hostName) {
    console.error(`target has no hosts: ${target}`);
    return 1;
  }

  const ansibleHost = inventory.all?.hosts?.[hostName]?.ansible_host;

  if (typeof ansibleHost !== "string" || ansibleHost.length === 0) {
    console.error(`host has no ansible_host: ${hostName}`);
    return 1;
  }

  const hostSpec = `cursor@${ansibleHost}`;
  const remoteCommand = "exec tmux new-session -A -s macos";

  await $`ssh -tt ${hostSpec} ${remoteCommand}`;
  return 0;
}

if (import.meta.main) {
  process.exitCode = await main();
}
