import { Badge } from "antd";
import { FolderOutlined, FileOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  AiOutlineMenu,
  AiOutlineNotification,
  AiOutlineUser,
  AiOutlineLogout,
  AiOutlineUsergroupAdd,
  AiOutlineCheckCircle,
} from "react-icons/ai";
import { BiChevronLeft, BiHomeAlt } from "react-icons/bi";

import { getUserNotifications, getUserProfile } from "../apis/users";
import { HideLoading, ShowLoading } from "../redux/alertSlice";
import { SetReloadNotifications } from "../redux/notificationsSlice";

function DefaultLayout({ children }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [collapsed, setCollapsed] = useState(false);
  const [menuToRender, setMenuToRender] = useState([]);

  const user = JSON.parse(localStorage.getItem("user"));
  const { reloadNotifications, unreadNotifications } = useSelector(
    (state) => state.notifications
  );

  const userMenu = [
    {
      title: "Home",
      onClick: () => navigate("/"),
      icon: <BiHomeAlt />,
      path: "/",
    },
    {
      title: "Applied Jobs",
      onClick: () => navigate("/applied-jobs"),
      icon: <AiOutlineCheckCircle />,
      path: "/applied-jobs",
    },
    {
      title: "Posted Jobs",
      onClick: () => navigate("/posted-jobs"),
      icon: <FileOutlined />,
      path: "/posted-jobs",
    },
    {
      title: "Profile",
      onClick: () => navigate(`/profile/${user.id}`),
      icon: <AiOutlineUser />,
      path: "/profile",
    },
    {
      title: "Logout",
      onClick: () => {
        localStorage.removeItem("user");
        navigate("/login");
      },
      icon: <AiOutlineLogout />,
      path: "/login",
    },
  ];

  const adminMenu = [
    {
      title: "Home",
      onClick: () => navigate("/"),
      icon: <BiHomeAlt />,
      path: "/",
    },
    {
      title: "Jobs",
      onClick: () => navigate("/admin/jobs"),
      icon: <FolderOutlined />,
      path: "/admin/jobs",
    },
    {
      title: "Users",
      onClick: () => navigate("/admin/users"),
      icon: <AiOutlineUsergroupAdd />,
      path: "/admin/users",
    },
    {
      title: "Logout",
      onClick: () => {
        localStorage.removeItem("user");
        navigate("/login");
      },
      icon: <AiOutlineLogout />,
      path: "/login",
    },
  ];

  const getData = async () => {
    try {
      dispatch(ShowLoading());
      const userId = JSON.parse(localStorage.getItem("user")).id;
      const response = await getUserProfile(userId);

      dispatch(HideLoading());
      if (response.data?.isAdmin) {
        setMenuToRender(adminMenu);
      } else {
        setMenuToRender(userMenu);
      }
    } catch (error) {
      console.log(error);
    }
  };

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

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    if (reloadNotifications) {
      loadNotifications();
    }
  }, [reloadNotifications]);

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
        <div
          className="menu"
          style={{
            width: collapsed ? "40px" : "180px",
          }}
        >
          {menuToRender.map((item, index) => {
            const isActive = window.location.pathname === item.path;
            return (
              <div
                className={`menu-item ${isActive && "active-menu-item"}`}
                onClick={item.onClick}
                key={index}
              >
                {item.icon}
                {!collapsed && <span>{item.title}</span>}
              </div>
            );
          })}
        </div>
        <span style={{ fontSize: "12px" }}>
          {!collapsed && "2024 All right reserved"}
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
