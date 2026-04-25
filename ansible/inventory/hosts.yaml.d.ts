/**
 * Gives TypeScript a typed view of Bun's runtime YAML import for hosts.yaml.
 */
const contents: {
  all?: {
    hosts?: Record<
      string,
      {
        ansible_host?: unknown;
      }
    >;
    children?: Record<
      string,
      {
        hosts?: Record<string, unknown>;
      }
    >;
  };
};

export = contents;
