export type Platform = "xiaohongshu" | "douyin" | "shipinhao" | "bilibili";

export type GrowthGoal = "followers" | "engagement" | "conversion" | "brand_deal";

export type KocStage = "new" | "growing" | "stable";

export type KocProfile = {
  niche: string;
  platform: Platform;
  stage: KocStage;
  audience: string;
  style: string;
  painPoints: string[];
  goal: GrowthGoal;
};

export type ProfileDiagnosis = {
  persona: string;
  positioning: string;
  scores: {
    audienceMatch: number;
    differentiation: number;
    contentConsistency: number;
    businessPotential: number;
  };
  opportunities: string[];
  risks: string[];
};

export type TopicIdea = {
  id: string;
  title: string;
  platform: Platform;
  contentType: string;
  audienceMatch: number;
  viralPotential: number;
  productionDifficulty: number;
  commercialValue: number;
  reason: string;
};

export type ContentPlan = {
  topicId: string;
  titles: string[];
  hooks: string[];
  script: string;
  storyboard: string[];
  coverCopy: string[];
  hashtags: string[];
  commentReplies: string[];
};

export type CalendarItem = {
  id: string;
  day: string;
  time: string;
  platform: Platform;
  topic: string;
  goal: string;
  status: "brief" | "shoot" | "edit" | "ready";
};

export type ReviewInsight = {
  metricSummary: {
    views: number;
    likes: number;
    comments: number;
    saves: number;
    followerGain: number;
  };
  diagnosis: string;
  nextActions: string[];
};

export type AiMode = "mock" | "real";
