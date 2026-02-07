import { parseResponse } from "@engine/util";

export async function fetchData(user: string, page: number) {
    const response = await parseResponse<string>(fetch(`https://www.kidscode.cn/coder/${user}`), "text");
    const document = new DOMParser().parseFromString(response, "text/html");
    const projects = [...document.querySelector("#cz")?.firstElementChild?.children ?? []]
        .slice(0, -1)
        .map(e => [...e.lastElementChild?.childNodes ?? []]
            .filter(e => e.nodeType === Node.TEXT_NODE)
            .map(e => e.textContent)
            .map(Number)).map(e => ({ looks: e[0], likes: e[1] }));
    const maxPage = [...document.querySelector("#cz")?.firstElementChild?.lastElementChild?.querySelectorAll("a.num") ?? []].length + 1;
    return {
        projects,
        maxPage
    };
}