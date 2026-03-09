import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Copy, RefreshCw, Shuffle, MessageCircle, Zap, Type, Video, AlignLeft,
  FileText, X, Download
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import FalaCard from './FalaCard';
import type { Fala, ScriptParams, TransformAction } from '@/hooks/useScriptGeneration';

interface ScriptResultPanelProps {
  falas: Fala[];
  isLoading: boolean;
  params: ScriptParams | null;
  transformedText: string | null;
  onRegenerate: (index: number) => void;
  onTransformFala: (index: number, action: TransformAction) => void;
  onTransformAll: (action: TransformAction) => void;
  onRegenerateAll: () => void;
  onClearTransformed: () => void;
}

const ScriptResultPanel = ({
  falas, isLoading, params, transformedText,
  onRegenerate, onTransformFala, onTransformAll, onRegenerateAll, onClearTransformed
}: ScriptResultPanelProps) => {

  const handleCopyAll = () => {
    const fullScript = falas.map(f => `[${f.funcao}] ${f.audio?.dialogue || f.texto || ''}`).join('\n\n');
    navigator.clipboard.writeText(fullScript);
    toast({ title: 'Roteiro copiado!', description: 'Todas as falas foram copiadas' });
  };

  const handleExportAllJson = () => {
    const exportData = falas.map(f => ({
      setup: f.setup,
      action: f.action,
      audio: f.audio,
    }));
    navigator.clipboard.writeText(JSON.stringify(exportData, null, 2));
    toast({ title: 'JSON completo copiado! 📋' });
  };

  const handleCopyTransformed = () => {
    if (transformedText) {
      navigator.clipboard.writeText(transformedText);
      toast({ title: 'Copiado!', description: 'Texto copiado para a área de transferência' });
    }
  };

  // Empty state
  if (!isLoading && falas.length === 0 && !transformedText) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="text-center max-w-sm space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto">
            <FileText className="w-8 h-8 text-primary/60" />
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-foreground">Seu roteiro aparecerá aqui</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Preencha os campos ao lado e clique em <span className="text-primary font-medium">Gerar Roteiro</span> para criar falas personalizadas para seu clone.
            </p>
          </div>
          <div className="text-muted-foreground/40 text-3xl">←</div>
        </div>
      </div>
    );
  }

  // Loading state
  if (isLoading && falas.length === 0) {
    return (
      <div className="flex-1 p-6 space-y-4">
        <Skeleton className="h-8 w-48" />
        <div className="flex gap-2">
          <Skeleton className="h-6 w-20 rounded-full" />
          <Skeleton className="h-6 w-24 rounded-full" />
          <Skeleton className="h-6 w-16 rounded-full" />
        </div>
        {[1, 2, 3].map(i => (
          <Card key={i} className="border-border/30">
            <CardContent className="p-5 space-y-3">
              <div className="flex items-center gap-3">
                <Skeleton className="w-8 h-8 rounded-full" />
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-5 w-16 rounded-full" />
              </div>
              <Skeleton className="h-12 w-full" />
              <div className="grid grid-cols-2 gap-2">
                <Skeleton className="h-3 w-32" />
                <Skeleton className="h-3 w-28" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-5">
      {/* Transformed text overlay */}
      {transformedText && (
        <Card className="border-primary/30 shadow-glow-accent">
          <CardContent className="p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-primary">✨ Texto Transformado</span>
              <div className="flex gap-1">
                <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={handleCopyTransformed}>
                  <Copy className="w-3 h-3 mr-1" /> Copiar
                </Button>
                <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={onClearTransformed}>
                  <X className="w-3 h-3 mr-1" /> Fechar
                </Button>
              </div>
            </div>
            <p className="text-sm text-foreground whitespace-pre-wrap leading-relaxed">{transformedText}</p>
          </CardContent>
        </Card>
      )}

      {/* Result header */}
      {params && falas.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-lg font-bold text-foreground">📋 Roteiro Gerado</h2>
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary" className="text-xs">{params.plataforma?.toUpperCase()}</Badge>
            <Badge variant="outline" className="text-xs">{params.objetivo}</Badge>
            <Badge variant="outline" className="text-xs">{falas.length} falas</Badge>
            {params.sotaque && params.sotaque !== 'neutro' && (
              <Badge variant="outline" className="text-xs">🗣️ {params.sotaque}</Badge>
            )}
          </div>
        </div>
      )}

      {/* General actions */}
      {falas.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" className="text-xs" onClick={handleCopyAll}>
            <Copy className="w-3 h-3" /> Copiar tudo
          </Button>
          <Button variant="outline" size="sm" className="text-xs" onClick={handleExportAllJson}>
            <Download className="w-3 h-3" /> Exportar JSON
          </Button>
          <Button variant="outline" size="sm" className="text-xs" onClick={onRegenerateAll} disabled={isLoading}>
            <RefreshCw className="w-3 h-3" /> Regenerar
          </Button>
          <Button variant="outline" size="sm" className="text-xs" onClick={() => onTransformAll('variacoes')} disabled={isLoading}>
            <Shuffle className="w-3 h-3" /> Variações
          </Button>
          <Button variant="outline" size="sm" className="text-xs" onClick={() => onTransformAll('mais-natural')} disabled={isLoading}>
            <MessageCircle className="w-3 h-3" /> + Natural
          </Button>
          <Button variant="outline" size="sm" className="text-xs" onClick={() => onTransformAll('mais-agressiva')} disabled={isLoading}>
            <Zap className="w-3 h-3" /> + Agressiva
          </Button>
          <Button variant="outline" size="sm" className="text-xs" onClick={() => onTransformAll('legenda')} disabled={isLoading}>
            <Type className="w-3 h-3" /> Legenda
          </Button>
          <Button variant="outline" size="sm" className="text-xs" onClick={() => onTransformAll('prompt-video')} disabled={isLoading}>
            <Video className="w-3 h-3" /> Prompt Vídeo
          </Button>
          <Button variant="outline" size="sm" className="text-xs" onClick={() => onTransformAll('teleprompter')} disabled={isLoading}>
            <AlignLeft className="w-3 h-3" /> Teleprompter
          </Button>
        </div>
      )}

      {/* Fala cards */}
      {falas.map((fala, idx) => (
        <FalaCard
          key={`${fala.numero}-${(fala.audio?.dialogue || fala.texto || '').slice(0, 20)}`}
          fala={fala}
          index={idx}
          isLoading={isLoading}
          onRegenerate={onRegenerate}
          onTransform={onTransformFala}
        />
      ))}
    </div>
  );
};

export default ScriptResultPanel;
