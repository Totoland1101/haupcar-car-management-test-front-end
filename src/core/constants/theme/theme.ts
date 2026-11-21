import { theme as antdTheme, type ThemeConfig } from "antd";
import type { ThemeMode } from "./mode";
import variable from "./variable";

const { color } = variable;

// Ant Design theme: dark sidebar with a blue selected item,
// taller inputs and pill-shaped tags. Dark mode keeps the sidebar and swaps the rest.
export function buildTheme(mode: ThemeMode): ThemeConfig {
  const dark = mode === "dark";

  return {
    algorithm: dark ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,
    token: {
      // --font-prompt is set by next/font in app/layout.tsx.
      fontFamily: "var(--font-prompt), sans-serif",
      colorPrimary: color.primary,
      ...(dark ? {} : { colorText: color.black }),
    },
    components: {
      Layout: {
        siderBg: color.secondary,
        triggerBg: color.secondary,
        headerBg: dark ? "#141414" : color.white,
        bodyBg: dark ? "#000000" : color.pageBg,
      },
      Menu: {
        itemBg: color.secondary,
        itemColor: color.white,
        subMenuItemBg: color.secondary,
        subMenuItemSelectedColor: color.white,
        popupBg: color.secondary,
        itemHoverBg: color.secondary,
        itemHoverColor: color.white,
        itemSelectedBg: color.primary,
        itemSelectedColor: color.white,
        groupTitleColor: color.white,
        itemActiveBg: color.primary,
      },
      Tag: { borderRadiusSM: 16 },
      Breadcrumb: dark ? {} : { lastItemColor: color.darkBlue },
      Input: { paddingBlock: 9, paddingInline: 16 },
      InputNumber: { paddingBlock: 9, paddingInline: 16 },
      Select: { controlHeight: 42 },
      DatePicker: { controlHeight: 42 },
      Segmented: { itemSelectedBg: color.primary, itemSelectedColor: color.white },
    },
  };
}
