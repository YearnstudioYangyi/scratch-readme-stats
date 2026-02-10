import esa from "./serverless/esa";
import fs from "fs/promises";

async function main() {
    fs.writeFile(
        "output.svg",
        await (
            await esa.fetch(
                new Request("https://baidu.com/?ccw=6107c5323e593a0c25f850f8&username=TestUser&rankSystem=ccw")
            )
        ).text()
    );
}
main();