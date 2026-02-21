import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileText, Sparkles, Copy, Check } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const toneOptions = [
  { id: 'profissional', label: 'Profissional' },
  { id: 'casual', label: 'Casual' },
  { id: 'engracado', label: 'Engraçado' },
  { id: 'urgente', label: 'Urgente' },
  { id: 'educativo', label: 'Educativo' },
  { id: 'inspirador', label: 'Inspirador' },
];

interface ScriptResult {
  id: number;
  title: string;
  hook: string;
  body: string;
  cta: string;
}

const generatePlaceholderScripts = (
  produto: string,
  nicho: string,
  publico: string,
  tom: string,
  qty: number
): ScriptResult[] => {
  return Array.from({ length: qty }, (_, i) => ({
    id: i + 1,
    title: `Roteiro ${i + 1} — ${produto}`,
    hook: `🎯 Hook: "Você sabia que ${publico} está perdendo dinheiro por não usar ${produto}?"`,
    body: `📝 Corpo: Apresente o ${produto} como a solução ideal para o nicho de ${nicho}. Use tom ${tom}. Mostre 2-3 benefícios principais e inclua prova social.`,
    cta: `🚀 CTA: "Clique no link da bio e descubra como o ${produto} pode transformar seus resultados!"`,
  }));
};

const ScriptGeneratorPage = () => {
  const [produto, setProduto] = useState('');
  const [nicho, setNicho] = useState('');
  const [publico, setPublico] = useState('');
  const [tom, setTom] = useState('');
  const [qty, setQty] = useState(3);
  const [results, setResults] = useState<ScriptResult[]>([]);
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const canGenerate = produto && nicho && publico && tom;

  const handleGenerate = () => {
    if (!canGenerate) return;
    const scripts = generatePlaceholderScripts(produto, nicho, publico, tom, qty);
    setResults(scripts);
  };

  const handleCopy = async (script: ScriptResult) => {
    const text = `${script.title}\n\n${script.hook}\n\n${script.body}\n\n${script.cta}`;
    await navigator.clipboard.writeText(text);
    setCopiedId(script.id);
    setTimeout(() => setCopiedId(null), 1600);
  };

  const getCharCount = (script: ScriptResult) => {
    return `${script.hook}\n${script.body}\n${script.cta}`.length;
  };

  return (
    <div className="flex flex-1 flex-col p-6 md:p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold font-display text-foreground md:text-3xl">
          Gerar Roteiros UGC
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Crie scripts persuasivos para vídeos de conteúdo gerado por usuários
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[400px_1fr]">
        {/* Form */}
        <div className="space-y-5">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-card space-y-5">
            <div className="space-y-2">
              <Label htmlFor="produto">Produto</Label>
              <Input
                id="produto"
                placeholder="Ex: Sérum facial anti-idade"
                value={produto}
                onChange={(e) => setProduto(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="nicho">Nicho</Label>
              <Input
                id="nicho"
                placeholder="Ex: Skincare, Fitness, Tech"
                value={nicho}
                onChange={(e) => setNicho(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="publico">Público-alvo</Label>
              <Input
                id="publico"
                placeholder="Ex: Mulheres 25-35 anos"
                value={publico}
                onChange={(e) => setPublico(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Tom do Avatar</Label>
              <Select value={tom} onValueChange={setTom}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tom" />
                </SelectTrigger>
                <SelectContent>
                  {toneOptions.map((t) => (
                    <SelectItem key={t.id} value={t.id}>
                      {t.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Quantidade de vídeos</Label>
                <span className="text-sm font-semibold text-accent-foreground">{qty}</span>
              </div>
              <Slider
                value={[qty]}
                onValueChange={(v) => setQty(v[0])}
                min={1}
                max={10}
                step={1}
              />
            </div>

            <Button
              onClick={handleGenerate}
              disabled={!canGenerate}
              className="w-full"
              size="lg"
            >
              <Sparkles className="h-4 w-4 mr-2" />
              Gerar Roteiros
            </Button>
          </div>
        </div>

        {/* Results */}
        <div className="space-y-4">
          {results.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card/50 p-12 text-center">
              <FileText className="h-12 w-12 text-muted-foreground/40 mb-4" />
              <h3 className="text-lg font-semibold font-display text-muted-foreground">
                Nenhum roteiro gerado
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                Preencha o formulário e clique em "Gerar Roteiros"
              </p>
            </div>
          ) : (
            results.map((script) => (
              <div
                key={script.id}
                className="rounded-2xl border border-border bg-card p-6 shadow-card animate-in fade-in slide-in-from-bottom-2 duration-300"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base font-semibold font-display text-card-foreground">
                    {script.title}
                  </h3>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs">
                      {getCharCount(script)} chars
                    </Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCopy(script)}
                    >
                      {copiedId === script.id ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
                <div className="space-y-3 rounded-lg bg-secondary p-4 text-sm text-foreground leading-relaxed">
                  <p>{script.hook}</p>
                  <p>{script.body}</p>
                  <p>{script.cta}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ScriptGeneratorPage;
