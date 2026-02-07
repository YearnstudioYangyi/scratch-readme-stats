import { init, run } from ".";

declare function addEventListener(event: string, callback: (event: {
    request: Request;
    respondWith(response: Response): void;
}) => void): void;

init();
addEventListener("fetch", async (event) => {
    const response = await run(event.request);
    event.respondWith(response);
});