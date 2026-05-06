import type { AppLanguage } from "@/stores/ui.store";

type TranslationKey =
  | "app.title"
  | "app.subtitle"
  | "control.hideMap"
  | "control.showMap"
  | "control.hideDashboard"
  | "control.showDashboard"
  | "control.resetLayout"
  | "control.theme"
  | "control.language"
  | "theme.dark"
  | "theme.light"
  | "map.title"
  | "map.source"
  | "panel.fleet"
  | "panel.simulation"
  | "panel.assets"
  | "panel.stream";

const translations: Record<AppLanguage, Record<TranslationKey, string>> = {
  en: {
    "app.title": "EcoTwin Hanoi Command",
    "app.subtitle": "Digital Twin Operations for V2G Corridor",
    "control.hideMap": "Hide 3D Map",
    "control.showMap": "Show 3D Map",
    "control.hideDashboard": "Hide Dashboard",
    "control.showDashboard": "Show Dashboard",
    "control.resetLayout": "Reset Layout",
    "control.theme": "Theme",
    "control.language": "Language",
    "theme.dark": "Dark",
    "theme.light": "Light",
    "map.title": "Hanoi Core Digital Twin",
    "map.source": "Data Source",
    "panel.fleet": "Fleet & Grid Status",
    "panel.simulation": "Scenario Simulation",
    "panel.assets": "Asset Creation",
    "panel.stream": "Realtime Stream"
  },
  vi: {
    "app.title": "Trung Tam Dieu Hanh EcoTwin Ha Noi",
    "app.subtitle": "Van hanh Digital Twin cho hanh lang V2G",
    "control.hideMap": "An ban do 3D",
    "control.showMap": "Hien ban do 3D",
    "control.hideDashboard": "An bang dieu khien",
    "control.showDashboard": "Hien bang dieu khien",
    "control.resetLayout": "Dat lai bo cuc",
    "control.theme": "Giao dien",
    "control.language": "Ngon ngu",
    "theme.dark": "Toi",
    "theme.light": "Sang",
    "map.title": "Digital Twin trung tam Ha Noi",
    "map.source": "Nguon du lieu",
    "panel.fleet": "Trang thai doi xe va luoi dien",
    "panel.simulation": "Mo phong kich ban",
    "panel.assets": "Them thuc the",
    "panel.stream": "Luong su kien realtime"
  }
};

export function t(language: AppLanguage, key: TranslationKey): string {
  return translations[language][key] ?? translations.en[key] ?? key;
}
