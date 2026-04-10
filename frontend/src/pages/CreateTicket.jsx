import { useEffect, useState } from "react";
import { getTickets, createTicket } from "../services/ticketService";

function CreateTicket() {
  const [tickets, setTickets] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "High",
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
      await createTicket(formData);
      setMessage("Ticket created successfully");

      setFormData({
        title: "",
        description: "",
        priority: "High",
      });

      loadTickets();
    } catch (error) {
      console.error(error);
      setMessage("Failed to create ticket");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px", color: "white" }}>
      <h2>Create Ticket</h2>

      <form onSubmit={handleSubmit} style={{ marginBottom: "30px" }}>
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
          {loading ? "Submitting..." : "Create Ticket"}
        </button>
      </form>

      {message && <p>{message}</p>}

      <h2>All Tickets</h2>

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
              maxWidth: "500px",
            }}
          >
            <h3>{ticket.title}</h3>
            <p>{ticket.description}</p>
            <p>
              <strong>Priority:</strong> {ticket.priority}
            </p>
          </div>
        ))
      )}
    </div>
  );
}

export default CreateTicket;