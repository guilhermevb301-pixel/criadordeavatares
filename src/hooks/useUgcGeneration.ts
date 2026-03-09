import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface UgcSceneSetup {
  scene: string;
  camera: string;
  style: string;
  aspect_ratio: string;
  fps: number;
  duration_seconds: number;
}

export interface UgcSceneAction {
  subject: string;
  movement: string;
}

export interface UgcSceneAudio {
  dialogue: string;
  voice: string;
}

export interface UgcScene {
  numero: number;
  type: 'hook' | 'development' | 'cta';
  setup: UgcSceneSetup;
  action: UgcSceneAction;
  audio: UgcSceneAudio;
}

export interface UgcParams {
  produto: string;
  beneficio: string;
  tom: string;
  numCenas: number;
  sotaque: string;
  startFrameDescription: string;
}

export function useUgcGeneration() {
  const [scenes, setScenes] = useState<UgcScene[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const generate = async (params: UgcParams) => {
    setIsLoading(true);
    setScenes([]);
    try {
      const { data, error } = await supabase.functions.invoke('generate-ugc', {
        body: params,
      });

      if (error) {
        toast({ title: 'Erro', description: error.message || 'Erro ao gerar cenas', variant: 'destructive' });
        return;
      }

      if (data?.error) {
        toast({ title: 'Erro', description: data.error, variant: 'destructive' });
        return;
      }

      if (data?.scenes && Array.isArray(data.scenes)) {
        setScenes(data.scenes);
      } else {
        toast({ title: 'Erro', description: 'Formato inesperado da resposta', variant: 'destructive' });
      }
    } catch (e) {
      toast({ title: 'Erro', description: 'Falha na conexão', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  const regenerateScene = async (index: number, params: UgcParams) => {
    setIsLoading(true);
    try {
      const singleParams = { ...params, numCenas: 1 };
      const { data, error } = await supabase.functions.invoke('generate-ugc', {
        body: singleParams,
      });

      if (error || data?.error) {
        toast({ title: 'Erro', description: data?.error || error?.message || 'Erro ao regenerar', variant: 'destructive' });
        return;
      }

      if (data?.scenes?.[0]) {
        setScenes(prev => prev.map((s, i) => i === index ? { ...data.scenes[0], numero: s.numero } : s));
      }
    } catch {
      toast({ title: 'Erro', description: 'Falha na conexão', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  return { scenes, isLoading, generate, regenerateScene, setScenes };
}
