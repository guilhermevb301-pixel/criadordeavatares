export interface ScriptPreset {
  id: string;
  label: string;
  emoji: string;
  tema: string;
  objetivo: string;
  publicoAlvo: string;
  estiloFala: string;
  personalidade: string;
  plataforma: string;
  cta: string;
}

export const scriptPresets: ScriptPreset[] = [
  {
    id: 'viral',
    label: 'Vídeo Viral',
    emoji: '🔥',
    tema: 'Algo que ninguém te conta sobre [seu nicho]',
    objetivo: 'Viralizar e gerar compartilhamentos',
    publicoAlvo: 'Público geral interessado em curiosidades',
    estiloFala: 'energico',
    personalidade: 'Provocador que revela verdades inconvenientes',
    plataforma: 'tiktok',
    cta: 'Salva esse vídeo antes que sumam com ele',
  },
  {
    id: 'autoridade',
    label: 'Autoridade',
    emoji: '👑',
    tema: 'Por que eu sou referência em [seu nicho]',
    objetivo: 'Construir autoridade e credibilidade',
    publicoAlvo: 'Profissionais e empreendedores do setor',
    estiloFala: 'profissional',
    personalidade: 'Especialista confiante e experiente',
    plataforma: 'linkedin',
    cta: 'Me siga para mais insights como esse',
  },
  {
    id: 'vendas',
    label: 'Vendas',
    emoji: '💰',
    tema: 'Como [produto/serviço] resolve [dor do cliente]',
    objetivo: 'Gerar leads e conversões',
    publicoAlvo: 'Pessoas com a dor específica do produto',
    estiloFala: 'casual',
    personalidade: 'Consultor amigável que entende seu problema',
    plataforma: 'reels',
    cta: 'Clique no link da bio e comece agora',
  },
  {
    id: 'educativo',
    label: 'Conteúdo Educativo',
    emoji: '📚',
    tema: '3 coisas que você precisa saber sobre [tema]',
    objetivo: 'Educar e gerar valor',
    publicoAlvo: 'Iniciantes querendo aprender sobre o tema',
    estiloFala: 'calmo',
    personalidade: 'Mentor paciente e didático',
    plataforma: 'shorts',
    cta: 'Comenta "quero" que te mando o material completo',
  },
  {
    id: 'objecao',
    label: 'Resposta a Objeção',
    emoji: '🛡️',
    tema: '"Isso não funciona pra mim" — será mesmo?',
    objetivo: 'Quebrar objeções e gerar confiança',
    publicoAlvo: 'Leads indecisos ou céticos',
    estiloFala: 'casual',
    personalidade: 'Amigo direto que fala a verdade',
    plataforma: 'reels',
    cta: 'Me manda uma DM que eu te provo',
  },
  {
    id: 'cta',
    label: 'Chamada para Ação',
    emoji: '📢',
    tema: 'Última chance de [oferta/oportunidade]',
    objetivo: 'Gerar urgência e ação imediata',
    publicoAlvo: 'Seguidores engajados prontos para comprar',
    estiloFala: 'energico',
    personalidade: 'Vendedor apaixonado e urgente',
    plataforma: 'reels',
    cta: 'Link na bio — vagas limitadas',
  },
  {
    id: 'storytelling',
    label: 'Storytelling Curto',
    emoji: '📖',
    tema: 'O dia que tudo mudou pra mim em [nicho]',
    objetivo: 'Conectar emocionalmente e gerar identificação',
    publicoAlvo: 'Pessoas que passam pela mesma jornada',
    estiloFala: 'calmo',
    personalidade: 'Narrador autêntico e vulnerável',
    plataforma: 'tiktok',
    cta: 'Se você se identificou, compartilha com alguém',
  },
];
