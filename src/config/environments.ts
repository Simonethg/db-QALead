export interface EnvironmentConfig {
  name: string;
  baseURL: string;
  apiBaseURL: string;
}

const environments: Record<string, EnvironmentConfig> = {
  staging: {
    name: 'staging',
    baseURL: 'https://www.demoblaze.com',
    apiBaseURL: process.env.RESTFUL_BOOKER_BASE_URL || 'https://restful-booker.herokuapp.com',
  },
  production: {
    name: 'production',
    baseURL: 'https://www.demoblaze.com',
    apiBaseURL: process.env.RESTFUL_BOOKER_BASE_URL || 'https://restful-booker.herokuapp.com',
  },
};

export function getEnvironmentConfig(name = process.env.NODE_ENV || 'staging'): EnvironmentConfig {
  const config = environments[name];
  if (!config) {
    throw new Error(`Unknown environment: ${name}`);
  }
  return config;
}
