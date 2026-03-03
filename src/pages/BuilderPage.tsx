import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAvatarStore } from '@/stores/avatar-store';
import { generatePrompt } from '@/lib/prompt-engine';
import { getBuilderBlocks, appearanceSubBlocks, cameraSubBlocks, type AvatarState } from '@/lib/avatar-config';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Sparkles, Copy, Check, ArrowLeft, User, Shirt, MapPin, Move, Camera, Smile, Sun, Aperture, Ratio } from 'lucide-react';
import OptionGrid from '@/components/builder/OptionGrid';
import PromptPreview from '@/components/builder/PromptPreview';
import EditTab from '@/components/builder/EditTab';
import { ThemeToggle } from '@/components/ThemeToggle';

const iconMap: Record<string, React.ReactNode> = {
  User: <User className="h-4 w-4" />,
  Shirt: <Shirt className="h-4 w-4" />,
  MapPin: <MapPin className="h-4 w-4" />,
  Move: <Move className="h-4 w-4" />,
  Camera: <Camera className="h-4 w-4" />,
  Smile: <Smile className="h-4 w-4" />,
  Sun: <Sun className="h-4 w-4" />,
  Aperture: <Aperture className="h-4 w-4" />,
  RatioIcon: <Ratio className="h-4 w-4" />,
};

const BuilderPage = () => {
  const navigate = useNavigate();
  const { gender, state, updateField, toggleMultiField } = useAvatarStore();
  const [activeTab, setActiveTab] = useState<'builder' | 'edit'>('builder');

  useEffect(() => {
    if (!gender) navigate('/');
  }, [gender, navigate]);

  const blocks = useMemo(() => (gender ? getBuilderBlocks(gender) : []), [gender]);

  const fullState: AvatarState | null = useMemo(
    () => (gender ? { ...state, gender } : null),
    [state, gender]
  );

  const prompt = useMemo(() => (fullState ? generatePrompt(fullState) : ''), [fullState]);

  if (!gender) return null;

  const getSummaryTags = (blockId: string): string[] => {
    const tags: string[] = [];
    switch (blockId) {
      case 'appearance': {
        const findLabel = (opts: { options: { id: string; label: string }[] }, val: string) =>
          opts.options.find(o => o.id === val)?.label;
        if (state.skinTone) tags.push(findLabel(appearanceSubBlocks.skinTone, state.skinTone) || '');
        if (state.eyeColor) tags.push(findLabel(appearanceSubBlocks.eyeColor, state.eyeColor) || '');
        if (state.hairColor) tags.push(findLabel(appearanceSubBlocks.hairColor, state.hairColor) || '');
        if (state.hairType) tags.push(findLabel(appearanceSubBlocks.hairType, state.hairType) || '');
        (state.features || []).forEach(f => {
          const l = findLabel(appearanceSubBlocks.features, f);
          if (l) tags.push(l);
        });
        break;
      }
      case 'clothing':
        (state.clothing || []).forEach(c => {
          const block = blocks.find(b => b.id === 'clothing');
          const l = block?.options?.find(o => o.id === c)?.label;
          if (l) tags.push(l);
        });
        break;
      case 'environment': {
        const block = blocks.find(b => b.id === 'environment');
        const l = block?.options?.find(o => o.id === state.environment)?.label;
        if (l) tags.push(l);
        break;
      }
      case 'pose': {
        const block = blocks.find(b => b.id === 'pose');
        const l = block?.options?.find(o => o.id === state.pose)?.label;
        if (l) tags.push(l);
        break;
      }
      case 'camera': {
        const aL = cameraSubBlocks.angle.options.find(o => o.id === state.cameraAngle)?.label;
        const fL = cameraSubBlocks.framing.options.find(o => o.id === state.cameraFraming)?.label;
        if (aL) tags.push(aL);
        if (fL) tags.push(fL);
        break;
      }
      case 'expression': {
        const block = blocks.find(b => b.id === 'expression');
        const l = block?.options?.find(o => o.id === state.expression)?.label;
        if (l) tags.push(l);
        break;
      }
      case 'lighting': {
        const block = blocks.find(b => b.id === 'lighting');
        const l = block?.options?.find(o => o.id === state.lighting)?.label;
        if (l) tags.push(l);
        break;
      }
      case 'photoStyle': {
        const block = blocks.find(b => b.id === 'photoStyle');
        const l = block?.options?.find(o => o.id === state.photoStyle)?.label;
        if (l) tags.push(l);
        break;
      }
      case 'aspectRatio': {
        const block = blocks.find(b => b.id === 'aspectRatio');
        const l = block?.options?.find(o => o.id === state.aspectRatio)?.label;
        if (l) tags.push(l);
        break;
      }
    }
    return tags.filter(Boolean);
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-background/80 backdrop-blur-sm px-4 md:px-6 py-3">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/')} className="text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <Sparkles className="h-5 w-5 text-accent-foreground" />
          <span className="font-bold font-display text-foreground">Avatar Creator</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 rounded-lg bg-secondary p-1">
          <button
            onClick={() => setActiveTab('builder')}
            className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
              activeTab === 'builder'
                ? 'bg-card text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Novo Avatar
          </button>
          <button
            onClick={() => setActiveTab('edit')}
            className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
              activeTab === 'edit'
                ? 'bg-card text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Editar Existente
          </button>
          </div>
          <ThemeToggle />
        </div>
      </header>

      {activeTab === 'edit' ? (
        <EditTab />
      ) : (
        <div className="flex flex-1 flex-col lg:flex-row">
          {/* Builder Column */}
          <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:max-w-[60%]">
            <div className="mb-4">
              <h1 className="text-2xl font-bold font-display text-foreground">
                Avatar {gender === 'masculino' ? 'Masculino' : 'Feminino'}
              </h1>
              <p className="text-sm text-muted-foreground">Personalize cada detalhe do seu avatar</p>
            </div>

            {/* Age Slider */}
            <div className="mb-4 rounded-xl border border-border bg-card p-4 shadow-card">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-card-foreground">Idade</span>
                <span className="text-sm font-semibold text-accent-foreground">{state.age} anos</span>
              </div>
              <Slider
                value={[state.age]}
                onValueChange={(v) => updateField('age', v[0])}
                min={16}
                max={80}
                step={1}
              />
            </div>

            <Accordion type="multiple" className="space-y-2">
              {blocks.map((block) => {
                const tags = getSummaryTags(block.id);
                return (
                  <AccordionItem
                    key={block.id}
                    value={block.id}
                    className="rounded-xl border border-border bg-card shadow-card overflow-hidden"
                  >
                    <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-secondary/50 transition-colors">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-secondary text-muted-foreground">
                          {iconMap[block.icon]}
                        </div>
                        <div className="flex flex-col items-start min-w-0">
                          <span className="text-sm font-semibold text-card-foreground">{block.title}</span>
                          {tags.length > 0 ? (
                            <div className="flex flex-wrap gap-1 mt-0.5">
                              {tags.slice(0, 4).map((t) => (
                                <Badge key={t} variant="secondary" className="text-[10px] px-1.5 py-0">
                                  {t}
                                </Badge>
                              ))}
                              {tags.length > 4 && (
                                <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                                  +{tags.length - 4}
                                </Badge>
                              )}
                            </div>
                          ) : (
                            <span className="text-xs text-muted-foreground">{block.description}</span>
                          )}
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-4 pb-4">
                      {block.id === 'appearance' ? (
                        <div className="space-y-4">
                          {Object.entries(appearanceSubBlocks).map(([key, sub]) => (
                            <div key={key}>
                              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                                {sub.title}
                              </h4>
                              <OptionGrid
                                options={sub.options}
                                selected={
                                  sub.type === 'multi'
                                    ? state[key as keyof typeof state] as string[]
                                    : [state[key as keyof typeof state] as string]
                                }
                                onSelect={(id) => {
                                  if (sub.type === 'multi') {
                                    toggleMultiField(key as 'features', id);
                                  } else {
                                    updateField(key as keyof Omit<AvatarState, 'gender'>, id as any);
                                  }
                                }}
                                multi={sub.type === 'multi'}
                              />
                            </div>
                          ))}
                        </div>
                      ) : block.id === 'camera' ? (
                        <div className="space-y-4">
                          {Object.entries(cameraSubBlocks).map(([key, sub]) => (
                            <div key={key}>
                              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                                {sub.title}
                              </h4>
                              <OptionGrid
                                options={sub.options}
                                selected={[state[key === 'angle' ? 'cameraAngle' : 'cameraFraming'] as string]}
                                onSelect={(id) =>
                                  updateField(key === 'angle' ? 'cameraAngle' : 'cameraFraming', id as any)
                                }
                                multi={false}
                              />
                            </div>
                          ))}
                        </div>
                      ) : (
                        <OptionGrid
                          options={block.options || []}
                          selected={
                            block.id === 'clothing'
                              ? state.clothing
                              : [state[block.id as keyof typeof state] as string]
                          }
                          onSelect={(id) => {
                            if (block.id === 'clothing') {
                              toggleMultiField('clothing', id);
                            } else {
                              updateField(block.id as keyof Omit<AvatarState, 'gender'>, id as any);
                            }
                          }}
                          multi={block.id === 'clothing'}
                        />
                      )}
                    </AccordionContent>
                  </AccordionItem>
                );
              })}
            </Accordion>
          </div>

          {/* Preview Column - desktop */}
          <div className="hidden lg:block lg:w-[40%] border-l border-border">
            <div className="sticky top-[57px] p-6">
              <PromptPreview prompt={prompt} />
            </div>
          </div>

          {/* Mobile preview button */}
          <div className="fixed bottom-4 left-4 right-4 lg:hidden z-20">
            <PromptPreview prompt={prompt} mobile />
          </div>
        </div>
      )}
    </div>
  );
};

export default BuilderPage;
