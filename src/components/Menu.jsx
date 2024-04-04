import { useNavigate } from "react-router-dom";
import { BiHomeAlt } from "react-icons/bi";
import {
  AiOutlineUser,
  AiOutlineLogout,
  AiOutlineUsergroupAdd,
  AiOutlineCheckCircle,
} from "react-icons/ai";
import { FileOutlined, FolderOutlined } from "@ant-design/icons";

const Menu = ({ userType, user, collapsed }) => {
  const navigate = useNavigate();

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

  const menuToRender = userType === "admin" ? adminMenu : userMenu;

  return (
    <div
      className="menu"
      style={{
        width: collapsed ? "40px" : "180px",
      }}
    >
      {menuToRender.map((item, index) => (
        <div
          className={`menu-item ${
            window.location.pathname === item.path && "active-menu-item"
          }`}
          onClick={item.onClick}
          key={index}
        >
          {item.icon}
          {!collapsed && <span>{item.title}</span>}
        </div>
      ))}
    </div>
  );
};

export default Menu;
