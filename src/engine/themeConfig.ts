export interface ThemeConfig {
    backgroundColor: string;
    borderColor: string;
    textColor: string;
    progressBarColor: string;
}
export type ThemeType = typeof themes[number];

export const themes = ["dark", "light", "blue", "green", "purple", "red", "yellow", "orange", "geek"] as const;
export const themeConfig: Record<ThemeType, ThemeConfig> = {
    light: {
        backgroundColor: "#fffefe",
        borderColor: "#e4e2e2",
        textColor: "#434d58",
        progressBarColor: "#ffffff",
    },
    dark: {
        backgroundColor: "#0d1117",
        borderColor: "#30363d",
        textColor: "#c9d1d9",
        progressBarColor: "#30363d",
    },
    blue: {
        backgroundColor: "#1e3a8a",
        borderColor: "#3b82f6",
        textColor: "#eff6ff",
        progressBarColor: "#3b82f6",
    },
    green: {
        backgroundColor: "#166534",
        borderColor: "#22c55e",
        textColor: "#f0fdf4",
        progressBarColor: "#22c55e",
    },
    purple: {
        backgroundColor: "#5b21b6",
        borderColor: "#a855f7",
        textColor: "#f5f3ff",
        progressBarColor: "#a855f7",
    },
    red: {
        backgroundColor: "#991b1b",
        borderColor: "#ef4444",
        textColor: "#fef2f2",
        progressBarColor: "#ef4444",
    },
    yellow: {
        backgroundColor: "#92400e",
        borderColor: "#eab308",
        textColor: "#fffbeb",
        progressBarColor: "#eab308",
    },
    orange: {
        backgroundColor: "#c2410c",
        borderColor: "#f97316",
        textColor: "#fff7ed",
        progressBarColor: "#f97316",
    },
    geek: {
        backgroundColor: "#0f0f1a",
        borderColor: "#00ffff",
        textColor: "#00ffff",
        progressBarColor: "#ff00ff",
    },
};
