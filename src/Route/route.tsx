import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "../Pages/Login/index";
import Register from "../Pages/Register/index";

export default function AppRoute() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Register />} />
      </Routes>
    </Router>
  );
}
