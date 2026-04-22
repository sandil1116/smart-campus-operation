import { useEffect, useState } from "react";
import { getTickets, completeTicket } from "../services/ticketService";

function TechnicianTicketManagement() {
  const [tickets, setTickets] = useState([]);
  const [technicianName, setTechnicianName] = useState("");
  const [message, setMessage] = useState("");

  const loadTickets = async () => {
    try {
      const data = await getTickets();
      setTickets(data);
    } catch (error) {
      console.error(error);
      setMessage("Failed to load tickets");
    }
  };

  useEffect(() => {
    loadTickets();
  }, []);

  const assignedTickets = tickets.filter(
    (ticket) =>
      ticket.assignedTechnician &&
      ticket.assignedTechnician.toLowerCase() === technicianName.toLowerCase()
  );

  const handleCompleteTicket = async (ticketId) => {
    const resolutionNotes = prompt("Enter resolution notes:");
    if (!resolutionNotes) return;

    try {
      await completeTicket(ticketId, resolutionNotes);
      setMessage("Ticket marked as DONE successfully");
      await loadTickets();
    } catch (error) {
      console.error(error);
      setMessage("Failed to complete ticket");
    }
  };

  return (
    <div style={{ padding: "20px", color: "white" }}>
      <h2>Technician Ticket Management</h2>

      <div style={{ marginBottom: "20px" }}>
        <label>Technician / Staff Name</label>
        <br />
        <input
          type="text"
          value={technicianName}
          onChange={(e) => setTechnicianName(e.target.value)}
          placeholder="Enter your assigned name"
          style={{ width: "300px", padding: "8px" }}
        />
      </div>

      {message && <p>{message}</p>}

      {!technicianName ? (
        <p>Enter your technician/staff name to view assigned tickets.</p>
      ) : assignedTickets.length === 0 ? (
        <p>No tickets assigned to this technician/staff member.</p>
      ) : (
        assignedTickets.map((ticket) => (
          <div
            key={ticket.id}
            style={{
              border: "1px solid gray",
              borderRadius: "8px",
              padding: "15px",
              marginBottom: "12px",
              maxWidth: "700px",
            }}
          >
            <h3>{ticket.title}</h3>
            <p>{ticket.description}</p>

            <p>
              <strong>Created By:</strong> {ticket.createdByName || "N/A"} (
              {ticket.createdByRole || "N/A"})
            </p>
            <p>
              <strong>Category:</strong> {ticket.category || "N/A"}
            </p>
            <p>
              <strong>Priority:</strong> {ticket.priority || "N/A"}
            </p>
            <p>
              <strong>Status:</strong> {ticket.status || "OPEN"}
            </p>
            <p>
              <strong>Admin Comment:</strong>{" "}
              {ticket.adminComment || "No admin comment yet"}
            </p>
            <p>
              <strong>Resolution Notes:</strong>{" "}
              {ticket.resolutionNotes || "Not resolved yet"}
            </p>

            <button onClick={() => handleCompleteTicket(ticket.id)}>
              Mark as DONE
            </button>
          </div>
        ))
      )}
    </div>
  );
}

export default TechnicianTicketManagement;