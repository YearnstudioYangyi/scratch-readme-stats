import { compose } from "./composer";
import { CardSetting, CommunityAdapter, adapterStore, UserProfile } from "./dataHandler";
import { calculateProgress, normalize, RankLevelLabels, RankLevelStore, rankStore } from "./rankHandler";
import { ThemeType } from "./themeConfig";
import { fetchImageAsBase64 } from "./util";

export interface AdaptiveResult {
    adapter: CommunityAdapter<string, string | undefined>;
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
        theme: (params.get("theme") || "light") as ThemeType,
        img: params.get("img") || undefined,
        store: rankStore[rankSystem],
        rankSystem
    };
}
export function reportRank(profile: UserProfile, store: RankLevelStore): RankReport {
    const { works, likes, looks } = profile;
    const score = likes * 1.2 + works * 0.8 + looks * 0.01;
    const level: RankLevelLabels = normalize(store).find(level => level.max >= score)?.label || "E";
    const progress = calculateProgress(score, store);
    return { score, level, progress };
}
export async function generateCard(results: AdaptiveResult[], username: string, setting: CardSetting, store: RankLevelStore, rankSystem: string, request: Request): Promise<GenerateStatus> {
    try {
        const { color } = setting;
        const { theme, img } = setting;
        const promises: Promise<UserProfile | null>[] = [];
        for (const result of results) {
            promises.push((async (adapter) => {
                try {
                    return await adapter.getInfo(result.username, request);
                } catch (e) {
                    console.warn(`请求${adapter.communityName}时出错，已忽略：${e}`);
                    return null;
                }
            })(result.adapter));
        }
        const resolvedProfiles = await Promise.all(promises);
        const profiles = resolvedProfiles.filter((p): p is UserProfile => p !== null);
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

        let rankCircleInner = `<text x="0" y="8" text-anchor="middle" class="rank-text">\n      ${level}\n    </text>`;

        if (img) {
            const base64Image = await fetchImageAsBase64(img);
            if (base64Image) {
                rankCircleInner = `
                    <defs>
                        <clipPath id="avatar-clip">
                            <circle cx="0" cy="0" r="32" />
                        </clipPath>
                    </defs>
                    <image href="${base64Image}" x="-32" y="-32" width="64" height="64" preserveAspectRatio="xMidYMid slice" clip-path="url(#avatar-clip)" opacity="0" class="avatar-img" style="animation: zoomIn 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards 1.2s;" />
                    <text x="24" y="24" text-anchor="middle" class="rank-badge">${level}</text>
                `;
            }
        }

        const result = compose(theme, {
            ...totalProfile,
            username,
            rankSystem,
            rankResult: level,
            rankScore: Math.round(score),
            rankCircleInner,
            totalDash,
            targetOffset,
            themeColor: color,
        });
        return { result, success: true };
    } catch (e) {
        return {
            result: `Internal Server Error: ${e}`,
            success: false
        };
    }
}