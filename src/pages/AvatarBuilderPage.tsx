import { useMemo, useState } from 'react';
import { useAvatarStore } from '@/stores/avatar-store';
import { generatePrompt } from '@/lib/prompt-engine';
import {
  getBuilderBlocks,
  appearanceSubBlocks,
  getPersonalitySubBlocks,
  cameraSubBlocks,
  visualStyles,
  artStyles,
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
import {
  Dna,
  Scissors,
  Gem,
  Sparkles,
  User,
  Shirt,
  MapPin,
  Move,
  Camera,
  Smile,
  Sun,
  Aperture,
  Ratio,
} from 'lucide-react';
import OptionGrid from '@/components/builder/OptionGrid';
import AvatarPromptCard from '@/components/builder/AvatarPromptCard';

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

// Helper to render a sub-block section
const SubBlockSection = ({
  title,
  options,
  selected,
  onSelect,
  multi,
  customKey,
  customValue,
  customPlaceholder,
  onCustomChange,
}: {
  title: string;
  options: { id: string; label: string; promptValue: string; icon?: string }[];
  selected: string[];
  onSelect: (id: string) => void;
  multi: boolean;
  customKey?: string;
  customValue?: string;
  customPlaceholder?: string;
  onCustomChange?: (v: string) => void;
}) => (
  <div>
    <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
      {title}
    </h4>
    <OptionGrid
      options={options}
      selected={selected}
      onSelect={onSelect}
      multi={multi}
    />
    {customKey && onCustomChange && (
      <Input
        value={customValue || ''}
        onChange={(e) => onCustomChange(e.target.value)}
        placeholder={customPlaceholder}
        className="mt-3"
      />
    )}
  </div>
);

const AvatarBuilderPage = () => {
  const { gender, state, updateField, toggleMultiField, setGender, setVisualStyle, randomize } = useAvatarStore();
  const [activeTab, setActiveTab] = useState<'builder' | 'edit'>('builder');

  // Toggle helper: clicking a selected single-select option deselects it
  const toggleSingle = <K extends keyof Omit<AvatarState, 'gender'>>(key: K, id: string) => {
    updateField(key, (state[key] === id ? '' : id) as AvatarState[K]);
  };

  const blocks = useMemo(() => (gender ? getBuilderBlocks(gender) : []), [gender]);
  const personalitySubBlocks = useMemo(() => getPersonalitySubBlocks(gender || 'masculino'), [gender]);
  const isThematic = isThematicStyle(state.visualStyle);

  const fullState: AvatarState | null = useMemo(
    () => (gender ? { ...state, gender } : null),
    [state, gender]
  );

  const prompt = useMemo(() => (fullState ? generatePrompt(fullState) : ''), [fullState]);

  const configVersion = useMemo(() => {
    return JSON.stringify(state).length + Date.now();
  }, [state]);

  if (!gender) return <GenderSelection onSelect={setGender} />;

  // Summary tags for the 4 personality accordion categories
  const getDnaTags = (): string[] => {
    const tags: string[] = [];
    const findLabel = (opts: { id: string; label: string }[], val: string) =>
      opts.find(o => o.id === val)?.label;
    if (state.skinTone) tags.push(findLabel(appearanceSubBlocks.skinTone.options, state.skinTone) || '');
    if (state.eyeColor) tags.push(findLabel(appearanceSubBlocks.eyeColor.options, state.eyeColor) || '');
    if (state.faceShape) tags.push(findLabel(personalitySubBlocks.faceShape.options, state.faceShape) || '');
    tags.push(`${state.age} anos`);
    return tags.filter(Boolean);
  };

  const getHairTags = (): string[] => {
    const tags: string[] = [];
    const findLabel = (opts: { id: string; label: string }[], val: string) =>
      opts.find(o => o.id === val)?.label;
    if (state.hairColor) tags.push(findLabel(appearanceSubBlocks.hairColor.options, state.hairColor) || '');
    if (state.exoticHairColor) tags.push(findLabel(personalitySubBlocks.exoticHairColor.options, state.exoticHairColor) || '');
    if (state.hairCut) tags.push(findLabel(personalitySubBlocks.hairCut.options, state.hairCut) || '');
    if (state.hairType) tags.push(findLabel(appearanceSubBlocks.hairType.options, state.hairType) || '');
    if (state.beardStyle && state.beardStyle !== 'clean') tags.push(findLabel(personalitySubBlocks.beardStyle.options, state.beardStyle) || '');
    return tags.filter(Boolean);
  };

  const getAccessoryTags = (): string[] => {
    const tags: string[] = [];
    const findLabel = (opts: { id: string; label: string }[], val: string) =>
      opts.find(o => o.id === val)?.label;
    if (state.glassesStyle && state.glassesStyle !== 'none') tags.push(findLabel(personalitySubBlocks.glassesStyle.options, state.glassesStyle) || '');
    (state.piercingsTattoos || []).forEach(p => {
      const l = findLabel(personalitySubBlocks.piercingsTattoos.options, p);
      if (l) tags.push(l);
    });
    if (state.makeupStyle && state.makeupStyle !== 'none') tags.push(findLabel(personalitySubBlocks.makeupStyle.options, state.makeupStyle) || '');
    (state.features || []).forEach(f => {
      const l = findLabel(appearanceSubBlocks.features.options, f);
      if (l) tags.push(l);
    });
    return tags.filter(Boolean);
  };

  const getVibeTags = (): string[] => {
    const tags: string[] = [];
    const findLabel = (opts: { id: string; label: string }[], val: string) =>
      opts.find(o => o.id === val)?.label;
    if (state.artStyle) tags.push(findLabel(artStyles, state.artStyle) || '');
    return tags.filter(Boolean);
  };

  // Existing block summary tags for the remaining technical accordions
  const getBlockTags = (blockId: string): string[] => {
    const tags: string[] = [];
    const findLabel = (opts: { id: string; label: string }[], val: string) =>
      opts.find(o => o.id === val)?.label;
    switch (blockId) {
      case 'clothing':
        (state.clothing || []).forEach(c => {
          const block = blocks.find(b => b.id === 'clothing');
          const l = block?.options?.find(o => o.id === c)?.label;
          if (l) tags.push(l);
        });
        break;
      case 'environment': {
        if (isThematic) {
          const l = thematicEnvironments.find(o => o.id === state.thematicEnvironment)?.label;
          if (l) tags.push(l);
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

  const renderTagBadges = (tags: string[]) =>
    tags.length > 0 ? (
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
    ) : null;

  // The 4 personality categories
  const personalityAccordions = [
    {
      id: 'dna-visual',
      title: '🧬 DNA Visual (Base)',
      icon: <Dna className="h-4 w-4" />,
      description: 'Etnia, idade e formato do rosto',
      tags: getDnaTags(),
      content: (
        <div className="space-y-4">
          {/* Age Slider */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Idade</h4>
              <span className="text-sm font-semibold text-foreground">{state.age} anos</span>
            </div>
            <Slider
              value={[state.age]}
              onValueChange={(v) => updateField('age', v[0])}
              min={5}
              max={80}
              step={1}
            />
          </div>
          <SubBlockSection
            title="Etnia / Tom de Pele"
            options={appearanceSubBlocks.skinTone.options}
            selected={state.skinTone ? [state.skinTone] : []}
            onSelect={(id) => updateField('skinTone', id)}
            multi={false}
            customKey="customSkinTone"
            customValue={state.customSkinTone}
            customPlaceholder="✏️ Ex: pele bronzeada com sardas..."
            onCustomChange={(v) => updateField('customSkinTone', v)}
          />
          <SubBlockSection
            title="Cor dos Olhos"
            options={appearanceSubBlocks.eyeColor.options}
            selected={state.eyeColor ? [state.eyeColor] : []}
            onSelect={(id) => updateField('eyeColor', id)}
            multi={false}
            customKey="customEyeColor"
            customValue={state.customEyeColor}
            customPlaceholder="✏️ Ex: olhos heterocromicos verde e azul..."
            onCustomChange={(v) => updateField('customEyeColor', v)}
          />
          <SubBlockSection
            title="Formato do Rosto"
            options={personalitySubBlocks.faceShape.options}
            selected={state.faceShape ? [state.faceShape] : []}
            onSelect={(id) => updateField('faceShape', id)}
            multi={false}
          />
        </div>
      ),
    },
    {
      id: 'estilo-cabelo',
      title: '✂️ Estilo e Cabelo',
      icon: <Scissors className="h-4 w-4" />,
      description: 'Cortes, cores exóticas e barba',
      tags: getHairTags(),
      content: (
        <div className="space-y-4">
          <SubBlockSection
            title="Cor do Cabelo"
            options={appearanceSubBlocks.hairColor.options}
            selected={state.hairColor ? [state.hairColor] : []}
            onSelect={(id) => updateField('hairColor', id)}
            multi={false}
            customKey="customHairColor"
            customValue={state.customHairColor}
            customPlaceholder="✏️ Ex: cabelo com mechas roxas..."
            onCustomChange={(v) => updateField('customHairColor', v)}
          />
          <SubBlockSection
            title="Cores Exóticas"
            options={personalitySubBlocks.exoticHairColor.options}
            selected={state.exoticHairColor ? [state.exoticHairColor] : []}
            onSelect={(id) => updateField('exoticHairColor', state.exoticHairColor === id ? '' : id)}
            multi={false}
          />
          <SubBlockSection
            title="Corte de Cabelo"
            options={personalitySubBlocks.hairCut.options}
            selected={state.hairCut ? [state.hairCut] : []}
            onSelect={(id) => updateField('hairCut', id)}
            multi={false}
          />
          <SubBlockSection
            title="Tipo de Cabelo"
            options={appearanceSubBlocks.hairType.options}
            selected={state.hairType ? [state.hairType] : []}
            onSelect={(id) => updateField('hairType', id)}
            multi={false}
            customKey="customHairType"
            customValue={state.customHairType}
            customPlaceholder="✏️ Ex: cabelo com tranças box braids..."
            onCustomChange={(v) => updateField('customHairType', v)}
          />
          <SubBlockSection
            title="Barba / Pelos Faciais"
            options={personalitySubBlocks.beardStyle.options}
            selected={state.beardStyle ? [state.beardStyle] : []}
            onSelect={(id) => updateField('beardStyle', id)}
            multi={false}
          />
        </div>
      ),
    },
    {
      id: 'acessorios',
      title: '💎 Acessórios e Identidade',
      icon: <Gem className="h-4 w-4" />,
      description: 'Óculos, piercings, tatuagens e maquiagem',
      tags: getAccessoryTags(),
      content: (
        <div className="space-y-4">
          <SubBlockSection
            title="Óculos"
            options={personalitySubBlocks.glassesStyle.options}
            selected={state.glassesStyle ? [state.glassesStyle] : []}
            onSelect={(id) => updateField('glassesStyle', id)}
            multi={false}
          />
          <SubBlockSection
            title="Piercings / Tatuagens"
            options={personalitySubBlocks.piercingsTattoos.options}
            selected={state.piercingsTattoos || []}
            onSelect={(id) => toggleMultiField('piercingsTattoos', id)}
            multi={true}
          />
          <SubBlockSection
            title="Maquiagem / Pintura de Guerra"
            options={personalitySubBlocks.makeupStyle.options}
            selected={state.makeupStyle ? [state.makeupStyle] : []}
            onSelect={(id) => updateField('makeupStyle', id)}
            multi={false}
          />
          <SubBlockSection
            title="Características Especiais"
            options={appearanceSubBlocks.features.options}
            selected={state.features || []}
            onSelect={(id) => toggleMultiField('features', id)}
            multi={true}
            customKey="customFeatures"
            customValue={state.customFeatures}
            customPlaceholder="✏️ Ex: cicatriz no queixo, sobrancelha grossa..."
            onCustomChange={(v) => updateField('customFeatures', v)}
          />
        </div>
      ),
    },
    {
      id: 'vibe',
      title: '✨ Vibe e Estética',
      icon: <Sparkles className="h-4 w-4" />,
      description: 'Estilo artístico do avatar',
      tags: getVibeTags(),
      content: (
        <div className="space-y-4">
          <SubBlockSection
            title="Estilo Artístico"
            options={artStyles}
            selected={state.artStyle ? [state.artStyle] : []}
            onSelect={(id) => updateField('artStyle', id)}
            multi={false}
          />
          <div>
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
              Estilo Visual (Motor de Prompt)
            </h4>
            <div className="flex flex-wrap gap-2">
              {visualStyles.map((style) => (
                <button
                  key={style.id}
                  onClick={() => setVisualStyle(style.id as VisualStyle)}
                  className={`rounded-full px-4 py-1.5 text-sm font-medium transition-all duration-200 ${
                    state.visualStyle === style.id
                      ? 'bg-accent text-accent-foreground shadow-sm'
                      : 'bg-secondary text-muted-foreground hover:bg-secondary/80 hover:text-foreground'
                  }`}
                >
                  {style.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      ),
    },
  ];

  // Remaining technical blocks (clothing, environment, pose, camera, expression, lighting, photoStyle, aspectRatio)
  const technicalBlocks = blocks.filter(b => b.id !== 'appearance');

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
          {/* Mobile Prompt */}
            <div className="lg:hidden border-b border-border p-5">
              <AvatarPromptCard prompt={prompt} />
            </div>
          {/* Builder Column */}
          <div className="flex-1 overflow-y-auto p-6 lg:max-w-[55%]">
            <div className="mb-6">
              <h1 className="text-2xl font-bold font-display text-foreground">
                🛠️ Modo Personalidade
              </h1>
              <p className="text-sm text-muted-foreground mt-1">Controle total sobre cada detalhe do seu avatar ✨</p>
            </div>

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

            {/* === 4 Personality Accordions === */}
            <div className="mb-6">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Personalidade</h3>
              <Accordion type="multiple" defaultValue={['dna-visual']} className="space-y-2">
                {(state.useAttachedPhoto
                  ? personalityAccordions.filter(acc => !['dna-visual', 'estilo-cabelo'].includes(acc.id))
                  : personalityAccordions
                ).map((acc) => (
                  <AccordionItem
                    key={acc.id}
                    value={acc.id}
                    className="rounded-xl border border-border bg-card shadow-card overflow-hidden"
                  >
                    <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-secondary/50 transition-colors">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-secondary text-muted-foreground">
                          {acc.icon}
                        </div>
                        <div className="flex flex-col items-start min-w-0">
                          <span className="text-sm font-semibold text-card-foreground">{acc.title}</span>
                          {acc.tags.length > 0
                            ? renderTagBadges(acc.tags)
                            : <span className="text-xs text-muted-foreground">{acc.description}</span>
                          }
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-4 pb-4">
                      {acc.content}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>

            {/* === Technical Accordions (Roupa, Ambiente, etc) === */}
            <div>
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Configurações Técnicas</h3>
              <Accordion type="multiple" className="space-y-2">
                {technicalBlocks.map((block) => {
                  const tags = getBlockTags(block.id);
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
                            {tags.length > 0
                              ? renderTagBadges(tags)
                              : <span className="text-xs text-muted-foreground">{block.description}</span>
                            }
                          </div>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="px-4 pb-4">
                        {block.id === 'camera' ? (
                          <div className="space-y-4">
                            {Object.entries(cameraSubBlocks).map(([key, sub]) => {
                              const customKey = key === 'angle' ? 'customCameraAngle' : 'customCameraFraming';
                              const placeholder = key === 'angle'
                                ? '✏️ Ex: camera de drone vista aerea...'
                                : '✏️ Ex: apenas o rosto bem proximo...';
                              return (
                                <SubBlockSection
                                  key={key}
                                  title={sub.title}
                                  options={sub.options}
                                  selected={[state[key === 'angle' ? 'cameraAngle' : 'cameraFraming'] as string]}
                                  onSelect={(id) =>
                                    updateField(key === 'angle' ? 'cameraAngle' : 'cameraFraming', id as any)
                                  }
                                  multi={false}
                                  customKey={customKey}
                                  customValue={state[customKey] as string}
                                  customPlaceholder={placeholder}
                                  onCustomChange={(v) => updateField(customKey as any, v)}
                                />
                              );
                            })}
                          </div>
                        ) : block.id === 'environment' ? (
                          isThematic ? (
                            <div className="space-y-4">
                              <SubBlockSection
                                title="Ambiente Temático"
                                options={thematicEnvironments}
                                selected={state.thematicEnvironment ? [state.thematicEnvironment] : []}
                                onSelect={(id) => updateField('thematicEnvironment', id)}
                                multi={false}
                              />
                              {state.thematicEnvironment === 'custom' && (
                                <Input
                                  value={state.customThematicEnv}
                                  onChange={(e) => updateField('customThematicEnv', e.target.value)}
                                  placeholder="Descreva o ambiente desejado..."
                                  className="mt-3"
                                />
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
                                  ? (state.clothing || [])
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
          </div>

          {/* Prompt Column - desktop */}
          <div className="hidden lg:flex lg:flex-col lg:w-[45%] border-l border-border p-6">
            <div className="sticky top-[57px]">
              <AvatarPromptCard prompt={prompt} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AvatarBuilderPage;
