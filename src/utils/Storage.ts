
export default class LocalStorageManager {
    /**
     * Stores a value in localStorage under the specified key.
     * @param key - The key under which the value is stored.
     * @param value - The value to store, which will be converted to JSON.
     */
    static setItem(key: string, value: any): void {
        try {
            const jsonValue = JSON.stringify(value);
            window.localStorage.setItem(key, jsonValue);
        } catch (e) {
            console.error('Error saving to localStorage:', e);
        }
    }

    /**
     * Retrieves a value from localStorage for the specified key.
     * @param key - The key of the item to retrieve.
     * @returns The parsed value from JSON, or undefined if the key does not exist or an error occurs.
     */
    static getItem(key: string): any {
        try {
            const jsonValue = window.localStorage.getItem(key);
            return jsonValue ? JSON.parse(jsonValue) : undefined;
        } catch (e) {
            console.error('Error getting data from localStorage:', e);
            return undefined;
        }
    }

    /**
     * Removes the value stored in localStorage for the specified key.
     * @param key - The key of the item to remove.
     */
    static removeItem(key: string): void {
        try {
            window.localStorage.removeItem(key);
        } catch (e) {
            console.error('Error removing data from localStorage:', e);
        }
    }

    /**
     * Clears all values stored in localStorage.
     */
    static clear(): void {
        try {
            window.localStorage.clear();
        } catch (e) {
            console.error('Error clearing localStorage:', e);
        }
    }
}
