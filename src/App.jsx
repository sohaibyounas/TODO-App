import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "./pages/auth/Login";
import ToDoList from "./components/ToDoList.jsx";

const App = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/todoList" element={<ToDoList />} />
      </Routes>
      {/* <Login /> */}
    </>
  );
};

export default App;
