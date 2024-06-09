import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from "./Register";
import Home from "./Home";
import Login from "./Login";
import Createnotes from "./Createnotes";
import Listenotes from "./Listenotes";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/create-notes" element={<Createnotes />} />
          <Route path="/list-notes" element={<Listenotes />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
