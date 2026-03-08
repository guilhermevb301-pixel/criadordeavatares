import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileText, Sparkles, Copy, Check, RefreshCw, Loader2 } from 'lucide-react';
import { useScriptGeneration, type ScriptParams } from '@/hooks/useScriptGeneration';
import { toast } from '@/hooks/use-toast';

const estiloOptions = [
  { id: 'casual', label: '😎 Casual' },
  { id: 'profissional', label: '💼 Profissional' },
  { id: 'energico', label: '⚡ Enérgico' },
  { id: 'calmo', label: '🧘 Calmo' },
  { id: 'humoristico', label: '😂 Humorístico' },
];

const plataformaOptions = [
  { id: 'tiktok', label: '🎵 TikTok' },
  { id: 'reels', label: '📸 Reels' },
  { id: 'shorts', label: '▶️ Shorts' },
  { id: 'linkedin', label: '💼 LinkedIn' },
];

const MIN_CHARS = 80;
const MAX_CHARS = 140;

const ScriptGeneratorPage = () => {
  const [tema, setTema] = useState('');
  const [objetivo, setObjetivo] = useState('');
  const [publicoAlvo, setPublicoAlvo] = useState('');
  const [estiloFala, setEstiloFala] = useState('');
  const [personalidade, setPersonalidade] = useState('');
  const [plataforma, setPlataforma] = useState('');
  const [cta, setCta] = useState('');
  const [numFalas, setNumFalas] = useState(5);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  const { falas, isLoading, generate, regenerateFala } = useScriptGeneration();

  const canGenerate = tema && objetivo && publicoAlvo && estiloFala && personalidade && plataforma;

  const getParams = (): ScriptParams => ({
    tema, objetivo, publicoAlvo, estiloFala, personalidade, plataforma, cta, numFalas,
  });

  const handleGenerate = () => {
    if (!canGenerate) return;
    generate(getParams());
  };

  const handleCopy = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    toast({ title: 'Copiado!', description: 'Texto copiado para a área de transferência' });
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  const handleCopyAll = () => {
    const fullScript = falas.map(f => `[Fala ${f.numero}] ${f.texto}`).join('\n\n');
    navigator.clipboard.writeText(fullScript);
    toast({ title: 'Roteiro copiado!', description: 'Todas as falas copiadas' });
  };

  const charColor = (len: number) => {
    if (len >= MIN_CHARS && len <= MAX_CHARS) return 'text-green-500';
    return 'text-destructive';
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2.5 rounded-xl bg-primary/10">
            <FileText className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Gerador de Roteiro</h1>
            <p className="text-sm text-muted-foreground">Crie roteiros para seu clone de IA com falas naturais</p>
          </div>
        </div>

        {/* Form */}
        <div className="grid gap-6 mb-8">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>🎬 Tema do vídeo *</Label>
              <Input value={tema} onChange={e => setTema(e.target.value)} placeholder="Ex: Como usar IA para vender mais" />
            </div>
            <div className="space-y-2">
              <Label>🎯 Objetivo *</Label>
              <Input value={objetivo} onChange={e => setObjetivo(e.target.value)} placeholder="Ex: Gerar curiosidade e leads" />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>👥 Público-alvo *</Label>
              <Input value={publicoAlvo} onChange={e => setPublicoAlvo(e.target.value)} placeholder="Ex: Empreendedores digitais 25-45 anos" />
            </div>
            <div className="space-y-2">
              <Label>🧠 Personalidade do clone *</Label>
              <Input value={personalidade} onChange={e => setPersonalidade(e.target.value)} placeholder="Ex: Especialista confiante e acessível" />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>🗣️ Estilo de fala *</Label>
              <Select value={estiloFala} onValueChange={setEstiloFala}>
                <SelectTrigger><SelectValue placeholder="Selecione o estilo" /></SelectTrigger>
                <SelectContent>
                  {estiloOptions.map(opt => (
                    <SelectItem key={opt.id} value={opt.id}>{opt.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>📱 Plataforma *</Label>
              <Select value={plataforma} onValueChange={setPlataforma}>
                <SelectTrigger><SelectValue placeholder="Selecione a plataforma" /></SelectTrigger>
                <SelectContent>
                  {plataformaOptions.map(opt => (
                    <SelectItem key={opt.id} value={opt.id}>{opt.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>📢 CTA final (opcional)</Label>
            <Input value={cta} onChange={e => setCta(e.target.value)} placeholder="Ex: Clique no link da bio e comece agora" />
          </div>

          <div className="space-y-3">
            <Label>🔢 Número de falas: {numFalas}</Label>
            <Slider
              value={[numFalas]}
              onValueChange={v => setNumFalas(v[0])}
              min={3}
              max={10}
              step={1}
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>3</span><span>10</span>
            </div>
          </div>

          <Button
            onClick={handleGenerate}
            disabled={!canGenerate || isLoading}
            size="lg"
            className="w-full"
          >
            {isLoading ? (
              <><Loader2 className="animate-spin" /> Gerando roteiro...</>
            ) : (
              <><Sparkles /> Gerar Roteiro</>
            )}
          </Button>
        </div>

        {/* Results */}
        {falas.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-foreground">📋 Roteiro ({falas.length} falas)</h2>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handleCopyAll}>
                  <Copy className="w-3.5 h-3.5" /> Copiar tudo
                </Button>
                <Button variant="outline" size="sm" onClick={handleGenerate} disabled={isLoading}>
                  <RefreshCw className="w-3.5 h-3.5" /> Regenerar
                </Button>
              </div>
            </div>

            {falas.map((fala, idx) => (
              <Card key={idx} className="overflow-hidden">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
                        {fala.numero}
                      </div>
                      <Badge variant="secondary">{fala.intencao}</Badge>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleCopy(fala.texto, idx)}
                      >
                        {copiedIdx === idx ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => regenerateFala(idx, getParams())}
                        disabled={isLoading}
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>

                  <p className="text-foreground leading-relaxed mb-3">"{fala.texto}"</p>

                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">🎭 {fala.expressao}</span>
                    <span className={charColor(fala.texto.length)}>
                      {fala.texto.length} chars {fala.texto.length >= MIN_CHARS && fala.texto.length <= MAX_CHARS ? '✅' : '⚠️'}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ScriptGeneratorPage;
