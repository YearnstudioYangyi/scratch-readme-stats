export interface ThemeConfig {
    backgroundColor: string;
    borderColor: string;
    textColor: string;
    progressBarColor: string;
}
export type ThemeType = typeof themes[number];

export const themes = ["dark", "light"] as const;
export const themeConfig: Record<ThemeType, ThemeConfig> = {
    light: {
        backgroundColor: "#fffefe",
        borderColor: "#e4e2e2",
        textColor: "#434d58",
        progressBarColor: "#eee",
    },
    dark: {
        backgroundColor: "#0d1117",
        borderColor: "#30363d",
        textColor: "#c9d1d9",
        progressBarColor: "#30363d",
    },
};
