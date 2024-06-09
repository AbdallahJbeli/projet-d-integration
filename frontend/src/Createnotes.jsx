import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const Createnotes = () => {
  const [values, setValues] = useState({
    title: '',
    content: ''
  });
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    axios.post('http://localhost:8080/create-notes', values)
      .then(res => {
        if (res.data.Status === "Success") {
          navigate('/list-notes'); // Ensure this matches the path in App.js
        } else {
          alert("Error");
        }
      })
      .catch(err => console.error('Error during adding notes:', err));
  };

  return (
    <div className="container mt-5">
      <div className="card">
        <div className="card-header">
          Create a Note
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="noteTitle" className="form-label">Title</label>
              <input
                type="text"
                className="form-control"
                id="noteTitle"
                value={values.title}
                onChange={e => setValues({ ...values, title: e.target.value })}
                placeholder="Enter note title"
              />
            </div>
            <div className="mb-3">
              <label htmlFor="noteContent" className="form-label">Content</label>
              <textarea
                className="form-control"
                id="noteContent"
                rows="3"
                value={values.content}
                onChange={e => setValues({ ...values, content: e.target.value })}
                placeholder="Enter note content"
              ></textarea>
            </div>
            <button type="submit" className="btn btn-primary">Create Note</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Createnotes;
