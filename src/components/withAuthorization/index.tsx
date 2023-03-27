import React, { FC } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "@/app/hooks";
import { getInfoAsync, selectUser, logout } from "@pages/login/slice";

function withAuthorization(WrappedComponent: FC) {
	return () => {
		const location = useLocation();
		const dispatch = useAppDispatch();
		const navigate = useNavigate();
		const user = useAppSelector(selectUser);

		if (user.token) {
			if (location.pathname === "/login" || location.pathname === "/") {
				return <Navigate to="/syt/dashboard" replace />;
			}

			if (user.name) {
				return <WrappedComponent />;
			}

			// 获取name，在跳转
			dispatch(getInfoAsync()).then((res) => {
				// 获取失败
				if (res.type === "user/getInfo/rejected") {
					dispatch(logout());
					navigate("/login");
				}
			});

			return <WrappedComponent />;
		} else {
			if (location.pathname === "/login") {
				return <WrappedComponent />;
			} else {
				return <Navigate to="/login" />;
			}
		}
	};
}

export default withAuthorization;
