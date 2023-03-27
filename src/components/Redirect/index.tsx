import React, { useEffect } from "react";
import { useNavigate, Outlet } from "react-router-dom";

interface CompProps {
	to: string;
	from?: string;
}

function Redirect({ to }: CompProps) {
	const navigate = useNavigate();

	useEffect(() => {
		navigate(to);
	}, [navigate, to]);

	return <Outlet />;
}

export default Redirect;
