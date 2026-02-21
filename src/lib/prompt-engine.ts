// Prompt Engine: transforms AvatarState into an optimized English prompt
// Editorial paragraph style — single fluid block with semicolons and commas

import {
  type AvatarState,
  type Gender,
  type OptionItem,
  appearanceSubBlocks,
  cameraSubBlocks,
  getBuilderBlocks,
  visualStyles,
  thematicEnvironments,
  isThematicStyle,
} from './avatar-config';

function findOption(options: OptionItem[], id: string): string {
  return options.find(o => o.id === id)?.promptValue || '';
}

function ageDescriptor(age: number, gender: Gender): string {
  if (gender === 'masculino') {
    if (age < 18) return `a ${age}-year-old teenage boy`;
    if (age < 30) return `a ${age}-year-old young man`;
    if (age < 50) return `a ${age}-year-old man`;
    return `a ${age}-year-old mature man`;
  } else {
    if (age < 18) return `a ${age}-year-old teenage girl`;
    if (age < 30) return `a ${age}-year-old young woman`;
    if (age < 50) return `a ${age}-year-old woman`;
    return `a ${age}-year-old mature woman`;
  }
}

function getStyleOpener(styleId: string): string {
  return findOption(visualStyles, styleId) || 'Ultra-photorealistic professional portrait';
}

function getFinishingModifiers(styleId: string): string {
  switch (styleId) {
    case 'realistic':
      return 'the final image must look like a real, high-budget photograph captured in-camera, fully photorealistic, authentic, and human, with no text, no logos, no branding, no CGI look, and no AI artifacts';
    case 'cartoon':
      return 'the final image must be a polished cartoon illustration with consistent style, vibrant colors, no text, no logos, no branding';
    case 'anime':
      return 'the final image must be a polished anime illustration with consistent style, clean lines, vibrant colors, no text, no logos, no branding';
    case 'low-poly':
      return 'the final image must be a clean low-poly 3D render with consistent geometry, no text, no logos, no branding';
    case 'watercolor':
      return 'the final image must look like a hand-painted watercolor with natural brush strokes, no text, no logos, no branding';
    case 'pixel-art':
      return 'the final image must be consistent 16-bit pixel art with limited color palette, no text, no logos, no branding';
    default:
      return 'the final image must have no text, no logos, no branding, and no AI artifacts';
  }
}

export function generatePrompt(state: AvatarState): string {
  const blocks = getBuilderBlocks(state.gender);
  const sections: string[] = [];
  const style = state.visualStyle || 'realistic';
  const isRealistic = style === 'realistic';
  const isThematic = isThematicStyle(style);

  // 1. Style opener + Framing + Subject
  const framing = findOption(cameraSubBlocks.framing.options, state.cameraFraming);
  const subject = ageDescriptor(state.age, state.gender);
  const opener = getStyleOpener(style);
  const framingClause = framing ? `${framing} depicting ${subject}` : `depicting ${subject}`;
  sections.push(`${opener}, ${framingClause}`);

  // 2. Celebrity reference (if any)
  if (state.celebrityRef && state.celebrityRef.trim()) {
    sections.push(`inspired by the visual vibe of ${state.celebrityRef.trim()}, without replicating exact likeness`);
  }

  // 3. Appearance (skin, eyes, hair)
  const skin = findOption(appearanceSubBlocks.skinTone.options, state.skinTone);
  const eyes = findOption(appearanceSubBlocks.eyeColor.options, state.eyeColor);
  const hairColor = findOption(appearanceSubBlocks.hairColor.options, state.hairColor);
  const hairType = findOption(appearanceSubBlocks.hairType.options, state.hairType);
  const appearanceParts = [skin, eyes, hairColor, hairType].filter(Boolean);
  if (appearanceParts.length > 0) {
    sections.push(`the subject has ${appearanceParts.join(', ')}`);
  }

  // 4. Features
  const featureDescs = state.features
    .map(f => findOption(appearanceSubBlocks.features.options, f))
    .filter(Boolean);
  if (featureDescs.length > 0) {
    sections.push(featureDescs.join(', '));
  }

  // 5. Clothing
  const clothingBlock = blocks.find(b => b.id === 'clothing');
  if (clothingBlock && state.clothing.length > 0) {
    const clothingDescs = state.clothing
      .map(c => findOption(clothingBlock.options || [], c))
      .filter(Boolean);
    if (clothingDescs.length > 0) {
      sections.push(clothingDescs.join(' layered with '));
    }
  }

  // 6. Expression
  const expr = findOption(blocks.find(b => b.id === 'expression')?.options || [], state.expression);
  if (expr) sections.push(`expression is ${expr.replace(/^with a /i, '').replace(/expression$/i, '').trim()}, maintaining direct eye contact with the camera`);

  // 7. Pose
  const pose = findOption(blocks.find(b => b.id === 'pose')?.options || [], state.pose);
  if (pose) sections.push(`posture ${pose}`);

  // 8. Camera angle
  const angle = findOption(cameraSubBlocks.angle.options, state.cameraAngle);
  if (angle) sections.push(angle);

  // 9. Environment (conditional on style)
  if (isThematic) {
    if (state.thematicEnvironment === 'custom' && state.customThematicEnv?.trim()) {
      // Style-prefixed custom environment
      const styleLabel = style === 'anime' ? 'anime-style' : style === 'cartoon' ? 'cartoon-style' : 'pixel art style';
      sections.push(`${styleLabel} character standing in ${state.customThematicEnv.trim()}`);
    } else if (state.thematicEnvironment) {
      const env = findOption(thematicEnvironments, state.thematicEnvironment);
      if (env) sections.push(`environment is ${env.replace(/^in /i, '')}`);
    }
  } else {
    const envBlock = blocks.find(b => b.id === 'environment');
    const env = findOption(envBlock?.options || [], state.environment || 'modern-living');
    if (env) sections.push(`environment is ${env.replace(/^in /i, '').replace(/^at /i, '').replace(/^on /i, '')}`);
  }

  // 10. Lighting
  const light = findOption(blocks.find(b => b.id === 'lighting')?.options || [], state.lighting);
  if (light) {
    if (isRealistic) {
      sections.push(`lighting is ${light.replace(/lighting$/i, '').trim()}, creating dimensional contrast with soft shadow transitions and realistic color spill across the skin while preserving natural tones`);
    } else {
      sections.push(`lighting is ${light.replace(/lighting$/i, '').trim()}`);
    }
  }

  // 11. Skin realism block (only for realistic)
  if (isRealistic) {
    sections.push('skin rendered hyper-realistically with visible pores, micro-imperfections, natural redness, and zero smoothing or beautification');
  }

  // 12. Photo style / camera look (only for realistic/watercolor)
  if (isRealistic || style === 'watercolor') {
    const photoStyle = findOption(blocks.find(b => b.id === 'photoStyle')?.options || [], state.photoStyle);
    if (photoStyle) {
      if (isRealistic) {
        sections.push(`camera look is premium ${photoStyle}, razor-sharp focus on the eyes, natural color balance, no HDR, no over-sharpening, no stylization`);
      } else {
        sections.push(`style reference: ${photoStyle}`);
      }
    }
  }

  // 13. Aspect ratio
  if (state.aspectRatio) {
    const ar = findOption(blocks.find(b => b.id === 'aspectRatio')?.options || [], state.aspectRatio);
    if (ar) sections.push(ar);
  }

  // 14. Finishing modifiers
  sections.push(getFinishingModifiers(style));

  return sections.join('; ') + '.';
}

export function generateEditInstructions(changes: string[]): string {
  if (changes.length === 0) return '';
  return `${changes.join('. ')}. Keep all other attributes unchanged.`;
}
