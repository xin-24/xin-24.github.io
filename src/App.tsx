import { NavLink, Navigate, Route, Routes, useNavigate } from "react-router-dom";
import {
  BarChart3,
  CalendarDays,
  ClipboardCheck,
  Copy,
  Factory,
  Gauge,
  KeyRound,
  Layers3,
  Menu,
  Radar,
  RefreshCcw,
  Settings,
  Sparkles,
  Wand2
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { aiService, type ProgressHandler } from "./aiService";
import { demoProfile, goalLabels, platformLabels, stageLabels } from "./data";
import type { AiMode, CalendarItem, ContentPlan, KocProfile, ProfileDiagnosis, ReviewInsight, TopicIdea } from "./types";

type AppState = {
  profile: KocProfile;
  diagnosis: ProfileDiagnosis | null;
  topics: TopicIdea[];
  selectedTopicId: string | null;
  contentPlan: ContentPlan | null;
  calendar: CalendarItem[];
  review: ReviewInsight | null;
  apiKey: string;
  aiMode: AiMode;
};

const defaultState: AppState = {
  profile: demoProfile,
  diagnosis: null,
  topics: [],
  selectedTopicId: null,
  contentPlan: null,
  calendar: [],
  review: null,
  apiKey: "",
  aiMode: "mock"
};

const storageKey = "koc-growth-agent-state";

function loadState(): AppState {
  try {
    const saved = window.localStorage.getItem(storageKey);
    return saved ? { ...defaultState, ...JSON.parse(saved) } : defaultState;
  } catch {
    return defaultState;
  }
}

function App() {
  const [state, setState] = useState<AppState>(loadState);
  const [progress, setProgress] = useState({ message: "待命", value: 0, busy: false });

  useEffect(() => {
    window.localStorage.setItem(storageKey, JSON.stringify(state));
  }, [state]);

  const updateState = (patch: Partial<AppState>) => setState((current) => ({ ...current, ...patch }));
  const apiKeyForMode = state.aiMode === "real" ? state.apiKey : "";
  const onProgress: ProgressHandler = (message, value) => setProgress({ message, value, busy: value < 100 });

  const runTask = async <T,>(task: () => Promise<T>, done: (result: T) => void) => {
    setProgress({ message: "启动 AI Agent", value: 6, busy: true });
    const result = await task();
    done(result);
    setProgress({ message: "已生成", value: 100, busy: false });
  };

  const generateDiagnosis = () =>
    runTask(() => aiService.generateProfileDiagnosis(state.profile, apiKeyForMode, onProgress), (diagnosis) => updateState({ diagnosis }));

  const generateTopics = () =>
    runTask(() => aiService.generateTopics(state.profile, apiKeyForMode, onProgress), (topics) =>
      updateState({ topics, selectedTopicId: topics[0]?.id ?? null })
    );

  const generateContentPlan = (topicId = state.selectedTopicId ?? state.topics[0]?.id ?? "topic-1") =>
    runTask(() => aiService.generateContentPlan(topicId, apiKeyForMode, onProgress), (contentPlan) =>
      updateState({ contentPlan, selectedTopicId: topicId })
    );

  const generateCalendar = () =>
    runTask(() => aiService.generateCalendar(state.profile, apiKeyForMode, onProgress), (calendar) => updateState({ calendar }));

  const generateReview = () =>
    runTask(() => aiService.generateReview(state.profile, apiKeyForMode, onProgress), (review) => updateState({ review }));

  const fillExample = async () => {
    updateState({ profile: demoProfile });
    await generateDiagnosis();
  };

  const reset = () => {
    window.localStorage.removeItem(storageKey);
    setState(defaultState);
    setProgress({ message: "已重置", value: 0, busy: false });
  };

  return (
    <div className="appShell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brandMark">
            <Sparkles size={18} />
          </div>
          <div>
            <strong>KOC Growth</strong>
            <span>Agent OS</span>
          </div>
        </div>
        <nav>
          <NavItem to="/diagnosis" icon={<Gauge size={18} />} label="诊断" />
          <NavItem to="/topics" icon={<Radar size={18} />} label="选题雷达" />
          <NavItem to="/studio" icon={<Factory size={18} />} label="内容工坊" />
          <NavItem to="/calendar" icon={<CalendarDays size={18} />} label="发布日历" />
          <NavItem to="/review" icon={<BarChart3 size={18} />} label="增长复盘" />
          <NavItem to="/settings" icon={<Settings size={18} />} label="设置" />
        </nav>
        <div className="sidePanel">
          <span>增长闭环</span>
          <b>诊断 → 选题 → 生成 → 排期 → 复盘</b>
        </div>
      </aside>

      <main className="workspace">
        <header className="topbar">
          <div className="topTitle">
            <Menu className="mobileOnly" size={20} />
            <div>
              <span>当前 KOC 人设</span>
              <strong>{state.diagnosis?.persona ?? state.profile.niche}</strong>
            </div>
          </div>
          <div className="statusPills">
            <Pill label={platformLabels[state.profile.platform]} />
            <Pill label={goalLabels[state.profile.goal]} />
            <Pill label={state.aiMode === "real" && state.apiKey ? "API Key" : "Demo Mock"} active />
          </div>
        </header>

        <AgentProgress progress={progress} />

        <Routes>
          <Route path="/" element={<Navigate to="/diagnosis" replace />} />
          <Route
            path="/diagnosis"
            element={
              <DiagnosisPage
                state={state}
                updateState={updateState}
                fillExample={fillExample}
                generateDiagnosis={generateDiagnosis}
                generateTopics={generateTopics}
              />
            }
          />
          <Route
            path="/topics"
            element={
              <TopicsPage
                topics={state.topics}
                selectedTopicId={state.selectedTopicId}
                generateTopics={generateTopics}
                selectTopic={(selectedTopicId) => updateState({ selectedTopicId })}
                generateContentPlan={generateContentPlan}
              />
            }
          />
          <Route
            path="/studio"
            element={
              <StudioPage
                topics={state.topics}
                selectedTopicId={state.selectedTopicId}
                contentPlan={state.contentPlan}
                generateContentPlan={generateContentPlan}
              />
            }
          />
          <Route path="/calendar" element={<CalendarPage calendar={state.calendar} generateCalendar={generateCalendar} />} />
          <Route path="/review" element={<ReviewPage review={state.review} generateReview={generateReview} />} />
          <Route path="/settings" element={<SettingsPage state={state} updateState={updateState} reset={reset} />} />
        </Routes>
      </main>
    </div>
  );
}

function NavItem({ to, icon, label }: { to: string; icon: React.ReactNode; label: string }) {
  return (
    <NavLink to={to} className={({ isActive }) => `navItem ${isActive ? "active" : ""}`}>
      {icon}
      <span>{label}</span>
    </NavLink>
  );
}

function Pill({ label, active = false }: { label: string; active?: boolean }) {
  return <span className={`pill ${active ? "active" : ""}`}>{label}</span>;
}

function AgentProgress({ progress }: { progress: { message: string; value: number; busy: boolean } }) {
  return (
    <section className="agentStrip">
      <div className="agentPulse">
        <Wand2 size={18} />
      </div>
      <div>
        <span>AI Agent 状态</span>
        <strong>{progress.message}</strong>
      </div>
      <div className="progressTrack" aria-label="AI 生成进度">
        <div style={{ width: `${progress.value}%` }} />
      </div>
      <span className={progress.busy ? "liveDot on" : "liveDot"} />
    </section>
  );
}

function PageHeader({ kicker, title, action }: { kicker: string; title: string; action?: React.ReactNode }) {
  return (
    <div className="pageHeader">
      <div>
        <span>{kicker}</span>
        <h1>{title}</h1>
      </div>
      {action}
    </div>
  );
}

function DiagnosisPage({
  state,
  updateState,
  fillExample,
  generateDiagnosis,
  generateTopics
}: {
  state: AppState;
  updateState: (patch: Partial<AppState>) => void;
  fillExample: () => void;
  generateDiagnosis: () => void;
  generateTopics: () => void;
}) {
  const profile = state.profile;
  const setProfile = (patch: Partial<KocProfile>) => updateState({ profile: { ...profile, ...patch } });
  const navigate = useNavigate();

  return (
    <section className="page">
      <PageHeader
        kicker="STEP 01"
        title="KOC 画像诊断"
        action={
          <div className="buttonRow">
            <button className="ghostButton" onClick={fillExample}>
              <Sparkles size={16} /> 使用示例账号
            </button>
            <button className="primaryButton" onClick={generateDiagnosis}>
              <Wand2 size={16} /> 生成诊断
            </button>
          </div>
        }
      />

      <div className="twoCol">
        <div className="panel">
          <h2>账号输入</h2>
          <label>
            领域
            <input value={profile.niche} onChange={(event) => setProfile({ niche: event.target.value })} />
          </label>
          <label>
            目标用户
            <textarea value={profile.audience} onChange={(event) => setProfile({ audience: event.target.value })} />
          </label>
          <label>
            内容风格
            <input value={profile.style} onChange={(event) => setProfile({ style: event.target.value })} />
          </label>
          <div className="formGrid">
            <label>
              平台
              <select value={profile.platform} onChange={(event) => setProfile({ platform: event.target.value as KocProfile["platform"] })}>
                {Object.entries(platformLabels).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </label>
            <label>
              阶段
              <select value={profile.stage} onChange={(event) => setProfile({ stage: event.target.value as KocProfile["stage"] })}>
                {Object.entries(stageLabels).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <div className="tagCloud">
            {profile.painPoints.map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>
        </div>

        <div className="panel highlightPanel">
          <h2>AI 诊断结果</h2>
          {state.diagnosis ? (
            <>
              <div className="heroMetric">
                <span>推荐人设</span>
                <strong>{state.diagnosis.persona}</strong>
                <p>{state.diagnosis.positioning}</p>
              </div>
              <div className="scoreGrid">
                {Object.entries(state.diagnosis.scores).map(([key, value]) => (
                  <Score key={key} label={scoreLabel(key)} value={value} />
                ))}
              </div>
              <InfoList title="机会方向" items={state.diagnosis.opportunities} />
              <InfoList title="风险提醒" items={state.diagnosis.risks} muted />
              <button
                className="primaryButton full"
                onClick={async () => {
                  await generateTopics();
                  navigate("/topics");
                }}
              >
                <Radar size={16} /> 进入选题雷达
              </button>
            </>
          ) : (
            <EmptyState icon={<ClipboardCheck />} title="等待诊断" text="点击使用示例账号或填写信息后生成画像、定位和机会点。" />
          )}
        </div>
      </div>
    </section>
  );
}

function TopicsPage({
  topics,
  selectedTopicId,
  generateTopics,
  selectTopic,
  generateContentPlan
}: {
  topics: TopicIdea[];
  selectedTopicId: string | null;
  generateTopics: () => void;
  selectTopic: (id: string) => void;
  generateContentPlan: (id?: string) => void;
}) {
  const [platformFilter, setPlatformFilter] = useState("all");
  const navigate = useNavigate();
  const filtered = platformFilter === "all" ? topics : topics.filter((topic) => topic.platform === platformFilter);

  return (
    <section className="page">
      <PageHeader
        kicker="STEP 02"
        title="内容机会与选题雷达"
        action={
          <button className="primaryButton" onClick={generateTopics}>
            <RefreshCcw size={16} /> 生成选题
          </button>
        }
      />
      <div className="filterBar">
        {["all", ...Object.keys(platformLabels)].map((item) => (
          <button key={item} className={platformFilter === item ? "chip active" : "chip"} onClick={() => setPlatformFilter(item)}>
            {item === "all" ? "全部平台" : platformLabels[item as keyof typeof platformLabels]}
          </button>
        ))}
      </div>
      {filtered.length ? (
        <div className="topicGrid">
          {filtered.map((topic) => (
            <article key={topic.id} className={selectedTopicId === topic.id ? "topicCard selected" : "topicCard"} onClick={() => selectTopic(topic.id)}>
              <div className="cardTop">
                <Pill label={platformLabels[topic.platform]} active />
                <span>{topic.contentType}</span>
              </div>
              <h2>{topic.title}</h2>
              <p>{topic.reason}</p>
              <Score label="匹配" value={topic.audienceMatch} compact />
              <Score label="爆款" value={topic.viralPotential} compact />
              <Score label="商业" value={topic.commercialValue} compact />
              <Score label="难度" value={100 - topic.productionDifficulty} compact />
              <button
                className="ghostButton full"
                onClick={(event) => {
                  event.stopPropagation();
                  generateContentPlan(topic.id);
                  navigate("/studio");
                }}
              >
                <Factory size={16} /> 生成内容方案
              </button>
            </article>
          ))}
        </div>
      ) : (
        <EmptyState icon={<Radar />} title="还没有选题" text="先生成一组可评分、可筛选的内容机会。" />
      )}
    </section>
  );
}

function StudioPage({
  topics,
  selectedTopicId,
  contentPlan,
  generateContentPlan
}: {
  topics: TopicIdea[];
  selectedTopicId: string | null;
  contentPlan: ContentPlan | null;
  generateContentPlan: (id?: string) => void;
}) {
  const selectedTopic = topics.find((topic) => topic.id === selectedTopicId) ?? topics[0];

  return (
    <section className="page">
      <PageHeader
        kicker="STEP 03"
        title="脚本、标题与互动内容工坊"
        action={
          <button className="primaryButton" onClick={() => generateContentPlan(selectedTopic?.id)}>
            <Wand2 size={16} /> 生成脚本
          </button>
        }
      />
      {contentPlan ? (
        <div className="studioGrid">
          <div className="panel">
            <h2>标题组</h2>
            <InfoList title="" items={contentPlan.titles} />
            <h2>前三秒钩子</h2>
            <InfoList title="" items={contentPlan.hooks} />
            <h2>封面文案</h2>
            <div className="tagCloud">{contentPlan.coverCopy.map((item) => <span key={item}>{item}</span>)}</div>
          </div>
          <div className="panel widePanel">
            <h2>短视频脚本</h2>
            <p className="scriptText">{contentPlan.script}</p>
            <h2>分镜流程</h2>
            <div className="timeline">
              {contentPlan.storyboard.map((item, index) => (
                <div key={item}>
                  <span>{index + 1}</span>
                  <p>{item}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="panel">
            <h2>标签与评论区</h2>
            <div className="tagCloud">{contentPlan.hashtags.map((item) => <span key={item}>{item}</span>)}</div>
            <InfoList title="互动话术" items={contentPlan.commentReplies} />
            <button className="ghostButton full" onClick={() => navigator.clipboard?.writeText(JSON.stringify(contentPlan, null, 2))}>
              <Copy size={16} /> 复制方案
            </button>
          </div>
        </div>
      ) : (
        <EmptyState icon={<Factory />} title="等待内容生成" text="从选题雷达选择一个题目，或直接生成默认内容方案。" />
      )}
    </section>
  );
}

function CalendarPage({ calendar, generateCalendar }: { calendar: CalendarItem[]; generateCalendar: () => void }) {
  return (
    <section className="page">
      <PageHeader
        kicker="STEP 04"
        title="7 天发布排期"
        action={
          <button className="primaryButton" onClick={generateCalendar}>
            <CalendarDays size={16} /> 生成排期
          </button>
        }
      />
      {calendar.length ? (
        <div className="calendarGrid">
          {calendar.map((item) => (
            <article key={item.id} className="calendarCard">
              <div>
                <strong>{item.day}</strong>
                <span>{item.time}</span>
              </div>
              <h2>{item.topic}</h2>
              <p>{platformLabels[item.platform]} · 目标 {item.goal}</p>
              <Pill label={statusLabel(item.status)} active={item.status === "ready"} />
            </article>
          ))}
        </div>
      ) : (
        <EmptyState icon={<CalendarDays />} title="还没有排期" text="生成一周内容节奏，让内容生产从灵感变成执行。" />
      )}
    </section>
  );
}

function ReviewPage({ review, generateReview }: { review: ReviewInsight | null; generateReview: () => void }) {
  return (
    <section className="page">
      <PageHeader
        kicker="STEP 05"
        title="增长复盘与下一轮优化"
        action={
          <button className="primaryButton" onClick={generateReview}>
            <BarChart3 size={16} /> 生成复盘
          </button>
        }
      />
      {review ? (
        <div className="reviewLayout">
          <div className="metricGrid">
            <Metric label="播放" value={review.metricSummary.views.toLocaleString()} />
            <Metric label="点赞" value={review.metricSummary.likes.toLocaleString()} />
            <Metric label="评论" value={review.metricSummary.comments.toLocaleString()} />
            <Metric label="收藏" value={review.metricSummary.saves.toLocaleString()} />
            <Metric label="转粉" value={review.metricSummary.followerGain.toLocaleString()} />
          </div>
          <div className="panel highlightPanel">
            <h2>AI 复盘诊断</h2>
            <p className="scriptText">{review.diagnosis}</p>
            <InfoList title="下一轮动作" items={review.nextActions} />
          </div>
        </div>
      ) : (
        <EmptyState icon={<BarChart3 />} title="等待复盘" text="用模拟经营数据展示 AI 如何把结果转成下一轮动作。" />
      )}
    </section>
  );
}

function SettingsPage({
  state,
  updateState,
  reset
}: {
  state: AppState;
  updateState: (patch: Partial<AppState>) => void;
  reset: () => void;
}) {
  return (
    <section className="page">
      <PageHeader kicker="SYSTEM" title="设置与提交说明" />
      <div className="twoCol">
        <div className="panel">
          <h2>AI 模式</h2>
          <div className="toggleGroup">
            <button className={state.aiMode === "mock" ? "chip active" : "chip"} onClick={() => updateState({ aiMode: "mock" })}>
              Demo Mock
            </button>
            <button className={state.aiMode === "real" ? "chip active" : "chip"} onClick={() => updateState({ aiMode: "real" })}>
              API Key
            </button>
          </div>
          <label>
            API Key 本地保存
            <input
              type="password"
              value={state.apiKey}
              placeholder="可选填写，初赛演示默认不需要"
              onChange={(event) => updateState({ apiKey: event.target.value })}
            />
          </label>
          <p className="mutedText">静态部署不绑定后端。Key 仅保存于当前浏览器，真实请求失败时自动回到 Demo Mock 模式。</p>
          <button className="dangerButton" onClick={reset}>
            <RefreshCcw size={16} /> 一键重置 Demo 数据
          </button>
        </div>
        <div className="panel">
          <h2>初赛材料检查</h2>
          <div className="checkList">
            <span><ClipboardCheck size={16} /> GitHub Pages Demo</span>
            <span><ClipboardCheck size={16} /> PDF 说明文档结构</span>
            <span><ClipboardCheck size={16} /> 3 分钟演示视频脚本</span>
            <span><ClipboardCheck size={16} /> README 运行与部署说明</span>
          </div>
          <div className="submitNote">
            <KeyRound size={18} />
            <p>评审体验路径：使用示例账号 → 生成诊断 → 选题雷达 → 内容工坊 → 发布日历 → 增长复盘。</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function Score({ label, value, compact = false }: { label: string; value: number; compact?: boolean }) {
  return (
    <div className={compact ? "score compact" : "score"}>
      <div>
        <span>{label}</span>
        <strong>{value}</strong>
      </div>
      <div className="scoreTrack">
        <div style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="metricCard">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function InfoList({ title, items, muted = false }: { title: string; items: string[]; muted?: boolean }) {
  return (
    <div className={muted ? "infoList muted" : "infoList"}>
      {title ? <h3>{title}</h3> : null}
      {items.map((item) => (
        <p key={item}>
          <Layers3 size={14} />
          {item}
        </p>
      ))}
    </div>
  );
}

function EmptyState({ icon, title, text }: { icon: React.ReactElement; title: string; text: string }) {
  return (
    <div className="emptyState">
      {icon}
      <strong>{title}</strong>
      <p>{text}</p>
    </div>
  );
}

function scoreLabel(key: string) {
  const map: Record<string, string> = {
    audienceMatch: "用户匹配",
    differentiation: "差异化",
    contentConsistency: "内容一致",
    businessPotential: "商业潜力"
  };
  return map[key] ?? key;
}

function statusLabel(status: CalendarItem["status"]) {
  const map = {
    brief: "待写 Brief",
    shoot: "待拍摄",
    edit: "剪辑中",
    ready: "可发布"
  };
  return map[status];
}

export default App;
