// Avatar Builder Configuration — PT labels → EN prompt descriptors
// Config-driven architecture for easy extension

export type Gender = 'masculino' | 'feminino';

export interface OptionItem {
  id: string;
  label: string; // PT
  promptValue: string; // EN descriptor
}

export interface BuilderBlock {
  id: string;
  title: string; // PT
  icon: string; // lucide icon name
  description: string; // PT
  selectionType: 'single' | 'multi' | 'slider' | 'toggle-group';
  options?: OptionItem[];
  sliderConfig?: { min: number; max: number; step: number; unit: string };
  defaultValue?: string | string[] | number | boolean;
  genderSpecific?: Gender; // only show for this gender
}

// ─── Shared Options ───

const skinTones: OptionItem[] = [
  { id: 'very-light', label: 'Muito Clara', promptValue: 'very fair porcelain skin' },
  { id: 'light', label: 'Clara', promptValue: 'light skin tone' },
  { id: 'medium', label: 'Média', promptValue: 'medium skin tone' },
  { id: 'olive', label: 'Morena Clara', promptValue: 'olive skin tone with warm undertones' },
  { id: 'tan', label: 'Morena', promptValue: 'tan warm skin tone' },
  { id: 'brown', label: 'Parda', promptValue: 'brown skin tone with golden undertones' },
  { id: 'dark-brown', label: 'Negra Clara', promptValue: 'dark brown skin with rich undertones' },
  { id: 'dark', label: 'Negra', promptValue: 'deep dark skin tone with smooth complexion' },
];

const eyeColors: OptionItem[] = [
  { id: 'brown', label: 'Castanho', promptValue: 'brown eyes' },
  { id: 'dark-brown', label: 'Castanho Escuro', promptValue: 'dark brown eyes' },
  { id: 'hazel', label: 'Avelã', promptValue: 'hazel eyes' },
  { id: 'green', label: 'Verde', promptValue: 'green eyes' },
  { id: 'blue', label: 'Azul', promptValue: 'blue eyes' },
  { id: 'gray', label: 'Cinza', promptValue: 'gray eyes' },
  { id: 'amber', label: 'Âmbar', promptValue: 'amber eyes' },
];

const hairColors: OptionItem[] = [
  { id: 'black', label: 'Preto', promptValue: 'black hair' },
  { id: 'dark-brown', label: 'Castanho Escuro', promptValue: 'dark brown hair' },
  { id: 'brown', label: 'Castanho', promptValue: 'brown hair' },
  { id: 'light-brown', label: 'Castanho Claro', promptValue: 'light brown hair' },
  { id: 'blonde', label: 'Loiro', promptValue: 'blonde hair' },
  { id: 'platinum', label: 'Platinado', promptValue: 'platinum blonde hair' },
  { id: 'red', label: 'Ruivo', promptValue: 'red ginger hair' },
  { id: 'auburn', label: 'Ruivo Escuro', promptValue: 'auburn hair' },
  { id: 'gray', label: 'Grisalho', promptValue: 'gray hair' },
];

const hairTypes: OptionItem[] = [
  { id: 'straight', label: 'Liso', promptValue: 'straight hair' },
  { id: 'wavy', label: 'Ondulado', promptValue: 'wavy hair' },
  { id: 'curly', label: 'Cacheado', promptValue: 'curly hair' },
  { id: 'coily', label: 'Crespo', promptValue: 'coily afro-textured hair' },
  { id: 'bald', label: 'Careca', promptValue: 'bald head' },
  { id: 'buzz', label: 'Raspado', promptValue: 'buzz cut' },
];

const features: OptionItem[] = [
  { id: 'freckles', label: 'Sardas', promptValue: 'with freckles' },
  { id: 'dimples', label: 'Covinhas', promptValue: 'with dimples' },
  { id: 'moles', label: 'Pintas', promptValue: 'with beauty marks' },
  { id: 'glasses', label: 'Óculos', promptValue: 'wearing stylish glasses' },
  { id: 'beard', label: 'Barba', promptValue: 'with a well-groomed beard' },
  { id: 'mustache', label: 'Bigode', promptValue: 'with a mustache' },
  { id: 'tattoos', label: 'Tatuagens', promptValue: 'with visible tattoos' },
  { id: 'piercings', label: 'Piercings', promptValue: 'with subtle piercings' },
];

const environments: OptionItem[] = [
  { id: 'modern-living', label: 'Sala de Estar Moderna', promptValue: 'in a modern minimalist living room with natural light' },
  { id: 'office', label: 'Escritório', promptValue: 'in a professional modern office environment' },
  { id: 'studio', label: 'Estúdio Fotográfico', promptValue: 'in a professional photography studio with neutral background' },
  { id: 'outdoor-urban', label: 'Urbano / Rua', promptValue: 'in an urban city street with buildings in the background' },
  { id: 'outdoor-nature', label: 'Natureza', promptValue: 'in a lush natural outdoor setting with greenery' },
  { id: 'cafe', label: 'Cafeteria', promptValue: 'in a cozy modern café with warm ambient lighting' },
  { id: 'beach', label: 'Praia', promptValue: 'at a beautiful beach with ocean in the background' },
  { id: 'gym', label: 'Academia', promptValue: 'in a modern gym environment' },
  { id: 'kitchen', label: 'Cozinha', promptValue: 'in a modern kitchen with clean design' },
  { id: 'rooftop', label: 'Terraço / Rooftop', promptValue: 'on a rooftop terrace with city skyline view' },
];

const poses: OptionItem[] = [
  { id: 'standing', label: 'Em pé', promptValue: 'standing naturally' },
  { id: 'sitting', label: 'Sentado(a)', promptValue: 'sitting comfortably' },
  { id: 'leaning', label: 'Apoiado(a)', promptValue: 'leaning casually against a wall' },
  { id: 'walking', label: 'Caminhando', promptValue: 'walking confidently' },
  { id: 'arms-crossed', label: 'Braços Cruzados', promptValue: 'with arms crossed confidently' },
  { id: 'hands-pockets', label: 'Mãos nos Bolsos', promptValue: 'with hands in pockets casually' },
  { id: 'gesturing', label: 'Gesticulando', promptValue: 'gesturing while speaking' },
  { id: 'holding-phone', label: 'Com Celular', promptValue: 'holding a smartphone naturally' },
  { id: 'holding-coffee', label: 'Com Café', promptValue: 'holding a coffee cup' },
];

const cameraAngles: OptionItem[] = [
  { id: 'eye-level', label: 'Nível dos Olhos', promptValue: 'shot at eye level' },
  { id: 'slightly-above', label: 'Levemente Acima', promptValue: 'shot from slightly above' },
  { id: 'below', label: 'De Baixo', promptValue: 'shot from below, looking up' },
  { id: '45-degrees', label: '45 Graus', promptValue: 'shot at a 45-degree angle' },
  { id: 'profile', label: 'Perfil', promptValue: 'profile view from the side' },
  { id: 'three-quarter', label: 'Três Quartos', promptValue: 'three-quarter view angle' },
];

const framings: OptionItem[] = [
  { id: 'close-up', label: 'Close-up (Rosto)', promptValue: 'close-up portrait of face' },
  { id: 'head-shoulders', label: 'Busto', promptValue: 'head and shoulders portrait' },
  { id: 'half-body', label: 'Meio Corpo', promptValue: 'half-body shot from waist up' },
  { id: 'full-body', label: 'Corpo Inteiro', promptValue: 'full-body shot' },
  { id: 'environmental', label: 'Ambiental', promptValue: 'environmental portrait showing surroundings' },
];

const expressions: OptionItem[] = [
  { id: 'smile', label: 'Sorriso Natural', promptValue: 'with a natural warm smile' },
  { id: 'serious', label: 'Sério(a)', promptValue: 'with a serious confident expression' },
  { id: 'laugh', label: 'Rindo', promptValue: 'laughing naturally with genuine joy' },
  { id: 'thoughtful', label: 'Pensativo(a)', promptValue: 'with a thoughtful contemplative expression' },
  { id: 'neutral', label: 'Neutro(a)', promptValue: 'with a neutral relaxed expression' },
  { id: 'confident', label: 'Confiante', promptValue: 'with a confident empowered expression' },
  { id: 'friendly', label: 'Amigável', promptValue: 'with a friendly approachable expression' },
  { id: 'mysterious', label: 'Misterioso(a)', promptValue: 'with a mysterious intriguing expression' },
];

const lightings: OptionItem[] = [
  { id: 'natural', label: 'Luz Natural', promptValue: 'natural daylight lighting' },
  { id: 'golden-hour', label: 'Golden Hour', promptValue: 'golden hour warm sunset lighting' },
  { id: 'studio', label: 'Estúdio', promptValue: 'professional studio lighting with softbox' },
  { id: 'soft', label: 'Suave / Difusa', promptValue: 'soft diffused lighting' },
  { id: 'dramatic', label: 'Dramática', promptValue: 'dramatic chiaroscuro lighting with strong shadows' },
  { id: 'backlit', label: 'Contraluz', promptValue: 'backlit with rim lighting and lens flare' },
  { id: 'neon', label: 'Neon / Colorida', promptValue: 'colorful neon ambient lighting' },
  { id: 'window', label: 'Luz de Janela', promptValue: 'window light with soft shadows' },
];

const photoStyles: OptionItem[] = [
  { id: 'portrait-85mm', label: 'Retrato 85mm', promptValue: 'shot with 85mm lens, shallow depth of field, beautiful bokeh' },
  { id: 'portrait-50mm', label: 'Retrato 50mm', promptValue: 'shot with 50mm lens, natural perspective' },
  { id: 'editorial', label: 'Editorial', promptValue: 'editorial fashion photography style' },
  { id: 'cinematic', label: 'Cinematográfico', promptValue: 'cinematic film still style with anamorphic lens' },
  { id: 'lifestyle', label: 'Lifestyle', promptValue: 'candid lifestyle photography style' },
  { id: 'corporate', label: 'Corporativo', promptValue: 'professional corporate headshot style' },
  { id: 'street', label: 'Street Photography', promptValue: 'street photography style with urban context' },
  { id: 'high-fashion', label: 'Alta Moda', promptValue: 'high fashion photography with dramatic styling' },
];

const aspectRatios: OptionItem[] = [
  { id: '1-1', label: '1:1 Quadrado', promptValue: '1:1 square aspect ratio' },
  { id: '4-5', label: '4:5 Instagram', promptValue: '4:5 vertical aspect ratio' },
  { id: '9-16', label: '9:16 Stories', promptValue: '9:16 vertical portrait aspect ratio' },
  { id: '16-9', label: '16:9 Widescreen', promptValue: '16:9 widescreen horizontal aspect ratio' },
  { id: '3-4', label: '3:4 Retrato', promptValue: '3:4 classic portrait aspect ratio' },
  { id: '2-3', label: '2:3 Pinterest', promptValue: '2:3 tall portrait aspect ratio' },
];

const clothingMale: OptionItem[] = [
  { id: 'tshirt', label: 'Camiseta', promptValue: 'wearing a casual t-shirt' },
  { id: 'polo', label: 'Polo', promptValue: 'wearing a polo shirt' },
  { id: 'dress-shirt', label: 'Camisa Social', promptValue: 'wearing a dress shirt' },
  { id: 'suit', label: 'Terno', promptValue: 'wearing a tailored suit' },
  { id: 'blazer', label: 'Blazer', promptValue: 'wearing a blazer with casual pants' },
  { id: 'hoodie', label: 'Moletom', promptValue: 'wearing a hoodie' },
  { id: 'jacket', label: 'Jaqueta', promptValue: 'wearing a stylish jacket' },
  { id: 'sweater', label: 'Suéter', promptValue: 'wearing a knit sweater' },
  { id: 'tank-top', label: 'Regata', promptValue: 'wearing a tank top' },
  { id: 'activewear', label: 'Roupa Esportiva', promptValue: 'wearing athletic sportswear' },
];

const clothingFemale: OptionItem[] = [
  { id: 'blouse', label: 'Blusa', promptValue: 'wearing an elegant blouse' },
  { id: 'tshirt', label: 'Camiseta', promptValue: 'wearing a casual t-shirt' },
  { id: 'dress', label: 'Vestido', promptValue: 'wearing a stylish dress' },
  { id: 'blazer', label: 'Blazer', promptValue: 'wearing a chic blazer' },
  { id: 'suit', label: 'Terno Feminino', promptValue: 'wearing a tailored women\'s suit' },
  { id: 'crop-top', label: 'Cropped', promptValue: 'wearing a crop top' },
  { id: 'sweater', label: 'Suéter', promptValue: 'wearing a cozy sweater' },
  { id: 'jacket', label: 'Jaqueta', promptValue: 'wearing a fashionable jacket' },
  { id: 'tank-top', label: 'Regata', promptValue: 'wearing a tank top' },
  { id: 'activewear', label: 'Roupa Esportiva', promptValue: 'wearing athletic sportswear' },
];

// ─── Builder Blocks Config ───

export const getBuilderBlocks = (gender: Gender): BuilderBlock[] => [
  {
    id: 'appearance',
    title: 'Aparência Física',
    icon: 'User',
    description: 'Tom de pele, olhos, cabelo e características faciais',
    selectionType: 'multi',
    options: [],
  },
  {
    id: 'clothing',
    title: 'Roupa',
    icon: 'Shirt',
    description: 'Selecione uma ou mais peças de roupa',
    selectionType: 'multi',
    options: gender === 'masculino' ? clothingMale : clothingFemale,
  },
  {
    id: 'environment',
    title: 'Ambiente',
    icon: 'MapPin',
    description: 'Onde o avatar está? (padrão: sala de estar moderna)',
    selectionType: 'single',
    options: environments,
    defaultValue: 'modern-living',
  },
  {
    id: 'pose',
    title: 'Posição',
    icon: 'Move',
    description: 'Postura e posição do corpo',
    selectionType: 'single',
    options: poses,
  },
  {
    id: 'camera',
    title: 'Ângulo de Câmera',
    icon: 'Camera',
    description: 'Ângulo e enquadramento da foto',
    selectionType: 'single',
    options: [],
  },
  {
    id: 'expression',
    title: 'Expressão e Energia',
    icon: 'Smile',
    description: 'Expressão facial e energia transmitida',
    selectionType: 'single',
    options: expressions,
  },
  {
    id: 'lighting',
    title: 'Iluminação',
    icon: 'Sun',
    description: 'Tipo e qualidade da luz',
    selectionType: 'single',
    options: lightings,
  },
  {
    id: 'photoStyle',
    title: 'Estilo Fotográfico',
    icon: 'Aperture',
    description: 'Estilo e lente da fotografia',
    selectionType: 'single',
    options: photoStyles,
  },
  {
    id: 'aspectRatio',
    title: 'Proporção da Imagem',
    icon: 'RatioIcon',
    description: 'Proporção e formato da imagem final',
    selectionType: 'single',
    options: aspectRatios,
  },
];

// Sub-options for compound blocks
export const appearanceSubBlocks = {
  skinTone: { title: 'Tom de Pele', options: skinTones, type: 'single' as const },
  eyeColor: { title: 'Cor dos Olhos', options: eyeColors, type: 'single' as const },
  hairColor: { title: 'Cor do Cabelo', options: hairColors, type: 'single' as const },
  hairType: { title: 'Tipo de Cabelo', options: hairTypes, type: 'single' as const },
  features: { title: 'Características', options: features, type: 'multi' as const },
};

export const cameraSubBlocks = {
  angle: { title: 'Ângulo', options: cameraAngles, type: 'single' as const },
  framing: { title: 'Enquadramento', options: framings, type: 'single' as const },
};

// ─── Avatar State ───

export interface AvatarState {
  gender: Gender;
  age: number;
  skinTone: string;
  eyeColor: string;
  hairColor: string;
  hairType: string;
  features: string[];
  clothing: string[];
  environment: string;
  pose: string;
  cameraAngle: string;
  cameraFraming: string;
  expression: string;
  lighting: string;
  photoStyle: string;
  aspectRatio: string;
}

export const defaultAvatarState: Omit<AvatarState, 'gender'> = {
  age: 28,
  skinTone: '',
  eyeColor: '',
  hairColor: '',
  hairType: '',
  features: [],
  clothing: [],
  environment: 'modern-living',
  pose: '',
  cameraAngle: '',
  cameraFraming: '',
  expression: '',
  lighting: '',
  photoStyle: '',
  aspectRatio: '',
};

// ─── Edit Actions ───

export interface EditAction {
  id: string;
  label: string; // PT
  promptPrefix: string; // EN
  hasSubOptions?: boolean;
  subOptions?: OptionItem[];
}

export const editActions: EditAction[] = [
  {
    id: 'camera-angle',
    label: 'Mudar Ângulo de Câmera',
    promptPrefix: 'Change the camera angle to',
    hasSubOptions: true,
    subOptions: cameraAngles,
  },
  {
    id: 'pose',
    label: 'Mudar Pose',
    promptPrefix: 'Change the pose to',
    hasSubOptions: true,
    subOptions: poses,
  },
  {
    id: 'close-up',
    label: 'Fazer Close-up',
    promptPrefix: 'Make it a close-up portrait focusing on the face',
  },
  {
    id: 'lighting',
    label: 'Ajustar Iluminação',
    promptPrefix: 'Adjust the lighting to',
    hasSubOptions: true,
    subOptions: lightings,
  },
  {
    id: 'expression',
    label: 'Ajustar Expressão',
    promptPrefix: 'Change the expression to',
    hasSubOptions: true,
    subOptions: expressions,
  },
  {
    id: 'realism',
    label: 'Aumentar Realismo',
    promptPrefix: 'Increase the realism to photorealistic cinematic 8K quality with natural skin texture and micro-details',
  },
];
