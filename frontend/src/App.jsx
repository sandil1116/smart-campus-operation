import { useState } from "react";
import CreateTicket from "./pages/CreateTicket";
import AdminTicketManagement from "./pages/AdminTicketManagement";
import TechnicianTicketManagement from "./pages/TechnicianTicketManagement";

function App() {
  const [role, setRole] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();

    if (username === "student" && password === "123") {
      setRole("student");
    } else if (username === "lecturer" && password === "123") {
      setRole("lecturer");
    } else if (username === "admin" && password === "123") {
      setRole("admin");
    } else if (username === "tech" && password === "123") {
      setRole("technician");
    } else {
      alert("Invalid login");
    }
  };

  const logout = () => {
    setRole("");
    setUsername("");
    setPassword("");
  };

  if (!role) {
    return (
      <div style={{ padding: "40px", color: "white", textAlign: "center" }}>
        <h1>Smart Campus Ticket System</h1>
        <h2>Login</h2>

        <form onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={{ padding: "10px", width: "250px", marginBottom: "10px" }}
          />
          <br />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ padding: "10px", width: "250px", marginBottom: "10px" }}
          />
          <br />

          <button type="submit" style={{ padding: "10px 25px" }}>
            Login
          </button>
        </form>

        <p>Student: student / 123</p>
        <p>Lecturer: lecturer / 123</p>
        <p>Admin: admin / 123</p>
        <p>Technician: tech / 123</p>
      </div>
    );
  }

  return (
    <div>
      <div style={{ padding: "15px", textAlign: "right" }}>
        <button onClick={logout}>Logout</button>
      </div>

      <h1 style={{ textAlign: "center", color: "white" }}>
        Smart Campus Ticket System
      </h1>

      {(role === "student" || role === "lecturer") && <CreateTicket />}

      {role === "admin" && <AdminTicketManagement />}

      {role === "technician" && <TechnicianTicketManagement />}
    </div>
  );
}

export default App;