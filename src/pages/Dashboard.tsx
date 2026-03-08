import { useNavigate } from 'react-router-dom';
import { UserCircle, FileText, Video, Settings } from 'lucide-react';

const cards = [
  {
    title: 'Criar Avatar Realista',
    description: 'Gere prompts ultra-detalhados para avatares fotorealistas com IA',
    icon: UserCircle,
    emoji: '🎨',
    path: '/avatar',
  },
  {
    title: 'Roteiro para Clone IA',
    description: 'Gere roteiros com falas naturais e estruturadas para seu clone de IA',
    icon: FileText,
    emoji: '📝',
    path: '/roteiros',
  },
  {
    title: 'Cenas UGC',
    description: 'Crie cenas estruturadas para vídeos de conteúdo gerado por usuários',
    icon: Video,
    emoji: '🎬',
    path: '/ugc',
  },
  {
    title: 'Produção de Vídeo',
    description: 'Ferramentas para produção e edição de vídeos com IA',
    icon: Video,
    emoji: '🔜',
    path: '/video',
    disabled: true,
  },
  {
    title: 'Configurações',
    description: 'Gerencie seu perfil, preferências e plano',
    icon: Settings,
    emoji: '⚙️',
    path: '/configuracoes',
  },
];

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-1 flex-col items-center justify-center p-6 md:p-10">
      <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-border bg-secondary px-4 py-1.5 text-xs font-medium text-muted-foreground">
        <span>✨</span>
        Plataforma de Criação com IA
      </div>

      <h1 className="mb-2 text-center text-3xl font-bold font-display text-foreground md:text-4xl">
        O que você quer criar hoje? 🚀
      </h1>
      <p className="mb-10 max-w-md text-center text-muted-foreground">
        Escolha uma ferramenta para começar 👇
      </p>

      <div className="grid w-full max-w-3xl grid-cols-1 gap-6 sm:grid-cols-2">
        {cards.map((card) => (
          <button
            key={card.path}
            onClick={() => !card.disabled && navigate(card.path)}
            disabled={card.disabled}
            className="group relative flex flex-col items-center gap-4 rounded-2xl border border-border bg-card p-8 md:p-10 shadow-card transition-all duration-300 ease-out hover:shadow-card-hover hover:-translate-y-1 hover:border-accent focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-card"
          >
            <div className="text-4xl transition-transform duration-300 group-hover:scale-110">
              {card.emoji}
            </div>
            <h3 className="text-lg font-semibold font-display text-card-foreground">{card.title}</h3>
            <p className="text-sm text-muted-foreground text-center">{card.description}</p>
            {card.disabled && (
              <span className="absolute top-4 right-4 rounded-full bg-secondary px-2.5 py-0.5 text-[10px] font-medium text-muted-foreground">
                🔜 Em breve
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
