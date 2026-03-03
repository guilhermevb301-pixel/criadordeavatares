import type { OptionItem } from '@/lib/avatar-config';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

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
            className={cn(
              "relative flex items-center gap-2 rounded-lg border px-3 py-2.5 text-sm transition-all duration-200 text-left",
              isSelected
                ? 'border-emerald-500/70 bg-emerald-500/10 text-foreground shadow-[0_0_12px_hsl(152_69%_50%/0.2)]'
                : 'border-border bg-card text-card-foreground hover:border-muted-foreground/30 hover:bg-secondary/50'
            )}
          >
            {opt.icon && (
              <span className="text-base shrink-0">{opt.icon}</span>
            )}
            {isSelected && !opt.icon && (
              <Check className="h-3.5 w-3.5 shrink-0 text-emerald-500" />
            )}
            {isSelected && opt.icon && (
              <Check className="absolute top-1 right-1 h-3 w-3 text-emerald-500" />
            )}
            <span className={isSelected ? 'font-medium' : ''}>{opt.label}</span>
          </button>
        );
      })}
    </div>
  );
};

export default OptionGrid;
