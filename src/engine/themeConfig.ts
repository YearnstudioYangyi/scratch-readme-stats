export interface ThemeConfig {
    backgroundColor: string;
    borderColor: string;
    textColor: string;
    progressBarColor: string;
}
export type ThemeType = typeof themes[number];

export const themes = ["dark", "light", "rainbow"] as const;
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
    rainbow: {
        backgroundColor: "#ff0000",
        borderColor: "#F09436",
        textColor: "#38802D",
        progressBarColor: "#FCEF50"
    }
};
