import { message, Table } from "antd";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { BiTrash, BiPencil } from "react-icons/bi";

import { PageTitle } from "../../../components";
import { HideLoading, ShowLoading } from "../../../redux/alertSlice";
import {
  getPostedJobsByUserId,
  deleteJobById,
  getApplicationsByJobId,
} from "../../../apis/jobs";
import AppliedCandidates from "./AppliedCandidates";

function PostedJobs() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [data, setData] = useState([]);
  const [showAppliedCandidates, setShowAppliedCandidates] = useState(false);
  const [appliedCandidates, setAppliedCandidates] = useState([]);

  const getData = async () => {
    try {
      dispatch(ShowLoading());
      const user = JSON.parse(localStorage.getItem("user"));
      const response = await getPostedJobsByUserId(user.id);
      if (response.success) {
        setData(response.data);
      }
      dispatch(HideLoading());
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  };

  useEffect(() => {
    getData();
  }, []);

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

  const getAppliedCandidates = async (id) => {
    try {
      dispatch(ShowLoading());
      const response = await getApplicationsByJobId(id);
      if (response.success) {
        setAppliedCandidates(response.data);
        if (!showAppliedCandidates) {
          setShowAppliedCandidates(true);
        }
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
        <div className="d-flex gap-5 align-items-center">
          <span
            className="underline"
            onClick={() => getAppliedCandidates(record.id)}
          >
            candidates
          </span>
          <div className="d-flex gap-2">
            <i onClick={() => deleteJob(record.id)}>
              <BiTrash fill="red" />
            </i>
            <i onClick={() => navigate(`/posted-jobs/edit/${record.id}`)}>
              <BiPencil fill="blue" />
            </i>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="d-flex justify-content-between">
        <PageTitle title="Posted Jobs" />
        <button
          className="primary-outlined-btn"
          onClick={() => navigate("/posted-jobs/new")}
        >
          New Job
        </button>
      </div>

      <Table columns={columns} dataSource={data} rowKey="id" />

      {showAppliedCandidates && (
        <AppliedCandidates
          showAppliedCandidates={showAppliedCandidates}
          setShowAppliedCandidates={setShowAppliedCandidates}
          appliedCandidates={appliedCandidates}
          reloadData={getAppliedCandidates}
        />
      )}
    </div>
  );
}

export default PostedJobs;
