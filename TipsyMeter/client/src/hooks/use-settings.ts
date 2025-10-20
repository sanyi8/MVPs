import { useState, useEffect } from 'react';
import { AppSettings, TaxiInfo } from '@/components/SettingsPanel';

// Default settings
const defaultSettings: AppSettings = {
  tipsyThreshold: 40, // Lower threshold (gets tipsy first)
  drunkThreshold: 60, // Higher threshold (gets drunk after being tipsy)
  contacts: [
    { id: "1", name: "Emergency Contact", phone: "+4415664894" }
  ],
  taxis: [
    { id: "1", name: "Local Taxi", phone: "", appUrl: "" },
    { id: "2", name: "Uber", phone: "", appUrl: "https://m.uber.com/" }
  ]
};

// Local storage key
const SETTINGS_STORAGE_KEY = 'tipsy_calculator_settings';

export function useSettings() {
  const [settings, setSettings] = useState<AppSettings>(defaultSettings);
  const [isLoaded, setIsLoaded] = useState(false);
  
  // Load settings from localStorage on init
  useEffect(() => {
    const loadSettings = () => {
      try {
        const storedSettings = localStorage.getItem(SETTINGS_STORAGE_KEY);
        if (storedSettings) {
          setSettings(JSON.parse(storedSettings));
        }
      } catch (error) {
        console.error('Failed to load settings:', error);
      } finally {
        setIsLoaded(true);
      }
    };
    
    loadSettings();
  }, []);
  
  // Save settings to localStorage
  const saveSettings = (newSettings: AppSettings) => {
    try {
      localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(newSettings));
      setSettings(newSettings);
    } catch (error) {
      console.error('Failed to save settings:', error);
    }
  };
  
  // Reset settings to defaults
  const resetSettings = () => {
    localStorage.removeItem(SETTINGS_STORAGE_KEY);
    setSettings(defaultSettings);
  };
  
  return {
    settings,
    isLoaded,
    saveSettings,
    resetSettings
  };
}