import packageJson from '../../package.json';

const dependencies = packageJson.dependencies ?? {};

export const healthSnapshot = {
  versions: {
    react: dependencies.react ?? null,
    next: dependencies.next ?? null,
    'drizzle-orm': dependencies['drizzle-orm'] ?? null,
    stripe: dependencies.stripe ?? null,
  },
};

export type HealthSnapshot = typeof healthSnapshot;
