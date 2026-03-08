import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface Fala {
  numero: number;
  texto: string;
  intencao: string;
  expressao: string;
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
}

export function useScriptGeneration() {
  const [falas, setFalas] = useState<Fala[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const generate = async (params: ScriptParams) => {
    setIsLoading(true);
    setFalas([]);
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
      const singleParams = { ...params, numFalas: 1 };
      const { data, error } = await supabase.functions.invoke('generate-script', {
        body: singleParams,
      });

      if (error || data?.error) {
        toast({ title: 'Erro', description: data?.error || error?.message || 'Erro ao regenerar', variant: 'destructive' });
        return;
      }

      if (data?.falas?.[0]) {
        setFalas(prev => prev.map((f, i) => i === index ? { ...data.falas[0], numero: f.numero } : f));
      }
    } catch {
      toast({ title: 'Erro', description: 'Falha na conexão', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  return { falas, isLoading, generate, regenerateFala, setFalas };
}
