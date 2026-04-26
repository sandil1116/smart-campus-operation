import { useEffect, useState } from "react";
import {
  getTickets,
  assignTechnician,
  addAdminComment,
  updateTicketStatus,
} from "../services/ticketService";

function AdminTicketManagement() {
  const [tickets, setTickets] = useState([]);
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

  const handleAssignTechnician = async (ticketId) => {
    const technician = prompt("Enter technician/staff name:");
    if (!technician) return;

    try {
      await assignTechnician(ticketId, technician);
      setMessage("Technician assigned successfully");
      await loadTickets();
    } catch (error) {
      console.error(error);
      setMessage("Failed to assign technician");
    }
  };

  const handleAdminComment = async (ticketId) => {
    const comment = prompt("Enter admin comment:");
    if (!comment) return;

    try {
      await addAdminComment(ticketId, comment);
      setMessage("Admin comment added successfully");
      await loadTickets();
    } catch (error) {
      console.error(error);
      setMessage("Failed to add admin comment");
    }
  };

  const handleStatusUpdate = async (ticketId, status) => {
    try {
      await updateTicketStatus(ticketId, status);
      setMessage(`Ticket status updated to ${status}`);
      await loadTickets();
    } catch (error) {
      console.error(error);
      setMessage("Failed to update ticket status");
    }
  };

  return (
    <div style={{ padding: "20px", color: "white" }}>
      <h2>Admin Ticket Management</h2>

      {message && <p>{message}</p>}

      {tickets.length === 0 ? (
        <p>No tickets available</p>
      ) : (
        tickets.map((ticket) => (
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
              <strong>Assigned Technician:</strong>{" "}
              {ticket.assignedTechnician || "Not assigned"}
            </p>
            <p>
              <strong>Admin Comment:</strong>{" "}
              {ticket.adminComment || "No admin comment yet"}
            </p>
            <p>
              <strong>Resolution Notes:</strong>{" "}
              {ticket.resolutionNotes || "Not resolved yet"}
            </p>

            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              <button onClick={() => handleAssignTechnician(ticket.id)}>
                Assign Technician
              </button>

              <button onClick={() => handleAdminComment(ticket.id)}>
                Add Admin Comment
              </button>

              <button onClick={() => handleStatusUpdate(ticket.id, "IN_PROGRESS")}>
                Mark In Progress
              </button>

              <button onClick={() => handleStatusUpdate(ticket.id, "REJECTED")}>
                Reject Ticket
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default AdminTicketManagement;