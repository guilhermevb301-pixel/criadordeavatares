import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, RefreshCw, Copy, Download } from 'lucide-react';
import { useUgcGeneration, UgcParams } from '@/hooks/useUgcGeneration';
import { toast } from '@/hooks/use-toast';

const MIN_CHARS = 120;
const MAX_CHARS = 160;

const tonsDeVoz = [
  { value: 'casual', label: '😊 Casual' },
  { value: 'entusiasmado', label: '🔥 Entusiasmado' },
  { value: 'confiante', label: '💪 Confiante' },
  { value: 'amigavel', label: '🤗 Amigável' },
  { value: 'informativo', label: '📚 Informativo' },
];

const charColor = (len: number) => {
  if (len >= MIN_CHARS && len <= MAX_CHARS) return 'text-green-500';
  return 'text-destructive';
};

const typeLabel = (type: string) => {
  switch (type) {
    case 'hook': return { label: '🎣 Hook', variant: 'default' as const };
    case 'cta': return { label: '📢 CTA', variant: 'default' as const };
    default: return { label: '📖 Desenvolvimento', variant: 'secondary' as const };
  }
};

const UgcGeneratorPage = () => {
  const { scenes, isLoading, generate, regenerateScene } = useUgcGeneration();

  const [form, setForm] = useState<UgcParams>({
    produto: '',
    beneficio: '',
    tom: 'casual',
    numCenas: 4,
  });

  const updateField = (field: keyof UgcParams, value: string | number) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleGenerate = () => {
    if (!form.produto.trim() || !form.beneficio.trim()) {
      toast({ title: 'Campos obrigatórios', description: 'Preencha produto e benefício', variant: 'destructive' });
      return;
    }
    generate(form);
  };

  const copyDialogue = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: 'Copiado! 📋' });
  };

  const exportSceneJson = (scene: typeof scenes[0]) => {
    const json = JSON.stringify({ scene: scene.scene, action: scene.action, dialogue: scene.dialogue }, null, 2);
    navigator.clipboard.writeText(json);
    toast({ title: 'JSON copiado! 📋' });
  };

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 md:p-8 max-w-4xl mx-auto w-full">
      <div>
        <h1 className="text-2xl font-bold font-display text-foreground md:text-3xl">
          🎬 Gerador de Cenas UGC
        </h1>
        <p className="text-muted-foreground mt-1">
          Crie cenas estruturadas para vídeos de conteúdo gerado por usuários
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">📋 Configuração</CardTitle>
          <CardDescription>Defina o produto e contexto para gerar as cenas</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Nome do Produto *</Label>
            <Input
              placeholder="Ex: Sérum Vitamina C"
              value={form.produto}
              onChange={e => updateField('produto', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Benefício Principal *</Label>
            <Input
              placeholder="Ex: Pele mais luminosa em 7 dias"
              value={form.beneficio}
              onChange={e => updateField('beneficio', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Tom de Voz</Label>
            <Select value={form.tom} onValueChange={v => updateField('tom', v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {tonsDeVoz.map(t => (
                  <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Número de Cenas: {form.numCenas}</Label>
            <Slider
              min={3}
              max={6}
              step={1}
              value={[form.numCenas]}
              onValueChange={v => updateField('numCenas', v[0])}
              className="mt-2"
            />
          </div>

          <div className="sm:col-span-2">
            <Button onClick={handleGenerate} disabled={isLoading} className="w-full">
              {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Gerando...</> : '🎬 Gerar Cenas UGC'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {scenes.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold font-display text-foreground">📽️ Cenas Geradas</h2>
          {scenes.map((scene, idx) => {
            const tl = typeLabel(scene.type);
            return (
              <Card key={idx} className="overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold">
                        {scene.numero}
                      </span>
                      <Badge variant={tl.variant}>{tl.label}</Badge>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => regenerateScene(idx, form)}
                        disabled={isLoading}
                        title="Regenerar cena"
                      >
                        <RefreshCw className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => copyDialogue(scene.dialogue)}
                        title="Copiar diálogo"
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => exportSceneJson(scene)}
                        title="Exportar JSON"
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <span className="text-xs font-medium text-muted-foreground">🎬 Cenário</span>
                    <p className="text-sm text-foreground">{scene.scene}</p>
                  </div>
                  <div>
                    <span className="text-xs font-medium text-muted-foreground">🎭 Ação</span>
                    <p className="text-sm text-foreground">{scene.action}</p>
                  </div>
                  <div>
                    <span className="text-xs font-medium text-muted-foreground">💬 Diálogo</span>
                    <p className="text-sm text-foreground leading-relaxed">{scene.dialogue}</p>
                    <span className={`text-xs font-mono ${charColor(scene.dialogue.length)}`}>
                      {scene.dialogue.length} chars {scene.dialogue.length >= MIN_CHARS && scene.dialogue.length <= MAX_CHARS ? '✅' : '⚠️'}
                    </span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default UgcGeneratorPage;
