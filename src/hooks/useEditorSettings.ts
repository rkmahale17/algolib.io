import { useState, useEffect } from 'react';

export interface EditorSettings {
    fontSize: number;
    theme: 'dark' | 'light' | 'system';
    tabSize: number;
    wordWrap: 'on' | 'off';
    minimap: boolean;
    lineNumbers: 'on' | 'off' | 'relative' | 'interval';
    autocomplete: boolean;
}

export const DEFAULT_SETTINGS: EditorSettings = {
    fontSize: 14,
    theme: 'system',
    tabSize: 2,
    wordWrap: 'off',
    minimap: false,
    lineNumbers: 'on',
    autocomplete: true
};

const readFromStorage = (): EditorSettings => {
    const savedSettings = localStorage.getItem('monaco-editor-settings');
    if (savedSettings) {
        try {
            return { ...DEFAULT_SETTINGS, ...JSON.parse(savedSettings) };
        } catch (e) {
            console.error("Failed to parse saved settings", e);
        }
    }
    return DEFAULT_SETTINGS;
};

export const useEditorSettings = () => {
    const [settings, setSettings] = useState<EditorSettings>(DEFAULT_SETTINGS);

    // Initial load from localStorage
    useEffect(() => {
        setSettings(readFromStorage());
    }, []);

    // Listen for cross-instance updates (e.g. settings changed in another part of the tree)
    useEffect(() => {
        const handleSettingsChanged = () => {
            setSettings(readFromStorage());
        };
        window.addEventListener('monaco-settings-changed', handleSettingsChanged);
        return () => window.removeEventListener('monaco-settings-changed', handleSettingsChanged);
    }, []);

    const updateSetting = <K extends keyof EditorSettings>(key: K, value: EditorSettings[K]) => {
        const newSettings = { ...settings, [key]: value };
        setSettings(newSettings);
        localStorage.setItem('monaco-editor-settings', JSON.stringify(newSettings));
        window.dispatchEvent(new Event('monaco-settings-changed'));
    };

    return { settings, updateSetting };
};
