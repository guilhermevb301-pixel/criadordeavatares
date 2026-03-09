import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Copy, Check, RefreshCw, MessageCircle, Zap, ArrowDown, ArrowUp, Download } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import type { Fala, TransformAction } from '@/hooks/useScriptGeneration';

const MIN_CHARS = 80;
const MAX_CHARS = 140;

const funcaoBadgeColors: Record<string, string> = {
  Hook: 'bg-primary/20 text-primary border-primary/30',
  Contexto: 'bg-accent/20 text-accent-foreground border-accent/30',
  Desenvolvimento: 'bg-secondary text-secondary-foreground border-border',
  Virada: 'bg-destructive/15 text-destructive border-destructive/30',
  CTA: 'bg-primary/25 text-primary border-primary/40',
};

interface FalaCardProps {
  fala: Fala;
  index: number;
  isLoading: boolean;
  onRegenerate: (index: number) => void;
  onTransform: (index: number, action: TransformAction) => void;
}

const FalaCard = ({ fala, index, isLoading, onRegenerate, onTransform }: FalaCardProps) => {
  const [copied, setCopied] = useState(false);

  const dialogueText = fala.audio?.dialogue || fala.texto || '';
  const charCount = dialogueText.length;
  const charOk = charCount >= MIN_CHARS && charCount <= MAX_CHARS;

  const handleCopy = () => {
    navigator.clipboard.writeText(dialogueText);
    setCopied(true);
    toast({ title: 'Copiado!', description: 'Fala copiada para a área de transferência' });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExportJson = () => {
    const exportObj = {
      setup: fala.setup,
      action: fala.action,
      audio: fala.audio,
    };
    navigator.clipboard.writeText(JSON.stringify(exportObj, null, 2));
    toast({ title: 'JSON copiado! 📋' });
  };

  return (
    <Card className="border-border/50 shadow-card hover:shadow-card-hover transition-all duration-300 overflow-hidden group">
      <CardContent className="p-5 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-primary/15 flex items-center justify-center text-sm font-bold text-primary">
              {fala.numero}
            </div>
            <span className="text-sm font-semibold text-foreground">Fala {fala.numero}</span>
            <Badge variant="outline" className={`text-[10px] px-2 py-0.5 ${funcaoBadgeColors[fala.funcao] || 'bg-secondary text-secondary-foreground'}`}>
              {fala.funcao}
            </Badge>
          </div>
          <span className={`text-xs font-mono ${charOk ? 'text-green-500' : 'text-destructive'}`}>
            {charCount}/{MAX_CHARS} {charOk ? '✅' : '⚠️'}
          </span>
        </div>

        {/* Setup section */}
        {fala.setup && (
          <div className="space-y-1">
            <span className="text-xs font-semibold text-primary">📐 Setup</span>
            <div className="grid grid-cols-2 gap-1.5 text-xs text-muted-foreground">
              <div>🎬 <span className="font-medium text-foreground">{fala.setup.scene}</span></div>
              <div>📷 <span className="font-medium text-foreground">{fala.setup.camera}</span></div>
              <div>🎨 <span className="font-medium text-foreground">{fala.setup.style}</span></div>
              <div>📐 <span className="font-medium text-foreground">{fala.setup.aspect_ratio} · {fala.setup.fps}fps · {fala.setup.duration_seconds}s</span></div>
            </div>
          </div>
        )}

        {/* Action section */}
        {fala.action && (
          <div className="space-y-1">
            <span className="text-xs font-semibold text-primary">🎭 Action</span>
            <div className="text-xs text-muted-foreground">
              <div>👤 <span className="font-medium text-foreground">{fala.action.subject}</span></div>
              <div>🏃 <span className="font-medium text-foreground">{fala.action.movement}</span></div>
            </div>
          </div>
        )}

        {/* Audio/Dialogue */}
        <div className="space-y-1">
          <span className="text-xs font-semibold text-primary">🔊 Audio</span>
          <p className="text-foreground text-[15px] leading-relaxed font-medium">
            "{dialogueText}"
          </p>
          {fala.audio?.voice && (
            <span className="text-xs text-muted-foreground">🎤 {fala.audio.voice}</span>
          )}
        </div>

        {/* Legacy meta (backwards compat) */}
        {!fala.setup && (
          <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
            {fala.expressao && <div>🎭 <span className="font-medium">{fala.expressao}</span></div>}
            {fala.intencao && <div>💡 <span className="font-medium">{fala.intencao}</span></div>}
            {fala.gesto && <div>🤲 <span className="font-medium">{fala.gesto}</span></div>}
            {fala.enquadramento && <div>📷 <span className="font-medium">{fala.enquadramento}</span></div>}
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-wrap gap-1.5 pt-1 opacity-70 group-hover:opacity-100 transition-opacity">
          <Button variant="ghost" size="sm" className="h-7 text-xs px-2" onClick={handleCopy} disabled={isLoading}>
            {copied ? <Check className="w-3 h-3 mr-1" /> : <Copy className="w-3 h-3 mr-1" />}
            {copied ? 'Copiado' : 'Copiar'}
          </Button>
          <Button variant="ghost" size="sm" className="h-7 text-xs px-2" onClick={handleExportJson} disabled={isLoading}>
            <Download className="w-3 h-3 mr-1" /> JSON
          </Button>
          <Button variant="ghost" size="sm" className="h-7 text-xs px-2" onClick={() => onRegenerate(index)} disabled={isLoading}>
            <RefreshCw className="w-3 h-3 mr-1" /> Regenerar
          </Button>
          <Button variant="ghost" size="sm" className="h-7 text-xs px-2" onClick={() => onTransform(index, 'mais-natural')} disabled={isLoading}>
            <MessageCircle className="w-3 h-3 mr-1" /> Natural
          </Button>
          <Button variant="ghost" size="sm" className="h-7 text-xs px-2" onClick={() => onTransform(index, 'mais-persuasiva')} disabled={isLoading}>
            <Zap className="w-3 h-3 mr-1" /> Persuasiva
          </Button>
          <Button variant="ghost" size="sm" className="h-7 text-xs px-2" onClick={() => onTransform(index, 'encurtar')} disabled={isLoading}>
            <ArrowDown className="w-3 h-3 mr-1" /> Encurtar
          </Button>
          <Button variant="ghost" size="sm" className="h-7 text-xs px-2" onClick={() => onTransform(index, 'expandir')} disabled={isLoading}>
            <ArrowUp className="w-3 h-3 mr-1" /> Expandir
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default FalaCard;
