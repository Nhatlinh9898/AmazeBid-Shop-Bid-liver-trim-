/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GoogleGenAI, Type } from "@google/genai";
import { KOLInfo, KOLSkill, ProductType } from "../types";

const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

export const aiService = {
  /**
   * Generates a professional lore and stats for a product.
   */
  generateProductContent: async (name: string, category: string) => {
    const model = genAI.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Hãy tạo một đoạn truyền thuyết (lore) ngắn (khoảng 3 câu), các chỉ số sức mạnh (Công kích, Linh lực, Tốc độ - từ 10 đến 100), và 1 kỹ năng đặc biệt (tên, mô tả, hồi chiêu, tiêu tốn mana) cho một pháp bảo tên là "${name}" thuộc danh mục "${category}" trong thế giới Tiên Hiệp Cyberpunk. Trả về định dạng JSON.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            lore: { type: Type.STRING },
            attack: { type: Type.NUMBER },
            spirit: { type: Type.NUMBER },
            speed: { type: Type.NUMBER },
            ability: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                description: { type: Type.STRING },
                cooldown: { type: Type.STRING },
                manaCost: { type: Type.NUMBER }
              },
              required: ["name", "description", "cooldown", "manaCost"]
            }
          },
          required: ["lore", "attack", "spirit", "speed", "ability"]
        }
      }
    });

    const response = await model;
    return JSON.parse(response.text);
  },

  /**
   * Generates a professional KOL profile.
   */
  generateKOLProfile: async (name: string, specialty: ProductType[]) => {
    const model = genAI.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Tạo một hồ sơ KOL chuyên nghiệp cho người tên "${name}" chuyên về các lĩnh vực: ${specialty.join(", ")}. 
      Bao gồm: tiểu sử (bio), trạng thái hiện tại, số lượng người theo dõi (định dạng như 1.2M), vai trò (Influencer, Expert, Reviewer, Ambassador, Legend), và 2 kỹ năng đặc trưng (tên, mô tả, hiệu ứng, thời gian hồi chiêu).
      Trả về định dạng JSON.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            bio: { type: Type.STRING },
            status: { type: Type.STRING },
            followers: { type: Type.STRING },
            role: { type: Type.STRING, enum: ['Influencer', 'Expert', 'Reviewer', 'Ambassador', 'Legend'] },
            skills: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  description: { type: Type.STRING },
                  effect: { type: Type.STRING },
                  cooldown: { type: Type.STRING }
                },
                required: ["name", "description", "effect", "cooldown"]
              }
            }
          },
          required: ["bio", "status", "followers", "role", "skills"]
        }
      }
    });

    const response = await model;
    return JSON.parse(response.text);
  },

  /**
   * Generates an image for a KOL.
   */
  generateImage: async (prompt: string, aspectRatio: "1:1" | "3:4" | "4:3" | "9:16" | "16:9" = "1:1") => {
    const model = genAI.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: { parts: [{ text: prompt }] },
      config: { imageConfig: { aspectRatio } },
    });

    const response = await model;
    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    return null;
  },

  /**
   * Generates a video for a KOL.
   */
  generateVideo: async (prompt: string) => {
    let operation = await genAI.models.generateVideos({
      model: 'veo-3.1-fast-generate-preview',
      prompt,
      config: { numberOfVideos: 1, resolution: '720p', aspectRatio: '16:9' }
    });

    while (!operation.done) {
      await new Promise(resolve => setTimeout(resolve, 5000));
      operation = await genAI.operations.getVideosOperation({ operation });
    }

    const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
    if (downloadLink) {
      const response = await fetch(downloadLink, {
        method: 'GET',
        headers: { 'x-goog-api-key': process.env.GEMINI_API_KEY! },
      });
      const blob = await response.blob();
      return URL.createObjectURL(blob);
    }
    return null;
  },

  /**
   * Generates a voice for a KOL.
   */
  generateVoice: async (text: string, voiceName: 'Puck' | 'Charon' | 'Kore' | 'Fenrir' | 'Zephyr' = 'Kore') => {
    const response = await genAI.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: `Say cheerfully: ${text}` }] }],
      config: {
        responseModalities: ["AUDIO" as any],
        speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName } } },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (base64Audio) {
      return `data:audio/wav;base64,${base64Audio}`;
    }
    return null;
  }
};
