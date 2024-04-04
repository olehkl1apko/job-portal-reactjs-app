import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { BiTrash } from "react-icons/bi";
import { message, Table } from "antd";

import { PageTitle } from "../../components";
import {
  changeJobStatusFromAdmin,
  deleteJobById,
  getAllJobs,
} from "../../apis/jobs";
import { HideLoading, ShowLoading } from "../../redux/alertSlice";

function AllJobs() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [data, setData] = useState([]);

  const getData = async () => {
    try {
      dispatch(ShowLoading());
      const response = await getAllJobs();
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

  const deleteJob = async (id) => {
    try {
      dispatch(ShowLoading());

      const response = await deleteJobById(id);
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

  const changeStatus = async (jobData, status) => {
    try {
      dispatch(ShowLoading());

      const response = await changeJobStatusFromAdmin({
        ...jobData,
        status,
      });
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
      title: "Title",
      dataIndex: "title",
    },
    {
      title: "Company",
      dataIndex: "company",
    },
    {
      title: "Posted On",
      dataIndex: "postedOn",
    },
    {
      title: "Last Date to Apply",
      dataIndex: "lastDateToApply",
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
          <i onClick={() => deleteJob(record.id)}>
            <BiTrash fill="red" />
          </i>
          {record.status === "approved" && (
            <span
              className="underline"
              onClick={() => changeStatus(record, "rejected")}
            >
              Reject
            </span>
          )}

          {(record.status === "pending" || record.status === "rejected") && (
            <span
              className="underline text-success"
              onClick={() => changeStatus(record, "approved")}
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
        <PageTitle title="All Jobs" />
        <button
          className="primary-outlined-btn"
          onClick={() => navigate("/posted-jobs/new")}
        >
          New Job
        </button>
      </div>

      <Table columns={columns} dataSource={data} />
    </div>
  );
}

export default AllJobs;
