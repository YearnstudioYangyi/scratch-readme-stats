import { communities } from "./adapters";
import { CommunityAdapter } from "./dataHandler";
import { clamp } from "./util";

export const rankLevels = ["S+", "S", "A++", "A+", "A", "B+", "B", "C", "D", "E"] as const;
export type RankLevelLabels = typeof rankLevels[number];
export type RankLevelMaxScore = number //该适配器的最大分数（平均分配成分级）
export type RankLevelRating = Record<RankLevelLabels, number> //分级标签->该分级的上限分数
export type RankLevelArray = { label: RankLevelLabels, max: number }[]; //同上但是数组形式，需要normalize可进行排序
export type RankLevelStore = RankLevelMaxScore | RankLevelRating | RankLevelArray;
export type RankSystem = "default" | (
    typeof communities[number] extends infer R
    ? R extends CommunityAdapter<string, infer Rank>
    ? string extends Rank
    ? never
    : Rank
    : never
    : never
);


export function normalize(store: RankLevelStore): RankLevelArray {
    let result: RankLevelArray = [];
    if (typeof store === "number") {
        result = rankLevels.toReversed().map((label, i) => ({
            label,
            max: label === rankLevels[0] ? Infinity : store / rankLevels.length * (i + 1)
        }));
    } else if (Array.isArray(store)) {
        result = [...store].sort((a, b) => a.max - b.max);
    } else {
        result = normalize(Object.entries(store).map(([label, max]) => ({ label: label as RankLevelLabels, max })));
    };
    return result;
}
export function maxScore(store: RankLevelStore) {
    const normalized = normalize(store).filter(level => level.max !== Infinity);
    return normalized[normalized.length - 1].max;
}
export function calculateProgress(score: number, store: RankLevelStore) {
    return clamp(score / maxScore(store), 0, 1);
}
export function defineRank(data: RankLevelStore) {
    return normalize(data);
}
export function getRankStores() {
    return Object.keys(rankStore);
}

export const DEFAULT_RANK = defineRank({
    "S+": Infinity,
    "S": 400,
    "A++": 300,
    "A+": 250,
    "A": 150,
    "B+": 100,
    "B": 70,
    "C": 40,
    "D": 20,
    "E": 10
});
export const rankStore: Record<string, RankLevelStore> = {
    default: DEFAULT_RANK
};