import React from "react";
import "../styles/workflow.css";

const Stage = ({ title, children }) => (
  <div className="wf-stage">
    <div className="wf-stage-title">{title}</div>
    <div className="wf-stage-body">{children}</div>
    <div className="wf-stage-footer">GEMINI: pending</div>
  </div>
);

const Workflow = () => {
  return (
    <div className="workflow-page">
      <h2 className="workflow-heading">Workflow</h2>

      <div className="workflow-container">
        <Stage title="Ideas/Drafts">Details / tasks go here.</Stage>
        <Stage title="Planning">Details / tasks go here.</Stage>
        <Stage title="Review">Details / tasks go here.</Stage>
        <Stage title="Update">Details / tasks go here.</Stage>
        <Stage title="Ready-TO-Post">Details / tasks go here.</Stage>
      </div>

      <p className="workflow-note">Automation will be driven by GEMINI API integrations per stage.</p>
    </div>
  );
};

export default Workflow;
