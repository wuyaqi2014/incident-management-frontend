import React, { useState } from "react";
import IncidentList from "./components/IncidentList";
import IncidentForm from "./components/IncidentForm";
import axios from "axios";
import { Button, Row } from "antd";
import './App.css'

function App() {
  const [incidentToEdit, setIncidentToEdit] = useState(null);

  const handleEdit = (incident) => {
    setIncidentToEdit(incident);
  };

  const handleDelete = (id) => {
    axios
      .put(`/rest/v1/incident/delete_incident/${id}`)
      .then(() => {
        setIncidentToEdit(null); // Clear form
        window.location.reload(); // Refresh list
      })
      .catch((error) => console.error("There was an error deleting the incident!", error));
  };

  const handleSave = () => {
    setIncidentToEdit(null);
    window.location.reload(); // Refresh list
  };

  return (
    <div className="App">
      <IncidentForm incidentToEdit={incidentToEdit} onSave={handleSave} />
      <IncidentList onEdit={handleEdit} onDelete={handleDelete} />
    </div>
  );
}

export default App;
