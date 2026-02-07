import { defineAdapter } from "@engine/dataHandler";
import { parseResponse } from "@engine/util";

export default defineAdapter({
    communityName: "编程候老师",
    async getInfo(user) {
        const response = await parseResponse<string>(fetch(`https://codinghou.cn/work/workAppuserPub/${user}`), "text");
        const document = new DOMParser().parseFromString(response, "text/html");
        let likes = 0;
        let looks = 0;
        const works = [...document.querySelectorAll(".work")].map(e => [...e.querySelectorAll(".text")].map(e => Number(e.textContent)));
        for (const work of works) {
            looks += work[0];
            likes += work[1];
        }
        return {
            works: works.length,
            likes,
            looks
        };
    },
    fields: {
        username: "hou"
    }
});