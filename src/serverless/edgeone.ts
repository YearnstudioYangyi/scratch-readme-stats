import { init, run } from ".";

init();
addEventListener("fetch", async (event: any) => {
    const response = await run(event.request);
    event.respondWith(response);
});