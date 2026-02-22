import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useImageGeneration = () => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateImage = async (prompt: string) => {
    setLoading(true);
    setError(null);
    setImageUrl(null);

    try {
      const { data, error: fnError } = await supabase.functions.invoke('generate-image', {
        body: { prompt },
      });

      if (fnError) {
        throw new Error(fnError.message || 'Erro ao gerar imagem');
      }

      if (data?.error) {
        throw new Error(data.error);
      }

      if (data?.imageUrl) {
        setImageUrl(data.imageUrl);
      } else {
        throw new Error('Nenhuma imagem retornada');
      }
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Erro desconhecido';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setImageUrl(null);
    setError(null);
  };

  return { generateImage, imageUrl, loading, error, reset };
};
