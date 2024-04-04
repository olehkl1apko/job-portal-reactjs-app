const JobDetails = ({ jobData }) => {
  const jobDetails = [
    { label: "Company", value: jobData.company },
    { label: "Location", value: jobData.location?.toUpperCase() },
    { label: "Salary", value: jobData.salary },
    { label: "Experience", value: `${jobData.experience} Years` },
    { label: "Notice Period", value: `${jobData.noticePeriod} Days` },
    { label: "Job Type", value: jobData.jobType },
    { label: "Industry", value: jobData.industry?.toUpperCase() },
    { label: "Posted On", value: jobData.postedOn },
    { label: "Last Date To Apply", value: jobData.lastDateToApply },
    { label: "Posted By", value: jobData.postedByUserName },
  ];

  return (
    <div className="d-flex flex-column gap-1">
      {jobDetails.map((detail, index) => (
        <div className="d-flex justify-content-between" key={index}>
          <span>{detail.label}</span>
          <span>{detail.value}</span>
        </div>
      ))}
    </div>
  );
};

export default JobDetails;
