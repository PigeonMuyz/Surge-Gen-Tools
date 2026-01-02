// LocalStorage persistence for Surge configuration

import { SurgeConfig } from '@/data/types';
import { getGuguTemplateConfig, getEmptyConfig } from '@/data/gugu-template';

const STORAGE_KEY = 'surge-webui-config';
const STORAGE_VERSION = 4; // Bumped: v3->v4 for empty subscriptions template

interface StoredConfig {
    version: number;
    config: SurgeConfig;
    updatedAt: string;
}

// Get default config (based on 咕咕.conf template)
export function getDefaultConfig(): SurgeConfig {
    return getGuguTemplateConfig();
}

// Get empty config for starting from scratch
export { getEmptyConfig };

// Save config to localStorage
export function saveConfig(config: SurgeConfig): void {
    if (typeof window === 'undefined') return;

    const stored: StoredConfig = {
        version: STORAGE_VERSION,
        config,
        updatedAt: new Date().toISOString(),
    };

    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(stored));
    } catch (error) {
        console.error('Failed to save config to localStorage:', error);
    }
}

// Load config from localStorage
export function loadConfig(): SurgeConfig | null {
    if (typeof window === 'undefined') return null;

    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (!stored) return null;

        const parsed: StoredConfig = JSON.parse(stored);

        // Version migration can be added here if needed
        if (parsed.version < STORAGE_VERSION) {
            console.warn('Config version outdated, returning null to use new template');
            return null;
        }

        return parsed.config;
    } catch (error) {
        console.error('Failed to load config from localStorage:', error);
        return null;
    }
}

// Clear stored config
export function clearConfig(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(STORAGE_KEY);
}

// Export config as JSON file
export function exportConfigJson(config: SurgeConfig): void {
    const json = JSON.stringify(config, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'surge-config-backup.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// Import config from JSON
export function importConfigJson(jsonString: string): SurgeConfig | null {
    try {
        const config = JSON.parse(jsonString) as SurgeConfig;
        // Basic validation
        if (!config.general || !Array.isArray(config.rules)) {
            throw new Error('Invalid config format');
        }
        return config;
    } catch (error) {
        console.error('Failed to parse config JSON:', error);
        return null;
    }
}

// Generate unique ID
export function generateId(): string {
    return Math.random().toString(36).substring(2, 11);
}
