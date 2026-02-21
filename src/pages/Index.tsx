import { useNavigate } from 'react-router-dom';
import { useAvatarStore } from '@/stores/avatar-store';
import type { Gender } from '@/lib/avatar-config';
import { User, Sparkles } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';

const GenderCard = ({
  gender,
  icon,
  label,
  description,
}: {
  gender: Gender;
  icon: React.ReactNode;
  label: string;
  description: string;
}) => {
  const navigate = useNavigate();
  const setGender = useAvatarStore((s) => s.setGender);

  const handleSelect = () => {
    setGender(gender);
    navigate('/builder');
  };

  return (
    <button
      onClick={handleSelect}
      className="group relative flex flex-col items-center gap-4 rounded-2xl border border-border bg-card p-8 md:p-10 shadow-card transition-all duration-300 ease-out hover:shadow-card-hover hover:-translate-y-1 hover:border-accent focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background w-full max-w-xs"
    >
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-secondary transition-colors duration-300 group-hover:bg-accent group-hover:text-accent-foreground">
        {icon}
      </div>
      <h3 className="text-xl font-semibold font-display text-card-foreground">{label}</h3>
      <p className="text-sm text-muted-foreground text-center">{description}</p>
      <div className="absolute inset-0 rounded-2xl ring-2 ring-transparent transition-all duration-300 group-hover:ring-accent" />
    </button>
  );
};

const Index = () => {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-border">
        <div className="flex items-center gap-2">
          <Sparkles className="h-6 w-6 text-accent-foreground" />
          <span className="text-lg font-bold font-display text-foreground">Avatar Creator</span>
        </div>
        <ThemeToggle />
      </header>

      {/* Hero */}
      <main className="flex flex-1 flex-col items-center justify-center px-4 py-12">
        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-border bg-secondary px-4 py-1.5 text-xs font-medium text-muted-foreground">
          <Sparkles className="h-3 w-3" />
          Prompts em Inglês • Interface em Português
        </div>

        <h1 className="mb-3 text-center text-3xl font-bold font-display text-foreground md:text-4xl lg:text-5xl">
          Crie seu Avatar Realista
        </h1>
        <p className="mb-10 max-w-md text-center text-muted-foreground">
          Construa prompts ultra-detalhados em inglês para geradores de imagem IA, de forma simples e intuitiva.
        </p>

        <h2 className="mb-6 text-lg font-medium text-foreground">
          Você quer criar um avatar masculino ou feminino?
        </h2>

        <div className="flex flex-col gap-6 sm:flex-row">
          <GenderCard
            gender="masculino"
            icon={<User className="h-10 w-10" />}
            label="Masculino"
            description="Crie um avatar masculino com aparência personalizada"
          />
          <GenderCard
            gender="feminino"
            icon={<User className="h-10 w-10" />}
            label="Feminino"
            description="Crie um avatar feminino com aparência personalizada"
          />
        </div>

        <p className="mt-8 text-xs text-muted-foreground">
          Escolha um gênero para começar a construir seu prompt
        </p>
      </main>

      {/* Footer */}
      <footer className="border-t border-border px-6 py-4 text-center text-xs text-muted-foreground">
        Avatar Creator — Prompts fotorealistas de alta qualidade
      </footer>
    </div>
  );
};

export default Index;
