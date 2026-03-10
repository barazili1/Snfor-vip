
import { Platform } from '../types';

const BASE_URL = "https://evoioi-default-rtdb.europe-west1.firebasedatabase.app";

export const fetchAppleGridData = async (platform: Platform): Promise<boolean[][] | null> => {
  try {
    const response = await fetch(`${BASE_URL}/m11.json`);
    if (!response.ok) return null;
    const data = await response.json();
    if (!data) return null;
    const grid: boolean[][] = Array(10).fill(null).map(() => Array(5).fill(false));
    for (let i = 1; i <= 50; i++) {
        const key = `m${i}`;
        const entry = data[key]; 
        if (entry !== undefined && entry !== null) {
            const valStr = (typeof entry === 'object' && entry[key] !== undefined) ? entry[key] : entry; 
            if (valStr !== undefined) {
                const isGood = String(valStr) === "0";
                const idx = i - 1;
                const row = Math.floor(idx / 5);
                const col = idx % 5;
                if (row < 10 && col < 5) grid[row][col] = isGood;
            }
        }
    }
    return grid;
  } catch (error) {
    console.error("Apple Grid Fetch Error:", error);
    return null;
  }
};

export const updateAppleGridData = async (platform: Platform): Promise<boolean> => {
  try {
    const newData: Record<string, any> = {};
    const setRowData = (start: number, end: number, badCount: number) => {
      const keys: string[] = [];
      for (let i = start; i <= end; i++) keys.push(`m${i}`);
      for (let i = keys.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [keys[i], keys[j]] = [keys[j], keys[i]];
      }
      const badKeys = new Set(keys.slice(0, badCount));
      for (let i = start; i <= end; i++) {
        const key = `m${i}`;
        newData[key] = { [key]: badKeys.has(key) ? "1" : "0" };
      }
    };
    setRowData(1, 5, 1); setRowData(6, 10, 1); setRowData(11, 15, 1); setRowData(16, 20, 1);
    setRowData(21, 25, 2); setRowData(26, 30, 2); setRowData(31, 35, 2);
    setRowData(36, 40, 3); setRowData(41, 45, 3); setRowData(46, 50, 4);
    const response = await fetch(`${BASE_URL}/m11.json`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newData)
    });
    return response.ok;
  } catch (e) {
    console.error("Error updating Apple Grid Data:", e);
    return false;
  }
};
