import { RankLevelLabels, RankLevelStore, rankStore, RankSystem } from "./rankHandler";
import { ThemeType } from "./themeConfig";

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
    rankCircleInner: string;
}
export interface CardStyle {
    totalDash: number;
    targetOffset: number;
    themeColor: string;
}
export interface CardSetting {
    theme: ThemeType;
    color: string;
    img?: string;
}
export type ParamInput = Partial<{
    rankSystem: RankSystem;
    username: string;
    color: string;
    theme: ThemeType;
    img: string;
}>;
export interface UserProfileHandler {
    (user: string, request: Request): Promise<UserProfile>;
}
export interface CommunityAdapter<U extends string = string, R extends string | undefined = undefined> {
    communityName: string;
    getInfo: UserProfileHandler;
    fields: {
        username: U;
        rank?: {
            system: R;
            store: RankLevelStore;
        };
    };
}

export const adapterStore: Record<string, CommunityAdapter<string, string | undefined>> = {};
export function defineAdapter<U extends string, R extends string | undefined = undefined>(data: CommunityAdapter<U, R>) {
    return data;
}
export function registerAdapter(...adapters: CommunityAdapter<string, string | undefined>[]) {
    for (const adapter of adapters) {
        adapterStore[adapter.communityName] = adapter;
        if (adapter.fields.rank && adapter.fields.rank.system) {
            rankStore[adapter.fields.rank.system] = adapter.fields.rank.store;
        }
    }
}
export function getUsernames() {
    return Object.values(adapterStore).map(adapter => adapter.fields.username);
}