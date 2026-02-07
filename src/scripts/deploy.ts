import crypto from "crypto";

function sha256(message: string, secret = "", encoding: crypto.BinaryToTextEncoding = "hex") {
    const hmac = crypto.createHmac("sha256", secret);
    return hmac.update(message).digest(encoding);
}
function getHash(message: string, encoding: crypto.BinaryToTextEncoding = "hex") {
    const hash = crypto.createHash("sha256");
    return hash.update(message).digest(encoding);
}
function getDate(timestamp: number) {
    const date = new Date(timestamp * 1000);
    const year = date.getUTCFullYear();
    const month = ("0" + (date.getUTCMonth() + 1)).slice(-2);
    const day = ("0" + date.getUTCDate()).slice(-2);
    return `${year}-${month}-${day}`;
}

// 密钥信息从环境变量读取，需要提前在环境变量中设置 TENCENTCLOUD_SECRET_ID 和 TENCENTCLOUD_SECRET_KEY
// 使用环境变量方式可以避免密钥硬编码在代码中，提高安全性
// 生产环境建议使用更安全的密钥管理方案，如密钥管理系统(KMS)、容器密钥注入等
// 请参见：https://cloud.tencent.com/document/product/1278/85305
// 密钥可前往官网控制台 https://console.cloud.tencent.com/cam/capi 进行获取
const SECRET_ID = process.env.TENCENTCLOUD_SECRET_ID;
const SECRET_KEY = process.env.TENCENTCLOUD_SECRET_KEY;
const TOKEN = "";
const host = "teo.tencentcloudapi.com";
const service = "teo";
const region = "";
const action = "ModifyFunction";
const version = "2022-09-01";
const timestamp = parseInt(String(new Date().getTime() / 1000));
const date = getDate(timestamp);
const payload = "{}";
const signedHeaders = "content-type;host";
const hashedRequestPayload = getHash(payload);
const httpRequestMethod = "POST";
const canonicalUri = "/";
const canonicalQueryString = "";
const canonicalHeaders = "content-type:application/json; charset=utf-8\n" + "host:" + host + "\n";
const canonicalRequest = [
    httpRequestMethod,
    canonicalUri,
    canonicalQueryString,
    canonicalHeaders,
    signedHeaders,
    hashedRequestPayload,
].join("\n");
const algorithm = "TC3-HMAC-SHA256";
const hashedCanonicalRequest = getHash(canonicalRequest);
const credentialScope = `${date}/${service}/tc3_request"`;
const stringToSign = [
    algorithm,
    timestamp,
    credentialScope,
    hashedCanonicalRequest
].join("\n");
const kDate = sha256(date, "TC3" + SECRET_KEY);
const kService = sha256(service, kDate);
const kSigning = sha256("tc3_request", kService);
const signature = sha256(stringToSign, kSigning, "hex");
const authorization = `${algorithm} Credential=${SECRET_ID}/${credentialScope}, SignedHeaders=${signedHeaders}, Signature=${signature}`;
const headers: HeadersInit = {
    "Authorization": authorization,
    "Content-Type": "application/json; charset=utf-8",
    "Host": host,
    "X-TC-Action": action,
    "X-TC-Timestamp": String(timestamp),
    "X-TC-Version": version,
};
if (region) {
    headers["X-TC-Region"] = region;
}
if (TOKEN) {
    headers["X-TC-Token"] = TOKEN;
}

const response = await fetch(`https://${host}`, {
    headers,
    method: httpRequestMethod
});
console.log(await response.text());
