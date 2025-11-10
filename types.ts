export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  imageUrl?: string;
  thumbnailUrl?: string;
  summaryText?: string;
  type?: 'loading' | 'response' | 'visual' | 'cognition' | 'upsell';
  isComplete?: boolean;
  htmlContent?: string;
  cognitionData?: {
    summary: string;
    enhancements: string[];
    fidelityCheck: string;
    detailedBreakdown?: string;
  };
  isConfirmedForRender?: boolean;
  userPrompt?: string;
  source?: 'sandbox';
  feedback?: 'up' | 'down' | 'idea';
  feedbackResponse?: {
    text: string;
    thumbnailUrl?: string;
    isLoading: boolean;
  };
}

export type View = 'IMAGE' | 'STREAMING' | 'CHAT' | 'SANDBOX';

export type RevisionType = 'PROMPT_INPUT' | 'IMAGE_UPLOAD' | 'STREAM_TOGGLE' | 'MODULE_ACTIVATION' | 'VOICE_CHANGE' | 'RENDER_ACTIVATION' | 'DOCS_VIEW' | 'CLIP_INTERACTION' | 'VISUAL_GENERATION' | 'SANDBOX_INTENT' | 'FIDELITY_MISMATCH' | 'DIRECTIVE_INSTALL' | 'INTENT_PARSED' | 'UI_STATE_CHANGE' | 'INTENT_OVERRIDE' | 'SESSION_MEMORY_RECALL' | 'USER_FEEDBACK' | 'VISUAL_ANCHOR_LOCKED' | 'IMAGE_TO_IMAGE_PARSING' | 'FOUR_IMAGE_LAYOUT_GENERATED' | 'PRE_RENDER_AUDIT' | 'CONSTRUCTION_PLAN' | 'ACCEPT_LOCK' | 'REJECT_MISMATCH' | 'FIDELITY_AUDIT';

export interface AnalysisCard {
  title: string;
  summary: string;
  version?: string;
  intent?: string;
  timestamp?: string;
}

export interface IntentUnderstanding {
  intent: string[];
  visualParsing: string[];
  fidelityRules: string[];
  executionSteps: string[];
  uiDiscipline: string[];
  preservationSummary: {
    preserved: string[];
    excluded: string[];
  };
  capabilitiesUsed?: string[];
  userUnderstanding?: {
    requested: string;
    interpreted: string;
    delivered: string;
    pending: string;
  };
}

export interface CapabilityChecklistItem {
  capability: string;
  status: string;
  notes: string;
}

export interface Revision {
  id: string;
  timestamp: string;
  version: string;
  type: RevisionType;
  description: string;
  previewUrl?: string;
  outputPreviewUrl?: string;
  comparisonSummary?: string;
  confirmed: boolean;
  enhancements?: string[];
  duration?: number; // Duration in seconds
  animationStatus?: string;
  aspectRatioProfile?: string;
  sandboxInjectionStatus?: string;
  lightingMap?: string;
  artifactSuppressionStatus?: string;
  fidelityTraceComparison?: string;
  analysisCards?: AnalysisCard[];
  parsedIntentSummary?: string;
  intentUnderstanding?: IntentUnderstanding;
  // New fields for v67.7 audit trace
  postRenderParsedIntentSummary?: string;
  imageToImageConfirmationMessage?: string;
  capabilityConfirmationMessage?: string;
  fidelityConfirmationMessage?: string;
  capabilityChecklist?: CapabilityChecklistItem[];
  userPrompt?: string;
  // New fields for v81.0
  intentScreenshotUrl?: string;
  buildPlan?: string;
  metrics?: {
    ssim?: string;
    iou?: string;
    mse?: string;
    lpips?: string;
  };
  // New field for v70.9
  auditReport?: string;
}