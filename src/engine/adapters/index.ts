import { CommunityAdapter } from "@engine/dataHandler";
import fortyCode from "@community/40code";
import ccw from "@community/ccw";
import kernyr from "@community/kernyr";
import momQ from "@community/momQ";
import sccn from "@community/sccn";
import scratch from "@community/scratch";
import smallBox from "@community/smallBox";
import zerocat from "@community/zerocat";
import clipcc from "@community/clipcc";
import hou from "@community/hou";
import gitblock from "@community/gitblock";
import github from "@community/github";
import kidscode from "@community/kidscode";
import xmw from "@community/xmw";

export const communities = [
    fortyCode,
    ccw,
    kernyr,
    momQ,
    sccn,
    scratch,
    smallBox,
    zerocat,
    clipcc,
    hou,
    gitblock,
    github,
    kidscode,
    xmw
] as const;
export type CommunityField = typeof communities[number] extends CommunityAdapter<infer U extends string> ? U : never;
