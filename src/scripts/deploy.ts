import fs from "fs/promises";
import { teo } from "tencentcloud-sdk-nodejs-teo";
const { Client: TeoClient } = teo.v20220901;

async function main() {
    const client = new TeoClient({
        credential: {
            secretId: process.env.TENCENTCLOUD_SECRET_ID,
            secretKey: process.env.TENCENTCLOUD_SECRET_KEY,
        },
        profile: {
            httpProfile: {
                endpoint: "teo.tencentcloudapi.com",
            },
        },
    });
    await client.ModifyFunction({
        ZoneId: process.env.ZONE_ID!,
        FunctionId: process.env.FUNCTION_ID!,
        Content: String(await fs.readFile("dist/serverless/edgeone.mjs"))
    });
}

main();