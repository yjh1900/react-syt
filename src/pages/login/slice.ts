import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from "@/app/store";
import { reqLogin, reqLogout, reqGetInfo } from "@api/user";

interface UserState {
  name: string; // 用户名
  avatar: string; // 头像
  token: string;
  routes: string[]; // 菜单权限列表
  buttons: string[]; // 按钮权限列表
}

interface UserFormData {
  username: string;
  password: string;
}

function getInitialState(): UserState {
  const token = localStorage.getItem("token") || "";

  return {
    name: "",
    avatar: "",
    token,
    routes: [], // 菜单权限列表
    buttons: [], // 按钮权限列表
  };
}

// 初始化状态
let initialState: UserState = getInitialState();

// 异步action
// 登录
export const loginAsync = createAsyncThunk("user/login", (user: UserFormData) => {
  const { username, password } = user;
  return reqLogin(username, password);
});

// 登出
export const logoutAsync = createAsyncThunk("user/logout", () => {
  return reqLogout();
});

// 获取用户信息
export const getInfoAsync = createAsyncThunk("user/getInfo", () => {
  return reqGetInfo();
});

// 创建redux模块
export const userSlice = createSlice({
  name: "user",
  // 初始化状态数据
  initialState,
  // reducer函数 --> 会自动生成同步action函数
  // 语法：const { login } = userSlice.actions;
  // 使用：dispatch(login())
  reducers: {
    // login: (state, action: PayloadAction<UserState>) => {
    // 	state.name = action.payload.name;
    // 	state.token = action.payload.token;
    // },
    logout(state) {
      state.token = "";
      state.name = "";
      state.avatar = "";
      state.buttons = [];
      state.routes = [];
      localStorage.removeItem("token");
    },
  },
  // reducer函数 --> 专门处理异步action函数
  extraReducers: (builder) => {
    builder
      // 代表异步action执行中
      // .addCase(loginAsync.pending, (state) => {
      // 	state.status = "loading";
      // })
      // 代表异步action执行成功
      .addCase(loginAsync.fulfilled, (state, action) => {
        const token = action.payload;
        // 将数据存储到redux中
        state.token = token;
        // // 将数据持久化存储
        localStorage.setItem("token", token);
      })
      // 代表异步失败
      // .addCase(loginAsync.rejected, (state, action) => {
      // 	state.error = action.error.message;
      // });
      .addCase(logoutAsync.fulfilled, (state) => {
        state.token = "";
        state.name = "";
        state.avatar = "";
        state.buttons = [];
        state.routes = [];
        localStorage.removeItem("token");
      })
      .addCase(getInfoAsync.fulfilled, (state, action) => {
        const { name, avatar, buttons, routes } = action.payload;
        state.name = name;
        state.avatar = avatar;
        state.buttons = buttons;
        state.routes = routes;
      });
  },
});

// 暴露用来获取数据
export const selectUser = (state: RootState) => state.user;

// 暴露同步action
export const { logout } = userSlice.actions;

export default userSlice.reducer;
