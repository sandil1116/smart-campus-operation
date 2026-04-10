const API_URL = "http://localhost:8083/api/tickets";

export const getTickets = async () => {
  const response = await fetch(API_URL);

  if (!response.ok) {
    throw new Error("Failed to fetch tickets");
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
    throw new Error("Failed to create ticket");
  }

  return response.json();
};