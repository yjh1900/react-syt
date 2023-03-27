import React from "react";
import { Form, Input, Button } from "antd";
import { useNavigate } from "react-router-dom";
// redux相关
import { useAppDispatch } from "@/app/hooks";
import { loginAsync } from "./slice";

import "./index.less";

function Login() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const onFinish = async (values: any) => {
    const res = await dispatch(loginAsync(values));

    if (res.type === "user/login/fulfilled") {
      navigate("/syt/dashboard");
    }
  };

  return (
    <div className="login">
      <div className="login-container">
        <h1>尚医通平台管理系统</h1>
        <Form name="basic" labelCol={{ span: 4 }} wrapperCol={{ span: 20 }} initialValues={{ username: "admin", password: "111111" }} onFinish={onFinish} autoComplete="off">
          <Form.Item label="用户名" name="username" rules={[{ required: true, message: "请输入用户名!" }]}>
            <Input />
          </Form.Item>

          <Form.Item label="密码" name="password" rules={[{ required: true, message: "请输入用户名密码!" }]}>
            <Input.Password />
          </Form.Item>

          <Form.Item wrapperCol={{ span: 24 }}>
            <Button type="primary" htmlType="submit" className="login-btn">
              登录
            </Button>
            <br />
            <br />
            <p>用户名:admin 密码:111111</p>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}

export default Login;
