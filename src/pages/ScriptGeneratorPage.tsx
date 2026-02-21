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

const actionPool = [
  'Passa o produto de uma mão para a outra enquanto fala naturalmente',
  'Levanta o frasco brevemente na direção da câmera',
  'Abre a palma da mão enquanto explica o ponto',
  'Gira levemente o frasco enquanto fala',
  'Encosta o frasco de leve na bochecha e sorri',
  'Ajusta o cabelo com a mão livre enquanto continua falando',
  'Inclina minimamente o corpo para frente ao enfatizar',
  'Olha para baixo por um instante e volta para a câmera',
  'Segura o produto no colo e gesticula com as duas mãos',
  'Levanta a sobrancelha ao mencionar um benefício',
  'Ri de leve e balança o produto de forma natural',
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

// Dialogues organized by narrative role per tone
const dialoguesByRole: Record<string, { intro: string[]; dev: string[]; cta: string[] }> = {
  profissional: {
    intro: [
      'Tava revisando minha rotina de cuidados essa semana e percebi como esse produto mudou meu padrão de resultados nos últimos meses',
      'Quero compartilhar uma análise honesta sobre um produto que incorporei na rotina e que trouxe dados bem consistentes até agora',
      'Hoje quero falar sobre algo que testei metodicamente por semanas e que realmente entregou o que a formulação prometia entregar',
      'Resolvi documentar minha experiência porque os resultados foram relevantes o suficiente pra merecer uma avaliação detalhada e séria',
    ],
    dev: [
      'A textura absorve em segundos sem deixar resíduo, o que facilita muito pra quem tem rotina apertada pela manhã toda',
      'Percebi firmeza real na região do contorno após três semanas de uso contínuo, sem irritação ou sensibilidade aparente nenhuma',
      'O diferencial técnico está na concentração ativa que trabalha em camadas, os resultados não são superficiais como outros produtos',
      'Nos dias de estresse a pele manteve estabilidade, algo que não consegui com nenhuma outra formulação que testei antes',
      'A hidratação dura o dia inteiro sem reaplicação, testei em clima seco e úmido e manteve performance igual nos dois',
      'O acabamento é imperceptível na pele, dá pra usar sob maquiagem sem nenhum conflito de textura ou acúmulo visível',
      'Depois de um mês a uniformidade do tom melhorou visivelmente, não é milagre mas é progresso real e mensurável',
      'A entrega é gradual e respeitosa com a barreira cutânea, o que mostra inteligência na formulação e não agressividade',
    ],
    cta: [
      'Deixei o link aqui embaixo pra quem quiser conferir os detalhes da formulação e testar por conta própria com calma',
      'Se quiser experimentar também, o link tá aqui embaixo, vale a pena analisar os ingredientes antes de decidir comprar',
      'O link tá logo abaixo pra você dar uma olhada, recomendo pra quem busca resultado consistente e sem exagero nenhum',
      'Vou deixar o link aqui embaixo, dá uma olhada depois com calma e decide se faz sentido pra sua rotina',
    ],
  },
  casual: {
    intro: [
      'Tava arrumando minhas coisas agora e lembrei que preciso te contar sobre uma mudança que fiz na minha rotina recente',
      'Então gente, deixa eu contar uma parada que aconteceu desde que comecei a testar um negócio novo na rotina aqui',
      'Olha, eu nem ia gravar sobre isso mas aí acordei hoje com a pele tão boa que precisei vir falar aqui',
      'Sabe quando você acha um produto que simplesmente encaixa na rotina sem drama nenhum? Pois é, preciso contar isso',
    ],
    dev: [
      'A textura é leve demais, parece que não tem nada na pele mas você sente a diferença no toque ao longo do dia',
      'No terceiro dia já acordei com a pele mais macia, sem aquela sensação de repuxar que eu tinha toda manhã antes',
      'O mais legal é que dá pra passar rápido e sair, não precisa esperar secar nem nada, praticidade total no uso',
      'Até nos dias que esqueço de cuidar direito da pele, parece que ele segura o resultado do dia anterior tranquilamente',
      'Passei a usar de manhã e à noite e percebi que a oleosidade diminuiu bastante sem ressecar nada no processo',
      'Ele tem um cheirinho suave que não incomoda e some rápido, pra quem é sensível a fragrância é ótimo isso',
      'A pele ficou mais uniforme sem eu mudar mais nada na rotina, literalmente só adicionei esse passo e pronto já vi',
      'Minha maquiagem passou a durar mais depois que comecei a usar como base de preparação, inesperado mas muito bom',
    ],
    cta: [
      'Deixei o link aqui embaixo pra você experimentar, se gostar tanto quanto eu volta aqui pra me contar depois',
      'Se quiser testar também tá aí o link embaixo, sem pressão nenhuma mas acho que vale dar uma olhada nisso',
      'O link tá aqui embaixo pra quem ficou curioso, dá uma olhada depois e decide por você mesmo sem pressa',
      'Vou deixar o link embaixo, experimenta e me fala o que achou, quero saber se o efeito é parecido',
    ],
  },
  engracado: {
    intro: [
      'Meu marido perguntou se eu troquei de rosto essa semana, falei que não amor é só rotina nova e ele ficou confuso',
      'Acordei bonita hoje e levei um susto honesto, fui investigar o que mudou e lembrei do produto novo na rotina',
      'Comprei um negócio novo e minha colega jurou que eu fiz procedimento, gente é só um produto calma aí pelo amor',
      'Minha mãe ligou preocupada achando que eu gastei fortunas no dermatologista, tive que explicar que foi um produto só',
    ],
    dev: [
      'O engraçado é que a textura é tão leve que eu achei que não ia fazer nada, aí a pele resolveu me surpreender',
      'Passei três dias desconfiada olhando no espelho tipo será? Será? E no quarto dia confirmei que sim tava diferente mesmo',
      'Minha amiga pediu pra cheirar o produto e ficou viciada no aroma, agora ela quer pegar emprestado todo santo dia',
      'A aplicação é tão rápida que eu quase esqueço que passei, aí olho no espelho à noite e lembro pelo resultado',
      'Tentei não gostar pra economizar juro que tentei, mas a pele tava tão boa que perdi a batalha com meu bolso',
      'Meu gato me observa passar o produto com uma cara de julgamento, mas pelo menos um de nós tá com a pele boa',
      'Usei por uma semana e já quero comprar de backup, meu instinto de acumuladora de produto bom ativou automaticamente',
      'A embalagem é tão bonita que deixo no balcão do banheiro como decoração, funcional e estético ao mesmo tempo gente',
    ],
    cta: [
      'Deixei o link aqui embaixo, vai por mim e testa antes que eu compre o estoque inteiro da loja sozinha',
      'Se quiser testar também o link tá embaixo, prometo que você não vai me xingar por ter indicado esse aqui',
      'O link tá logo abaixo, experimenta e depois me conta a reação do espelho porque a minha foi impagável demais',
      'Vou deixar o link aqui embaixo, pega o seu antes que eu indique pra família inteira e acabe o estoque',
    ],
  },
  urgente: {
    intro: [
      'Preciso te contar isso agora porque descobri algo que mudou minha rotina em poucos dias e não dá pra guardar',
      'Para tudo e presta atenção porque o que eu vou te contar agora pode mudar como você cuida da sua pele',
      'Não costumo gravar com pressa mas precisei vir aqui correndo te falar sobre o que aconteceu essa semana comigo',
      'Escuta rápido porque isso é importante, descobri um produto que entrega resultado visível muito mais rápido do que eu esperava',
    ],
    dev: [
      'Em três dias a textura da pele já mudou, não é exagero é cronômetro, fiquei de queixo caído com a velocidade',
      'A absorção é instantânea e o efeito começa rápido, você acorda no dia seguinte e já percebe diferença no toque',
      'Cada dia que passa o resultado fica mais evidente, é daqueles produtos que trabalham rápido sem pular etapas no processo',
      'Testei de manhã e à noite por uma semana e o acúmulo de resultado foi impressionante comparado com outros que usei',
      'O diferencial é que age rápido mas sem agredir, não irrita não descama só entrega resultado limpo e consistente',
      'Não é daqueles que demora meses pra mostrar algo, em semanas você já consegue perceber a evolução claramente na pele',
      'A sensação imediata após aplicar já é diferente, a pele responde rápido e você sente que algo está funcionando ali',
      'Comparando com tudo que já usei esse foi disparado o que mostrou sinal de mudança mais cedo no processo todo',
    ],
    cta: [
      'Deixei o link aqui embaixo, não adia mais porque cada dia sem testar é resultado que você tá deixando passar',
      'O link tá aqui embaixo, corre e experimenta logo porque quando eu achei já queria ter começado muito antes',
      'Se quiser testar o link tá embaixo, não espera o momento perfeito porque o melhor momento é agora mesmo',
      'Vou deixar o link aqui, aproveita e começa hoje porque o arrependimento de quem testa é sempre não ter testado antes',
    ],
  },
  educativo: {
    intro: [
      'Quero explicar hoje por que escolhi esse produto específico, fui atrás da composição antes de começar a usar de fato',
      'Resolvi estudar os ingredientes ativos desse produto e o que encontrei me convenceu a testar com expectativa fundamentada',
      'Antes de indicar qualquer coisa eu pesquiso bastante, e hoje quero te mostrar o que descobri sobre essa formulação aqui',
      'Vou te explicar tecnicamente o que esse produto faz na pele porque entender o mecanismo ajuda a ter expectativa real',
    ],
    dev: [
      'A concentração do ativo principal está na faixa ideal segundo estudos recentes, nem abaixo do eficaz nem acima do seguro',
      'O pH da formulação respeita a barreira cutânea o que significa que os ativos penetram sem causar sensibilização desnecessária',
      'Os ingredientes trabalham em sinergia, o ácido hialurônico hidrata enquanto a niacinamida controla oleosidade simultaneamente sem conflito',
      'A tecnologia de liberação prolongada mantém os ativos trabalhando por horas, diferente de fórmulas que perdem efeito rápido demais',
      'O veículo da fórmula foi pensado pra otimizar a entrega dos ativos nas camadas certas da pele onde fazem diferença',
      'Diferente de produtos que usam concentrações marketing esse tem dosagem funcional, cada ingrediente está ali por um motivo claro',
      'A ausência de fragrância forte e álcool na fórmula reduz muito o risco de reação adversa em peles mais sensíveis',
      'Estudos clínicos mostram resultados a partir da terceira semana de uso contínuo, o que bate com minha experiência pessoal',
    ],
    cta: [
      'Deixei o link aqui embaixo pra você ler a composição completa e decidir com informação se faz sentido pra você',
      'Se quiser conferir os ingredientes por conta própria o link tá embaixo, recomendo analisar antes de qualquer decisão final',
      'O link tá aqui embaixo, vale estudar a formulação com calma e ver se encaixa no que a sua pele precisa',
      'Vou deixar o link embaixo, pesquisa os ativos depois e decide com base em dado e não em propaganda vaga',
    ],
  },
  inspirador: {
    intro: [
      'Hoje quero falar sobre uma escolha pequena que fiz por mim mesma e que mudou como me sinto todos os dias',
      'Cuidar de si não precisa ser complicado, às vezes um passo novo na rotina já transforma a forma como você se vê',
      'Decidi priorizar meu bem-estar de verdade, não só falar sobre isso, e comecei com algo simples na rotina diária',
      'Tem dias que a gente precisa de um lembrete de que merece cuidado, pra mim esse produto virou esse lembrete',
    ],
    dev: [
      'A sensação de olhar no espelho e gostar do que vê é transformadora, e começou com uma mudança simples na rotina',
      'Não é sobre ficar perfeita é sobre se sentir confortável na própria pele, e isso faz diferença em tudo ao redor',
      'Quando a pele está bem a confiança muda naturalmente, percebi isso nas reuniões no trabalho e até nas fotos do dia',
      'O ritual de aplicar virou meu momento de conexão comigo mesma, dois minutos de pausa que mudam o tom do dia',
      'Cada pequeno progresso na pele me lembrava que consistência importa mais que intensidade, e isso vale pra tudo na vida',
      'A transformação não foi só visual foi emocional, me sinto mais presente e mais gentil comigo desde que comecei esse hábito',
      'Aprendi que cuidar da pele é um ato de respeito próprio, não vaidade, e isso mudou minha relação com autocuidado',
      'O efeito mais bonito não foi na pele foi na atitude, comecei a me tratar melhor em outros aspectos também',
    ],
    cta: [
      'Deixei o link aqui embaixo pra você dar o primeiro passo, às vezes tudo começa com uma decisão simples assim',
      'Se quiser começar sua própria jornada o link tá embaixo, você merece se sentir bem todos os dias sem exceção',
      'O link tá aqui embaixo, experimenta quando sentir que é a hora certa, o importante é começar em algum momento',
      'Vou deixar o link embaixo, se hoje for o dia que você decide cuidar mais de si mesma aproveita agora',
    ],
  },
};

function pickRandomScene(): string {
  return scenePool[Math.floor(Math.random() * scenePool.length)];
}

function shuffleArray<T>(arr: T[]): T[] {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function getNarrativeRole(index: number, total: number): 'intro' | 'dev' | 'cta' {
  if (total === 1) return 'intro'; // single prompt = intro+cta combined handled separately
  if (index === 0) return 'intro';
  if (index === total - 1) return 'cta';
  return 'dev';
}

interface GenerationState {
  scene: string;
  toneKey: string;
  usedIntroIdx: number;
  usedDevIndices: number[];
  usedCtaIdx: number;
  actions: string[];
}

function generatePrompts(
  tom: string,
  qty: number
): { prompts: UGCPrompt[]; state: GenerationState } {
  const scene = pickRandomScene();
  const toneKey = dialoguesByRole[tom] ? tom : 'casual';
  const roleDialogues = dialoguesByRole[toneKey];

  // Shuffle and assign unique actions
  const shuffledActions = shuffleArray(actionPool);
  const actions = Array.from({ length: qty }, (_, i) => shuffledActions[i % shuffledActions.length]);

  // Pick random indices for each role
  const introIdx = Math.floor(Math.random() * roleDialogues.intro.length);
  const ctaIdx = Math.floor(Math.random() * roleDialogues.cta.length);
  const shuffledDevIndices = shuffleArray(Array.from({ length: roleDialogues.dev.length }, (_, i) => i));

  const prompts: UGCPrompt[] = [];
  let devCounter = 0;
  const usedDevIndices: number[] = [];

  for (let i = 0; i < qty; i++) {
    const role = getNarrativeRole(i, qty);
    let dialogue: string;

    if (qty === 1) {
      // Single prompt: combine intro feel with CTA
      dialogue = roleDialogues.intro[introIdx];
    } else if (role === 'intro') {
      dialogue = roleDialogues.intro[introIdx];
    } else if (role === 'cta') {
      dialogue = roleDialogues.cta[ctaIdx];
    } else {
      const devIdx = shuffledDevIndices[devCounter % shuffledDevIndices.length];
      usedDevIndices.push(devIdx);
      dialogue = roleDialogues.dev[devIdx];
      devCounter++;
    }

    prompts.push({
      id: i + 1,
      scene,
      action: actions[i],
      audio: { dialogue },
    });
  }

  return {
    prompts,
    state: { scene, toneKey, usedIntroIdx: introIdx, usedDevIndices, usedCtaIdx: ctaIdx, actions },
  };
}

const MIN_CHARS = 120;
const MAX_CHARS = 160;

const ScriptGeneratorPage = () => {
  const [produto, setProduto] = useState('');
  const [nicho, setNicho] = useState('');
  const [publico, setPublico] = useState('');
  const [tom, setTom] = useState('');
  const [qty, setQty] = useState(3);
  const [results, setResults] = useState<UGCPrompt[]>([]);
  const [genState, setGenState] = useState<GenerationState | null>(null);
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const canGenerate = produto && nicho && publico && tom;

  const handleGenerate = () => {
    if (!canGenerate) return;
    const { prompts, state } = generatePrompts(tom, qty);
    setResults(prompts);
    setGenState(state);
  };

  const handleRegenerate = (promptId: number) => {
    if (!genState) return;

    setResults((prev) => {
      const roleDialogues = dialoguesByRole[genState.toneKey];
      const total = prev.length;

      return prev.map((p) => {
        if (p.id < promptId) return p;
        const role = getNarrativeRole(p.id - 1, total);

        let newDialogue: string;
        if (role === 'intro') {
          const pool = roleDialogues.intro;
          newDialogue = pool[Math.floor(Math.random() * pool.length)];
        } else if (role === 'cta') {
          const pool = roleDialogues.cta;
          newDialogue = pool[Math.floor(Math.random() * pool.length)];
        } else {
          const pool = roleDialogues.dev;
          newDialogue = pool[Math.floor(Math.random() * pool.length)];
        }

        // Also assign a new action from pool
        const newAction = actionPool[Math.floor(Math.random() * actionPool.length)];

        return { ...p, action: newAction, audio: { dialogue: newDialogue } };
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
