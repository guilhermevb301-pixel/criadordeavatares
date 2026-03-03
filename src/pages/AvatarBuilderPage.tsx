import { useMemo, useState } from 'react';
import { useAvatarStore } from '@/stores/avatar-store';
import { generatePrompt } from '@/lib/prompt-engine';
import {
  getBuilderBlocks,
  appearanceSubBlocks,
  cameraSubBlocks,
  visualStyles,
  thematicEnvironments,
  isThematicStyle,
  type AvatarState,
  type Gender,
  type VisualStyle,
} from '@/lib/avatar-config';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { User, Shirt, MapPin, Move, Camera, Smile, Sun, Aperture, Ratio, Palette } from 'lucide-react';
import OptionGrid from '@/components/builder/OptionGrid';
import AvatarPreview from '@/components/builder/AvatarPreview';
import EditTab from '@/components/builder/EditTab';

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

const GenderSelection = ({ onSelect }: { onSelect: (g: Gender) => void }) => (
  <div className="flex flex-1 flex-col items-center justify-center p-8">
    <h2 className="mb-2 text-2xl font-bold font-display text-foreground">Escolha o Gênero 🎭</h2>
    <p className="mb-8 text-sm text-muted-foreground">Selecione para começar a construir seu avatar ✨</p>
    <div className="flex flex-col gap-6 sm:flex-row">
      {(['masculino', 'feminino'] as const).map((g) => (
        <button
          key={g}
          onClick={() => onSelect(g)}
          className="group flex flex-col items-center gap-4 rounded-2xl border border-border bg-card p-8 shadow-card transition-all duration-300 hover:shadow-card-hover hover:-translate-y-1 hover:border-accent focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-secondary transition-colors group-hover:bg-accent group-hover:text-accent-foreground">
            <span className="text-3xl">{g === 'masculino' ? '👨' : '👩'}</span>
          </div>
          <span className="text-lg font-semibold font-display text-card-foreground capitalize">{g}</span>
        </button>
      ))}
    </div>
  </div>
);

const VisualStyleSelector = ({
  selected,
  onSelect,
}: {
  selected: string;
  onSelect: (style: VisualStyle) => void;
}) => (
  <div className="mb-4 rounded-xl border border-border bg-card p-4 shadow-card">
    <div className="flex items-center gap-2 mb-3">
      <span className="text-xl">🎨</span>
      <span className="text-sm font-semibold text-card-foreground">Estilo Visual</span>
    </div>
    <div className="flex flex-wrap gap-2">
      {visualStyles.map((style) => (
        <button
          key={style.id}
          onClick={() => onSelect(style.id as VisualStyle)}
          className={`rounded-full px-4 py-1.5 text-sm font-medium transition-all duration-200 ${
            selected === style.id
              ? 'bg-accent text-accent-foreground shadow-sm'
              : 'bg-secondary text-muted-foreground hover:bg-secondary/80 hover:text-foreground'
          }`}
        >
          {style.label}
        </button>
      ))}
    </div>
  </div>
);

const AttachedPhotoToggle = ({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
}) => (
  <div className="mb-4 rounded-xl border border-border bg-card p-4 shadow-card">
    <div className="flex items-center justify-between">
      <div>
        <span className="text-sm font-medium text-card-foreground">📸 Vou anexar uma foto de referência</span>
        <p className="text-xs text-muted-foreground mt-0.5">Ative se você vai enviar uma foto junto com o prompt</p>
      </div>
      <Switch checked={checked} onCheckedChange={onChange} />
    </div>
  </div>
);

const CelebrityRefInput = ({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) => (
  <div className="mb-4 rounded-xl border border-border bg-card p-4 shadow-card">
    <label className="block text-sm font-medium text-card-foreground mb-2">
      🌟 Quer copiar o visual de alguém? <span className="text-muted-foreground font-normal">(opcional)</span>
    </label>
    <Input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Ex: Goku, Naruto, Angelina Jolie, Keanu Reeves..."
    />
  </div>
);

const AvatarBuilderPage = () => {
  const { gender, state, updateField, toggleMultiField, setGender, setVisualStyle } = useAvatarStore();
  const [activeTab, setActiveTab] = useState<'builder' | 'edit'>('builder');

  const blocks = useMemo(() => (gender ? getBuilderBlocks(gender) : []), [gender]);
  const isThematic = isThematicStyle(state.visualStyle);

  const fullState: AvatarState | null = useMemo(
    () => (gender ? { ...state, gender } : null),
    [state, gender]
  );

  const prompt = useMemo(() => (fullState ? generatePrompt(fullState) : ''), [fullState]);

  // Config version counter for shimmer effect
  const configVersion = useMemo(() => {
    return JSON.stringify(state).length + Date.now();
  }, [state]);

  if (!gender) return <GenderSelection onSelect={setGender} />;

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
        state.features.forEach(f => {
          const l = findLabel(appearanceSubBlocks.features, f);
          if (l) tags.push(l);
        });
        break;
      }
      case 'clothing':
        state.clothing.forEach(c => {
          const block = blocks.find(b => b.id === 'clothing');
          const l = block?.options?.find(o => o.id === c)?.label;
          if (l) tags.push(l);
        });
        break;
      case 'environment': {
        if (isThematic) {
          const l = thematicEnvironments.find(o => o.id === state.thematicEnvironment)?.label;
          if (l) tags.push(l);
          if (state.thematicEnvironment === 'custom' && state.customThematicEnv) tags.push(state.customThematicEnv);
        } else {
          const block = blocks.find(b => b.id === 'environment');
          const l = block?.options?.find(o => o.id === state.environment)?.label;
          if (l) tags.push(l);
        }
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
    <div className="flex flex-col flex-1">
      {/* Sub-navigation */}
      <div className="flex items-center gap-2 border-b border-border px-6 py-3">
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
        <div className="ml-auto">
          <h2 className="text-sm font-medium text-muted-foreground">
            Avatar {gender === 'masculino' ? 'Masculino' : 'Feminino'}
          </h2>
        </div>
      </div>

      {activeTab === 'edit' ? (
        <EditTab />
      ) : (
        <div className="flex flex-1 flex-col lg:flex-row min-h-0">
          {/* Mobile Preview - top */}
          <div className="lg:hidden border-b border-border max-h-[50vh] overflow-y-auto">
            <AvatarPreview gender={gender} prompt={prompt} configVersion={configVersion} />
          </div>

          {/* Builder Column */}
          <div className="flex-1 overflow-y-auto p-6 lg:max-w-[55%]">
            <div className="mb-6">
              <h1 className="text-2xl font-bold font-display text-foreground">
                🛠️ Configurações do Avatar
              </h1>
              <p className="text-sm text-muted-foreground mt-1">Personalize cada detalhe do seu avatar ✨</p>
            </div>

            {/* Visual Style */}
            <VisualStyleSelector
              selected={state.visualStyle}
              onSelect={setVisualStyle}
            />

            {/* Attached Photo Toggle */}
            <AttachedPhotoToggle
              checked={state.useAttachedPhoto}
              onChange={(v) => updateField('useAttachedPhoto', v)}
            />

            {/* Celebrity Reference */}
            <CelebrityRefInput
              value={state.celebrityRef}
              onChange={(v) => updateField('celebrityRef', v)}
            />

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
                          {Object.entries(appearanceSubBlocks).map(([key, sub]) => {
                            const customFieldMap: Record<string, keyof Omit<AvatarState, 'gender'>> = {
                              skinTone: 'customSkinTone',
                              eyeColor: 'customEyeColor',
                              hairColor: 'customHairColor',
                              hairType: 'customHairType',
                              features: 'customFeatures',
                            };
                            const placeholderMap: Record<string, string> = {
                              skinTone: '✏️ Ex: pele bronzeada com sardas...',
                              eyeColor: '✏️ Ex: olhos heterocromicos verde e azul...',
                              hairColor: '✏️ Ex: cabelo com mechas roxas...',
                              hairType: '✏️ Ex: cabelo com trancas box braids...',
                              features: '✏️ Ex: cicatriz no queixo, sobrancelha grossa...',
                            };
                            const customKey = customFieldMap[key];
                            return (
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
                                {customKey && (
                                  <Input
                                    value={state[customKey] as string}
                                    onChange={(e) => updateField(customKey, e.target.value)}
                                    placeholder={placeholderMap[key]}
                                    className="mt-3"
                                  />
                                )}
                              </div>
                            );
                          })}
                        </div>
                      ) : block.id === 'camera' ? (
                        <div className="space-y-4">
                          {Object.entries(cameraSubBlocks).map(([key, sub]) => {
                            const customKey = key === 'angle' ? 'customCameraAngle' : 'customCameraFraming';
                            const placeholder = key === 'angle'
                              ? '✏️ Ex: camera de drone vista aerea...'
                              : '✏️ Ex: apenas o rosto bem proximo...';
                            return (
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
                                <Input
                                  value={state[customKey] as string}
                                  onChange={(e) => updateField(customKey, e.target.value)}
                                  placeholder={placeholder}
                                  className="mt-3"
                                />
                              </div>
                            );
                          })}
                        </div>
                      ) : block.id === 'environment' ? (
                        isThematic ? (
                          <div className="space-y-4">
                            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                              Ambiente Temático
                            </h4>
                            <OptionGrid
                              options={thematicEnvironments}
                              selected={state.thematicEnvironment ? [state.thematicEnvironment] : []}
                              onSelect={(id) => updateField('thematicEnvironment', id)}
                              multi={false}
                            />
                            {state.thematicEnvironment === 'custom' && (
                              <div className="mt-3">
                                <Input
                                  value={state.customThematicEnv}
                                  onChange={(e) => updateField('customThematicEnv', e.target.value)}
                                  placeholder="Descreva o ambiente desejado..."
                                />
                              </div>
                            )}
                          </div>
                        ) : (
                          <div>
                            <OptionGrid
                              options={block.options || []}
                              selected={state.environment ? [state.environment] : []}
                              onSelect={(id) => updateField('environment', id)}
                              multi={false}
                            />
                            <Input
                              value={state.customEnvironment}
                              onChange={(e) => updateField('customEnvironment', e.target.value)}
                              placeholder="✏️ Ex: em cima de um predio abandonado..."
                              className="mt-3"
                            />
                          </div>
                        )
                      ) : (
                        <div>
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
                          {(() => {
                            const customMap: Record<string, { key: keyof Omit<AvatarState, 'gender'>; placeholder: string }> = {
                              clothing: { key: 'customClothing', placeholder: '✏️ Ex: blusa vermelha, terno azul marinho...' },
                              pose: { key: 'customPose', placeholder: '✏️ Ex: sentado em uma cadeira de escritorio...' },
                              expression: { key: 'customExpression', placeholder: '✏️ Ex: sorriso com os olhos fechados...' },
                              lighting: { key: 'customLighting', placeholder: '✏️ Ex: luz roxa neon vindo da esquerda...' },
                              photoStyle: { key: 'customPhotoStyle', placeholder: '✏️ Ex: foto com lente olho de peixe...' },
                              aspectRatio: { key: 'customAspectRatio', placeholder: '✏️ Ex: formato panoramico ultra-wide...' },
                            };
                            const custom = customMap[block.id];
                            if (!custom) return null;
                            return (
                              <Input
                                value={state[custom.key] as string}
                                onChange={(e) => updateField(custom.key, e.target.value)}
                                placeholder={custom.placeholder}
                                className="mt-3"
                              />
                            );
                          })()}
                        </div>
                      )}
                    </AccordionContent>
                  </AccordionItem>
                );
              })}
            </Accordion>
          </div>

          {/* Preview Column - desktop */}
          <div className="hidden lg:flex lg:flex-col lg:w-[45%] border-l border-border">
            <div className="sticky top-0 h-screen overflow-hidden">
              <AvatarPreview gender={gender} prompt={prompt} configVersion={configVersion} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AvatarBuilderPage;
