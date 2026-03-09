import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface FalaSetup {
  scene: string;
  camera: string;
  style: string;
  aspect_ratio: string;
  fps: number;
  duration_seconds: number;
}

export interface FalaAction {
  subject: string;
  movement: string;
}

export interface FalaAudio {
  dialogue: string;
  voice: string;
}

export interface Fala {
  numero: number;
  funcao: string;
  setup: FalaSetup;
  action: FalaAction;
  audio: FalaAudio;
  // Legacy fields for backwards compat
  texto?: string;
  intencao?: string;
  expressao?: string;
  gesto?: string;
  enquadramento?: string;
}

export interface CloneProfile {
  comoFala: string;
  palavrasUsa: string;
  palavrasEvita: string;
  nivelEnergia: string;
  arquetipo: string;
  tomEmocional: string;
}

export interface ScriptParams {
  tema: string;
  objetivo: string;
  publicoAlvo: string;
  estiloFala: string;
  personalidade: string;
  plataforma: string;
  cta: string;
  numFalas: number;
  cloneProfile?: CloneProfile;
  sotaque?: string;
  startFrameDescription?: string;
}

export type TransformAction =
  | 'mais-natural'
  | 'mais-persuasiva'
  | 'encurtar'
  | 'expandir'
  | 'variacoes'
  | 'legenda'
  | 'prompt-video'
  | 'teleprompter'
  | 'mais-agressiva';

export function useScriptGeneration() {
  const [falas, setFalas] = useState<Fala[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [transformedText, setTransformedText] = useState<string | null>(null);

  const generate = async (params: ScriptParams) => {
    setIsLoading(true);
    setFalas([]);
    setTransformedText(null);
    try {
      const { data, error } = await supabase.functions.invoke('generate-script', {
        body: params,
      });

      if (error) {
        toast({ title: 'Erro', description: error.message || 'Erro ao gerar roteiro', variant: 'destructive' });
        return;
      }

      if (data?.error) {
        toast({ title: 'Erro', description: data.error, variant: 'destructive' });
        return;
      }

      if (data?.falas && Array.isArray(data.falas)) {
        setFalas(data.falas);
      } else {
        toast({ title: 'Erro', description: 'Formato inesperado da resposta', variant: 'destructive' });
      }
    } catch (e) {
      toast({ title: 'Erro', description: 'Falha na conexão', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  const regenerateFala = async (index: number, params: ScriptParams) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-script', {
        body: { ...params, numFalas: 1, action: 'regenerar', falaIndex: index, funcaoAlvo: falas[index]?.funcao },
      });

      if (error || data?.error) {
        toast({ title: 'Erro', description: data?.error || error?.message || 'Erro ao regenerar', variant: 'destructive' });
        return;
      }

      if (data?.falas?.[0]) {
        setFalas(prev => prev.map((f, i) => i === index ? { ...data.falas[0], numero: f.numero, funcao: f.funcao } : f));
      }
    } catch {
      toast({ title: 'Erro', description: 'Falha na conexão', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  const transformFala = async (index: number, action: TransformAction, params: ScriptParams) => {
    setIsLoading(true);
    try {
      const fala = falas[index];
      const falaOriginal = fala?.audio?.dialogue || fala?.texto || '';
      const { data, error } = await supabase.functions.invoke('generate-script', {
        body: {
          ...params,
          action,
          falaOriginal,
          funcaoAlvo: fala?.funcao,
          numFalas: 1,
        },
      });

      if (error || data?.error) {
        toast({ title: 'Erro', description: data?.error || error?.message || 'Erro na transformação', variant: 'destructive' });
        return;
      }

      if (data?.falas?.[0]) {
        setFalas(prev => prev.map((f, i) => i === index ? { ...data.falas[0], numero: f.numero, funcao: f.funcao } : f));
      }
    } catch {
      toast({ title: 'Erro', description: 'Falha na conexão', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  const transformAll = async (action: TransformAction, params: ScriptParams) => {
    setIsLoading(true);
    setTransformedText(null);
    try {
      const isTextTransform = ['legenda', 'prompt-video', 'teleprompter'].includes(action);
      const falasOriginais = falas.map(f => f.audio?.dialogue || f.texto || '');
      const { data, error } = await supabase.functions.invoke('generate-script', {
        body: {
          ...params,
          action,
          falasOriginais,
        },
      });

      if (error || data?.error) {
        toast({ title: 'Erro', description: data?.error || error?.message || 'Erro na transformação', variant: 'destructive' });
        return;
      }

      if (isTextTransform && data?.texto) {
        setTransformedText(data.texto);
        toast({ title: 'Transformado!', description: 'Texto gerado com sucesso' });
      } else if (data?.falas && Array.isArray(data.falas)) {
        setFalas(data.falas);
      }
    } catch {
      toast({ title: 'Erro', description: 'Falha na conexão', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  return { falas, isLoading, generate, regenerateFala, transformFala, transformAll, setFalas, transformedText, setTransformedText };
}
