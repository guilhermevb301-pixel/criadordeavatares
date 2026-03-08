import { scriptPresets, type ScriptPreset } from '@/lib/script-presets';
import { Badge } from '@/components/ui/badge';

interface PresetChipsProps {
  activePreset: string | null;
  onSelect: (preset: ScriptPreset) => void;
}

const PresetChips = ({ activePreset, onSelect }: PresetChipsProps) => {
  return (
    <div className="space-y-2">
      <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Presets rápidos</p>
      <div className="flex flex-wrap gap-2">
        {scriptPresets.map((preset) => (
          <button
            key={preset.id}
            onClick={() => onSelect(preset)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 border ${
              activePreset === preset.id
                ? 'bg-primary/20 border-primary text-primary shadow-glow-accent'
                : 'bg-secondary/50 border-border hover:border-primary/50 text-muted-foreground hover:text-foreground'
            }`}
          >
            <span>{preset.emoji}</span>
            <span>{preset.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default PresetChips;
