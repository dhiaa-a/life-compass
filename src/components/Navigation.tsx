import { cn } from '@/lib/utils';
import { ThemeToggle } from '@/components/ThemeToggle';

interface NavigationProps {
  currentSection: string;
  onNavigate: (section: string) => void;
}

const sections = [
  { id: 'hero', label: 'Welcome' },
  { id: 'wheel', label: 'Wheel of Life' },
  { id: 'dashboard', label: 'DYL Dashboard' },
  { id: 'odyssey', label: 'Odyssey Plans' },
  { id: 'goals', label: 'SMART Goals' },
  { id: 'quickwins', label: 'Quick Wins' },
  { id: 'calendar', label: 'Calendar' },
  { id: 'tasks', label: 'Tasks' },
];

export function Navigation({ currentSection, onNavigate }: NavigationProps) {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <button 
            onClick={() => onNavigate('hero')}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-display font-bold text-sm">L</span>
            </div>
            <span className="font-display font-semibold text-lg hidden sm:block">Life Audit</span>
          </button>
          
          <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto scrollbar-hide">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => onNavigate(section.id)}
                className={cn(
                  'nav-link px-2 sm:px-3 py-2 rounded-md whitespace-nowrap text-sm',
                  currentSection === section.id && 'nav-link-active bg-primary/10'
                )}
              >
                {section.label}
              </button>
            ))}
            <ThemeToggle />
          </div>
        </div>
      </div>
    </nav>
  );
}
