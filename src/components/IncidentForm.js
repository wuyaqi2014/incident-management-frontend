import React, { useState, useEffect } from "react";
import axios from "axios";
import { Input, Button, DatePicker, Row, Col, message } from "antd";
import moment from "moment";

const { RangePicker } = DatePicker;

function IncidentForm({ incidentToEdit, onSave }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [remark, setRemark] = useState("");

  useEffect(() => {
    if (incidentToEdit) {
      setTitle(incidentToEdit.title);
      setDescription(incidentToEdit.description);
      setStartTime(moment(incidentToEdit.startTime));
      setEndTime(moment(incidentToEdit.endTime));
      setRemark(incidentToEdit.remark);
    }
  }, [incidentToEdit]);

  const handleSubmit = (event) => {
    event.preventDefault();
    const incident = { title, description, startTime: startTime.valueOf(), endTime: endTime.valueOf(), remark };
    if (incidentToEdit) {
      axios
        .put(`/rest/v1/incident/update_incident/${incidentToEdit.id}`, incident)
        .then((response) => {
          console.log(response)
          if (response.data.result === 1) {
            onSave(response.data);
          } else {
            message.error(response.data.errorMsg);
          }
        }).catch((error) => {
          const errorMessage = error.response?.data?.errorMsg || "There was an error creating the incident!";
          message.error(errorMessage);
          console.error("There was an error update the incident!", error);
        });
    } else {
      axios
        .post("/rest/v1/incident/create_incident", incident)
        .then((response) => {
          console.log(response)
          if (response.data.result === 1) {
            onSave(response.data);
          } else {
            message.error(response.data.errorMsg);
          }
        }).catch((error) => {
          const errorMessage = error.response?.data?.errorMsg || "There was an error creating the incident!";
          message.error(errorMessage);
          console.error("There was an error creating the incident!", error);
        });
    }

    setTitle("");
    setDescription("");
    setStartTime("");
    setEndTime("");
    setRemark("");
  };

  return (
    <>
      <Row justify={"space-around"}>
        <Col>
          <Row wrap={false} align={"middle"}>
            title: <Input style={{ marginLeft: "10px" }} value={title} onChange={(e) => setTitle(e.target.value)} />
          </Row>
        </Col>
        <Col>
          <Row wrap={false} align={"middle"}>
            description:{" "}
            <Input
              style={{ marginLeft: "10px" }}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />{" "}
          </Row>
        </Col>
        <Col>
          <Row wrap={false} align={"middle"}>
            timeRange:
            <RangePicker
              style={{ marginLeft: "10px" }}
              value={[startTime, endTime]}
              onChange={(v) => {
                setStartTime(v?.[0]);
                setEndTime(v?.[1]);
              }}
            />
          </Row>
        </Col>
        <Col>
          <Row wrap={false} align={"middle"}>
            remark: <Input style={{ marginLeft: "10px" }} value={remark} onChange={(e) => setRemark(e.target.value)} />{" "}
          </Row>
        </Col>
        <Button type="primary" onClick={handleSubmit}>
          {incidentToEdit ? "Update" : "Add"}
        </Button>
      </Row>
    </>
  );
}

export default IncidentForm;
