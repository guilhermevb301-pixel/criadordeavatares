// Prompt Engine: transforms AvatarState into an optimized English prompt
// Editorial paragraph style — single fluid block with semicolons and commas

import {
  type AvatarState,
  type Gender,
  type OptionItem,
  appearanceSubBlocks,
  cameraSubBlocks,
  getBuilderBlocks,
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

export function generatePrompt(state: AvatarState): string {
  const blocks = getBuilderBlocks(state.gender);
  const sections: string[] = [];

  // 1. Framing + Subject opener
  const framing = findOption(cameraSubBlocks.framing.options, state.cameraFraming);
  const subject = ageDescriptor(state.age, state.gender);
  const framingClause = framing ? `${framing} depicting ${subject}` : `depicting ${subject}`;
  sections.push(`Ultra-photorealistic professional portrait, ${framingClause}`);

  // 2. Appearance (skin, eyes, hair) as "with" clause
  const skin = findOption(appearanceSubBlocks.skinTone.options, state.skinTone);
  const eyes = findOption(appearanceSubBlocks.eyeColor.options, state.eyeColor);
  const hairColor = findOption(appearanceSubBlocks.hairColor.options, state.hairColor);
  const hairType = findOption(appearanceSubBlocks.hairType.options, state.hairType);
  const appearanceParts = [skin, eyes, hairColor, hairType].filter(Boolean);
  if (appearanceParts.length > 0) {
    sections.push(`the subject has ${appearanceParts.join(', ')}`);
  }

  // 3. Features
  const featureDescs = state.features
    .map(f => findOption(appearanceSubBlocks.features.options, f))
    .filter(Boolean);
  if (featureDescs.length > 0) {
    sections.push(featureDescs.join(', '));
  }

  // 4. Clothing
  const clothingBlock = blocks.find(b => b.id === 'clothing');
  if (clothingBlock && state.clothing.length > 0) {
    const clothingDescs = state.clothing
      .map(c => findOption(clothingBlock.options || [], c))
      .filter(Boolean);
    if (clothingDescs.length > 0) {
      sections.push(clothingDescs.join(' layered with '));
    }
  }

  // 5. Expression
  const expr = findOption(blocks.find(b => b.id === 'expression')?.options || [], state.expression);
  if (expr) sections.push(`expression is ${expr.replace(/^with a /i, '').replace(/expression$/i, '').trim()}, maintaining direct eye contact with the camera`);

  // 6. Pose
  const pose = findOption(blocks.find(b => b.id === 'pose')?.options || [], state.pose);
  if (pose) sections.push(`posture ${pose}`);

  // 7. Camera angle
  const angle = findOption(cameraSubBlocks.angle.options, state.cameraAngle);
  if (angle) sections.push(angle);

  // 8. Environment
  const envBlock = blocks.find(b => b.id === 'environment');
  const env = findOption(envBlock?.options || [], state.environment || 'modern-living');
  if (env) sections.push(`environment is ${env.replace(/^in /i, '').replace(/^at /i, '').replace(/^on /i, '')}`);

  // 9. Lighting
  const light = findOption(blocks.find(b => b.id === 'lighting')?.options || [], state.lighting);
  if (light) sections.push(`lighting is ${light.replace(/lighting$/i, '').trim()}, creating dimensional contrast with soft shadow transitions and realistic color spill across the skin while preserving natural tones`);

  // 10. Skin realism block
  sections.push('skin rendered hyper-realistically with visible pores, micro-imperfections, natural redness, and zero smoothing or beautification');

  // 11. Photo style / camera look
  const style = findOption(blocks.find(b => b.id === 'photoStyle')?.options || [], state.photoStyle);
  if (style) {
    sections.push(`camera look is premium ${style}, razor-sharp focus on the eyes, natural color balance, no HDR, no over-sharpening, no stylization`);
  }

  // 12. Aspect ratio
  if (state.aspectRatio) {
    const ar = findOption(blocks.find(b => b.id === 'aspectRatio')?.options || [], state.aspectRatio);
    if (ar) sections.push(ar);
  }

  // 13. Finishing modifiers
  sections.push('the final image must look like a real, high-budget photograph captured in-camera, fully photorealistic, authentic, and human, with no text, no logos, no branding, no CGI look, and no AI artifacts');

  return sections.join('; ') + '.';
}

export function generateEditInstructions(changes: string[]): string {
  if (changes.length === 0) return '';
  return `${changes.join('. ')}. Keep all other attributes unchanged.`;
}
