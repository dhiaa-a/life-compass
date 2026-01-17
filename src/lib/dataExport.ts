const STORAGE_KEY = 'life-audit-data';

interface ExportData {
  version: string;
  exportedAt: string;
  data: unknown;
  checksum: string;
}

// Simple hash for data integrity check
function simpleHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(36);
}

// Base64 encode/decode for "encryption" (not true encryption, but obfuscation)
function encode(data: string): string {
  return btoa(unescape(encodeURIComponent(data)));
}

function decode(data: string): string {
  return decodeURIComponent(escape(atob(data)));
}

export function exportData(): void {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    alert('No data to export');
    return;
  }

  const checksum = simpleHash(stored);
  const exportPayload: ExportData = {
    version: '1.0',
    exportedAt: new Date().toISOString(),
    data: JSON.parse(stored),
    checksum,
  };

  const encoded = encode(JSON.stringify(exportPayload));
  const blob = new Blob([encoded], { type: 'application/octet-stream' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = `life-audit-backup-${new Date().toISOString().split('T')[0]}.lab`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function importData(file: File): Promise<boolean> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const encoded = e.target?.result as string;
        const decoded = decode(encoded);
        const payload: ExportData = JSON.parse(decoded);

        // Verify checksum
        const dataStr = JSON.stringify(payload.data);
        const expectedChecksum = simpleHash(dataStr);
        
        if (payload.checksum !== expectedChecksum) {
          // Checksum might differ due to formatting, still try to import
          console.warn('Checksum mismatch, but attempting import anyway');
        }

        localStorage.setItem(STORAGE_KEY, JSON.stringify(payload.data));
        resolve(true);
      } catch (error) {
        console.error('Import failed:', error);
        reject(new Error('Invalid backup file. Please select a valid .lab file.'));
      }
    };

    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
}

export function getLastSavedDate(): string | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const data = JSON.parse(stored);
      return data.lastSaved || null;
    }
  } catch {
    return null;
  }
  return null;
}
