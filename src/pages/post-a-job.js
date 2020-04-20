import React, { useState } from "react";
import PostAJobForm from "../components/form/PostAJobForm";
import StatusBar from "../components/form/StatusBar";
import JobTemplate from "../components/JobTemplate";
import JobPostingConfirmation from "../components/JobPostingConfirmation";

import {db, storage} from '../firebase/firebase'
import firebase from 'firebase'


const PostAJob = () => {
  const [status, setStatus] = useState(1);

  const [jobData, setJobData] = useState();

  const [companyLogo, setcompanyLogo] = useState(undefined);

  function receivingJobData(e) {
    setJobData(e);
    setStatus(2);
  }

  function recievingLogo2(logo) {
    setcompanyLogo(logo);
  }

  function recievingTemplateApproval(e) {
    setStatus(3);
    console.log(companyLogo)
    sendJobToDB({jobData, companyLogo});
  }

  function sendJobToDB(data) {
    const logoFileName = `${new Date().getTime()}${data.companyLogo.name}`

    const postDate = firebase.firestore.Timestamp.fromDate(new Date())

    const uploadTask = storage.ref(`images/${logoFileName}`).put(companyLogo)

    uploadTask.then(
      db.collection('jobs').doc().set({
        approved: false,
        companyEmail: data.jobData.companyEmail,
        companyLogo: logoFileName,
        companyName: data.jobData.companyName,
        companyWebsite: data.jobData.companyWebsite,
        companyHQ: data.jobData.companyHQ,
        companyDescription: data.jobData.companyDescription,
        howToApply: data.jobData.howToApply,
        jobDescription: data.jobData.jobDescription,
        jobtitle: data.jobData.jobTitle,
        positionType: data.jobData.positionType,
        postedAt: postDate,
        roleFocus: data.jobData.roleFocus
      })
    )
  }

  return (
    <div className="container mx-auto mt-24 md:mt-32 p-2">
      <h1 className="text-lg md:text-2xl text-blue-500 font-bold text-center leading-snug">
        Inexperienced doesn’t mean incapable. <br />
        Fill your role with ambition.
      </h1>

      <StatusBar props={status} />
      {status === 1 && !jobData && (
        <PostAJobForm
          recievingLogo2={recievingLogo2}
          receivingJobData={receivingJobData}
        />
      )}

      {status === 2 && jobData && (
        <>
          <JobTemplate
            props={jobData}
            logo={companyLogo}
          />
          <button className="btn btn-blue mt-8" onClick=    {recievingTemplateApproval}>
            Approve
          </button>
        </>
      )}

      {status === 3 && jobData && <JobPostingConfirmation props={jobData} />}
    </div>
  );
};

export default PostAJob;
