import card from "@template/card.svg";
import { themeConfig, ThemeType } from "./themeConfig";
import { CardInfo, CardStyle, UserProfile } from "./dataHandler";

export function compose(theme: ThemeType, data: UserProfile & CardInfo & CardStyle) {
    const colors = themeConfig[theme];
    const dataWithColors = {
        ...data,
        ...colors,
    };
    let result = card;
    for (const [key, value] of Object.entries(dataWithColors)) {
        result = result.replaceAll(`\${${key}}`, value.toString());
    }
    return result;
}