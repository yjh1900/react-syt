import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "./store";

interface AppState {
  lang: string;
}

function getInitialState(): AppState {
  const lang = localStorage.getItem("lang") || "zh_CN";

  return {
    lang,
  };
}

// 初始化状态
let initialState: AppState = getInitialState();

// 创建redux模块
export const appSlice = createSlice({
  name: "app",
  // 初始化状态数据
  initialState,
  // reducer函数 --> 会自动生成同步action函数
  reducers: {
    setLang(state, action) {
      const lang = action.payload;
      localStorage.setItem("lang", lang);
      state.lang = lang;
    },
  },
});

// 暴露用来获取数据
export const selectLang = (state: RootState) => state.app.lang;

// 暴露同步action
export const { setLang } = appSlice.actions;

export default appSlice.reducer;
