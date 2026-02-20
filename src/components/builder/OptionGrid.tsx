import type { OptionItem } from '@/lib/avatar-config';
import { Check } from 'lucide-react';

interface OptionGridProps {
  options: OptionItem[];
  selected: string[];
  onSelect: (id: string) => void;
  multi: boolean;
}

const OptionGrid = ({ options, selected, onSelect, multi }: OptionGridProps) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
      {options.map((opt) => {
        const isSelected = selected.includes(opt.id);
        return (
          <button
            key={opt.id}
            onClick={() => onSelect(opt.id)}
            className={`relative flex items-center gap-2 rounded-lg border px-3 py-2.5 text-sm transition-all duration-200 text-left ${
              isSelected
                ? 'border-accent bg-accent text-accent-foreground shadow-sm'
                : 'border-border bg-card text-card-foreground hover:border-muted-foreground/30 hover:bg-secondary/50'
            }`}
          >
            {isSelected && (
              <Check className="h-3.5 w-3.5 shrink-0 text-accent-foreground" />
            )}
            <span className={isSelected ? 'font-medium' : ''}>{opt.label}</span>
          </button>
        );
      })}
    </div>
  );
};

export default OptionGrid;
