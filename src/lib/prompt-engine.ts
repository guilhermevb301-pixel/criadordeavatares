// Prompt Engine: transforms AvatarState into an optimized English prompt

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
  const parts: string[] = [];

  // 1. Subject
  parts.push(`Photorealistic portrait of ${ageDescriptor(state.age, state.gender)}`);

  // 2. Appearance
  const skin = findOption(appearanceSubBlocks.skinTone.options, state.skinTone);
  const eyes = findOption(appearanceSubBlocks.eyeColor.options, state.eyeColor);
  const hairColor = findOption(appearanceSubBlocks.hairColor.options, state.hairColor);
  const hairType = findOption(appearanceSubBlocks.hairType.options, state.hairType);

  const appearanceParts = [skin, eyes, hairColor, hairType].filter(Boolean);
  if (appearanceParts.length > 0) {
    parts.push(`with ${appearanceParts.join(', ')}`);
  }

  // 3. Features
  const featureDescs = state.features
    .map(f => findOption(appearanceSubBlocks.features.options, f))
    .filter(Boolean);
  if (featureDescs.length > 0) {
    parts.push(featureDescs.join(', '));
  }

  // 4. Clothing
  const clothingBlock = blocks.find(b => b.id === 'clothing');
  if (clothingBlock && state.clothing.length > 0) {
    const clothingDescs = state.clothing
      .map(c => findOption(clothingBlock.options || [], c))
      .filter(Boolean);
    if (clothingDescs.length > 0) {
      parts.push(clothingDescs.join(', '));
    }
  }

  // 5. Pose
  const pose = findOption(blocks.find(b => b.id === 'pose')?.options || [], state.pose);
  if (pose) parts.push(pose);

  // 6. Camera
  const angle = findOption(cameraSubBlocks.angle.options, state.cameraAngle);
  const framing = findOption(cameraSubBlocks.framing.options, state.cameraFraming);
  if (framing) parts.push(framing);
  if (angle) parts.push(angle);

  // 7. Expression
  const expr = findOption(blocks.find(b => b.id === 'expression')?.options || [], state.expression);
  if (expr) parts.push(expr);

  // 8. Lighting
  const light = findOption(blocks.find(b => b.id === 'lighting')?.options || [], state.lighting);
  if (light) parts.push(light);

  // 9. Environment
  const envBlock = blocks.find(b => b.id === 'environment');
  const env = findOption(envBlock?.options || [], state.environment || 'modern-living');
  if (env) parts.push(env);

  // 10. Photo Style
  const style = findOption(blocks.find(b => b.id === 'photoStyle')?.options || [], state.photoStyle);
  if (style) parts.push(style);

  // 11. Finishing modifiers
  parts.push('ultra-detailed, photorealistic, 8K resolution, professional photography');

  return parts.join('. ') + '.';
}

export function generateEditPrompt(originalPrompt: string, changes: string[]): string {
  if (changes.length === 0) return originalPrompt;

  return `Modify the original image described as: "${originalPrompt}". Changes: ${changes.join('. ')}. Keep all other attributes unchanged.`;
}
