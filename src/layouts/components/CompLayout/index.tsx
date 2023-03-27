import React from "react";
import { Outlet } from "react-router-dom";

function CompLayout() {
	return <Outlet />;
}

// React.memo用来缓存函数式组件
export default React.memo(CompLayout);
