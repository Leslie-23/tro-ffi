import { useState } from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";

// import "./App.css";

import Dashboard from "./pages/Dashboard";
import LoginPage from "./pages/Login";
import Signup from "./pages/Signup";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
