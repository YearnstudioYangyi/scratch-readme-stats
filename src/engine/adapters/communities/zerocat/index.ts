import { defineAdapter } from "@engine/dataHandler";

export default defineAdapter({
    communityName: "ZeroCat",
    async getInfo(user) {
        const response = await fetch(`https://api.zerocat.dev/searchapi?search_userid=${encodeURIComponent(user)}&search_orderby=view_up&search_state=public&curr=1&limit=10000`);
        if (!response.ok) {
            throw new Error(`Status: ${response.status}`);
        }
        const data = await response.json();
        const projects: { star_count?: number }[] = data?.projects || [];
        const works = projects.length;
        const likes = projects.reduce((acc, cur) => acc + (cur.star_count || 0), 0);
        return { works, likes, looks: 0 };
    },
    fields: {
        username: "zc"
    }
});
