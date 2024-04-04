import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { message, Table } from "antd";

import { PageTitle } from "../../components";
import { HideLoading, ShowLoading } from "../../redux/alertSlice";
import { getApplicationsByUserId } from "../../apis/jobs";

function AppliedJobs() {
  const dispatch = useDispatch();
  const [data, setData] = useState([]);

  const columns = [
    {
      title: "Job",
      dataIndex: "jobTitle",
    },
    {
      title: "Company",
      dataIndex: "company",
    },
    {
      title: "Applied On",
      dataIndex: "appliedOn",
    },
    {
      title: "Status",
      dataIndex: "status",
    },
  ];

  useEffect(() => {
    const getData = async () => {
      try {
        dispatch(ShowLoading());
        const user = JSON.parse(localStorage.getItem("user"));
        const response = await getApplicationsByUserId(user.id);
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
        <PageTitle title="Applied Jobs" />
      </div>

      <Table columns={columns} dataSource={data} />
    </div>
  );
}

export default AppliedJobs;
