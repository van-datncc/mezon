import { NativeModules } from 'react-native';

const { NotificationPreferences } = NativeModules;

if (!NotificationPreferences) {
	throw new Error('NotificationPreferences module is not available');
}

/**
 * Interface for NotificationPreferences native module
 */
interface NotificationPreferencesInterface {
	getValue(key: string): Promise<string | null>;
	getAllValues(): Promise<Record<string, any>>;
	clearValue(key: string): Promise<boolean>;
	clearAll(): Promise<boolean>;
}

/**
 * NotificationPreferencesManager - Interface for accessing notification data saved in SharedPreferences
 */
const NotificationPreferencesManager: NotificationPreferencesInterface = {
	/**
	 * Get a specific value by key
	 * @param key - The key to retrieve
	 * @returns The value or null if not found
	 */
	getValue: (key: string): Promise<string | null> => {
		return NotificationPreferences.getValue(key);
	},

	/**
	 * Get all saved notification values
	 * @returns Object containing all key-value pairs
	 */
	getAllValues: (): Promise<Record<string, any>> => {
		return NotificationPreferences.getAllValues();
	},

	/**
	 * Clear a specific value by key
	 * @param key - The key to clear
	 * @returns Success status
	 */
	clearValue: (key: string): Promise<boolean> => {
		return NotificationPreferences.clearValue(key);
	},

	/**
	 * Clear all notification values
	 * @returns Success status
	 */
	clearAll: (): Promise<boolean> => {
		return NotificationPreferences.clearAll();
	}
};

export default NotificationPreferencesManager;
