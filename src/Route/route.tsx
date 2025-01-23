import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "../Login/index";
import Register from "../Register/index";

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
