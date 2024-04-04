import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { message, Table } from "antd";

import { PageTitle } from "../../components";
import { HideLoading, ShowLoading } from "../../redux/alertSlice";
import { getAllUsers, updateUserStatus } from "../../apis/users";

function AllUsers() {
  const dispatch = useDispatch();
  const [data, setData] = useState([]);

  const getData = async () => {
    try {
      dispatch(ShowLoading());
      const response = await getAllUsers();
      if (response.success) {
        const newData = response.data.map((item) => ({
          ...item,
          key: item.id,
        }));
        setData(newData);
      }
      dispatch(HideLoading());
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  };

  const changeStatus = async (id, status) => {
    try {
      dispatch(ShowLoading());

      const response = await updateUserStatus({ id, status });
      if (response.success) {
        setData(response.data);
        getData();
      }
      dispatch(HideLoading());
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
    },
    {
      title: "Email",
      dataIndex: "email",
    },
    {
      title: "User Id",
      dataIndex: "id",
    },
    {
      title: "Status",
      dataIndex: "status",
    },
    {
      title: "Action",
      dataIndex: "action",
      render: (text, record) => (
        <div className="d-flex gap-2 align-items-center">
          {record.status === "approved" && (
            <span
              className="underline"
              onClick={() => changeStatus(record.id, "rejected")}
            >
              Reject
            </span>
          )}

          {(record.status === "pending" || record.status === "rejected") && (
            <span
              className="underline"
              onClick={() => changeStatus(record.id, "approved")}
            >
              Approve
            </span>
          )}
        </div>
      ),
    },
  ];

  useEffect(() => {
    getData();
  }, []);

  return (
    <div>
      <div className="d-flex justify-content-between">
        <PageTitle title="All Users" />
      </div>

      <Table columns={columns} dataSource={data} />
    </div>
  );
}

export default AllUsers;
