import { RankLevelLabels, RankLevelStore, rankStore } from "./rankHandler";

export interface UserProfile {
    works: number;
    likes: number;
    looks: number;
}
export interface CardInfo {
    username: string;
    rankResult: RankLevelLabels;
    rankSystem: string;
    rankScore: number;
}
export interface CardStyle {
    totalDash: number;
    targetOffset: number;
    themeColor: string;
}
export type Themes = "dark" | "light";
export interface CardSetting {
    theme: Themes;
    color: string;
}
export interface UserProfileHandler {
    (user: string, request: Request): Promise<UserProfile>;
}
export interface CommunityAdapter {
    communityName: string;
    getInfo: UserProfileHandler;
    fields: {
        username: string;
        rank?: {
            system: string;
            store: RankLevelStore;
        };
    };
}

export const adapterStore: Record<string, CommunityAdapter> = {};
export function defineAdapter(data: CommunityAdapter) {
    return data;
}
export function registerAdapter(...adapters: CommunityAdapter[]) {
    for (const adapter of adapters) {
        adapterStore[adapter.communityName] = adapter;
        if (adapter.fields.rank) {
            rankStore[adapter.fields.rank.system] = adapter.fields.rank.store;
        }
    }
}
export function getUsernames() {
    return Object.values(adapterStore).map(adapter => adapter.fields.username);
}