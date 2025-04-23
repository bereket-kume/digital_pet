// This file is kept for future Firebase integration
// Currently using localStorage for data persistence
export const db = {
  save: (key: string, data: any) => {
    localStorage.setItem(key, JSON.stringify(data));
  },
  get: (key: string) => {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  }
}; 