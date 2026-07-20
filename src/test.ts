import { CommunityField } from "@engine/adapters";
import esa from "./serverless/esa";
import fs from "fs/promises";
import { ParamInput } from "@engine/dataHandler";
import { querize } from "@engine/util";

const communities: Partial<Record<CommunityField, string>> = {
    ccw: "6107c5323e593a0c25f850f8"
};
const config: ParamInput = {
    username: "TestUser",
    rankSystem: "ccw",
    theme: "geek",
    img: "https://github.com/YearnstudioYangyi.png"
};

async function main() {
    const response = await esa.fetch(new Request(`https://baidu.com/?${querize(communities)}&${querize(config)}`));
    await fs.writeFile("output.svg", await response.text());
}
main();
