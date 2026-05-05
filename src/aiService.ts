import { demoCalendar, demoContentPlan, demoDiagnosis, demoTopics } from "./data";
import type { CalendarItem, ContentPlan, KocProfile, ProfileDiagnosis, ReviewInsight, TopicIdea } from "./types";
import { demoReview } from "./data";

const wait = (ms: number) => new Promise((resolve) => window.setTimeout(resolve, ms));

export type ProgressHandler = (message: string, progress: number) => void;

async function runProgress(onProgress?: ProgressHandler) {
  const steps = [
    ["分析账号画像", 22],
    ["匹配平台内容趋势", 48],
    ["生成增长策略", 74],
    ["输出可执行计划", 100]
  ] as const;

  for (const [message, progress] of steps) {
    onProgress?.(message, progress);
    await wait(260);
  }
}

export const mockAiService = {
  async generateProfileDiagnosis(_profile: KocProfile, onProgress?: ProgressHandler): Promise<ProfileDiagnosis> {
    await runProgress(onProgress);
    return demoDiagnosis;
  },
  async generateTopics(_profile: KocProfile, onProgress?: ProgressHandler): Promise<TopicIdea[]> {
    await runProgress(onProgress);
    return demoTopics;
  },
  async generateContentPlan(_topicId: string, onProgress?: ProgressHandler): Promise<ContentPlan> {
    await runProgress(onProgress);
    return demoContentPlan;
  },
  async generateCalendar(_profile: KocProfile, onProgress?: ProgressHandler): Promise<CalendarItem[]> {
    await runProgress(onProgress);
    return demoCalendar;
  },
  async generateReview(_profile: KocProfile, onProgress?: ProgressHandler): Promise<ReviewInsight> {
    await runProgress(onProgress);
    return demoReview;
  }
};

export const realAiService = {
  async unavailable(): Promise<never> {
    throw new Error("当前静态 Demo 不直接绑定固定后端，已自动回退到 Demo Mock 模式。");
  }
};

export const aiService = {
  async generateProfileDiagnosis(profile: KocProfile, apiKey: string, onProgress?: ProgressHandler) {
    if (apiKey.trim()) {
      try {
        await realAiService.unavailable();
      } catch {
        return mockAiService.generateProfileDiagnosis(profile, onProgress);
      }
    }
    return mockAiService.generateProfileDiagnosis(profile, onProgress);
  },
  async generateTopics(profile: KocProfile, apiKey: string, onProgress?: ProgressHandler) {
    if (apiKey.trim()) {
      try {
        await realAiService.unavailable();
      } catch {
        return mockAiService.generateTopics(profile, onProgress);
      }
    }
    return mockAiService.generateTopics(profile, onProgress);
  },
  async generateContentPlan(topicId: string, apiKey: string, onProgress?: ProgressHandler) {
    if (apiKey.trim()) {
      try {
        await realAiService.unavailable();
      } catch {
        return mockAiService.generateContentPlan(topicId, onProgress);
      }
    }
    return mockAiService.generateContentPlan(topicId, onProgress);
  },
  async generateCalendar(profile: KocProfile, apiKey: string, onProgress?: ProgressHandler) {
    if (apiKey.trim()) {
      try {
        await realAiService.unavailable();
      } catch {
        return mockAiService.generateCalendar(profile, onProgress);
      }
    }
    return mockAiService.generateCalendar(profile, onProgress);
  },
  async generateReview(profile: KocProfile, apiKey: string, onProgress?: ProgressHandler) {
    if (apiKey.trim()) {
      try {
        await realAiService.unavailable();
      } catch {
        return mockAiService.generateReview(profile, onProgress);
      }
    }
    return mockAiService.generateReview(profile, onProgress);
  }
};
