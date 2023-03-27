import { request } from "@/utils/http";
import type { GetInfoResponse, LoginResponse } from "./model/userTypes";

// 登录
export const reqLogin = (username: string, password: string) => {
  // <any, string>的第一个类型为any即可，实际不会用上
  // 第二个类型是返回值数据中data的类型，根据接口文档填写
  return request.post<any, LoginResponse>("/admin/acl/index/login", {
    username,
    password,
  });
};

// 登出
export const reqLogout = () => {
  return request.post<any, null>("/admin/auth/index/logout");
};

// 查询用户信息
export const reqGetInfo = () => {
  return request.get<any, GetInfoResponse>("/admin/acl/index/info");
};
