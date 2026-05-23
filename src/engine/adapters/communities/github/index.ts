import { defineAdapter } from "@engine/dataHandler";
import { fetchGraphQLData } from "./data";

export default defineAdapter({
    communityName: "Github",
    async getInfo(user, request) {
        const pat = request.headers.get("Authorization");
        if (!pat) {
            throw new Error("需要鉴权，请携带Github Personal Access Token再请求。");
        }

        return await fetchGraphQLData(user, pat);
    },
    fields: {
        username: "github"
    }
});
