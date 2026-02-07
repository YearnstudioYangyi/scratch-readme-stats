import { parseResponse } from "@engine/util";

export function parseMaxPage(response: Response): number {
    const url = response.headers.get("Link")?.split(",")[1].split(";")[0].trim().slice(1, -1);
    if (url) {
        return Number(new URL(url).searchParams.get("page") ?? 1);
    } else return 1;
}
export async function fetchData(user: string, page: number, pat: string) {
    const headers: Record<string, string> = {
        Accept: "application/vnd.github.v3+json",
        Authorization: `token ${pat}`,
    };
    const response = await fetch(`https://api.github.com/users/${user}/repos?per_page=30&page=${page}`, { headers });
    const repos = await parseResponse<{
        forks_count: number;
        stargazers_count: number;
        watchers_count: number;
        owner: {
            login: string;
        };
    }[]>(response);
    const maxPage = parseMaxPage(response);
    return { repos, maxPage };
}