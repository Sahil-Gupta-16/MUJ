/**
 * src/data/modelReportData.ts
 * 
 * Dummy data for all 5 models with consistent data across different plot types
 * Now includes frame color marking (red for fake, green for authentic)
 */

export interface ChartDataPoint {
  frame: number;
  fakeScore: number;
  confidence: number;
  category?: string;
  frameColor?: string; // 'red' for fake, 'green' for authentic
  isDeepfake: boolean; // true if frame is marked as deepfake
}

export interface ModelAnalysisData {
  modelName: string;
  data: ChartDataPoint[];
  avgScore: number;
  authenticFrames: number;
  deepfakeFrames: number;
  totalFrames: number;
}

// Generate consistent dummy data for each model with frame colors
const generateModelData = (seed: number): ChartDataPoint[] => {
  const data: ChartDataPoint[] = [];
  
  // Define which frames are fake (for consistent marking across models)
  const fakeFrameIndices = seed === 1 
    ? [3, 5, 7, 9, 11, 13, 15, 17] // Model 1: 8 fake frames
    : seed === 2
    ? [2, 4, 6, 8, 10, 12, 14, 15, 16, 17, 18, 19] // Model 2: 12 fake frames
    : seed === 3
    ? [1, 3, 5, 7, 9, 11, 13, 15, 17, 18] // Model 3: 10 fake frames
    : seed === 4
    ? [0, 2, 3, 4, 6, 7, 8, 10, 11, 13, 14, 15, 16, 18] // Model 4: 14 fake frames
    : [4, 6, 8, 10, 12]; // Model 5: 6 fake frames
  
  for (let i = 0; i < 19; i++) {
    const isDeepfake = fakeFrameIndices.includes(i);
    const baseScore = isDeepfake ? 65 + seed * 5 : 25 + seed * 3;
    const variance = Math.sin(i / 5) * 15 + Math.random() * 10;
    const fakeScore = Math.min(100, Math.max(0, baseScore + variance));
    
    data.push({
      frame: i,
      fakeScore: Math.round(fakeScore),
      confidence: Math.round(Math.min(100, 50 + fakeScore * 0.5)),
      category: fakeScore > 60 ? 'Deepfake' : 'Authentic',
      frameColor: isDeepfake ? '#ef4444' : '#10b981', // Red for fake, green for authentic
      isDeepfake: isDeepfake,
    });
  }
  return data;
};

// Model 1: COLOR-CUES-LSTM-V1
const colorCuesData = generateModelData(1);
export const MODEL_COLOR_CUES: ModelAnalysisData = {
  modelName: 'COLOR-CUES-LSTM-V1',
  data: colorCuesData,
  avgScore: 48,
  authenticFrames: colorCuesData.filter(d => !d.isDeepfake).length,
  deepfakeFrames: colorCuesData.filter(d => d.isDeepfake).length,
  totalFrames: 19,
};

// Model 2: XCEPTION-V2
const xceptionData = generateModelData(2);
export const MODEL_XCEPTION: ModelAnalysisData = {
  modelName: 'XCEPTION-V2',
  data: xceptionData,
  avgScore: 62,
  authenticFrames: xceptionData.filter(d => !d.isDeepfake).length,
  deepfakeFrames: xceptionData.filter(d => d.isDeepfake).length,
  totalFrames: 19,
};

// Model 3: EfficientNet-B0
const efficientData = generateModelData(3);
export const MODEL_EFFICIENT: ModelAnalysisData = {
  modelName: 'EfficientNet-B0',
  data: efficientData,
  avgScore: 55,
  authenticFrames: efficientData.filter(d => !d.isDeepfake).length,
  deepfakeFrames: efficientData.filter(d => d.isDeepfake).length,
  totalFrames: 19,
};

// Model 4: ResNet-50
const resnetData = generateModelData(4);
export const MODEL_RESNET: ModelAnalysisData = {
  modelName: 'ResNet-50',
  data: resnetData,
  avgScore: 71,
  authenticFrames: resnetData.filter(d => !d.isDeepfake).length,
  deepfakeFrames: resnetData.filter(d => d.isDeepfake).length,
  totalFrames: 19,
};

// Model 5: Vision Transformer
const visionTransformerData = generateModelData(5);
export const MODEL_VISION_TRANSFORMER: ModelAnalysisData = {
  modelName: 'Vision Transformer',
  data: visionTransformerData,
  avgScore: 45,
  authenticFrames: visionTransformerData.filter(d => !d.isDeepfake).length,
  deepfakeFrames: visionTransformerData.filter(d => d.isDeepfake).length,
  totalFrames: 19,
};

// Export all models
export const ALL_MODELS = [
  MODEL_COLOR_CUES,
  MODEL_XCEPTION,
  MODEL_EFFICIENT,
  MODEL_RESNET,
  MODEL_VISION_TRANSFORMER,
];

// Get model data by name
export const getModelData = (modelName: string): ModelAnalysisData | null => {
  return ALL_MODELS.find(m => m.modelName === modelName) || null;
};
