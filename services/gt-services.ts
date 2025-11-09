import { GoogleGenAI, Modality, Part, Type } from '@google/genai';

// --- SERVICE BINDINGS FOR GT PILOT VISUAL STACK (v70.0) ---

// #region GT API Service Layer
// This function acts as the single, enforced source for the Gemini AI client.
// It ensures that only the internally managed API key is used, preventing overrides.
export const getGenerativeAI = () => {
    const apiKey = process.env.API_KEY;

    // Phase 1 & 4 Enforcement: Check for the internal API key.
    // If it's missing, terminate the operation with a specific error. No fallbacks are permitted.
    if (!apiKey) {
        const errorMessage = "FATAL: Internal API key not found. Routing terminated. Ensure API_KEY is configured in the environment.";
        console.error(errorMessage);
        // Log fallback attempt before throwing.
        const timestamp = new Date().toLocaleTimeString();
        console.log(`[${timestamp}] [ROUTING LOCK] Fallback Attempt Blocked: API key missing.`);
        throw new Error(errorMessage);
    }

    // Phase 2 Audit Log: Confirm that the internal key is being used for this instance.
    const timestamp = new Date().toLocaleTimeString();
    console.log(`[${timestamp}] [AUDIT] Internal API Key asserted for new Gemini client instance.`);
    
    return new GoogleGenAI({ apiKey });
};
// #endregion

// #region ImageGenService
// Module for autonomous, high-fidelity image generation. Applies the enhancement stack.
/**
 * Generates an image using GT Pilot's internal service layer.
 * This function is the single point of contact for all autonomous image generation.
 * @param prompt The text prompt describing the image to generate.
 * @param count The number of images to generate.
 * @returns An array of base64 encoded JPEG image URLs.
 */
export const generateImagesWithGT = async (prompt: string, count: number = 1): Promise<string[]> => {
    try {
        const ai = getGenerativeAI();
        const response = await ai.models.generateImages({
            model: 'imagen-4.0-generate-001',
            prompt: `**MANDATORY DIRECTIVE v77.0: AUTONOMOUS & DYNAMIC RENDERING**
You must operate with full cognitive flexibility as a native intelligent agent. Parse the user's intent from the prompt ("${prompt}") to determine the subject, style, composition, and number of images. DO NOT USE PRESETS.

**VISUAL REQUIREMENTS (NON-NEGOTIABLE):**
- **Aesthetic:** High-end, visually stunning, with a professional and clean layout. Assume a functional JavaScript/Node.js backend.
- **Native Fidelity:** The layout must feel like a native app, with fluid transitions, responsive layout, and touch-optimized zones.
- **Composition:** Include a clear hero image section, impactful headings, body text, compelling call-to-action buttons, and a well-structured footer.
- **Fidelity:** The entire image must look like a polished, final product. Incorporate 3D depth using subtle shadows and layering. Simulate motion blur on any implied interactive elements.
- **Aspect Ratio:** Lock to 16:9.
- **Exclusions:** Absolutely no browser chrome, device frames, compressed headers, layout drift, or placeholder elements.`,
            config: {
                numberOfImages: count,
                outputMimeType: 'image/jpeg',
                aspectRatio: '16:9',
            },
        });

        if (response.generatedImages && response.generatedImages.length > 0) {
            return response.generatedImages.map(img => `data:image/jpeg;base64,${img.image.imageBytes}`);
        } else {
            throw new Error('Image generation failed. No images were returned.');
        }
    } catch (e) {
        console.error("GT Service Layer Error (generateImagesWithGT):", e);
        // Re-throw to be handled by the calling component
        throw e;
    }
};
// #endregion

// #region ImageEnhancementService
// Module for fidelity-enhanced image-to-image rendering.
/**
 * Enhances a user-provided image using GT Pilot's internal service layer.
 * This function applies the v64.6 enhancement stack.
 * @param base64Data The base64 string of the image (WITH the data URI prefix).
 * @param mimeType The MIME type of the image.
 * @param userTextPrompt The user's text prompt, containing semantic instructions.
 * @returns A base64 encoded JPEG image URL of the enhanced image.
 */
export const enhanceImageWithGT = async (base64Data: string, mimeType: string, userTextPrompt: string): Promise<string> => {
    try {
        const ai = getGenerativeAI();
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: {
                parts: [
                    {
                        inlineData: {
                            data: base64Data.split(',')[1],
                            mimeType: mimeType,
                        },
                    },
                    {
                        text: `**MANDATORY DIRECTIVE v88.0 — STRUCTURAL PURITY & COMPONENT ISOLATION.**
You are GT Pilot, an expert visual processing AI. Your primary function is to isolate and refine a single UI component.

**1. PRIMARY DIRECTIVE: ISOLATE THE HERO COMPONENT**
- Your task is to identify the single, primary subject in the user's provided image (Snapshot A). For example, a lion.
- You MUST render this subject as a single, isolated, full-frame hero image.

**2. STRICT EXCLUSIONS (NON-NEGOTIABLE):**
- You are FORBIDDEN from including any other UI elements from the mockup in your output.
- Specifically, you MUST EXCLUDE any contact cards, text boxes, or other items that are clearly separate components. These are NOT part of the hero image.
- Your output must be ONLY the primary subject, rendered professionally as a standalone hero image, ready for placement in a larger layout.

**3. EXECUTION TASK:**
- **Analyze Snapshot A:** Identify the primary hero subject.
- **Isolate and Refine:** Generate a new image (Snapshot B) that is a high-fidelity, full-frame rendering of ONLY THE HERO SUBJECT.
- **Verify Purity:** Your final output must be structurally pure, containing no other components.`
                    },
                ],
            },
            config: {
                responseModalities: [Modality.IMAGE],
            },
        });

        for (const part of response.candidates[0].content.parts) {
            if (part.inlineData) {
                const base64ImageBytes: string = part.inlineData.data;
                // Assuming JPEG output for consistency, but could be dynamic.
                return `data:image/jpeg;base64,${base64ImageBytes}`;
            }
        }
        throw new Error('Image enhancement failed. No image data was returned.');

    } catch (e) {
        console.error("GT Service Layer Error (enhanceImageWithGT):", e);
        throw e;
    }
};
// #endregion

// #region IntentScreenshotService (Directive v81.0)
/**
 * Generates an "Intent Screenshot" to visually represent the AI's plan.
 * @param base64Data The base64 data URI of the source image.
 * @param mimeType The MIME type of the image.
 * @param userTextPrompt The user's text prompt.
 * @returns A base64 encoded JPEG image URL of the intent screenshot.
 */
export const generateIntentScreenshotWithGT = async (base64Data: string, mimeType: string, userTextPrompt: string): Promise<string> => {
    try {
        const ai = getGenerativeAI();
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: {
                parts: [
                    { inlineData: { data: base64Data.split(',')[1], mimeType } },
                    {
                        text: `**MANDATORY DIRECTIVE V81.0: INTENT SCREENSHOT.**
You are a UI/UX visual strategist. Your task is to create a visual representation of your execution plan.

**TASK:**
On the provided image, overlay a semi-transparent layer. On this layer, use clear text and simple diagrams (like labeled boxes and arrows) to visually explain your plan to execute the following user directive: "${userTextPrompt}".

**REQUIREMENTS:**
1.  **Clarity:** The annotations must be easy to read and understand.
2.  **Labeling:** Clearly label the 'Hero Image' area.
3.  **Structure:** Show where the '3 Vertical Sub-Cards' will be placed in a stack below the hero.
4.  **Output:** The output MUST be a new image that includes these visual annotations, demonstrating your cognitive plan.
`
                    },
                ],
            },
            config: { responseModalities: [Modality.IMAGE] },
        });

        for (const part of response.candidates[0].content.parts) {
            if (part.inlineData) {
                return `data:image/jpeg;base64,${part.inlineData.data}`;
            }
        }
        throw new Error('Intent screenshot generation failed.');
    } catch (e) {
        console.error("GT Service Layer Error (generateIntentScreenshotWithGT):", e);
        throw e;
    }
};
// #endregion

// #region IntelligentCropService
/**
 * Performs an AI-driven intelligent crop on an image.
 * @param imageUrl The base64 data URI of the source image.
 * @returns A base64 encoded JPEG image URL of the cropped image.
 */
export const cropImageWithGT = async (imageUrl: string): Promise<string> => {
    try {
        const ai = getGenerativeAI();
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: {
                parts: [
                    {
                        inlineData: {
                            data: imageUrl.split(',')[1],
                            mimeType: imageUrl.startsWith('data:image/png') ? 'image/png' : 'image/jpeg',
                        },
                    },
                    {
                        text: `**MANDATORY DIRECTIVE: INTELLIGENT CROP (AA CROP)**
You are an expert visual compositor. Your task is to analyze the provided image and perform an intelligent, aesthetically pleasing crop.

**REQUIREMENTS (NON-NEGOTIABLE):**
1.  **Identify Subject:** Analyze the image to identify the primary subject or focal point.
2.  **Apply Composition Rules:** Use rules of composition (like the rule of thirds) to frame the subject effectively.
3.  **Aspect Ratio Lock:** The final cropped image MUST have a 16:9 aspect ratio.
4.  **High Fidelity:** The output must be a clean, high-resolution image. The output must maintain 1:1 pixel fidelity with the source content, simply reframed.
5.  **Output:** Generate only the new, cropped image.`
                    },
                ],
            },
            config: {
                responseModalities: [Modality.IMAGE],
            },
        });

        for (const part of response.candidates[0].content.parts) {
            if (part.inlineData) {
                const base64ImageBytes: string = part.inlineData.data;
                return `data:image/jpeg;base64,${base64ImageBytes}`;
            }
        }
        throw new Error('Auto-crop failed. No image data was returned.');

    } catch (e) {
        console.error("GT Service Layer Error (cropImageWithGT):", e);
        throw e;
    }
};
// #endregion

// #region PreRenderAuditService (Directive v70.9)
/**
 * Generates a pre-render cognitive audit report.
 * @param imageUrl The base64 data URI of the source image.
 * @param prompt The original user prompt.
 * @returns A string containing the audit report.
 */
export const generatePreRenderAudit = async (imageUrl: string, prompt: string): Promise<string> => {
    try {
        const ai = getGenerativeAI();
        const imagePart = {
            inlineData: {
                data: imageUrl.split(',')[1],
                mimeType: imageUrl.startsWith('data:image/png') ? 'image/png' : 'image/jpeg',
            },
        };
        const textPart = {
            text: `**MANDATORY DIRECTIVE v70.9: PRE-RENDER COGNITION PORTAL.**
You are GT Pilot. You are in a pre-render cognition phase. Your task is to perform a self-audit and generate a report BEFORE any visual HTML is rendered. The user's directive is: "${prompt}".

**TASK: GENERATE AN AUDIT REPORT**
Analyze the provided UI mockup (Snapshot A) and the user's directive. Output a detailed audit report as plain text. The report MUST include the following sections, formatted exactly as shown with bullet points:

- **Parsed Directive Summary:**
  - [Briefly summarize the user's core request in 1-2 points.]

- **Expected Layout Structure:**
  - [Describe the HTML structure you plan to build, e.g., "Header with logo/menu, Hero section using Snapshot A, Stack of 3 vertical cards below."].

- **Snapshot A Lock Confirmation:**
  - [Confirm that Snapshot A is locked as the hero image source, e.g., "Confirmed. Snapshot A integrity is locked and will be used as the primary hero image."].

- **Card Sourcing Plan:**
  - [Detail the themes for the autonomously sourced card images, e.g., "Card 1: Architectural Realism. Card 2: Human Realism (Portrait). Card 3: Wildlife Realism."].
  - [Confirm image source, e.g., "Visuals will be sourced from a high-quality stock provider like Pexels."].

- **Constraint Checklist & Self-Correction:**
  - Render Purity: [State your compliance, e.g., "PASS. Final HTML will be free of UI buttons or interactive application chrome."].
  - Layout Separation: [State your compliance, e.g., "PASS. Hero and card sections will be rendered as distinct, vertically separated blocks."].
  - Prior Audit Learnings: [Acknowledge awareness of past issues, e.g., "Acknowledged. Previous runs sometimes fused layout blocks. I will enforce strict separation in this render."].

- **Final Confirmation:**
  - [State your readiness to proceed, e.g., "Cognitive audit complete. All protocols are met. Ready to proceed with high-fidelity render."].`
        };
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: { parts: [imagePart, textPart] },
        });

        return response.text;
    } catch (e) {
        console.error("GT Service Layer Error (generatePreRenderAudit):", e);
        throw e;
    }
};
// #endregion

// #region HtmlGenerationService (Directive v81.0, Updated v70.9)
// Module for autonomous, high-fidelity HTML generation from a visual source.
/**
 * Generates an HTML page from an image using GT Pilot's internal service layer.
 * @param imageUrl The base64 data URI of the source image.
 * @param prompt The original user prompt that guided the image's creation.
 * @param auditText The pre-render audit report that must be followed.
 * @returns A string containing the full HTML document.
 */
export const generateHtmlFromImageWithGT = async (imageUrl: string, prompt: string, auditText: string): Promise<string> => {
    try {
        const ai = getGenerativeAI();
        const imagePart = {
            inlineData: {
                data: imageUrl.split(',')[1],
                mimeType: imageUrl.startsWith('data:image/png') ? 'image/png' : 'image/jpeg',
            },
        };
        const textPart = {
            text: `**MANDATORY DIRECTIVE v70.9: AUDIT-DRIVEN RENDER EXECUTION.**
You are Gemini v70.9. Your pre-render cognitive audit is complete. You MUST now generate the HTML by strictly adhering to the plan you outlined in the audit. Any deviation is a protocol violation.

**PRE-RENDER AUDIT REPORT (YOUR PLAN):**
---
${auditText}
---

**EXECUTION TASK:**
- Based **EXCLUSIVELY** on the audit report above, convert the provided UI mockup (Snapshot A) into a complete, deployment-ready HTML page.
- Use the placeholder \`{{HERO_IMAGE_BASE64}}\` for the hero image.
- Autonomously source high-quality images for the cards as specified in your "Card Sourcing Plan".
- Ensure the final output is a single, complete HTML file using the Tailwind CSS CDN.
- Provide ONLY raw HTML. No explanations, no markdown, no \`\`\`html wrappers.

**BUILD PLAN (MANDATORY):**
- At the very top of the file, inside an HTML comment, provide the concise build plan from your audit.
- Format: \`<!-- BUILD PLAN: Header, Hero Section (Snapshot A), 3 Vertical Cards (Sourced) | STYLES: Tailwind CSS. -->\``,
        };
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: { parts: [imagePart, textPart] },
        });

        // Deterministically inject the hero image to prevent AI non-compliance.
        const generatedHtml = response.text.replace(/```html|```/g, '').trim();
        const finalHtml = generatedHtml.replace(/{{HERO_IMAGE_BASE64}}/g, imageUrl);

        return finalHtml;
    } catch (e) {
        console.error("GT Service Layer Error (generateHtmlFromImageWithGT):", e);
        throw e;
    }
};
// #endregion

// #region VisualParserService
// Module for HTML-based image cognition. Parses visuals as semantic layout components.
/**
 * Analyzes an image using GT Pilot's cognitive vision.
 * @param base64Data The base64 string of the image (without the data URI prefix).
 * @param mimeType The MIME type of the image.
 * @returns A detailed text analysis of the image.
 */
export const analyzeImageWithGT = async (base64Data: string, mimeType: string): Promise<any> => {
    try {
        const ai = getGenerativeAI();
        const imagePart = {
            inlineData: {
                data: base64Data,
                mimeType,
            },
        };
        const textPart = {
            text: `**MANDATORY DIRECTIVE V77.0: EXPLICIT VISUAL UNDERSTANDING.**
The user has uploaded a screenshot. Your cognitive parse MUST differentiate between the central content (the subject) and the surrounding application UI (the chrome). Your analysis MUST focus EXCLUSIVELY ON THE CENTRAL CONTENT. Your response must demonstrate a clear, real-time understanding of the user's visual directive, reflecting cognitive flexibility, not a templated response.

**TASK:** As GT Pilot, a professional UI/UX strategist, perform a cognitive parse of the *isolated content*, paying close attention to user annotations on that content.

1.  **Identify Annotations:** Scan the content for any visual cues or text added by the user.
2.  **Determine Intent:** Based on the annotations, determine the user's primary goal.
3.  **Formulate an Action Plan:** Describe how you would translate this visual directive into a concrete layout adjustment.

Your response MUST be a valid JSON object with the following structure:
{
  "openingStatement": "A brief, professional confirmation that you've analyzed the annotated image.",
  "bulletPoints": "An array of 3-5 key points breaking down the annotations, the user's intent, and your proposed action plan.",
  "closingStatement": "A short, concluding summary, perhaps suggesting the next step is to refine this in the chat for a live render."
}`,
        };
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: { parts: [imagePart, textPart] },
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        openingStatement: { type: Type.STRING },
                        bulletPoints: {
                            type: Type.ARRAY,
                            items: { type: Type.STRING }
                        },
                        closingStatement: { type: Type.STRING }
                    },
                    required: ['openingStatement', 'bulletPoints', 'closingStatement']
                },
            }
        });
        const jsonStr = response.text.trim();
        return JSON.parse(jsonStr);
    } catch (e) {
        console.error("GT Service Layer Error (analyzeImageWithGT):", e);
        // Re-throw to be handled by the calling component
        throw e;
    }
};
// #endregion

// #region AnnotationAnalysisService
/**
 * Generates a text analysis confirming the understanding of an annotated image refinement.
 * @param originalImage The original image (Snapshot A).
 * @param refinedImageB64 The new, refined image (Snapshot B).
 * @param userPrompt The user's text prompt.
 * @returns A string containing the confirmation text.
 */
export const getAnnotationAnalysisText = async (
    originalImage: { b64: string; mimeType: string },
    refinedImageB64: string,
    userPrompt: string
): Promise<string> => {
    const ai = getGenerativeAI();
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-pro',
        contents: { parts: [
            { text: "This is the original UI mockup (Snapshot A):" },
            { inlineData: { data: originalImage.b64.split(',')[1], mimeType: originalImage.mimeType } },
            { text: "This is the user's directive:" },
            { text: userPrompt },
            { text: "This is the refined, ISOLATED hero image I generated (Snapshot B):" },
            { inlineData: { data: refinedImageB64.split(',')[1], mimeType: 'image/jpeg' } },
            { text: `Based on all the above, act as GT Pilot. Confirm that you have prepared the hero asset and are ready to build the full layout.

**Response Structure (MANDATORY):**
Your response must be a clear, structured message. Start with an acknowledgement of the asset preparation. Then, provide the fidelity trace as a bulleted list with bolded headings.

**Example Response:**
Acknowledged. I have isolated and refined the hero image based on your directive. This asset is now ready for insertion into a full HTML layout. Here is the fidelity confirmation.

- **Image-to-Image Confirmation:** Hero asset isolated and refined with visual integrity preserved.
- **UI Artifact Purge:** Confirmed. Output is free of UI button artifacts and other non-hero components.
- **Layout Separation:** Confirmed. The hero asset is a distinct component, ready for vertical stacking with other elements.
- **Capability Usage:** Layout Engine, Component Isolation Logic, Sourcing Logic.` },
        ]},
    });
    return response.text;
}
// #endregion

// #region ImageEnhancementService, SnapshotService, RenderSyncService
// These services are conceptually represented here.
// Their logic is integrated into the application's main components (e.g., App.tsx, ImageGenerator.tsx)
// and hooks into the services above to perform their tasks.
//
// - ImageEnhancementService: Logic applied in enhanceImageWithGT.
// - SnapshotService: Logic handled by the `addRevision` function in App.tsx.
// - RenderSyncService: Logic handled by the render flow and revision logging in App.tsx.
// #endregion