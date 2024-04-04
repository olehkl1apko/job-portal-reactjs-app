import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Form, Tabs, message } from "antd";

import Experience from "./Experience";
import Education from "./Education";
import PersonalInfo from "./PersonalInfo";
import { PageTitle } from "../../../components";
import { ShowLoading, HideLoading } from "../../../redux/alertSlice";
import { getUserProfile, updateUserProfile } from "../../../apis/users";

function Profile() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const params = useParams();

  const loggedInUser = JSON.parse(localStorage.getItem("user"));
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const getData = async () => {
      try {
        dispatch(ShowLoading());
        const response = await getUserProfile(params.id);
        dispatch(HideLoading());
        if (response.success) {
          setUserData(response.data);
        } else {
          message.error(response.message);
        }
      } catch (error) {
        message.error(error.message);
      }
    };

    getData();
  }, [dispatch, params.id]);

  const onFinish = async (values) => {
    try {
      dispatch(ShowLoading());
      const response = await updateUserProfile(values);
      dispatch(HideLoading());
      if (response.success) {
        message.success(response.message);
      } else {
        message.error(response.message);
      }
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  };

  return (
    <div>
      <PageTitle title="Profile" />
      {userData && (
        <Form layout="vertical" onFinish={onFinish} initialValues={userData}>
          <Tabs defaultActiveKey="1">
            <Tabs.TabPane tab="Personal Info" key="1">
              <PersonalInfo />
            </Tabs.TabPane>
            <Tabs.TabPane tab="Education" key="2">
              <Education />
            </Tabs.TabPane>
            <Tabs.TabPane tab="Experience" key="3">
              <Experience />
            </Tabs.TabPane>
          </Tabs>
          <div className="d-flex justify-content-end gap-2">
            <button
              className="primary-outlined-btn"
              type="button"
              onClick={() => navigate("/")}
            >
              Cancel
            </button>
            {params.id === loggedInUser.id && (
              <button className="primary-contained-btn" type="submit">
                Save
              </button>
            )}
          </div>
        </Form>
      )}
    </div>
  );
}

export default Profile;
