import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button, message, Table } from "antd";
import moment from "moment";

function IncidentList({ onEdit, onDelete }) {
  const [incidents, setIncidents] = useState([]);

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);


  const handleFetchList = (page, pageSize) => {
    axios
    .post("/rest/v1/incident/incident_list_all", { page, pageSize })
    .then((response) => {
      const data = response.data.data.data;
      console.log(data);
      setIncidents(response.data.data.data || []);
      setPage(response.data.data.page)
      setPageSize(response.data.data.pageSize)
      setTotal(response.data.data.totalCount)
    })
    .catch((error) => {
      console.log(error)
      message.error('There was an error fetching the incidents!')
    });
  }

  useEffect(() => {
    handleFetchList(page, pageSize)
  }, []);

  const columns = [
    {
      title: "id",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "title",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "description",
      dataIndex: "description",
      key: "description",
      render: (text, record, index) => {
        return <span>{record.description}</span>;
      },
    },
    {
      title: "time",
      dataIndex: "time",
      key: "time",
      render: (text, record, index) => {
        return (
          <span>
            {moment(record.startTime).format("YYYY-MM-DD")} {"--"}{moment(record.endTime).format("YYYY-MM-DD")}
          </span>
        );
      },
    },
    {
      title: "remark",
      dataIndex: "remark",
      key: "remark",
      render: (text, record, index) => {
        return (
          <span>
            {record.remark}
          </span>
        );
      },
    },
    {
      title: "creater",
      dataIndex: "creater",
      key: "creater",
      render: (text, record, index) => {
        return (
          <span>
            {record.createdBy}
          </span>
        );
      },
    },
    {
      title: "action",
      dataIndex: "action",
      key: "action",
      render: (text, record, index) => {
        return (
          <>
            <Button type="primary" onClick={() => onEdit(record)} style={{ marginRight: "5px" }}>
              Edit
            </Button>
            <Button onClick={() => onDelete(record.id)}>Delete</Button>
          </>
        );
      },
    },
  ];

  return (
    <Table
      pagination={{
        pageSize,
        current: page,
        total,
        showSizeChanger: true,
        pageSizeOptions:[10,20,30],
        onShowSizeChange: (current, size) => {
          console.log(current, size)
          handleFetchList(current, size)
        },
        showTotal:(total) => `total: ${total} items`,
        onChange: (page, pageSize) => {
          handleFetchList(page, pageSize)
        }
      }}
      style={{ marginTop: "20px" }}
      columns={columns}
      dataSource={incidents}
    />
  );
}

export default IncidentList;
