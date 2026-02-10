import { GenerateStatus } from "./generator";

export function buildResponse(status: GenerateStatus) {
    if (status.success) {
        return new Response(status.result, {
            status: 200,
            headers: {
                "content-type": "image/svg+xml;charset=UTF-8",
                "cache-control": "public, max-age=3600",
            },
        });
    } else {
        return new Response(status.result, {
            status: 400,
            headers: { "content-type": "text/plain;charset=UTF-8" },
        });
    }
}
export async function parseResponse<T>(response: Promise<Response> | Response, type: "json" | "text" = "json", checkStatus?: string): Promise<T> {
    const responsed = await response;
    if (!responsed.ok) {
        throw new Error(`Status: ${responsed.status}`);
    }
    try {
        const data = await responsed[type]();
        if (checkStatus) {
            if (data[checkStatus] !== 200) {
                throw new Error(`API Responsed status: ${data[checkStatus]}`);
            }
        }
        return data;
    } catch (e) {
        throw new Error(`Error parsing ${type}: ${e}`);
    }
}
export function clamp(value: number, min: number, max: number) {
    return Math.min(Math.max(value, min), max);
}
export function buildForm(data: Record<string, string | number | boolean>) {
    const result = new FormData();
    for (const [key, value] of Object.entries(data)) {
        result.append(key, String(value));
    }
    return result;
}
export function querize(data: object) {
    return Object.entries(data).map(([key, value]) => `${key}=${value}`).join("&");
}