import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sparkles, Loader2, Settings2, User } from 'lucide-react';
import PresetChips from './PresetChips';
import type { ScriptPreset } from '@/lib/script-presets';
import type { ScriptParams, CloneProfile } from '@/hooks/useScriptGeneration';

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

const arquetipoOptions = [
  { id: 'mentor', label: '🧙 Mentor' },
  { id: 'vendedor', label: '💼 Vendedor' },
  { id: 'especialista', label: '🎓 Especialista' },
  { id: 'amigo', label: '🤝 Amigo' },
  { id: 'provocador', label: '🔥 Provocador' },
  { id: 'premium', label: '👑 Premium' },
];

const energiaOptions = [
  { id: 'baixo', label: '🧘 Baixo' },
  { id: 'medio', label: '⚡ Médio' },
  { id: 'alto', label: '🔥 Alto' },
];

interface ScriptConfigPanelProps {
  isLoading: boolean;
  onGenerate: (params: ScriptParams) => void;
}

const ScriptConfigPanel = ({ isLoading, onGenerate }: ScriptConfigPanelProps) => {
  const [tema, setTema] = useState('');
  const [objetivo, setObjetivo] = useState('');
  const [publicoAlvo, setPublicoAlvo] = useState('');
  const [estiloFala, setEstiloFala] = useState('');
  const [personalidade, setPersonalidade] = useState('');
  const [plataforma, setPlataforma] = useState('');
  const [cta, setCta] = useState('');
  const [numFalas, setNumFalas] = useState(3);
  const [isAdvanced, setIsAdvanced] = useState(false);
  const [activePreset, setActivePreset] = useState<string | null>(null);

  // Clone profile
  const [comoFala, setComoFala] = useState('');
  const [palavrasUsa, setPalavrasUsa] = useState('');
  const [palavrasEvita, setPalavrasEvita] = useState('');
  const [nivelEnergia, setNivelEnergia] = useState('');
  const [arquetipo, setArquetipo] = useState('');
  const [tomEmocional, setTomEmocional] = useState('');

  const canGenerate = tema && objetivo && publicoAlvo && estiloFala && personalidade && plataforma;

  const getParams = (): ScriptParams => {
    const params: ScriptParams = { tema, objetivo, publicoAlvo, estiloFala, personalidade, plataforma, cta, numFalas };
    if (isAdvanced) {
      params.cloneProfile = { comoFala, palavrasUsa, palavrasEvita, nivelEnergia, arquetipo, tomEmocional };
    }
    return params;
  };

  const handlePreset = (preset: ScriptPreset) => {
    setActivePreset(preset.id);
    setTema(preset.tema);
    setObjetivo(preset.objetivo);
    setPublicoAlvo(preset.publicoAlvo);
    setEstiloFala(preset.estiloFala);
    setPersonalidade(preset.personalidade);
    setPlataforma(preset.plataforma);
    setCta(preset.cta);
  };

  const handleGenerate = () => {
    if (!canGenerate) return;
    onGenerate(getParams());
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto space-y-5 p-5">
        {/* Presets */}
        <PresetChips activePreset={activePreset} onSelect={handlePreset} />

        {/* Mode toggle */}
        <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/30 border border-border">
          <div className="flex items-center gap-2 text-sm">
            <Settings2 className="w-4 h-4 text-muted-foreground" />
            <span className="text-muted-foreground">Modo Avançado</span>
          </div>
          <Switch checked={isAdvanced} onCheckedChange={setIsAdvanced} />
        </div>

        {/* Basic fields */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">🎬 Tema do vídeo *</Label>
            <Input value={tema} onChange={e => setTema(e.target.value)} placeholder="Ex: Como usar IA para vender mais" className="bg-secondary/30 border-border" />
          </div>

          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">🎯 Objetivo *</Label>
            <Input value={objetivo} onChange={e => setObjetivo(e.target.value)} placeholder="Ex: Gerar curiosidade e leads qualificados" className="bg-secondary/30 border-border" />
          </div>

          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">👥 Público-alvo *</Label>
            <Input value={publicoAlvo} onChange={e => setPublicoAlvo(e.target.value)} placeholder="Ex: Empreendedores digitais 25-45 anos" className="bg-secondary/30 border-border" />
          </div>

          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">🧠 Personalidade do clone *</Label>
            <Input value={personalidade} onChange={e => setPersonalidade(e.target.value)} placeholder="Ex: Especialista confiante e acessível" className="bg-secondary/30 border-border" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">🗣️ Estilo *</Label>
              <Select value={estiloFala} onValueChange={setEstiloFala}>
                <SelectTrigger className="bg-secondary/30 border-border"><SelectValue placeholder="Selecione" /></SelectTrigger>
                <SelectContent>
                  {estiloOptions.map(opt => (
                    <SelectItem key={opt.id} value={opt.id}>{opt.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">📱 Plataforma *</Label>
              <Select value={plataforma} onValueChange={setPlataforma}>
                <SelectTrigger className="bg-secondary/30 border-border"><SelectValue placeholder="Selecione" /></SelectTrigger>
                <SelectContent>
                  {plataformaOptions.map(opt => (
                    <SelectItem key={opt.id} value={opt.id}>{opt.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">📢 CTA final (opcional)</Label>
            <Input value={cta} onChange={e => setCta(e.target.value)} placeholder="Ex: Clique no link da bio e comece agora" className="bg-secondary/30 border-border" />
          </div>

          {/* Slider */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-xs text-muted-foreground">🔢 Número de falas</Label>
              <span className="text-sm font-semibold text-primary">{numFalas}</span>
            </div>
            <Slider value={[numFalas]} onValueChange={v => setNumFalas(v[0])} min={2} max={5} step={1} />
            <p className="text-[10px] text-muted-foreground leading-relaxed">
              Cada fala será gerada entre 80 e 140 caracteres para manter naturalidade, ritmo e boa performance em vídeo.
            </p>
          </div>
        </div>

        {/* Advanced: Clone Profile */}
        {isAdvanced && (
          <div className="space-y-4 pt-2 border-t border-border">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-primary" />
              <span className="text-sm font-semibold text-foreground">Perfil do Clone</span>
            </div>

            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">💬 Como esse clone fala?</Label>
              <Input value={comoFala} onChange={e => setComoFala(e.target.value)} placeholder="Ex: De forma direta, com gírias paulistas" className="bg-secondary/30 border-border" />
            </div>

            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">✅ Palavras que costuma usar</Label>
              <Input value={palavrasUsa} onChange={e => setPalavrasUsa(e.target.value)} placeholder="Ex: tipo, mano, é nóis, bora" className="bg-secondary/30 border-border" />
            </div>

            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">🚫 Palavras que evita</Label>
              <Input value={palavrasEvita} onChange={e => setPalavrasEvita(e.target.value)} placeholder="Ex: basicamente, outrossim, mediante" className="bg-secondary/30 border-border" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">⚡ Energia</Label>
                <Select value={nivelEnergia} onValueChange={setNivelEnergia}>
                  <SelectTrigger className="bg-secondary/30 border-border"><SelectValue placeholder="Nível" /></SelectTrigger>
                  <SelectContent>
                    {energiaOptions.map(opt => (
                      <SelectItem key={opt.id} value={opt.id}>{opt.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">🎭 Arquétipo</Label>
                <Select value={arquetipo} onValueChange={setArquetipo}>
                  <SelectTrigger className="bg-secondary/30 border-border"><SelectValue placeholder="Tipo" /></SelectTrigger>
                  <SelectContent>
                    {arquetipoOptions.map(opt => (
                      <SelectItem key={opt.id} value={opt.id}>{opt.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">💛 Tom emocional dominante</Label>
              <Input value={tomEmocional} onChange={e => setTomEmocional(e.target.value)} placeholder="Ex: Inspirador mas com pé no chão" className="bg-secondary/30 border-border" />
            </div>
          </div>
        )}
      </div>

      {/* Generate button - sticky bottom */}
      <div className="p-5 border-t border-border">
        <Button
          onClick={handleGenerate}
          disabled={!canGenerate || isLoading}
          size="lg"
          className="w-full text-base font-semibold"
        >
          {isLoading ? (
            <><Loader2 className="animate-spin" /> Gerando roteiro...</>
          ) : (
            <><Sparkles /> Gerar Roteiro</>
          )}
        </Button>
      </div>
    </div>
  );
};

export default ScriptConfigPanel;
