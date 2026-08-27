import { $ } from "bun";

interface AnsibleHostVariables {
  ansible_host?: unknown;
}

interface AnsibleInventoryEntry {
  hosts?: string[];
  hostvars?: Record<string, AnsibleHostVariables>;
}

interface AnsibleInventory {
  [name: string]: AnsibleInventoryEntry | undefined;
}

export async function resolveAnsibleHost(
  inventoryPath: string,
  target: string,
): Promise<string | undefined> {
  const inventory: AnsibleInventory =
    await $`ansible-inventory -i ${inventoryPath} --list`.json();
  const [host] = inventory[target]?.hosts ?? [];
  const ansibleHost = host
    ? inventory._meta?.hostvars?.[host]?.ansible_host
    : undefined;

  return typeof ansibleHost === "string" && ansibleHost.length > 0
    ? ansibleHost
    : undefined;
}
