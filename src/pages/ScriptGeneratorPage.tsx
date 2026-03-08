import { useRef, useState } from 'react';
import { FileText } from 'lucide-react';
import { useScriptGeneration, type ScriptParams } from '@/hooks/useScriptGeneration';
import ScriptConfigPanel from '@/components/script/ScriptConfigPanel';
import ScriptResultPanel from '@/components/script/ScriptResultPanel';

const ScriptGeneratorPage = () => {
  const { falas, isLoading, generate, regenerateFala, transformFala, transformAll, transformedText, setTransformedText } = useScriptGeneration();
  const [lastParams, setLastParams] = useState<ScriptParams | null>(null);

  const handleGenerate = (params: ScriptParams) => {
    setLastParams(params);
    generate(params);
  };

  const handleRegenerate = (index: number) => {
    if (lastParams) regenerateFala(index, lastParams);
  };

  const handleTransformFala = (index: number, action: any) => {
    if (lastParams) transformFala(index, action, lastParams);
  };

  const handleTransformAll = (action: any) => {
    if (lastParams) transformAll(action, lastParams);
  };

  const handleRegenerateAll = () => {
    if (lastParams) generate(lastParams);
  };

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col bg-background">
      {/* Top bar */}
      <div className="shrink-0 px-6 py-4 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-primary/10">
            <FileText className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-foreground">Gerador de Roteiro</h1>
            <p className="text-xs text-muted-foreground">Roteiros pensados para seu clone soar mais humano, natural e convincente.</p>
          </div>
        </div>
      </div>

      {/* Split panel */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Config panel */}
        <div className="lg:w-[420px] shrink-0 border-b lg:border-b-0 lg:border-r border-border bg-card overflow-y-auto">
          <ScriptConfigPanel isLoading={isLoading} onGenerate={handleGenerate} />
        </div>

        {/* Result panel */}
        <ScriptResultPanel
          falas={falas}
          isLoading={isLoading}
          params={lastParams}
          transformedText={transformedText}
          onRegenerate={handleRegenerate}
          onTransformFala={handleTransformFala}
          onTransformAll={handleTransformAll}
          onRegenerateAll={handleRegenerateAll}
          onClearTransformed={() => setTransformedText(null)}
        />
      </div>
    </div>
  );
};

export default ScriptGeneratorPage;
