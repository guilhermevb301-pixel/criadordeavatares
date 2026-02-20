import { useState } from 'react';
import { editActions, type EditAction } from '@/lib/avatar-config';
import { generateEditPrompt } from '@/lib/prompt-engine';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Copy, Check, Wand2 } from 'lucide-react';
import OptionGrid from './OptionGrid';

const EditTab = () => {
  const [originalPrompt, setOriginalPrompt] = useState('');
  const [selectedActions, setSelectedActions] = useState<Record<string, string | boolean>>({});
  const [copied, setCopied] = useState(false);

  const toggleAction = (actionId: string, subOptionId?: string) => {
    setSelectedActions((prev) => {
      const next = { ...prev };
      if (subOptionId) {
        next[actionId] = subOptionId;
      } else {
        if (next[actionId]) {
          delete next[actionId];
        } else {
          next[actionId] = true;
        }
      }
      return next;
    });
  };

  const changes = editActions
    .filter((a) => selectedActions[a.id])
    .map((a) => {
      if (a.hasSubOptions && typeof selectedActions[a.id] === 'string') {
        const sub = a.subOptions?.find((o) => o.id === selectedActions[a.id]);
        return `${a.promptPrefix} ${sub?.promptValue || selectedActions[a.id]}`;
      }
      return a.promptPrefix;
    });

  const editPrompt = originalPrompt ? generateEditPrompt(originalPrompt, changes) : '';

  const handleCopy = async () => {
    await navigator.clipboard.writeText(editPrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  return (
    <div className="flex flex-1 flex-col lg:flex-row">
      <div className="flex-1 p-4 md:p-6 lg:max-w-[60%] space-y-4">
        <div>
          <h1 className="text-2xl font-bold font-display text-foreground">Editar Avatar Existente</h1>
          <p className="text-sm text-muted-foreground">
            Cole seu prompt original e escolha as modificações desejadas
          </p>
        </div>

        <div>
          <label className="text-sm font-medium text-foreground mb-1.5 block">Prompt Original</label>
          <Textarea
            value={originalPrompt}
            onChange={(e) => setOriginalPrompt(e.target.value)}
            placeholder="Cole aqui o prompt que deseja modificar..."
            className="min-h-[120px] bg-card"
          />
        </div>

        {originalPrompt && (
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Wand2 className="h-4 w-4 text-accent-foreground" />
              Modificações Disponíveis
            </h3>
            {editActions.map((action) => {
              const isActive = !!selectedActions[action.id];
              return (
                <div key={action.id} className="rounded-xl border border-border bg-card p-3 shadow-card">
                  <button
                    onClick={() => !action.hasSubOptions && toggleAction(action.id)}
                    className={`w-full text-left text-sm font-medium transition-colors ${
                      isActive ? 'text-accent-foreground' : 'text-card-foreground'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className={`h-4 w-4 rounded border transition-colors flex items-center justify-center ${
                          isActive ? 'border-accent bg-accent' : 'border-border'
                        }`}
                      >
                        {isActive && <Check className="h-3 w-3 text-accent-foreground" />}
                      </div>
                      {action.label}
                    </div>
                  </button>
                  {action.hasSubOptions && action.subOptions && (
                    <div className="mt-2 pl-6">
                      <OptionGrid
                        options={action.subOptions}
                        selected={typeof selectedActions[action.id] === 'string' ? [selectedActions[action.id] as string] : []}
                        onSelect={(id) => toggleAction(action.id, id)}
                        multi={false}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Preview Column */}
      <div className="hidden lg:block lg:w-[40%] border-l border-border">
        <div className="sticky top-[57px] p-6">
          <div className="rounded-xl border border-border bg-card p-5 shadow-card">
            <h3 className="mb-1 text-lg font-bold font-display text-card-foreground">
              Prompt de Modificação
            </h3>
            <p className="mb-4 text-xs text-muted-foreground">
              Inglês — cole no gerador de imagem junto ao prompt original
            </p>
            <div className="mb-4 rounded-lg bg-secondary p-4 text-sm text-foreground leading-relaxed min-h-[120px]">
              {editPrompt || 'Cole um prompt e selecione modificações para gerar o resultado...'}
            </div>
            <Button onClick={handleCopy} disabled={!editPrompt} className="w-full">
              {copied ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
              {copied ? 'Copiado!' : 'Copiar Prompt de Modificação'}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile */}
      <div className="lg:hidden fixed bottom-4 left-4 right-4 z-20">
        {editPrompt && (
          <Button onClick={handleCopy} className="w-full shadow-card-hover" size="lg">
            {copied ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
            {copied ? 'Copiado!' : 'Copiar Prompt de Modificação'}
          </Button>
        )}
      </div>
    </div>
  );
};

export default EditTab;
