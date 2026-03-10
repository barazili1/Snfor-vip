import { AccessKey } from '../types';

const DB_URL = "https://evoioi-default-rtdb.europe-west1.firebasedatabase.app/keys.json";

export const verifyAccessKey = async (inputKey: string): Promise<{ valid: boolean; data?: AccessKey; error?: string }> => {
  const promoCodes = ['V8S', 'TOO3'];
  if (promoCodes.includes(inputKey.toUpperCase())) {
    return {
      valid: true,
      data: {
        key: inputKey.toUpperCase(),
        isActive: true,
        type: 'PROMO_ACCESS',
        name: 'Authorized User',
        createdAt: Date.now(),
        isAdminMode: false 
      }
    };
  }

  try {
    const response = await fetch(DB_URL);
    if (!response.ok) {
      throw new Error("Network error connecting to verification server.");
    }

    const data = await response.json();
    
    if (!data) {
        return { valid: false, error: "Database empty or inaccessible." };
    }

    const match = Object.values(data).find((entry: any) => entry.key === inputKey) as AccessKey | undefined;

    if (!match) {
        return { valid: false, error: "Invalid Access Key." };
    }

    if (!match.isActive) {
        return { valid: false, error: "Key has been disabled." };
    }

    if (match.type !== 'PERMANENT' && !match.expiresAt) {
        const creation = match.createdAt || Date.now();
        match.expiresAt = creation + (30 * 24 * 60 * 60 * 1000);
    }

    return { valid: true, data: match };

  } catch (error) {
    console.error("Auth Error:", error);
    return { valid: false, error: "Connection failed. Please check internet." };
  }
};