import { ExternalLink, Calendar, ShoppingCart, Mail, Link } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState } from 'react';

type ActionType = 'calendly' | 'amazon' | 'mailto' | 'custom';

interface NextActionLinksProps {
  goalId: string;
  onSaveAction: (goalId: string, action: { type: ActionType; url: string; label: string }) => void;
  savedAction?: { type: ActionType; url: string; label: string };
}

const actionTypeInfo = {
  calendly: { 
    icon: Calendar, 
    label: 'Schedule Meeting', 
    placeholder: 'https://calendly.com/your-link',
    prefix: '',
  },
  amazon: { 
    icon: ShoppingCart, 
    label: 'Buy Something', 
    placeholder: 'https://amazon.com/dp/...',
    prefix: '',
  },
  mailto: { 
    icon: Mail, 
    label: 'Send Email', 
    placeholder: 'email@example.com',
    prefix: 'mailto:',
  },
  custom: { 
    icon: Link, 
    label: 'Custom Link', 
    placeholder: 'https://...',
    prefix: '',
  },
};

export function NextActionLinks({ goalId, onSaveAction, savedAction }: NextActionLinksProps) {
  const [isEditing, setIsEditing] = useState(!savedAction);
  const [actionType, setActionType] = useState<ActionType>(savedAction?.type || 'custom');
  const [url, setUrl] = useState(savedAction?.url.replace('mailto:', '') || '');
  const [label, setLabel] = useState(savedAction?.label || '');

  const handleSave = () => {
    if (!url.trim()) return;
    
    const info = actionTypeInfo[actionType];
    const finalUrl = actionType === 'mailto' ? `mailto:${url}` : url;
    const finalLabel = label.trim() || info.label;
    
    onSaveAction(goalId, { type: actionType, url: finalUrl, label: finalLabel });
    setIsEditing(false);
  };

  if (savedAction && !isEditing) {
    const Icon = actionTypeInfo[savedAction.type].icon;
    return (
      <div className="mt-3 pt-3 border-t border-border">
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">Next Physical Action:</span>
          <div className="flex items-center gap-2">
            <a
              href={savedAction.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-colors"
            >
              <Icon className="w-4 h-4" />
              {savedAction.label}
              <ExternalLink className="w-3 h-3" />
            </a>
            <button
              onClick={() => setIsEditing(true)}
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              Edit
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-3 pt-3 border-t border-border space-y-3">
      <Label className="text-xs text-muted-foreground">Add Next Physical Action</Label>
      
      <div className="grid grid-cols-2 gap-2">
        <Select value={actionType} onValueChange={(v) => setActionType(v as ActionType)}>
          <SelectTrigger className="h-9">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {(Object.keys(actionTypeInfo) as ActionType[]).map((type) => {
              const info = actionTypeInfo[type];
              return (
                <SelectItem key={type} value={type}>
                  <div className="flex items-center gap-2">
                    <info.icon className="w-4 h-4" />
                    {info.label}
                  </div>
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>

        <Input
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          placeholder="Button label (optional)"
          className="h-9"
        />
      </div>

      <div className="flex gap-2">
        <Input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder={actionTypeInfo[actionType].placeholder}
          className="flex-1"
        />
        <Button size="sm" onClick={handleSave} disabled={!url.trim()}>
          Save
        </Button>
        {savedAction && (
          <Button size="sm" variant="ghost" onClick={() => setIsEditing(false)}>
            Cancel
          </Button>
        )}
      </div>
    </div>
  );
}
