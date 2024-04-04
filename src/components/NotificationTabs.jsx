import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Tabs, Alert } from "antd";

const NotificationTabs = ({ onChangeStatus }) => {
  const navigate = useNavigate();

  const { readNotifications, unreadNotifications } = useSelector(
    (state) => state.notifications
  );

  return (
    <Tabs defaultActiveKey="1">
      <Tabs.TabPane tab="Unread" key="1">
        {unreadNotifications.map((notification, index) => (
          <Alert
            key={index}
            message={
              <div className="d-flex justify-content-between align-items-center">
                <div
                  className="d-flex flex-column"
                  onClick={() => navigate(notification.onClick)}
                >
                  <span>{notification.title}</span>
                  <span>{notification.createdAt}</span>
                </div>
                <span
                  className="underline"
                  onClick={() => onChangeStatus(notification.id, "read")}
                >
                  Mark as read
                </span>
              </div>
            }
          />
        ))}
      </Tabs.TabPane>
      <Tabs.TabPane tab="Read" key="2">
        {readNotifications.map((notification, index) => (
          <Alert
            key={index}
            message={
              <div className="d-flex justify-content-between align-items-center">
                <div className="d-flex flex-column">
                  <span>{notification.title}</span>
                  <span>{notification.createdAt}</span>
                </div>
                <span
                  className="underline"
                  onClick={() => onChangeStatus(notification.id, "unread")}
                >
                  Mark as unread
                </span>
              </div>
            }
          />
        ))}
      </Tabs.TabPane>
    </Tabs>
  );
};

export default NotificationTabs;
