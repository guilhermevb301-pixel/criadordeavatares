import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileText, Sparkles, Copy, Check, RefreshCw } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const toneOptions = [
  { id: 'profissional', label: 'Profissional' },
  { id: 'casual', label: 'Casual' },
  { id: 'engracado', label: 'Engraçado' },
  { id: 'urgente', label: 'Urgente' },
  { id: 'educativo', label: 'Educativo' },
  { id: 'inspirador', label: 'Inspirador' },
];

interface UGCScene {
  id: number;
  angle: string;
  scene: string;
  action: string;
  audio: {
    dialogue: string;
  };
}

const anglePool = [
  'Close-up frontal',
  'Medium shot lateral',
  'Over-the-shoulder',
  'Wide shot ambiente',
  'Low angle',
  'High angle',
  'POV camera',
];

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const sceneTemplates: Record<string, { scenes: string[]; actions: string[]; dialogues: Record<string, string[]> }> = {
  default: {
    scenes: [
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
    ],
    actions: [
      'Olha diretamente para a câmera com expressão genuína de surpresa, gesticula com as mãos enquanto fala',
      'Segura o produto na altura do rosto, inclina levemente a cabeça e sorri de forma natural',
      'Caminha em direção à câmera enquanto fala, para e aponta para algo fora do quadro',
      'Está sentado de forma relaxada, inclina-se para frente com interesse ao mencionar o produto',
      'Faz um gesto de negação com a cabeça antes de apresentar a solução, muda a expressão para entusiasmo',
      'Aplica ou demonstra o produto com movimentos lentos e deliberados, olha para a câmera no final',
      'Apoia o queixo na mão pensativo, depois abre um sorriso e começa a explicar',
      'Gesticula contando nos dedos os benefícios, mantém contato visual constante',
      'Pega o celular e mostra a tela para a câmera, expressão de quem descobriu algo valioso',
      'Levanta as sobrancelhas em surpresa, faz pausa dramática antes de continuar falando',
    ],
    dialogues: {
      profissional: [
        'Depois de testar diversas alternativas no mercado, posso afirmar com segurança que este produto entrega resultados consistentes e mensuráveis em poucas semanas de uso contínuo',
        'A diferença que percebi nos primeiros dias de uso foi significativa. Os dados comprovam que a eficácia deste produto supera qualquer expectativa que eu tinha inicialmente',
        'Profissionais da área já reconhecem este produto como referência. Incorporei na minha rotina e os resultados falam por si, sem necessidade de exagero algum',
        'Analisei criteriosamente cada componente e a formulação é realmente superior. Os resultados aparecem de forma gradual porém consistente, exatamente como prometido pela marca',
        'Quando comecei a utilizar, mantive expectativas moderadas. Três semanas depois, os números mostram uma melhoria que supera qualquer outro produto que testei antes',
        'Este é o tipo de produto que recomendo sem hesitação para quem busca resultado real. A qualidade dos ingredientes e a eficácia comprovada fazem toda a diferença',
        'Em termos de custo-benefício, ainda não encontrei nada que se compare. A performance entregue justifica cada centavo investido e os resultados são duradouros',
        'Minha equipe inteira adotou este produto após ver meus resultados. A consistência na entrega e a qualidade do acabamento são incomparáveis no mercado atual',
        'O diferencial está nos detalhes técnicos que poucos percebem. A tecnologia empregada neste produto garante uma experiência superior que se nota desde o primeiro uso',
        'Já avaliei centenas de produtos similares na minha carreira. Este se destaca pela formulação inteligente e pelos resultados que aparecem sem precisar de ajustes constantes',
      ],
      casual: [
        'Gente, eu não acreditei quando vi o resultado. Tipo, uso há duas semanas e já tô vendo diferença real, sem frescura nenhuma, funciona mesmo no dia a dia',
        'Tava mega cética no começo, confesso. Mas aí comecei a usar e caramba, o negócio entrega o que promete. Agora virou item obrigatório na minha rotina toda',
        'Olha, vou ser sincera com vocês: testei um monte de coisa parecida e nada chegou perto disso aqui. A diferença é gritante e aparece muito rápido',
        'Não é publi não, tô falando sério. Comprei com meu dinheiro e amei tanto que precisei vir contar pra vocês porque realmente mudou meu jogo completamente',
        'Sabe aquele produto que você descobre e fica tipo por que não conheci antes? Então, é exatamente isso. Simples de usar e o resultado é absurdo',
        'Minha amiga me indicou e eu pensei que era exagero dela. Spoiler: não era. Depois de uma semana usando já entendi todo o hype que fazem',
        'Galera, achei que ia ser mais do mesmo, mas esse produto me surpreendeu de verdade. A textura, o resultado, tudo diferente do que já tinha testado',
        'Comecei a usar meio desacreditada e hoje não largo mais. É daqueles produtos que viram essenciais na rotina e você se pergunta como vivia sem ele',
        'Vou mostrar pra vocês o antes e depois porque não tem como explicar só com palavras. O resultado fala por si e aparece muito rápido mesmo',
        'Se alguém me perguntasse qual produto indicar sem pensar duas vezes, seria esse aqui. Praticidade, resultado visível e preço justo, combinação perfeita pra mim',
      ],
      engracado: [
        'Meu marido perguntou se eu troquei de rosto. Não troquei não, amor, só descobri um produto que realmente funciona e agora não consigo parar de me olhar',
        'Passei vergonha na farmácia comprando cinco unidades de uma vez. A atendente olhou pra mim e eu disse que era estoque estratégico de sobrevivência pessoal',
        'Minha mãe ligou preocupada achando que eu tinha feito procedimento. Mãe, calma, é só um produto bom. Ela já pediu o link e comprou dois',
        'Acordei bonita hoje e levei um susto. Fui ver o que mudou na rotina e lembrei que comecei a usar esse produto semana passada, coincidência zero',
        'Meus amigos acham que estou mentindo quando digo que é só esse produto. Começaram a revistar meu banheiro procurando o segredo, mas é só isso mesmo',
        'O entregador já me conhece pelo nome de tanto que peço. Ele chegou hoje e disse parabéns pelo estoque, obrigada pela fidelidade dona cliente especial',
        'Comprei escondido do meu orçamento mensal e meu contador interno está em pânico. Mas minha pele está tão bem que considero investimento e não gasto',
        'Fiz um estoque tão grande que minha gaveta virou praticamente uma filial da loja. Minha colega viu e perguntou se eu estava abrindo um negócio',
        'Tentei não gostar pra economizar, juro que tentei. Mas não tem como, o produto é bom demais e agora minha carteira que lute com as consequências',
        'Minha dermatologista perguntou o que eu mudei na rotina. Mostrei o produto e ela anotou o nome. Quando até a médica quer, é sinal de qualidade',
      ],
      urgente: [
        'Preciso te contar isso agora porque o estoque está acabando rápido. Esse produto mudou completamente minha rotina e os resultados aparecem em poucos dias de uso',
        'Não espera mais pra testar isso. Eu adiei por meses e me arrependo de cada dia que perdi sem usar esse produto incrível na minha rotina',
        'Todo mundo que eu conheço já está usando e quem não começou vai ficar pra trás. Os resultados são rápidos e a diferença é visível imediatamente',
        'Escuta, eu sei que você já ouviu isso antes, mas dessa vez é diferente de verdade. Comecei ontem e hoje já percebi mudança, sem exagero nenhum',
        'Estava guardando esse segredo só pra mim mas não consigo mais. Preciso compartilhar antes que acabe porque merece ser conhecido por todo mundo agora mesmo',
        'Corre que a promoção dura pouco e esse produto vale cada centavo mesmo no preço cheio. Os resultados que tive em uma semana foram impressionantes',
        'Não tenho tempo pra enrolação então vou direto ao ponto: funciona, é rápido e o resultado aparece antes do que você imagina. Começa hoje mesmo',
        'Se tem uma coisa que me arrependo é de não ter começado antes. Cada dia sem usar é um dia de resultado perdido, então não adia mais',
        'Para tudo que você está fazendo e presta atenção nisso. Esse produto vai mudar sua rotina e você vai me agradecer por ter contado a tempo',
        'Última vez que vi esse preço foi há seis meses. Se você está em dúvida, essa é a hora certa de experimentar antes que a oportunidade passe',
      ],
      educativo: [
        'O que diferencia esse produto é a composição baseada em estudos recentes. Cada ingrediente foi selecionado por sua eficácia comprovada em pesquisas independentes publicadas',
        'Muita gente não sabe, mas a maioria dos produtos similares usa concentrações abaixo do necessário. Este aqui trabalha com a dosagem ideal segundo a literatura',
        'Vou explicar como funciona de forma simples: os ativos penetram nas camadas mais profundas e estimulam a regeneração natural, por isso os resultados são duradouros',
        'É importante entender que resultado de verdade leva tempo e consistência. Esse produto foi desenvolvido para entrega gradual, respeitando o ciclo natural do organismo',
        'Pesquisei bastante antes de escolher e o que me convenceu foram os dados clínicos. Noventa e dois por cento dos participantes relataram melhoria significativa em trinta dias',
        'A ciência por trás deste produto é fascinante. Ele utiliza uma tecnologia de liberação controlada que mantém os ativos trabalhando por muito mais tempo que o comum',
        'Muitos produtos prometem resultado rápido e entregam irritação. Este foi formulado com pH balanceado e ativos encapsulados que protegem a barreira natural durante todo uso',
        'Quero que vocês entendam o porquê funciona e não apenas que funciona. A base científica deste produto é sólida e transparente, com estudos disponíveis publicamente',
        'O segredo está na sinergia entre os componentes. Isolados funcionam bem, mas juntos nesta formulação específica potencializam o efeito em até três vezes mais rápido',
        'Antes de indicar qualquer produto eu analiso a composição completa. Neste caso cada ingrediente tem função clara e complementar, sem componentes desnecessários na formulação toda',
      ],
      inspirador: [
        'Cuidar de si mesmo não é vaidade, é um ato de amor próprio. Quando descobri esse produto, entendi que mereço investir no melhor para minha rotina',
        'Cada pequena mudança na rotina pode transformar como você se sente consigo mesmo. Esse produto foi o primeiro passo de uma jornada que mudou minha autoestima',
        'Você merece se olhar no espelho e se sentir incrível todos os dias. Esse produto me devolveu uma confiança que eu achava que tinha perdido pra sempre',
        'Não é sobre perfeição, é sobre se sentir bem na própria pele. Desde que comecei a usar, minha relação comigo mesmo mudou completamente para muito melhor',
        'A melhor versão de você está a uma decisão de distância. Comecei essa mudança com um produto simples e hoje colho resultados que transformaram minha rotina',
        'Quando você investe em algo que realmente funciona, o retorno vai além do físico. A confiança que ganhei usando esse produto impacta todas as áreas da vida',
        'Todo mundo merece ter acesso a produtos que realmente cumprem o que prometem. Encontrar este foi um divisor de águas na forma como cuido de mim',
        'A transformação começa com uma escolha. Escolhi priorizar meu bem-estar e esse produto se tornou parte essencial dessa jornada de autoconhecimento e cuidado diário comigo',
        'Não deixe ninguém te dizer que cuidar de si é frescura. Esse produto me ensinou que pequenos rituais diários constroem a confiança que muda tudo ao redor',
        'Acredite no processo e dê tempo para os resultados aparecerem. A consistência com esse produto me mostrou que paciência e cuidado sempre são recompensados no final',
      ],
    },
  },
};

function generateSingleScene(
  id: number,
  angle: string,
  produto: string,
  nicho: string,
  publico: string,
  tom: string
): UGCScene {
  const t = sceneTemplates.default;
  const sceneDesc = t.scenes[Math.floor(Math.random() * t.scenes.length)];
  const actionDesc = t.actions[Math.floor(Math.random() * t.actions.length)];
  const toneKey = t.dialogues[tom] ? tom : 'casual';
  const dialogues = t.dialogues[toneKey];
  const dialogue = dialogues[Math.floor(Math.random() * dialogues.length)];

  return { id, angle, scene: sceneDesc, action: actionDesc, audio: { dialogue } };
}

function generateScenes(
  produto: string,
  nicho: string,
  publico: string,
  tom: string,
  qty: number
): UGCScene[] {
  const scenes: UGCScene[] = [];
  let pool: string[] = [];

  for (let i = 0; i < qty; i++) {
    if (pool.length === 0) pool = shuffle(anglePool);
    const angle = pool.pop()!;
    scenes.push(generateSingleScene(i + 1, angle, produto, nicho, publico, tom));
  }

  return scenes;
}

const ScriptGeneratorPage = () => {
  const [produto, setProduto] = useState('');
  const [nicho, setNicho] = useState('');
  const [publico, setPublico] = useState('');
  const [tom, setTom] = useState('');
  const [qty, setQty] = useState(3);
  const [results, setResults] = useState<UGCScene[]>([]);
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const canGenerate = produto && nicho && publico && tom;

  const handleGenerate = () => {
    if (!canGenerate) return;
    setResults(generateScenes(produto, nicho, publico, tom, qty));
  };

  const handleRegenerate = (sceneId: number) => {
    setResults((prev) =>
      prev.map((s) => {
        if (s.id !== sceneId) return s;
        const angle = anglePool[Math.floor(Math.random() * anglePool.length)];
        return generateSingleScene(s.id, angle, produto, nicho, publico, tom);
      })
    );
  };

  const handleCopyJSON = async (scene: UGCScene) => {
    const len = scene.audio.dialogue.length;
    if (len < 140 || len > 220) return;
    const json = JSON.stringify(
      { scene: scene.scene, action: scene.action, audio: { dialogue: scene.audio.dialogue } },
      null,
      2
    );
    await navigator.clipboard.writeText(json);
    setCopiedId(scene.id);
    setTimeout(() => setCopiedId(null), 1600);
  };

  const isDialogueValid = (d: string) => d.length >= 140 && d.length <= 220;

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
                <Label>Quantidade de vídeos</Label>
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
            results.map((scene) => {
              const charCount = scene.audio.dialogue.length;
              const valid = isDialogueValid(scene.audio.dialogue);
              return (
                <div key={scene.id} className="rounded-2xl border border-border bg-card p-6 shadow-card animate-in fade-in slide-in-from-bottom-2 duration-300">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <h3 className="text-base font-semibold font-display text-card-foreground">Cena {scene.id}</h3>
                      <Badge variant="secondary" className="text-xs">{scene.angle}</Badge>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="sm" onClick={() => handleRegenerate(scene.id)} title="Regenerar cena">
                        <RefreshCw className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleCopyJSON(scene)} disabled={!valid} title={valid ? 'Copiar JSON' : 'Dialogue fora do intervalo 140-220'}>
                        {copiedId === scene.id ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>

                  {/* Body */}
                  <div className="space-y-3 rounded-lg bg-secondary p-4 text-sm text-foreground leading-relaxed">
                    <div>
                      <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Scene</span>
                      <p className="mt-1">{scene.scene}</p>
                    </div>
                    <div>
                      <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Action</span>
                      <p className="mt-1">{scene.action}</p>
                    </div>
                    <div>
                      <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Dialogue</span>
                      <p className="mt-1">{scene.audio.dialogue}</p>
                    </div>
                  </div>

                  {/* Char counter */}
                  <div className="mt-3 flex justify-end">
                    <span className={`text-xs font-medium ${valid ? 'text-green-500' : 'text-destructive'}`}>
                      {charCount} / 140-220 chars
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default ScriptGeneratorPage;
