import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { message, Table } from "antd";

import { PageTitle } from "../../components";
import { HideLoading, ShowLoading } from "../../redux/alertSlice";
import { getAllUsers } from "../../apis/users";

function AllUsers() {
  const dispatch = useDispatch();
  const [data, setData] = useState([]);
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
  ];

  useEffect(() => {
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

    getData();
  }, [dispatch]);

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
