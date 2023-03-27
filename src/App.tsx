import React from "react";
import { ConfigProvider } from "antd";
import zhCN from "antd/lib/locale/zh_CN";
import enUS from "antd/lib/locale/en_US";

import { useAppSelector } from "@/app/hooks";
import { selectLang } from "@/app/slice";

import { RenderRoutes } from "./routes";

function App() {
  const lang = useAppSelector(selectLang);

  return <ConfigProvider locale={lang === "zh_CN" ? zhCN : enUS}>{RenderRoutes()}</ConfigProvider>;
}

export default App;
