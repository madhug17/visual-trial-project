
import { GoogleGenAI, Modality } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

interface ImageInput {
  mimeType: string;
  data: string;
}

interface GenerationResult {
  imageUrl: string | null;
  text: string | null;
}

export const generateVirtualTryOnImage = async (
  personImage: ImageInput,
  clothingImage: ImageInput
): Promise<GenerationResult> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image-preview',
      contents: {
        parts: [
          {
            inlineData: {
              data: personImage.data,
              mimeType: personImage.mimeType,
            },
          },
          {
            inlineData: {
              data: clothingImage.data,
              mimeType: clothingImage.mimeType,
            },
          },
          {
            text: 'Take the clothing item from the second image and place it realistically on the person in the first image. Ensure the fit, lighting, and shadows are natural.',
          },
        ],
      },
      config: {
        responseModalities: [Modality.IMAGE, Modality.TEXT],
      },
    });

    let imageUrl: string | null = null;
    let text: string | null = null;
    
    // The response is in response.candidates[0].content.parts
    const parts = response.candidates?.[0]?.content?.parts || [];

    for (const part of parts) {
      if (part.text) {
        text = part.text;
      } else if (part.inlineData) {
        const base64ImageBytes: string = part.inlineData.data;
        const mimeType = part.inlineData.mimeType;
        imageUrl = `data:${mimeType};base64,${base64ImageBytes}`;
      }
    }

    return { imageUrl, text };
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Failed to generate image with Gemini API.");
  }
};
