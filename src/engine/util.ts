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

export async function fetchImageAsBase64(urlStr: string): Promise<string> {
    try {
        const url = new URL(urlStr);
        if (url.protocol !== "http:" && url.protocol !== "https:") {
            throw new Error("Invalid protocol");
        }

        // Simple SSRF prevention for localhost / internal IPs
        const hostname = url.hostname;
        if (
            hostname === "localhost" ||
            hostname.startsWith("127.") ||
            hostname.startsWith("192.168.") ||
            hostname.startsWith("10.") ||
            hostname.endsWith(".local") ||
            (hostname.startsWith("172.") && parseInt(hostname.split(".")[1]) >= 16 && parseInt(hostname.split(".")[1]) <= 31) ||
            hostname.startsWith("169.254.") // AWS EC2 metadata
        ) {
            throw new Error("Local/Internal IPs are not allowed");
        }

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000); // 5s timeout

        const response = await fetch(urlStr, { signal: controller.signal });
        clearTimeout(timeoutId);

        if (!response.ok) {
            throw new Error(`Failed to fetch image: ${response.statusText}`);
        }

        let contentType = response.headers.get("content-type") || "image/jpeg";
        // Sanitize content type to prevent injection
        const mimeMatch = contentType.match(/^image\/[a-zA-Z0-9+-]+/);
        if (!mimeMatch) {
            throw new Error("Invalid content type");
        }
        contentType = mimeMatch[0];

        // Ensure max size (e.g. 2MB)
        const contentLength = response.headers.get("content-length");
        if (contentLength && parseInt(contentLength) > 2 * 1024 * 1024) {
            throw new Error("Image too large");
        }

        const buffer = await response.arrayBuffer();
        if (buffer.byteLength > 2 * 1024 * 1024) {
            throw new Error("Image too large");
        }

        let base64 = "";
        if (typeof Buffer !== "undefined") {
            base64 = Buffer.from(buffer).toString("base64");
        } else {
            const bytes = new Uint8Array(buffer);
            const binary = bytes.reduce((data, byte) => data + String.fromCharCode(byte), "");
            base64 = btoa(binary);
        }
        return `data:${contentType};base64,${base64}`;
    } catch (e) {
        console.error("Error fetching image", e);
        return "";
    }
}