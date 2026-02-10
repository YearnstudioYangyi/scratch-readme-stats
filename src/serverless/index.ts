import { getUsernames, registerAdapter } from "@engine/dataHandler";
import { reach, generateCard } from "@engine/generator";
import { getRankStores } from "@engine/rankHandler";
import { buildResponse } from "@engine/util";
import { communities } from "@engine/adapters";
import { themes } from "@engine/themeConfig";

export function init() {
    registerAdapter(...communities);
}
export async function run(request: Request): Promise<Response> {
    const { results, username, color, theme, store, rankSystem } = reach(request);
    if (results.length === 0) {
        return buildResponse({
            result: `请提供至少一个社区的用户ID查询（${getUsernames().join("、")}）`,
            success: false
        });
    }
    if (!store) {
        return buildResponse({
            result: `评分系统无效，请从${getRankStores().join("、")}中选择一个`,
            success: false
        });
    }
    if (!themes.includes(theme)) {
        return buildResponse({
            result: `主题名称无效，请从${themes.join("、")}中选择一个`,
            success: false
        });
    }
    const status = await generateCard(results, username, { color, theme }, store, rankSystem, request);
    return buildResponse(status);
}