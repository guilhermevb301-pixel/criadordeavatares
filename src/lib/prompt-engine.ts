// Prompt Engine: transforms AvatarState into an optimized English prompt
// Editorial paragraph style — single fluid block with semicolons and commas

import {
  type AvatarState,
  type Gender,
  type OptionItem,
  appearanceSubBlocks,
  getPersonalitySubBlocks,
  cameraSubBlocks,
  getBuilderBlocks,
  visualStyles,
  artStyles,
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

function getStyleOpener(styleId: string, artStyleId?: string): string {
  // If artStyle is set, use it instead
  if (artStyleId && artStyleId !== 'photorealistic') {
    const artVal = findOption(artStyles, artStyleId);
    if (artVal) return artVal;
  }
  return findOption(visualStyles, styleId) || 'Ultra-photorealistic professional portrait';
}

function getFinishingModifiers(styleId: string): string {
  switch (styleId) {
    case 'realistic':
      return 'rendered in Unreal Engine 5 quality with Octane Render lighting; the final image must look like a real, high-budget photograph captured in-camera, fully photorealistic, authentic, and human, with no text, no logos, no branding, no CGI look, and no AI artifacts';
    case 'cartoon':
      return 'rendered with Unreal Engine 5 stylized pipeline; the final image must be a polished cartoon illustration with consistent style, vibrant colors, no text, no logos, no branding';
    case 'anime':
      return 'rendered with cinematic Octane Render quality; the final image must be a polished anime illustration with consistent style, clean lines, vibrant colors, no text, no logos, no branding';
    case 'low-poly':
      return 'rendered in Unreal Engine 5 with Octane Render; the final image must be a clean low-poly 3D render with consistent geometry, no text, no logos, no branding';
    case 'watercolor':
      return 'the final image must look like a hand-painted watercolor with natural brush strokes, Octane Render ambient occlusion, no text, no logos, no branding';
    case 'pixel-art':
      return 'the final image must be consistent 16-bit pixel art with limited color palette, no text, no logos, no branding';
    default:
      return 'rendered in Unreal Engine 5 with Octane Render; the final image must have no text, no logos, no branding, and no AI artifacts';
  }
}

export function generatePrompt(state: AvatarState): string {
  const blocks = getBuilderBlocks(state.gender);
  const personalitySubBlocks = getPersonalitySubBlocks(state.gender);
  const sections: string[] = [];
  const style = state.visualStyle || 'realistic';
  const isRealistic = style === 'realistic';
  const isThematic = isThematicStyle(style);

  // 1. Style opener + Framing + Subject
  const framing = findOption(cameraSubBlocks.framing.options, state.cameraFraming);
  const framingCustom = state.customCameraFraming?.trim();
  const subject = ageDescriptor(state.age, state.gender);
  const opener = getStyleOpener(style, state.artStyle);
  const framingParts = [framing, framingCustom].filter(Boolean);
  const framingClause = framingParts.length > 0 ? `${framingParts.join(', ')} depicting ${subject}` : `depicting ${subject}`;
  sections.push(`${opener}, ${framingClause}`);

  // 1b. Attached photo reference
  if (state.useAttachedPhoto) {
    sections.push('use the attached photo as the base reference for the character');
  }

  // 2. Celebrity reference (if any)
  if (state.celebrityRef && state.celebrityRef.trim()) {
    sections.push(`the character must look exactly like ${state.celebrityRef.trim()}, replicating their facial features, bone structure, and overall appearance as closely as possible`);
  }

  // 2b. Face shape
  const faceShape = findOption(personalitySubBlocks.faceShape.options, state.faceShape);
  if (faceShape) {
    sections.push(faceShape);
  }

  // 3. Appearance (skin, eyes, hair)
  const skin = findOption(appearanceSubBlocks.skinTone.options, state.skinTone);
  const eyes = findOption(appearanceSubBlocks.eyeColor.options, state.eyeColor);
  const hairColor = findOption(appearanceSubBlocks.hairColor.options, state.hairColor);
  const hairType = findOption(appearanceSubBlocks.hairType.options, state.hairType);
  const exoticHair = findOption(personalitySubBlocks.exoticHairColor.options, state.exoticHairColor);
  const hairCut = findOption(personalitySubBlocks.hairCut.options, state.hairCut);
  const appearanceParts = [skin, state.customSkinTone, eyes, state.customEyeColor, exoticHair || hairColor, state.customHairColor, hairType, state.customHairType, hairCut].filter(Boolean);
  if (appearanceParts.length > 0) {
    sections.push(`the subject has ${appearanceParts.join(', ')}`);
  }

  // 3b. Beard (only for male)
  if (state.gender === 'masculino') {
    const beard = findOption(personalitySubBlocks.beardStyle.options, state.beardStyle);
    if (beard) sections.push(beard);
  }

  // 4. Features
  const featureDescs = (state.features || [])
    .map(f => findOption(appearanceSubBlocks.features.options, f))
    .filter(Boolean);
  if (state.customFeatures?.trim()) featureDescs.push(state.customFeatures.trim());
  if (featureDescs.length > 0) {
    sections.push(featureDescs.join(', '));
  }

  // 4b. Glasses
  const glasses = findOption(personalitySubBlocks.glassesStyle.options, state.glassesStyle);
  if (glasses) sections.push(glasses);

  // 4c. Piercings & Tattoos
  const piercDescs = (state.piercingsTattoos || [])
    .map(p => findOption(personalitySubBlocks.piercingsTattoos.options, p))
    .filter(Boolean);
  if (piercDescs.length > 0) sections.push(piercDescs.join(', '));

  // 4d. Makeup
  const makeup = findOption(personalitySubBlocks.makeupStyle.options, state.makeupStyle);
  if (makeup) sections.push(makeup);

  // 5. Clothing
  const clothingBlock = blocks.find(b => b.id === 'clothing');
  {
    const clothingDescs = (state.clothing || [])
      .map(c => findOption(clothingBlock?.options || [], c))
      .filter(Boolean);
    if (state.customClothing?.trim()) clothingDescs.push(state.customClothing.trim());
    if (clothingDescs.length > 0) {
      sections.push(clothingDescs.join(' layered with '));
    }
  }

  // 6. Expression
  const expr = findOption(blocks.find(b => b.id === 'expression')?.options || [], state.expression);
  const exprCustom = state.customExpression?.trim();
  const exprParts = [expr ? `expression is ${expr.replace(/^with a /i, '').replace(/expression$/i, '').trim()}` : '', exprCustom].filter(Boolean);
  if (exprParts.length > 0) sections.push(`${exprParts.join(', ')}, maintaining direct eye contact with the camera`);

  // 7. Pose
  const pose = findOption(blocks.find(b => b.id === 'pose')?.options || [], state.pose);
  const poseParts = [pose, state.customPose?.trim()].filter(Boolean);
  if (poseParts.length > 0) sections.push(`posture ${poseParts.join(', ')}`);

  // 8. Camera angle
  const angle = findOption(cameraSubBlocks.angle.options, state.cameraAngle);
  const angleParts = [angle, state.customCameraAngle?.trim()].filter(Boolean);
  if (angleParts.length > 0) sections.push(angleParts.join(', '));

  // 9. Environment (conditional on style)
  if (isThematic) {
    if (state.thematicEnvironment === 'custom' && state.customThematicEnv?.trim()) {
      const styleLabel = style === 'anime' ? 'anime-style' : style === 'cartoon' ? 'cartoon-style' : 'pixel art style';
      sections.push(`${styleLabel} character standing in ${state.customThematicEnv.trim()}`);
    } else if (state.thematicEnvironment) {
      const env = findOption(thematicEnvironments, state.thematicEnvironment);
      if (env) sections.push(`environment is ${env.replace(/^in /i, '')}`);
    }
  } else {
    const envBlock = blocks.find(b => b.id === 'environment');
    const env = findOption(envBlock?.options || [], state.environment || 'modern-living');
    const envParts = [env ? `environment is ${env.replace(/^in /i, '').replace(/^at /i, '').replace(/^on /i, '')}` : '', state.customEnvironment?.trim()].filter(Boolean);
    if (envParts.length > 0) sections.push(envParts.join(', '));
  }

  // 10. Lighting
  const light = findOption(blocks.find(b => b.id === 'lighting')?.options || [], state.lighting);
  const lightCustom = state.customLighting?.trim();
  const lightParts = [light ? light.replace(/lighting$/i, '').trim() : '', lightCustom].filter(Boolean);
  if (lightParts.length > 0) {
    const lightDesc = lightParts.join(', ');
    if (isRealistic) {
      sections.push(`lighting is ${lightDesc}, creating dimensional contrast with soft shadow transitions and realistic color spill across the skin while preserving natural tones`);
    } else {
      sections.push(`lighting is ${lightDesc}`);
    }
  }

  // 11. Skin realism block (only for realistic)
  if (isRealistic) {
    sections.push('skin rendered hyper-realistically with visible pores, micro-imperfections, natural redness, and zero smoothing or beautification');
  }

  // 12. Photo style / camera look (only for realistic/watercolor)
  if (isRealistic || style === 'watercolor') {
    const photoStyle = findOption(blocks.find(b => b.id === 'photoStyle')?.options || [], state.photoStyle);
    const photoCustom = state.customPhotoStyle?.trim();
    const photoParts = [photoStyle, photoCustom].filter(Boolean);
    if (photoParts.length > 0) {
      const photoDesc = photoParts.join(', ');
      if (isRealistic) {
        sections.push(`camera look is premium ${photoDesc}, razor-sharp focus on the eyes, natural color balance, no HDR, no over-sharpening, no stylization`);
      } else {
        sections.push(`style reference: ${photoDesc}`);
      }
    }
  }

  // 13. Aspect ratio
  {
    const ar = findOption(blocks.find(b => b.id === 'aspectRatio')?.options || [], state.aspectRatio);
    const arParts = [ar, state.customAspectRatio?.trim()].filter(Boolean);
    if (arParts.length > 0) sections.push(arParts.join(', '));
  }

  // 14. Finishing modifiers with UE5/Octane
  sections.push(getFinishingModifiers(style));

  return sections.join('; ') + '.';
}

export function generateEditInstructions(changes: string[]): string {
  if (changes.length === 0) return '';
  return `${changes.join('. ')}. Keep all other attributes unchanged.`;
}
