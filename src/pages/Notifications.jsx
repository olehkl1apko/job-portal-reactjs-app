import { useDispatch } from "react-redux";
import { message } from "antd";

import { NotificationTabs, PageTitle } from "../components";
import { HideLoading, ShowLoading } from "../redux/alertSlice";
import { SetReloadNotifications } from "../redux/notificationsSlice";
import { changeNotificationStatus } from "../apis/users";

function Notifications() {
  const dispatch = useDispatch();

  const onChangeStatus = async (id, status) => {
    try {
      dispatch(ShowLoading());
      const response = await changeNotificationStatus(id, status);

      if (response.success) {
        message.success(response.message);
        dispatch(SetReloadNotifications(true));
      }
    } catch (error) {
      message.error(error.message);
      dispatch(HideLoading());
    }
  };

  return (
    <div>
      <PageTitle title="Notifications" />
      <NotificationTabs onChangeStatus={onChangeStatus} />
    </div>
  );
}

export default Notifications;
