import { useState, useEffect, useRef } from 'react';
import { Sparkles, Eye, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import type { Gender } from '@/lib/avatar-config';

interface AvatarPreviewProps {
  gender: Gender;
  prompt: string;
  configVersion: number; // increments on any config change to trigger shimmer
}

const AvatarPreview = ({ gender, prompt, configVersion }: AvatarPreviewProps) => {
  const [isShimmering, setIsShimmering] = useState(false);
  const [displayedPrompt, setDisplayedPrompt] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [copied, setCopied] = useState(false);
  const [waitlistOpen, setWaitlistOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const prevVersion = useRef(configVersion);
  const typingRef = useRef<NodeJS.Timeout | null>(null);

  // Trigger shimmer on config change
  useEffect(() => {
    if (configVersion !== prevVersion.current) {
      prevVersion.current = configVersion;
      setIsShimmering(true);
      const t = setTimeout(() => setIsShimmering(false), 1200);
      return () => clearTimeout(t);
    }
  }, [configVersion]);

  // Typing animation for prompt
  useEffect(() => {
    if (typingRef.current) clearTimeout(typingRef.current);
    if (!prompt) {
      setDisplayedPrompt('');
      return;
    }

    setIsTyping(true);
    setDisplayedPrompt('');
    let i = 0;
    const speed = Math.max(4, Math.min(12, 600 / prompt.length));

    const typeNext = () => {
      if (i < prompt.length) {
        setDisplayedPrompt(prompt.slice(0, i + 1));
        i++;
        typingRef.current = setTimeout(typeNext, speed);
      } else {
        setIsTyping(false);
      }
    };
    typingRef.current = setTimeout(typeNext, 200);

    return () => {
      if (typingRef.current) clearTimeout(typingRef.current);
    };
  }, [prompt]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  const handleWaitlist = () => {
    setSubmitted(true);
    setTimeout(() => {
      setWaitlistOpen(false);
      setTimeout(() => setSubmitted(false), 300);
    }, 2000);
  };

  const placeholderSrc = gender === 'masculino'
    ? 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=600&fit=crop&crop=face&q=80'
    : 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600&h=600&fit=crop&crop=face&q=80';

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-2 px-5 py-3 border-b border-border">
        <Eye className="h-4 w-4 text-muted-foreground" />
        <h3 className="text-sm font-semibold font-display text-foreground">Preview em Tempo Real</h3>
        <div className={cn(
          "ml-auto flex items-center gap-1.5 text-xs font-medium px-2 py-0.5 rounded-full transition-colors",
          isShimmering
            ? "bg-accent/20 text-accent-foreground"
            : "bg-secondary text-muted-foreground"
        )}>
          <span className={cn("h-1.5 w-1.5 rounded-full", isShimmering ? "bg-accent animate-pulse" : "bg-muted-foreground/40")} />
          {isShimmering ? 'Atualizando...' : 'Sincronizado'}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-5 space-y-5">
        {/* Avatar Image Preview */}
        <div className="relative rounded-xl overflow-hidden border border-border bg-card shadow-card aspect-square">
          <img
            src={placeholderSrc}
            alt={`Preview avatar ${gender}`}
            className="w-full h-full object-cover"
          />
          {/* Shimmer overlay */}
          <div className={cn(
            "absolute inset-0 transition-opacity duration-500",
            isShimmering ? "opacity-100" : "opacity-0"
          )}>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-background/30 to-transparent animate-shimmer" />
          </div>
          {/* Overlay badge */}
          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
            <span className="text-xs font-medium bg-card/80 backdrop-blur-sm text-card-foreground px-2.5 py-1 rounded-full border border-border/50">
              {gender === 'masculino' ? '👨 Masculino' : '👩 Feminino'}
            </span>
            <span className="text-xs font-medium bg-card/80 backdrop-blur-sm text-muted-foreground px-2.5 py-1 rounded-full border border-border/50">
              Placeholder
            </span>
          </div>
        </div>

        {/* Generate Button */}
        <Button
          onClick={() => setWaitlistOpen(true)}
          className="w-full h-12 text-base font-semibold gap-2 shadow-card-hover"
          size="lg"
        >
          <Sparkles className="h-5 w-5" />
          ✨ Gerar Avatar (Em breve)
        </Button>

        {/* Prompt Preview */}
        <div className="rounded-xl border border-border bg-card p-4 shadow-card">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Prompt Gerado (EN)
            </h4>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCopy}
              className="h-7 px-2 text-xs gap-1"
            >
              {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
              {copied ? 'Copiado!' : 'Copiar'}
            </Button>
          </div>
          <div className="rounded-lg bg-secondary/70 p-3 text-sm text-foreground leading-relaxed min-h-[80px] max-h-[200px] overflow-y-auto font-mono text-xs">
            {displayedPrompt}
            {isTyping && (
              <span className="inline-block w-0.5 h-3.5 bg-accent ml-0.5 animate-pulse" />
            )}
          </div>
        </div>
      </div>

      {/* Waitlist Modal */}
      <Dialog open={waitlistOpen} onOpenChange={setWaitlistOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <Sparkles className="h-5 w-5 text-accent" />
              Geração de Avatar com IA
            </DialogTitle>
            <DialogDescription>
              Estamos finalizando a integração com IA para gerar avatares incríveis a partir do seu prompt. Entre na lista de espera para ser notificado quando lançarmos!
            </DialogDescription>
          </DialogHeader>
          {submitted ? (
            <div className="flex flex-col items-center py-6 gap-3">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-accent/20">
                <Check className="h-7 w-7 text-accent" />
              </div>
              <p className="text-sm font-medium text-foreground">Você está na lista! 🎉</p>
              <p className="text-xs text-muted-foreground">Avisaremos quando estiver disponível.</p>
            </div>
          ) : (
            <div className="space-y-4 pt-2">
              <Input
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Button
                onClick={handleWaitlist}
                disabled={!email.includes('@')}
                className="w-full gap-2"
              >
                <Sparkles className="h-4 w-4" />
                Entrar na Lista de Espera
              </Button>
              <p className="text-xs text-center text-muted-foreground">
                Sem spam. Apenas uma notificação quando lançarmos.
              </p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AvatarPreview;
