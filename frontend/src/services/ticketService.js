const API_URL = "http://localhost:8083/api/tickets";

export const getTickets = async () => {
  const response = await fetch(API_URL);

  if (!response.ok) {
    const errorText = await response.text();
    console.error("GET tickets error:", errorText);
    throw new Error("Failed to fetch tickets");
  }

  return response.json();
};

export const getTicketById = async (id) => {
  const response = await fetch(`${API_URL}/${id}`);

  if (!response.ok) {
    const errorText = await response.text();
    console.error("GET ticket by ID error:", errorText);
    throw new Error("Failed to fetch ticket");
  }

  return response.json();
};

export const createTicket = async (ticket) => {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(ticket),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Create ticket error:", errorText);
    throw new Error("Failed to create ticket");
  }

  return response.json();
};

export const updateTicket = async (id, ticket) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(ticket),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Update ticket error:", errorText);
    throw new Error("Failed to update ticket");
  }

  return response.json();
};

export const deleteTicket = async (id) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Delete ticket error:", errorText);
    throw new Error("Failed to delete ticket");
  }

  return response.text();
};

export const assignTechnician = async (id, technician) => {
  const response = await fetch(
    `${API_URL}/${id}/assign?technician=${encodeURIComponent(technician)}`,
    {
      method: "PUT",
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Assign technician error:", errorText);
    throw new Error("Failed to assign technician");
  }

  return response.json();
};

export const addAdminComment = async (id, comment) => {
  const response = await fetch(
    `${API_URL}/${id}/admin-comment?comment=${encodeURIComponent(comment)}`,
    {
      method: "PUT",
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Add admin comment error:", errorText);
    throw new Error("Failed to add admin comment");
  }

  return response.json();
};

export const updateTicketStatus = async (id, status, resolutionNotes = "") => {
  const response = await fetch(
    `${API_URL}/${id}/status?status=${encodeURIComponent(
      status
    )}&resolutionNotes=${encodeURIComponent(resolutionNotes)}`,
    {
      method: "PUT",
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Update status error:", errorText);
    throw new Error("Failed to update ticket status");
  }

  return response.json();
};

export const completeTicket = async (id, resolutionNotes = "") => {
  const response = await fetch(
    `${API_URL}/${id}/complete?resolutionNotes=${encodeURIComponent(
      resolutionNotes
    )}`,
    {
      method: "PUT",
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Complete ticket error:", errorText);
    throw new Error("Failed to complete ticket");
  }

  return response.json();
};