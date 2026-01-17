import { useRef, useState } from 'react';
import { Download, Upload, Check, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { exportData, importData, getLastSavedDate } from '@/lib/dataExport';
import { format } from 'date-fns';

interface DataBackupProps {
  onImportSuccess: () => void;
}

export function DataBackup({ onImportSuccess }: DataBackupProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importStatus, setImportStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const lastSaved = getLastSavedDate();

  const handleExport = () => {
    exportData();
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      await importData(file);
      setImportStatus('success');
      setErrorMessage('');
      setTimeout(() => {
        onImportSuccess();
        window.location.reload();
      }, 1500);
    } catch (error) {
      setImportStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Import failed');
    }

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="font-display text-lg">Data Backup</CardTitle>
        <CardDescription>
          {lastSaved 
            ? `Last saved: ${format(new Date(lastSaved), 'MMM d, yyyy h:mm a')}`
            : 'Export your progress to prevent data loss'
          }
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <Button 
          variant="outline" 
          className="w-full justify-start"
          onClick={handleExport}
        >
          <Download className="w-4 h-4 mr-2" />
          Export Backup (.lab)
        </Button>

        <Button 
          variant="outline" 
          className="w-full justify-start"
          onClick={handleImportClick}
        >
          {importStatus === 'success' ? (
            <>
              <Check className="w-4 h-4 mr-2 text-primary" />
              Imported Successfully!
            </>
          ) : importStatus === 'error' ? (
            <>
              <AlertCircle className="w-4 h-4 mr-2 text-destructive" />
              Import Failed
            </>
          ) : (
            <>
              <Upload className="w-4 h-4 mr-2" />
              Restore from Backup
            </>
          )}
        </Button>

        {errorMessage && (
          <p className="text-sm text-destructive">{errorMessage}</p>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept=".lab"
          onChange={handleFileChange}
          className="hidden"
        />
      </CardContent>
    </Card>
  );
}
