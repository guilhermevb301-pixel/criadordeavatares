import { useState, useEffect } from 'react';
import { Copy, Check, ChevronUp, FileText, Wand2, Download, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useImageGeneration } from '@/hooks/useImageGeneration';
import { useToast } from '@/hooks/use-toast';

interface PromptPreviewProps {
  prompt: string;
  mobile?: boolean;
}

const GeneratedImage = ({ imageUrl, onDownload }: { imageUrl: string; onDownload: () => void }) => (
  <div className="mt-4 space-y-3">
    <h4 className="text-sm font-semibold text-card-foreground">🖼️ Imagem Gerada</h4>
    <img src={imageUrl} alt="Avatar gerado" className="w-full rounded-lg border border-border" />
    <Button onClick={onDownload} variant="outline" className="w-full" size="sm">
      <Download className="h-4 w-4 mr-2" />
      Baixar Imagem
    </Button>
  </div>
);

const PromptPreview = ({ prompt, mobile }: PromptPreviewProps) => {
  const [copied, setCopied] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { generateImage, imageUrl, loading, error, reset } = useImageGeneration();
  const { toast } = useToast();

  const handleCopy = async () => {
    await navigator.clipboard.writeText(prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  const handleGenerate = async () => {
    reset();
    await generateImage(prompt);
  };

  useEffect(() => {
    if (error) {
      toast({ title: '❌ Erro', description: error, variant: 'destructive' });
    }
  }, [error, toast]);

  const handleDownload = () => {
    if (!imageUrl) return;
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `avatar-${Date.now()}.png`;
    link.click();
  };

  if (mobile) {
    return (
      <>
        {mobileOpen && (
          <div className="mb-2 rounded-xl border border-border bg-card p-4 shadow-card-hover animate-in slide-in-from-bottom-4 duration-300">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold font-display text-card-foreground">
                Prompt Gerado (Inglês)
              </h3>
              <button onClick={() => setMobileOpen(false)} className="text-muted-foreground">
                <ChevronUp className="h-4 w-4" />
              </button>
            </div>
            <div className="mb-3 max-h-48 overflow-y-auto rounded-lg bg-secondary p-3 text-sm text-foreground leading-relaxed">
              {prompt}
            </div>
            <div className="space-y-2">
              <Button onClick={handleCopy} className="w-full" size="sm">
                {copied ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
                {copied ? 'Copiado!' : 'Copiar Prompt'}
              </Button>
              <Button onClick={handleGenerate} className="w-full" size="sm" disabled={loading} variant="secondary">
                {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Wand2 className="h-4 w-4 mr-2" />}
                {loading ? 'Gerando...' : '🪄 Gerar Imagem com IA'}
              </Button>
            </div>
            {imageUrl && <GeneratedImage imageUrl={imageUrl} onDownload={handleDownload} />}
          </div>
        )}
        {!mobileOpen && (
          <Button
            onClick={() => setMobileOpen(true)}
            className="w-full shadow-card-hover"
            size="lg"
          >
            <FileText className="h-4 w-4 mr-2" />
            Ver Prompt
          </Button>
        )}
      </>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-card">
      <h3 className="mb-1 text-lg font-bold font-display text-card-foreground">
        Prompt Gerado
      </h3>
      <p className="mb-4 text-xs text-muted-foreground">
        Inglês — otimizado para geradores de imagem IA
      </p>
      <div className="mb-4 rounded-lg bg-secondary p-4 text-sm text-foreground leading-relaxed min-h-[120px] transition-all duration-300">
        {prompt}
      </div>
      <div className="space-y-2">
        <Button onClick={handleCopy} className="w-full" size="default">
          {copied ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
          {copied ? 'Prompt Copiado!' : 'Copiar Prompt'}
        </Button>
        <Button onClick={handleGenerate} className="w-full" size="default" disabled={loading} variant="secondary">
          {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Wand2 className="h-4 w-4 mr-2" />}
          {loading ? 'Gerando imagem... ⏳' : '🪄 Gerar Imagem com IA'}
        </Button>
      </div>
      {imageUrl && <GeneratedImage imageUrl={imageUrl} onDownload={handleDownload} />}
    </div>
  );
};

export default PromptPreview;
