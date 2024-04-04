import { Badge } from "antd";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  AiOutlineMenu,
  AiOutlineNotification,
  AiOutlineUser,
} from "react-icons/ai";
import { BiChevronLeft } from "react-icons/bi";

import { getUserNotifications, getUserProfile } from "../apis/users";
import { HideLoading, ShowLoading } from "../redux/alertSlice";
import { SetReloadNotifications } from "../redux/notificationsSlice";
import Menu from "./Menu";

function DefaultLayout({ children }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [collapsed, setCollapsed] = useState(false);
  const [userType, setUserType] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));
  const { reloadNotifications, unreadNotifications } = useSelector(
    (state) => state.notifications
  );

  useEffect(() => {
    const getData = async () => {
      try {
        dispatch(ShowLoading());
        const userId = JSON.parse(localStorage.getItem("user")).id;
        const response = await getUserProfile(userId);

        dispatch(HideLoading());
        response.data?.isAdmin ? setUserType("admin") : setUserType("user");
      } catch (error) {
        console.log(error);
      }
    };

    getData();
  }, [dispatch]);

  useEffect(() => {
    if (reloadNotifications) {
      const loadNotifications = async () => {
        try {
          dispatch(ShowLoading());
          await getUserNotifications();
          dispatch(HideLoading());

          dispatch(SetReloadNotifications(false));
        } catch (error) {
          dispatch(HideLoading());
        }
      };

      loadNotifications();
    }
  }, [dispatch, reloadNotifications]);

  return (
    <div className="layout">
      <div className="sidebar d-flex flex-column justify-content-between">
        <div className="menu-item">
          {collapsed ? (
            <AiOutlineMenu size={28} onClick={() => setCollapsed(!collapsed)} />
          ) : (
            <BiChevronLeft size={28} onClick={() => setCollapsed(!collapsed)} />
          )}
        </div>
        <Menu userType={userType} user={user} collapsed={collapsed} />
        <span style={{ fontSize: "12px" }}>
          {!collapsed && "2024 All rights reserved"}
        </span>
      </div>
      <div className="content">
        <div className="header justify-content-between d-flex">
          <span className="logo">JOB-PORTAL</span>
          <div className="d-flex gap-1 align-items-center">
            <Badge
              count={unreadNotifications?.length || 0}
              className="mx-5"
              onClick={() => navigate("/notifications")}
            >
              <AiOutlineNotification />
            </Badge>

            <span>{user?.name}</span>
            <AiOutlineUser />
          </div>
        </div>
        <div className="body">{children}</div>
      </div>
    </div>
  );
}

export default DefaultLayout;
