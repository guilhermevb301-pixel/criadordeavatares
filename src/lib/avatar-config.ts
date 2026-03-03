// Avatar Builder Configuration — PT labels → EN prompt descriptors
// Config-driven architecture for easy extension

export type Gender = 'masculino' | 'feminino';

export interface OptionItem {
  id: string;
  label: string; // PT
  promptValue: string; // EN descriptor
  icon?: string; // emoji mini-preview
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
  { id: 'very-light', label: 'Muito Clara', promptValue: 'very fair porcelain skin', icon: '🏻' },
  { id: 'light', label: 'Clara', promptValue: 'light skin tone', icon: '🏻' },
  { id: 'medium', label: 'Média', promptValue: 'medium skin tone', icon: '🏼' },
  { id: 'olive', label: 'Morena Clara', promptValue: 'olive skin tone with warm undertones', icon: '🏽' },
  { id: 'tan', label: 'Morena', promptValue: 'tan warm skin tone', icon: '🏽' },
  { id: 'brown', label: 'Parda', promptValue: 'brown skin tone with golden undertones', icon: '🏾' },
  { id: 'dark-brown', label: 'Negra Clara', promptValue: 'dark brown skin with rich undertones', icon: '🏾' },
  { id: 'dark', label: 'Negra', promptValue: 'deep dark skin tone with smooth complexion', icon: '🏿' },
];

const eyeColors: OptionItem[] = [
  { id: 'brown', label: 'Castanho', promptValue: 'brown eyes', icon: '🟤' },
  { id: 'dark-brown', label: 'Castanho Escuro', promptValue: 'dark brown eyes', icon: '🟤' },
  { id: 'hazel', label: 'Avelã', promptValue: 'hazel eyes', icon: '🟡' },
  { id: 'green', label: 'Verde', promptValue: 'green eyes', icon: '🟢' },
  { id: 'blue', label: 'Azul', promptValue: 'blue eyes', icon: '🔵' },
  { id: 'gray', label: 'Cinza', promptValue: 'gray eyes', icon: '⚪' },
  { id: 'amber', label: 'Âmbar', promptValue: 'amber eyes', icon: '🟠' },
];

const hairColors: OptionItem[] = [
  { id: 'black', label: 'Preto', promptValue: 'black hair', icon: '⬛' },
  { id: 'dark-brown', label: 'Castanho Escuro', promptValue: 'dark brown hair', icon: '🟫' },
  { id: 'brown', label: 'Castanho', promptValue: 'brown hair', icon: '🟫' },
  { id: 'light-brown', label: 'Castanho Claro', promptValue: 'light brown hair', icon: '🟫' },
  { id: 'blonde', label: 'Loiro', promptValue: 'blonde hair', icon: '🟨' },
  { id: 'platinum', label: 'Platinado', promptValue: 'platinum blonde hair', icon: '⬜' },
  { id: 'red', label: 'Ruivo', promptValue: 'red ginger hair', icon: '🟧' },
  { id: 'auburn', label: 'Ruivo Escuro', promptValue: 'auburn hair', icon: '🟧' },
  { id: 'gray', label: 'Grisalho', promptValue: 'gray hair', icon: '🩶' },
];

const exoticHairColors: OptionItem[] = [
  { id: 'cyberpunk-pink', label: 'Cyberpunk Pink', promptValue: 'vibrant cyberpunk pink hair', icon: '🩷' },
  { id: 'platinum-white', label: 'Platinum White', promptValue: 'platinum white icy hair', icon: '🤍' },
  { id: 'electric-blue', label: 'Electric Blue', promptValue: 'electric neon blue hair', icon: '💙' },
  { id: 'emerald-green', label: 'Emerald Green', promptValue: 'deep emerald green hair', icon: '💚' },
  { id: 'lavender', label: 'Lavanda', promptValue: 'soft lavender purple hair', icon: '💜' },
  { id: 'fire-orange', label: 'Fire Orange', promptValue: 'fiery bright orange hair', icon: '🧡' },
  { id: 'silver-chrome', label: 'Silver Chrome', promptValue: 'metallic silver chrome hair', icon: '🩶' },
  { id: 'galaxy-ombre', label: 'Galaxy Ombré', promptValue: 'galaxy ombré hair transitioning from deep purple to blue to pink', icon: '🌌' },
];

const hairCuts: OptionItem[] = [
  { id: 'buzzcut', label: 'Buzzcut', promptValue: 'buzzcut hairstyle', icon: '💈' },
  { id: 'fade', label: 'Fade', promptValue: 'clean fade haircut', icon: '💈' },
  { id: 'long-wavy', label: 'Long Wavy', promptValue: 'long wavy flowing hair', icon: '🌊' },
  { id: 'bob', label: 'Bob Cut', promptValue: 'chin-length bob cut', icon: '✂️' },
  { id: 'pixie', label: 'Pixie Cut', promptValue: 'short pixie cut', icon: '✂️' },
  { id: 'undercut', label: 'Undercut', promptValue: 'stylish undercut hairstyle', icon: '💈' },
  { id: 'man-bun', label: 'Man Bun', promptValue: 'man bun hairstyle', icon: '🎀' },
  { id: 'braids', label: 'Tranças', promptValue: 'intricate braided hairstyle', icon: '🪢' },
  { id: 'afro', label: 'Afro', promptValue: 'voluminous natural afro hairstyle', icon: '🌀' },
  { id: 'mohawk', label: 'Moicano', promptValue: 'bold mohawk hairstyle', icon: '🦔' },
  { id: 'slicked-back', label: 'Slicked Back', promptValue: 'slicked back hair with gel', icon: '💈' },
  { id: 'curtain-bangs', label: 'Curtain Bangs', promptValue: 'curtain bangs framing the face', icon: '🪟' },
];

const hairTypes: OptionItem[] = [
  { id: 'straight', label: 'Liso', promptValue: 'straight hair', icon: '📏' },
  { id: 'wavy', label: 'Ondulado', promptValue: 'wavy hair', icon: '🌊' },
  { id: 'curly', label: 'Cacheado', promptValue: 'curly hair', icon: '🌀' },
  { id: 'coily', label: 'Crespo', promptValue: 'coily afro-textured hair', icon: '🌀' },
  { id: 'bald', label: 'Careca', promptValue: 'bald head', icon: '🥚' },
  { id: 'buzz', label: 'Raspado', promptValue: 'buzz cut', icon: '💈' },
];

const faceShapes: OptionItem[] = [
  { id: 'oval', label: 'Oval', promptValue: 'oval face shape', icon: '🥚' },
  { id: 'square', label: 'Quadrado', promptValue: 'square jawline face shape', icon: '⬜' },
  { id: 'heart', label: 'Coração', promptValue: 'heart-shaped face with pointed chin', icon: '❤️' },
  { id: 'round', label: 'Redondo', promptValue: 'round soft face shape', icon: '⭕' },
  { id: 'diamond', label: 'Diamante', promptValue: 'diamond face shape with high cheekbones', icon: '💎' },
  { id: 'oblong', label: 'Oblongo', promptValue: 'oblong elongated face shape', icon: '📏' },
];

const beardStyles: OptionItem[] = [
  { id: 'clean', label: 'Sem Barba', promptValue: 'clean shaven', icon: '🧑' },
  { id: 'stubble', label: 'Barba por Fazer', promptValue: 'stylish stubble beard', icon: '🧔' },
  { id: 'short-beard', label: 'Barba Curta', promptValue: 'short well-trimmed beard', icon: '🧔' },
  { id: 'full-beard', label: 'Barba Cheia', promptValue: 'full thick beard', icon: '🧔‍♂️' },
  { id: 'goatee', label: 'Cavanhaque', promptValue: 'goatee beard style', icon: '🐐' },
  { id: 'mustache', label: 'Bigode', promptValue: 'prominent stylish mustache', icon: '🥸' },
  { id: 'handlebar', label: 'Handlebar', promptValue: 'handlebar mustache', icon: '🥸' },
  { id: 'mutton-chops', label: 'Costeletas', promptValue: 'mutton chop sideburns', icon: '🧔' },
];

const glassesStyles: OptionItem[] = [
  { id: 'none', label: 'Sem Óculos', promptValue: '', icon: '👁️' },
  { id: 'aviator', label: 'Aviator', promptValue: 'wearing classic aviator sunglasses', icon: '🕶️' },
  { id: 'round', label: 'Round', promptValue: 'wearing round vintage glasses', icon: '👓' },
  { id: 'tech-wear', label: 'Tech-wear', promptValue: 'wearing futuristic tech-wear AR glasses', icon: '🥽' },
  { id: 'reading', label: 'Leitura', promptValue: 'wearing elegant reading glasses', icon: '👓' },
  { id: 'cat-eye', label: 'Cat Eye', promptValue: 'wearing cat-eye fashion glasses', icon: '😎' },
  { id: 'cyberpunk', label: 'Cyberpunk', promptValue: 'wearing cyberpunk LED visor glasses', icon: '🤖' },
];

const piercingsTattoos: OptionItem[] = [
  { id: 'ear-piercings', label: 'Piercings de Orelha', promptValue: 'with ear piercings and earrings', icon: '👂' },
  { id: 'nose-ring', label: 'Piercing no Nariz', promptValue: 'with a nose ring piercing', icon: '👃' },
  { id: 'lip-piercing', label: 'Piercing no Lábio', promptValue: 'with a lip piercing', icon: '💋' },
  { id: 'eyebrow-piercing', label: 'Piercing na Sobrancelha', promptValue: 'with an eyebrow piercing', icon: '🤨' },
  { id: 'arm-tattoo', label: 'Tatuagem no Braço', promptValue: 'with detailed arm sleeve tattoo', icon: '💪' },
  { id: 'neck-tattoo', label: 'Tatuagem no Pescoço', promptValue: 'with a neck tattoo', icon: '🖋️' },
  { id: 'face-tattoo', label: 'Tatuagem no Rosto', promptValue: 'with subtle face tattoo', icon: '🎭' },
  { id: 'full-sleeve', label: 'Sleeve Completa', promptValue: 'with full arm sleeve tattoo with intricate designs', icon: '🎨' },
];

const makeupStyles: OptionItem[] = [
  { id: 'none', label: 'Sem Maquiagem', promptValue: '', icon: '🧑' },
  { id: 'natural', label: 'Natural', promptValue: 'with natural minimal makeup', icon: '✨' },
  { id: 'glam', label: 'Glam', promptValue: 'with glamorous full makeup with smoky eyes', icon: '💄' },
  { id: 'war-paint', label: 'Pintura de Guerra', promptValue: 'with tribal war paint on the face', icon: '⚔️' },
  { id: 'cyberpunk-makeup', label: 'Cyberpunk', promptValue: 'with neon cyberpunk-style makeup with glowing accents', icon: '🤖' },
  { id: 'gothic', label: 'Gótico', promptValue: 'with dark gothic makeup with black lipstick', icon: '🖤' },
  { id: 'editorial', label: 'Editorial', promptValue: 'with avant-garde editorial makeup', icon: '🎨' },
  { id: 'fantasy', label: 'Fantasia', promptValue: 'with fantasy-inspired makeup with ethereal glow', icon: '🧚' },
];

const features: OptionItem[] = [
  { id: 'freckles', label: 'Sardas', promptValue: 'with freckles', icon: '🔵' },
  { id: 'dimples', label: 'Covinhas', promptValue: 'with dimples', icon: '😊' },
  { id: 'moles', label: 'Pintas', promptValue: 'with beauty marks', icon: '⚫' },
  { id: 'scar', label: 'Cicatriz', promptValue: 'with a facial scar', icon: '⚡' },
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

// ─── Art Styles (Vibe e Estética) ───

export const artStyles: OptionItem[] = [
  { id: 'photorealistic', label: 'Realismo Fotográfico', promptValue: 'Ultra-photorealistic professional portrait', icon: '📷' },
  { id: 'anime-90s', label: 'Anime 90s', promptValue: 'Classic 90s anime style illustration with cel shading', icon: '🎌' },
  { id: '3d-pixar', label: '3D Render (Pixar)', promptValue: '3D rendered character in Pixar animation style with subsurface scattering', icon: '🧸' },
  { id: 'digital-painting', label: 'Digital Painting', promptValue: 'Digital painting masterpiece with visible brush strokes and painterly quality', icon: '🖌️' },
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

export const personalitySubBlocks = {
  faceShape: { title: 'Formato do Rosto', options: faceShapes, type: 'single' as const },
  hairCut: { title: 'Corte de Cabelo', options: hairCuts, type: 'single' as const },
  exoticHairColor: { title: 'Cores Exóticas', options: exoticHairColors, type: 'single' as const },
  beardStyle: { title: 'Barba / Pelos Faciais', options: beardStyles, type: 'single' as const },
  glassesStyle: { title: 'Óculos', options: glassesStyles, type: 'single' as const },
  piercingsTattoos: { title: 'Piercings / Tatuagens', options: piercingsTattoos, type: 'multi' as const },
  makeupStyle: { title: 'Maquiagem / Pintura', options: makeupStyles, type: 'single' as const },
};

export const cameraSubBlocks = {
  angle: { title: 'Ângulo', options: cameraAngles, type: 'single' as const },
  framing: { title: 'Enquadramento', options: framings, type: 'single' as const },
};

// ─── Avatar State ───

export type VisualStyle = 'realistic' | 'cartoon' | 'anime' | 'low-poly' | 'watercolor' | 'pixel-art';

export const visualStyles: OptionItem[] = [
  { id: 'realistic', label: 'Realista', promptValue: 'Ultra-photorealistic professional portrait' },
  { id: 'cartoon', label: 'Cartoon', promptValue: 'Colorful cartoon-style character illustration' },
  { id: 'anime', label: 'Anime', promptValue: 'High quality anime-style character illustration' },
  { id: 'low-poly', label: 'Low-Poly', promptValue: 'Low-poly 3D rendered character' },
  { id: 'watercolor', label: 'Aquarela', promptValue: 'Watercolor painting style portrait' },
  { id: 'pixel-art', label: 'Pixel Art', promptValue: '16-bit pixel art character in retro game style' },
];

export const thematicEnvironments: OptionItem[] = [
  { id: 'neutral-stylized', label: 'Neutro estilizado', promptValue: 'in a stylized neutral background with soft colors' },
  { id: 'anime-futuristic', label: 'Cidade futurista em anime', promptValue: 'in a futuristic anime city with neon lights and tall buildings' },
  { id: 'anime-school', label: 'Escola japonesa em anime', promptValue: 'in a Japanese anime school hallway with cherry blossoms' },
  { id: 'ninja-village', label: 'Vila ninja inspirada em Naruto', promptValue: 'in a stylized ninja village environment inspired by Naruto, wooden houses, banners, vibrant sky, anime background (not an exact copy of any specific scene)' },
  { id: 'hero-academy', label: 'Academia de heróis shonen', promptValue: 'in a shonen-style hero academy training ground, inspired by anime (not an exact copy of any specific scene)' },
  { id: 'rpg-fantasy', label: 'Mundo de RPG fantasia anime', promptValue: 'in an anime-style fantasy RPG world with castles and magical forests' },
  { id: 'cartoon-city', label: 'Cidade colorida cartoon', promptValue: 'in a colorful cartoon city with exaggerated proportions and vibrant colors' },
  { id: 'pixel-world', label: 'Mundo pixelado 16-bit', promptValue: 'in a 16-bit pixel art city street environment, simple blocky buildings, limited color palette, retro game vibe' },
  { id: 'custom', label: 'Outro (texto livre)', promptValue: '' },
];

export const isThematicStyle = (style: string): boolean =>
  ['cartoon', 'anime', 'pixel-art'].includes(style);

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
  visualStyle: VisualStyle;
  celebrityRef: string;
  thematicEnvironment: string;
  customThematicEnv: string;
  useAttachedPhoto: boolean;
  customClothing: string;
  customEnvironment: string;
  customPose: string;
  customCameraAngle: string;
  customCameraFraming: string;
  customExpression: string;
  customLighting: string;
  customPhotoStyle: string;
  customAspectRatio: string;
  customSkinTone: string;
  customEyeColor: string;
  customHairColor: string;
  customHairType: string;
  customFeatures: string;
  // New personality fields
  faceShape: string;
  hairCut: string;
  exoticHairColor: string;
  beardStyle: string;
  glassesStyle: string;
  piercingsTattoos: string[];
  makeupStyle: string;
  artStyle: string;
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
  visualStyle: 'realistic',
  celebrityRef: '',
  thematicEnvironment: '',
  customThematicEnv: '',
  useAttachedPhoto: false,
  customClothing: '',
  customEnvironment: '',
  customPose: '',
  customCameraAngle: '',
  customCameraFraming: '',
  customExpression: '',
  customLighting: '',
  customPhotoStyle: '',
  customAspectRatio: '',
  customSkinTone: '',
  customEyeColor: '',
  customHairColor: '',
  customHairType: '',
  customFeatures: '',
  // New personality fields
  faceShape: '',
  hairCut: '',
  exoticHairColor: '',
  beardStyle: '',
  glassesStyle: '',
  piercingsTattoos: [],
  makeupStyle: '',
  artStyle: 'photorealistic',
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
