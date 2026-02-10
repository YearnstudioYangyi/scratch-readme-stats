import { defineAdapter } from "@engine/dataHandler";

export default defineAdapter({
    communityName: "共创世界",
    async getInfo(user) {
        const response = await fetch("https://community-web.ccw.site/creation/page_by_student?page=1&perPage=1000&sortType=DESC", {
            method: "post",
            body: JSON.stringify({ studentOids: [user] }),
            headers: {
                "Content-Type": "application/json"
            }
        });
        if (!response.ok) {
            throw new Error(`Status: ${response.status}`);
        }
        const data = await response.json();
        if (data.status !== 200) {
            throw new Error(`Status: ${data.status}`);
        }
        const workCount = data.body.totalNum;
        let likeCount = 0;
        let lookCount = 0;
        for (const work of data.body.data) {
            likeCount += work.favoriteCount + work.likeCount;
            lookCount += work.viewCount;
        }
        return {
            works: workCount,
            likes: likeCount,
            looks: lookCount
        };
    },
    fields: {
        username: "ccw",
        rank: {
            system: "ccw",
            store: 800000
        }
    }
});