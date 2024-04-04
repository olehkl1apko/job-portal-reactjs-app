import { Col, message, Row } from "antd";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

import { applyJobPost, getApplicationsByJobId, getJobById } from "../apis/jobs";
import { PageTitle, JobDetails } from "../components";
import { HideLoading, ShowLoading } from "../redux/alertSlice";

function JobDescription() {
  const params = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [jobData, setJobData] = useState(null);
  const [showApplyButton, setShowApplyButton] = useState(true);
  const [alreadyApplied, setAlreadyApplied] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));

  const applyNow = async () => {
    try {
      dispatch(ShowLoading());
      const response = await applyJobPost(jobData);
      dispatch(HideLoading());

      if (response.success) {
        message.success(response.message);
        navigate("/");
      } else {
        message.error(response.message);
      }
    } catch (error) {
      message.error(error.message);
      dispatch(HideLoading());
    }
  };

  useEffect(() => {
    const getData = async () => {
      try {
        dispatch(ShowLoading());
        const response = await getJobById(params.id);

        if (
          response.data.postedByUserId ===
          JSON.parse(localStorage.getItem("user")).id
        ) {
          setShowApplyButton(false);
        }

        const applicationsResponse = await getApplicationsByJobId(params.id);

        if (
          applicationsResponse.data.filter((item) => item.userId === user.id)
            .length > 0
        ) {
          setShowApplyButton(false);
          setAlreadyApplied(true);
        }

        dispatch(HideLoading());
        if (response.success) {
          setJobData(response.data);
        } else {
          message.error(response.message);
        }
      } catch (error) {
        message.error(error.message);
      }
    };

    getData();
  }, [dispatch, params.id, user.id]);

  return (
    jobData && (
      <div>
        <PageTitle title={jobData.title} />

        <Row>
          <Col span={18}>
            <JobDetails jobData={jobData} />

            <h5 className="underline uppercase my-3">Job Description</h5>
            <span className="pt-2">{jobData.jobDescription}</span>

            {alreadyApplied && (
              <div className="already-applied">
                <span>
                  You have already applied for this job. You can view your
                  application status in the applied jobs section.
                </span>
              </div>
            )}

            <div className="d-flex gap-2 mt-3 justify-content-end">
              <button
                className="primary-outlined-btn"
                onClick={() => navigate("/")}
              >
                CANCEL
              </button>
              {showApplyButton && (
                <button className="primary-contained-btn" onClick={applyNow}>
                  APPLY NOW
                </button>
              )}
            </div>
          </Col>
        </Row>
      </div>
    )
  );
}

export default JobDescription;
