import { useState, useEffect, useRef } from 'react';
import { Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AvatarPromptCardProps {
  prompt: string;
}

const AvatarPromptCard = ({ prompt }: AvatarPromptCardProps) => {
  const [displayedPrompt, setDisplayedPrompt] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [copied, setCopied] = useState(false);
  const typingRef = useRef<NodeJS.Timeout | null>(null);

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

  return (
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
          <span className="inline-block w-0.5 h-3.5 bg-emerald-500 ml-0.5 animate-pulse" />
        )}
      </div>
    </div>
  );
};

export default AvatarPromptCard;
