// Reports, Trust & Safety Service for U'R com

let mockReports = [
  {
    id: "REP-9104",
    title: "Suspicious Rental Advance Request",
    targetId: "hse-02",
    targetTitle: "Private Room in Beltola",
    category: "Rental Scam",
    status: "Reviewing",
    date: "2026-08-14",
    details: "Host asking for safety deposit before showing the room.",
    reporter: "Bigyat Sharma"
  }
];

export const reportService = {
  async getReports() {
    return [...mockReports];
  },

  async fileReport(report) {
    const newReport = {
      id: `REP-${Math.floor(1000 + Math.random() * 9000)}`,
      title: report.title || "Safety / Verification Issue",
      targetId: report.targetId || "",
      targetTitle: report.targetTitle || "Local Listing",
      category: report.category || "General Feedback",
      status: "Submitted",
      date: new Date().toLocaleDateString(),
      details: report.details || "",
      reporter: report.reporter || "Anonymous User"
    };

    mockReports = [newReport, ...mockReports];
    return newReport;
  }
};
