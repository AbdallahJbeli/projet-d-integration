import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const Listenotes = () => {
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8080/notes')
      .then(response => {
        setNotes(response.data);
      })
      .catch(error => {
        console.error('There was an error fetching the notes!', error);
      });
  }, []);

  const handleDelete = (id) => {
    axios.delete(`http://localhost:8080/notes/${id}`)
      .then(response => {
        if (response.data.Status === "Success") {
          setNotes(notes.filter(note => note.id !== id));
        } else {
          alert("Error deleting note");
        }
      })
      .catch(error => {
        console.error('There was an error deleting the note!', error);
      });
  };

  return (
    <div className="container mt-5">
      <div className="card">
        <div className="card-header">
          List of Notes
        </div>
        <div className="card-body">
          <ul className="list-group">
            {notes.map((note) => (
              <li className="list-group-item" key={note.id}>
                <h5>{note.title}</h5>
                <p>{note.content}</p>
                <button className="btn btn-danger" onClick={() => handleDelete(note.id)}>Delete</button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Listenotes;
