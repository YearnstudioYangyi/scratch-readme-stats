export async function fetchGraphQLData(user: string, pat: string) {
    const query = `
      query($login: String!, $cursor: String) {
        repositoryOwner(login: $login) {
          repositories(first: 100, after: $cursor, ownerAffiliations: [OWNER]) {
            pageInfo {
              hasNextPage
              endCursor
            }
            nodes {
              stargazerCount
              forkCount
            }
          }
        }
      }
    `;

    const headers: Record<string, string> = {
        Authorization: `bearer ${pat}`,
        "Content-Type": "application/json",
        "User-Agent": "scratch-readme-stats"
    };

    let hasNextPage = true;
    let cursor: string | null = null;
    let works = 0;
    let likes = 0;
    let looks = 0;

    while (hasNextPage) {
        const response: Response = await fetch("https://api.github.com/graphql", {
            method: "POST",
            headers,
            body: JSON.stringify({ query, variables: { login: user, cursor } }),
        });

        const data = await response.json() as { message?: string; errors?: { message: string }[]; data?: { repositoryOwner: { repositories: { nodes: { stargazerCount: number; forkCount: number }[]; pageInfo: { hasNextPage: boolean; endCursor: string | null } } } } };

        if (!response.ok) {
            throw new Error(data.message || "GitHub API request failed");
        }

        if (data.errors) {
            throw new Error(data.errors.map((e: { message: string }) => e.message).join(", "));
        }

        if (!data.data) {
            throw new Error("No data returned from GitHub API");
        }

        const repositories = data.data.repositoryOwner.repositories;
        for (const repo of repositories.nodes) {
            works++;
            likes += repo.stargazerCount;
            looks += repo.stargazerCount * 2 + repo.forkCount;
        }

        hasNextPage = repositories.pageInfo.hasNextPage;
        cursor = repositories.pageInfo.endCursor;
    }

    return { works, likes, looks };
}
