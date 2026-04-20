import { useEffect, useRef, useState } from "react";
import {
  getTickets,
  createTicket,
  updateTicket,
  deleteTicket,
} from "../services/ticketService";

function CreateTicket() {
  const formRef = useRef(null);

  const [tickets, setTickets] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    priority: "High",
    createdByRole: "STUDENT",
    createdByName: "",
  });

  const [loading, setLoading] = useState(false);
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

  const resetForm = () => {
    setEditingId(null);
    setFormData({
      title: "",
      description: "",
      category: "",
      priority: "High",
      createdByRole: "STUDENT",
      createdByName: "",
    });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      if (editingId) {
        await updateTicket(editingId, formData);
        setMessage("Ticket updated successfully");
      } else {
        await createTicket(formData);
        setMessage("Ticket created successfully");
      }

      resetForm();
      await loadTickets();
    } catch (error) {
      console.error(error);
      setMessage("Failed to save ticket");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (ticket) => {
    setEditingId(ticket.id);

    setFormData({
      title: ticket.title || "",
      description: ticket.description || "",
      category: ticket.category || "",
      priority: ticket.priority || "High",
      createdByRole: ticket.createdByRole || "STUDENT",
      createdByName: ticket.createdByName || "",
    });

    setTimeout(() => {
      formRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 100);
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this ticket?"
    );

    if (!confirmDelete) return;

    try {
      await deleteTicket(id);
      setMessage("Ticket deleted successfully");
      await loadTickets();
    } catch (error) {
      console.error(error);
      setMessage("Failed to delete ticket");
    }
  };

  return (
    <div style={{ padding: "20px", color: "white" }}>
      <h2 ref={formRef}>{editingId ? "Update Ticket" : "Create Ticket"}</h2>

      <form onSubmit={handleSubmit} style={{ marginBottom: "30px" }}>
        <div style={{ marginBottom: "10px" }}>
          <label>Your Name</label>
          <br />
          <input
            type="text"
            name="createdByName"
            value={formData.createdByName}
            onChange={handleChange}
            required
            placeholder="Enter your name"
            style={{ width: "300px", padding: "8px" }}
          />
        </div>

        <div style={{ marginBottom: "10px" }}>
          <label>Role</label>
          <br />
          <select
            name="createdByRole"
            value={formData.createdByRole}
            onChange={handleChange}
            required
            style={{ width: "320px", padding: "8px" }}
          >
            <option value="STUDENT">Student</option>
            <option value="LECTURER">Lecturer</option>
          </select>
        </div>

        <div style={{ marginBottom: "10px" }}>
          <label>Title</label>
          <br />
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            style={{ width: "300px", padding: "8px" }}
          />
        </div>

        <div style={{ marginBottom: "10px" }}>
          <label>Description</label>
          <br />
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows="4"
            style={{ width: "300px", padding: "8px" }}
          />
        </div>

        <div style={{ marginBottom: "10px" }}>
          <label>Category</label>
          <br />
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
            style={{ width: "320px", padding: "8px" }}
          >
            <option value="">Select category</option>
            <option value="Academic System">Academic System</option>
            <option value="IT / Network">IT / Network</option>
            <option value="Facility">Facility</option>
            <option value="Equipment">Equipment</option>
            <option value="Safety">Safety</option>
            <option value="Cleaning">Cleaning</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div style={{ marginBottom: "10px" }}>
          <label>Priority</label>
          <br />
          <select
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            style={{ width: "320px", padding: "8px" }}
          >
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>

        <button type="submit" disabled={loading} style={{ padding: "10px 20px" }}>
          {loading ? "Saving..." : editingId ? "Update Ticket" : "Create Ticket"}
        </button>

        {editingId && (
          <button
            type="button"
            onClick={resetForm}
            style={{ padding: "10px 20px", marginLeft: "10px" }}
          >
            Cancel Edit
          </button>
        )}
      </form>

      {message && <p>{message}</p>}

      <h2>My Tickets</h2>

      {tickets.length === 0 ? (
        <p>No tickets found</p>
      ) : (
        tickets.map((ticket) => (
          <div
            key={ticket.id}
            style={{
              border: "1px solid gray",
              padding: "15px",
              marginBottom: "10px",
              borderRadius: "8px",
              maxWidth: "550px",
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
              {ticket.assignedTechnician || "Not assigned yet"}
            </p>

            <p>
              <strong>Admin Comment:</strong>{" "}
              {ticket.adminComment || "No admin comment yet"}
            </p>

            <p>
              <strong>Resolution Notes:</strong>{" "}
              {ticket.resolutionNotes || "Not resolved yet"}
            </p>

            <button onClick={() => handleEdit(ticket)} style={{ marginRight: "8px" }}>
              Edit
            </button>

            <button onClick={() => handleDelete(ticket.id)}>Delete</button>
          </div>
        ))
      )}
    </div>
  );
}

export default CreateTicket;