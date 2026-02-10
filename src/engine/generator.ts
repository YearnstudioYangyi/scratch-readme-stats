import { compose, templates } from "./composer";
import { CardSetting, CommunityAdapter, getUsernames, adapterStore, Themes, UserProfile } from "./dataHandler";
import { calculateProgress, normalize, RankLevelLabels, RankLevelStore, rankStore } from "./rankHandler";

export interface AdaptiveResult {
    adapter: CommunityAdapter;
    username: string;
}
export interface GenerateStatus {
    result: string;
    success: boolean;
}
export interface RankReport {
    score: number;
    level: RankLevelLabels;
    progress: number;
}
export function reach(request: Request) {
    const url = new URL(request.url);
    const params = url.searchParams;
    const results: AdaptiveResult[] = [];
    for (const adapter of Object.values(adapterStore)) {
        const communityUsername = params.get(adapter.fields.username);
        if (communityUsername) {
            results.push({
                adapter,
                username: communityUsername
            });
        }
    }
    const rankSystem = params.get("rankSystem") || "default";
    return {
        results,
        username: params.get("username") || "Unnamed Developer",
        color: params.get("color") || "#2f80ed",
        theme: (params.get("theme") || "light") as Themes,
        store: rankStore[rankSystem],
        rankSystem
    };
}
export function reportRank(profile: UserProfile, store: RankLevelStore): RankReport {
    const { works, likes, looks } = profile;
    const score: number = likes * 1.2 + works * 0.8 + looks * 0.01;
    const level: RankLevelLabels = normalize(store).find(level => level.max >= score)?.label || "E";
    const progress = calculateProgress(score, store);
    return { score, level, progress };
}
export async function generateCard(results: AdaptiveResult[], username: string, setting: CardSetting, store: RankLevelStore, rankSystem: string, request: Request): Promise<GenerateStatus> {
    try {
        if (results.length === 0) {
            return {
                result: `请提供至少一个社区的用户ID查询（${getUsernames().join("、")}）`,
                success: false
            };
        }
        const { color } = setting;
        const { theme } = setting;
        const promises: Promise<UserProfile>[] = [];
        for (const result of results) {
            promises.push((async (adapter) => {
                try {
                    return await adapter.getInfo(result.username, request);
                } catch (e) {
                    throw new Error(`请求${adapter.communityName}时出错：${e}`);
                }
            })(result.adapter));
        }
        const profiles = await Promise.all(promises);
        const totalProfile = profiles.reduce((pre, cur) => ({
            works: cur.works + pre.works,
            likes: cur.likes + pre.likes,
            looks: cur.looks + pre.looks
        }), {
            works: 0,
            likes: 0,
            looks: 0
        } satisfies UserProfile);
        const { level, progress, score } = reportRank(totalProfile, store);
        const progressPercent = progress;
        const totalDash = 251.2;
        const targetOffset = totalDash * (1 - progressPercent);
        const result = compose(templates[theme], {
            ...totalProfile,
            username,
            rankSystem,
            rankResult: level,
            rankScore: Math.round(score),
            totalDash,
            targetOffset,
            themeColor: color,
        });
        return { result, success: true };
    } catch (e) {
        return { result: `Internal Server Error: ${e}`, success: false };
    }
}