// Ticket Management Service for NeighbourAI

let mockTickets = [
  {
    id: "PLUM-2048",
    title: "Water leakage in Block A corridor",
    category: "Plumbing",
    status: "Assigned", // Received, Assigned, InProgress, Resolved
    date: "2026-08-14",
    time: "10:30 AM",
    technician: "Ramesh Sharma (Senior Plumber)",
    progress: 2, // 1: Received, 2: Assigned, 3: In Progress, 4: Resolved
    description: "Major leakage from pipe joint near the fire extinguisher cabinet."
  },
  {
    id: "GYM-1011",
    title: "Gym Access Card query",
    category: "Amenities",
    status: "Resolved",
    date: "2026-08-12",
    time: "04:15 PM",
    technician: "Arup Roy (Society Office)",
    progress: 4,
    description: "My NFC access card wasn't working at the gym door scanner."
  }
];

export const ticketService = {
  async getTickets() {
    return [...mockTickets];
  },

  async createTicket(ticket) {
    const newTicket = {
      id: ticket.id || `TKT-${Math.floor(1000 + Math.random() * 9000)}`,
      title: ticket.title || "General Maintenance",
      category: ticket.category || "General",
      status: ticket.status || "Received",
      date: ticket.date || new Date().toLocaleDateString(),
      time: ticket.time || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      technician: ticket.technician || "Assigning soon...",
      progress: ticket.progress || 1,
      description: ticket.description || ""
    };
    mockTickets = [newTicket, ...mockTickets];
    return newTicket;
  },

  async updateTicketStatus(id, status, progress, technician = null) {
    mockTickets = mockTickets.map(tkt => {
      if (tkt.id === id) {
        return {
          ...tkt,
          status,
          progress,
          ...(technician ? { technician } : {})
        };
      }
      return tkt;
    });
    return mockTickets.find(tkt => tkt.id === id);
  }
};
