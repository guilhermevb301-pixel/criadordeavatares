import { useState, useEffect, useRef, useCallback } from 'react';
import { Sparkles, Eye, Copy, Check, Dices, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { useImageGeneration } from '@/hooks/useImageGeneration';
import type { Gender } from '@/lib/avatar-config';
import AvatarPromptCard from './AvatarPromptCard';

interface AvatarPreviewProps {
  gender: Gender;
  prompt: string;
  configVersion: number;
  onRandomize?: () => void;
}

const AvatarPreview = ({ gender, prompt, configVersion, onRandomize }: AvatarPreviewProps) => {
  const { generateImage, imageUrl, loading, error, reset } = useImageGeneration();
  const [lastGeneratedPrompt, setLastGeneratedPrompt] = useState('');
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  const placeholderSrc = gender === 'masculino'
    ? 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=600&fit=crop&crop=face&q=80'
    : 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600&h=600&fit=crop&crop=face&q=80';

  const displayImage = imageUrl || placeholderSrc;
  const hasGenerated = !!imageUrl;
  const promptChanged = prompt !== lastGeneratedPrompt && hasGenerated;

  const handleGenerate = useCallback(() => {
    if (!prompt || loading) return;
    setLastGeneratedPrompt(prompt);
    generateImage(prompt);
  }, [prompt, loading, generateImage]);

  // Auto-generate with 3s debounce after config changes (only after first manual generate)
  useEffect(() => {
    if (!hasGenerated) return; // don't auto-generate until user clicks once
    if (prompt === lastGeneratedPrompt) return;

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      handleGenerate();
    }, 3000);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [prompt, hasGenerated, lastGeneratedPrompt, handleGenerate]);

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-2 px-5 py-3 border-b border-border">
        <Eye className="h-4 w-4 text-muted-foreground" />
        <h3 className="text-sm font-semibold font-display text-foreground">Preview em Tempo Real</h3>
        <div className={cn(
          "ml-auto flex items-center gap-1.5 text-xs font-medium px-2 py-0.5 rounded-full transition-colors",
          loading
            ? "bg-amber-500/20 text-amber-400"
            : promptChanged
              ? "bg-blue-500/20 text-blue-400"
              : "bg-secondary text-muted-foreground"
        )}>
          <span className={cn(
            "h-1.5 w-1.5 rounded-full",
            loading ? "bg-amber-500 animate-pulse" : promptChanged ? "bg-blue-500" : "bg-muted-foreground/40"
          )} />
          {loading ? 'Gerando...' : promptChanged ? 'Desatualizado' : hasGenerated ? 'Atualizado' : 'Sincronizado'}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-5 space-y-5">
        {/* Avatar Image Preview */}
        <div className="relative rounded-xl overflow-hidden border border-border bg-card shadow-card aspect-square">
          {loading ? (
            <div className="w-full h-full flex flex-col items-center justify-center gap-3 bg-secondary/50">
              <Loader2 className="h-8 w-8 text-muted-foreground animate-spin" />
              <p className="text-sm text-muted-foreground font-medium">Gerando avatar com IA...</p>
              <Skeleton className="w-3/4 h-2 rounded-full" />
              <Skeleton className="w-1/2 h-2 rounded-full" />
            </div>
          ) : (
            <img
              src={displayImage}
              alt={`Preview avatar ${gender}`}
              className="w-full h-full object-cover"
            />
          )}

          {/* Overlay badge */}
          {!loading && (
            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
              <span className="text-xs font-medium bg-card/80 backdrop-blur-sm text-card-foreground px-2.5 py-1 rounded-full border border-border/50">
                {gender === 'masculino' ? '👨 Masculino' : '👩 Feminino'}
              </span>
              <span className="text-xs font-medium bg-card/80 backdrop-blur-sm text-muted-foreground px-2.5 py-1 rounded-full border border-border/50">
                {hasGenerated ? '✨ IA' : 'Placeholder'}
              </span>
            </div>
          )}

          {/* Floating Randomize button */}
          {onRandomize && !loading && (
            <button
              onClick={onRandomize}
              className="absolute top-3 right-3 flex items-center gap-1.5 rounded-full bg-card/90 backdrop-blur-sm border border-border/50 px-3 py-1.5 text-xs font-medium text-foreground shadow-lg hover:bg-card transition-colors"
            >
              <Dices className="h-3.5 w-3.5" />
              🎲 Randomize
            </button>
          )}
        </div>

        {/* Error message */}
        {error && (
          <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
            {error}
          </div>
        )}

        {/* Generate Button */}
        <Button
          onClick={handleGenerate}
          disabled={loading || !prompt}
          className="w-full h-12 text-base font-semibold gap-2 shadow-card-hover"
          size="lg"
        >
          {loading ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              Gerando...
            </>
          ) : (
            <>
              <Sparkles className="h-5 w-5" />
              {hasGenerated ? '🔄 Regerar Avatar' : '✨ Gerar Avatar'}
            </>
          )}
        </Button>

        {/* Prompt Preview */}
        <AvatarPromptCard prompt={prompt} />
      </div>
    </div>
  );
};

export default AvatarPreview;
