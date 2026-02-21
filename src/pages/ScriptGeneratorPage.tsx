import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileText, Sparkles, Copy, Check, RefreshCw } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const toneOptions = [
  { id: 'profissional', label: 'Profissional' },
  { id: 'casual', label: 'Casual' },
  { id: 'engracado', label: 'Engraçado' },
  { id: 'urgente', label: 'Urgente' },
  { id: 'educativo', label: 'Educativo' },
  { id: 'inspirador', label: 'Inspirador' },
];

const rangeOptions = [
  { id: 'parado', label: 'Parado', action: 'Gesticula levemente com as mãos enquanto fala, olha direto para a câmera com expressão natural' },
  { id: 'produto', label: 'Com produto', action: 'Segura o produto na altura do peito, gesticula com uma mão enquanto apresenta com a outra' },
  { id: 'pessoa', label: 'Com pessoa', action: 'Gesticula em direção à pessoa ao lado enquanto fala, alterna o olhar entre a câmera e o interlocutor' },
];

interface UGCPrompt {
  id: number;
  scene: string;
  action: string;
  audio: {
    dialogue: string;
  };
}

const scenePool = [
  'Iluminação natural suave vinda de janela lateral, fundo desfocado com plantas e objetos do cotidiano',
  'Ambiente externo urbano com luz dourada do fim de tarde, profundidade de campo curta',
  'Quarto bem iluminado com ring light frontal, fundo clean e organizado',
  'Cozinha moderna com bancada visível, luz branca equilibrada e elementos decorativos',
  'Escritório home office com monitor ao fundo desfocado, iluminação mista natural e artificial',
  'Banheiro com espelho e iluminação frontal forte, vapor leve ao fundo',
  'Sala de estar aconchegante com sofá e almofadas, luz quente de abajur lateral',
  'Varanda com vista urbana desfocada, luz natural direta filtrada por cortina',
  'Estúdio minimalista com fundo neutro, iluminação profissional de três pontos',
  'Café ou restaurante com ambiente movimentado ao fundo desfocado, luz ambiente quente',
];

// Dialogue groups: each group is a sequential narrative (part 1 introduces, 2 develops, 3 deepens, 4 concludes, 5 wraps)
const dialogueGroups: Record<string, string[][]> = {
  profissional: [
    [
      'Depois de testar diversas alternativas no mercado, posso afirmar com segurança que este produto entrega resultados consistentes e mensuráveis',
      'A diferença que percebi nos primeiros dias foi significativa, os dados comprovam uma eficácia que supera qualquer expectativa inicial',
      'Os profissionais da área já reconhecem como referência e os resultados falam por si, sem necessidade de exagero algum',
      'Em termos de custo-benefício, a performance entregue justifica cada centavo investido e os resultados são realmente duradouros',
      'Recomendo sem hesitação para quem busca resultado real, a qualidade dos ingredientes faz toda a diferença no longo prazo',
    ],
    [
      'Analisei criteriosamente cada componente e a formulação é realmente superior ao que encontramos no mercado atualmente disponível',
      'Os resultados aparecem de forma gradual porém consistente, exatamente como prometido pela marca em seus estudos clínicos publicados',
      'Minha equipe inteira adotou este produto após ver meus resultados pessoais nas primeiras semanas de uso contínuo e regular',
      'O diferencial está nos detalhes técnicos que poucos percebem, a tecnologia empregada garante uma experiência verdadeiramente superior',
      'Já avaliei centenas de produtos similares na carreira e este se destaca pela formulação inteligente e resultados sem ajustes',
    ],
  ],
  casual: [
    [
      'Gente, eu não acreditei quando vi o resultado, tipo uso há duas semanas e já tô vendo diferença real sem frescura nenhuma',
      'Tava mega cética no começo, confesso, mas aí comecei a usar e caramba o negócio entrega o que promete de verdade mesmo',
      'Olha, vou ser sincera com vocês, testei um monte de coisa parecida e nada chegou perto disso aqui, a diferença é gritante',
      'Não é publi não, tô falando sério, comprei com meu dinheiro e amei tanto que precisei vir contar pra vocês agora',
      'Se alguém me perguntasse qual produto indicar sem pensar duas vezes seria esse aqui, praticidade resultado visível e preço justo',
    ],
    [
      'Sabe aquele produto que você descobre e fica tipo por que não conheci antes? Então é exatamente isso, simples de usar demais',
      'Minha amiga me indicou e eu pensei que era exagero dela, spoiler não era, depois de uma semana já entendi o hype todo',
      'Comecei a usar meio desacreditada e hoje não largo mais, é daqueles que viram essenciais na rotina e você não vive sem',
      'Galera, achei que ia ser mais do mesmo mas esse produto me surpreendeu de verdade, textura resultado tudo diferente do resto',
      'Vou mostrar o antes e depois porque não tem como explicar só com palavras, o resultado fala por si e aparece rápido',
    ],
  ],
  engracado: [
    [
      'Meu marido perguntou se eu troquei de rosto, não troquei não amor só descobri um produto que realmente funciona de verdade',
      'Passei vergonha na farmácia comprando cinco unidades de uma vez, a atendente olhou e eu disse que era estoque estratégico pessoal',
      'Minha mãe ligou preocupada achando que eu tinha feito procedimento, mãe calma é só um produto bom ela já pediu o link',
      'Acordei bonita hoje e levei um susto, fui ver o que mudou na rotina e lembrei que comecei a usar semana passada',
      'Meus amigos acham que estou mentindo quando digo que é só esse produto, começaram a revistar meu banheiro procurando segredo',
    ],
    [
      'Comprei escondido do meu orçamento mensal e meu contador interno está em pânico, mas minha pele está tão bem que compensa',
      'Fiz um estoque tão grande que minha gaveta virou praticamente uma filial da loja, minha colega perguntou se abri negócio',
      'Tentei não gostar pra economizar juro que tentei, mas não tem como o produto é bom demais e agora carteira que lute',
      'Minha dermatologista perguntou o que eu mudei na rotina, mostrei o produto e ela anotou o nome isso diz tudo gente',
      'O entregador já me conhece pelo nome de tanto que peço, chegou e disse parabéns pelo estoque dona cliente especial mesmo',
    ],
  ],
  urgente: [
    [
      'Preciso te contar isso agora porque o estoque está acabando rápido, esse produto mudou completamente minha rotina em poucos dias',
      'Não espera mais pra testar isso, eu adiei por meses e me arrependo de cada dia que perdi sem usar na rotina',
      'Todo mundo que eu conheço já está usando e quem não começou vai ficar pra trás, os resultados são visíveis rápido',
      'Escuta eu sei que você já ouviu isso antes mas dessa vez é diferente de verdade, comecei ontem e já vi mudança',
      'Corre que a promoção dura pouco e esse produto vale cada centavo mesmo no preço cheio, resultados em uma semana',
    ],
    [
      'Para tudo que você está fazendo e presta atenção nisso, esse produto vai mudar sua rotina e você vai me agradecer',
      'Se tem uma coisa que me arrependo é de não ter começado antes, cada dia sem usar é resultado perdido de verdade',
      'Não tenho tempo pra enrolação então vou direto ao ponto funciona é rápido e o resultado aparece antes do que imagina',
      'Última vez que vi esse preço foi há seis meses, se está em dúvida essa é a hora certa de experimentar agora',
      'Cada dia que passa sem testar é um dia a menos de resultado, não adia mais e começa hoje mesmo sem desculpa',
    ],
  ],
  educativo: [
    [
      'O que diferencia esse produto é a composição baseada em estudos recentes, cada ingrediente foi selecionado por eficácia comprovada',
      'Muita gente não sabe mas a maioria dos produtos similares usa concentrações abaixo do necessário, este trabalha na dosagem ideal',
      'Os ativos penetram nas camadas mais profundas e estimulam a regeneração natural, por isso os resultados são realmente duradouros',
      'É importante entender que resultado de verdade leva tempo e consistência, este produto respeita o ciclo natural do organismo',
      'A ciência por trás é fascinante, utiliza tecnologia de liberação controlada que mantém os ativos trabalhando por muito mais tempo',
    ],
    [
      'Pesquisei bastante antes de escolher e o que me convenceu foram os dados clínicos com noventa e dois por cento de aprovação',
      'Muitos produtos prometem resultado rápido e entregam irritação, este foi formulado com pH balanceado e ativos encapsulados seguros',
      'Quero que entendam o porquê funciona e não apenas que funciona, a base científica é sólida e transparente com estudos',
      'O segredo está na sinergia entre os componentes, isolados funcionam bem mas juntos potencializam o efeito em até três vezes',
      'Analisei a composição completa e cada ingrediente tem função clara e complementar, sem componentes desnecessários na formulação toda',
    ],
  ],
  inspirador: [
    [
      'Cuidar de si mesmo não é vaidade é um ato de amor próprio, quando descobri esse produto entendi que mereço o melhor',
      'Cada pequena mudança na rotina pode transformar como você se sente, esse produto foi o primeiro passo de uma jornada nova',
      'Você merece se olhar no espelho e se sentir incrível todos os dias, esse produto me devolveu a confiança que perdi',
      'Não é sobre perfeição é sobre se sentir bem na própria pele, desde que comecei minha relação comigo mudou muito',
      'A melhor versão de você está a uma decisão de distância, comecei com um produto simples e colho resultados incríveis',
    ],
    [
      'Quando você investe em algo que realmente funciona o retorno vai além do físico, a confiança impacta todas as áreas',
      'Todo mundo merece ter acesso a produtos que cumprem o que prometem, encontrar este foi um divisor de águas pra mim',
      'A transformação começa com uma escolha, escolhi priorizar meu bem-estar e esse produto se tornou parte essencial dessa jornada',
      'Não deixe ninguém te dizer que cuidar de si é frescura, pequenos rituais diários constroem a confiança que muda tudo',
      'Acredite no processo e dê tempo para os resultados, a consistência me mostrou que paciência e cuidado sempre são recompensados',
    ],
  ],
};

function pickRandomScene(): string {
  return scenePool[Math.floor(Math.random() * scenePool.length)];
}

function pickSequentialDialogues(tom: string, qty: number, startIndex = 0): string[] {
  const toneKey = dialogueGroups[tom] ? tom : 'casual';
  const groups = dialogueGroups[toneKey];
  const groupIndex = Math.floor(Math.random() * groups.length);
  const group = groups[groupIndex];

  const dialogues: string[] = [];
  for (let i = 0; i < qty; i++) {
    const idx = (startIndex + i) % group.length;
    dialogues.push(group[idx]);
  }
  return dialogues;
}

interface GenerationState {
  scene: string;
  action: string;
  toneKey: string;
  groupIndex: number;
}

function generatePrompts(
  produto: string,
  nicho: string,
  publico: string,
  tom: string,
  range: string,
  qty: number
): { prompts: UGCPrompt[]; state: GenerationState } {
  const scene = pickRandomScene();
  const rangeOpt = rangeOptions.find((r) => r.id === range);
  const action = rangeOpt ? rangeOpt.action : rangeOptions[0].action;

  const toneKey = dialogueGroups[tom] ? tom : 'casual';
  const groups = dialogueGroups[toneKey];
  const groupIndex = Math.floor(Math.random() * groups.length);
  const group = groups[groupIndex];

  const prompts: UGCPrompt[] = [];
  for (let i = 0; i < qty; i++) {
    const idx = i % group.length;
    prompts.push({
      id: i + 1,
      scene,
      action,
      audio: { dialogue: group[idx] },
    });
  }

  return { prompts, state: { scene, action, toneKey, groupIndex } };
}

const MIN_CHARS = 120;
const MAX_CHARS = 160;

const ScriptGeneratorPage = () => {
  const [produto, setProduto] = useState('');
  const [nicho, setNicho] = useState('');
  const [publico, setPublico] = useState('');
  const [tom, setTom] = useState('');
  const [range, setRange] = useState('');
  const [qty, setQty] = useState(3);
  const [results, setResults] = useState<UGCPrompt[]>([]);
  const [genState, setGenState] = useState<GenerationState | null>(null);
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const canGenerate = produto && nicho && publico && tom && range;

  const handleGenerate = () => {
    if (!canGenerate) return;
    const { prompts, state } = generatePrompts(produto, nicho, publico, tom, range, qty);
    setResults(prompts);
    setGenState(state);
  };

  const handleRegenerate = (promptId: number) => {
    if (!genState) return;

    setResults((prev) => {
      const groups = dialogueGroups[genState.toneKey];
      // Pick a different group for regeneration
      const availableGroups = groups.filter((_, i) => i !== genState.groupIndex);
      const newGroup = availableGroups.length > 0
        ? availableGroups[Math.floor(Math.random() * availableGroups.length)]
        : groups[genState.groupIndex];

      // Regenerate from promptId onwards
      const startIdx = promptId - 1;
      return prev.map((p) => {
        if (p.id < promptId) return p;
        const dialogueIdx = (p.id - 1) % newGroup.length;
        return { ...p, audio: { dialogue: newGroup[dialogueIdx] } };
      });
    });
  };

  const handleCopyJSON = async (prompt: UGCPrompt) => {
    const len = prompt.audio.dialogue.length;
    if (len < MIN_CHARS || len > MAX_CHARS) return;
    const json = JSON.stringify(
      { scene: prompt.scene, action: prompt.action, audio: { dialogue: prompt.audio.dialogue } },
      null,
      2
    );
    await navigator.clipboard.writeText(json);
    setCopiedId(prompt.id);
    setTimeout(() => setCopiedId(null), 1600);
  };

  const isDialogueValid = (d: string) => d.length >= MIN_CHARS && d.length <= MAX_CHARS;

  return (
    <div className="flex flex-1 flex-col p-6 md:p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold font-display text-foreground md:text-3xl">
          Gerador de Cenas UGC
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Gere cenas independentes prontas para produção de vídeo
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[400px_1fr]">
        {/* Form */}
        <div className="space-y-5">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-card space-y-5">
            <div className="space-y-2">
              <Label htmlFor="produto">Produto</Label>
              <Input id="produto" placeholder="Ex: Sérum facial anti-idade" value={produto} onChange={(e) => setProduto(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="nicho">Nicho</Label>
              <Input id="nicho" placeholder="Ex: Skincare, Fitness, Tech" value={nicho} onChange={(e) => setNicho(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="publico">Público-alvo</Label>
              <Input id="publico" placeholder="Ex: Mulheres 25-35 anos" value={publico} onChange={(e) => setPublico(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Tom do Avatar</Label>
              <Select value={tom} onValueChange={setTom}>
                <SelectTrigger><SelectValue placeholder="Selecione o tom" /></SelectTrigger>
                <SelectContent>
                  {toneOptions.map((t) => (
                    <SelectItem key={t.id} value={t.id}>{t.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Tipo de Ação</Label>
              <Select value={range} onValueChange={setRange}>
                <SelectTrigger><SelectValue placeholder="Selecione o tipo de ação" /></SelectTrigger>
                <SelectContent>
                  {rangeOptions.map((r) => (
                    <SelectItem key={r.id} value={r.id}>{r.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Quantidade de prompts</Label>
                <span className="text-sm font-semibold text-accent-foreground">{qty}</span>
              </div>
              <Slider value={[qty]} onValueChange={(v) => setQty(v[0])} min={1} max={10} step={1} />
            </div>
            <Button onClick={handleGenerate} disabled={!canGenerate} className="w-full" size="lg">
              <Sparkles className="h-4 w-4 mr-2" />
              Gerar Cenas
            </Button>
          </div>
        </div>

        {/* Results */}
        <div className="space-y-4">
          {results.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card/50 p-12 text-center">
              <FileText className="h-12 w-12 text-muted-foreground/40 mb-4" />
              <h3 className="text-lg font-semibold font-display text-muted-foreground">Nenhuma cena gerada</h3>
              <p className="text-sm text-muted-foreground mt-1">Preencha o formulário e clique em "Gerar Cenas"</p>
            </div>
          ) : (
            <TooltipProvider>
              {results.map((prompt) => {
                const charCount = prompt.audio.dialogue.length;
                const valid = isDialogueValid(prompt.audio.dialogue);
                return (
                  <div key={prompt.id} className="rounded-2xl border border-border bg-card p-6 shadow-card animate-in fade-in slide-in-from-bottom-2 duration-300">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-base font-semibold font-display text-card-foreground">Prompt {prompt.id}</h3>
                      <div className="flex items-center gap-1">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="ghost" size="sm" onClick={() => handleRegenerate(prompt.id)}>
                              <RefreshCw className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{prompt.id === 1 ? 'Regenerar todos os prompts' : 'Regenerar este e os seguintes para manter continuidade'}</p>
                          </TooltipContent>
                        </Tooltip>
                        <Button variant="ghost" size="sm" onClick={() => handleCopyJSON(prompt)} disabled={!valid} title={valid ? 'Copiar JSON' : `Dialogue fora do intervalo ${MIN_CHARS}-${MAX_CHARS}`}>
                          {copiedId === prompt.id ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>

                    {/* Body */}
                    <div className="space-y-3 rounded-lg bg-secondary p-4 text-sm text-foreground leading-relaxed">
                      <div>
                        <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Scene</span>
                        <p className="mt-1">{prompt.scene}</p>
                      </div>
                      <div>
                        <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Action</span>
                        <p className="mt-1">{prompt.action}</p>
                      </div>
                      <div>
                        <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Dialogue</span>
                        <p className="mt-1">{prompt.audio.dialogue}</p>
                      </div>
                    </div>

                    {/* Char counter */}
                    <div className="mt-3 flex justify-end">
                      <span className={`text-xs font-medium ${valid ? 'text-green-500' : 'text-destructive'}`}>
                        {charCount} / {MIN_CHARS}-{MAX_CHARS} chars
                      </span>
                    </div>
                  </div>
                );
              })}
            </TooltipProvider>
          )}
        </div>
      </div>
    </div>
  );
};

export default ScriptGeneratorPage;
