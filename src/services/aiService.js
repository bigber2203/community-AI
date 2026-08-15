// AI Assistant Service for NeighbourAI

const SOCIETY_RULES = [
  {
    keywords: ["gym", "fitness", "exercise"],
    question: "What are the gym timings?",
    answer: "The community gym is open daily from 6:00 AM to 10:00 PM. Clean shoes are mandatory, and residents must sign in at the entry desk.",
    ruleRef: "Section 4.2 - Recreation & Amenities"
  },
  {
    keywords: ["pet", "dog", "cat", "animal"],
    question: "Are pets allowed in the garden?",
    answer: "Yes, pets are allowed in the central garden, but they must be kept on a leash at all times. Owners are responsible for cleaning up after their pets.",
    ruleRef: "Section 7.1 - Animal Control & Pets"
  },
  {
    keywords: ["garbage", "trash", "waste", "dustbin"],
    question: "When is garbage collected?",
    answer: "Door-to-door dry and wet waste collection starts at 8:30 AM every morning. Please segregate your waste before disposal.",
    ruleRef: "Section 3.5 - Waste Management"
  },
  {
    keywords: ["pool", "swimming", "swim"],
    question: "Can guests use the swimming pool?",
    answer: "Guests are permitted to use the swimming pool only if accompanied by a host resident. A guest pass (₹50/day) must be generated in the app.",
    ruleRef: "Section 4.5 - Swimming Pool Guidelines"
  },
  {
    keywords: ["hall", "clubhouse", "booking", "celebration", "party"],
    question: "How do I book the community hall?",
    answer: "The community hall can be booked up to 3 months in advance via the 'Amenities' tab in the app. A refundable security deposit of ₹5,000 is required.",
    ruleRef: "Section 5.1 - Clubhouse & Hall Bookings"
  },
  {
    keywords: ["visitor", "parking", "car", "guest"],
    question: "What are the visitor parking rules?",
    answer: "Visitors must park only in the designated 'V-parking' slots near Gate 2. Overnight visitor parking requires a pre-approved parking pass from the security desk.",
    ruleRef: "Section 2.3 - Parking Regulations"
  }
];

const COMPLAINT_CATEGORIES = [
  { keywords: ["water", "leak", "pipe", "tap", "clog"], category: "Plumbing", prefix: "PLUM" },
  { keywords: ["light", "electricity", "fuse", "power", "switch", "wire"], category: "Electrical", prefix: "ELEC" },
  { keywords: ["lift", "elevator", "escalator"], category: "Lift Maintenance", prefix: "LIFT" },
  { keywords: ["clean", "dirt", "sweep", "dustbin", "garbage", "trash"], category: "Cleaning & Sanitation", prefix: "CLEAN" },
  { keywords: ["security", "gate", "guard", "theft", "stranger"], category: "Security", prefix: "SEC" },
  { keywords: ["noise", "loud", "music", "party", "bark", "drill"], category: "Noise Complaint", prefix: "NOISE" }
];

export const aiService = {
  // Query text processor
  async processQuery(text, language = "English") {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    const cleanText = text.toLowerCase().trim();

    if (!cleanText) {
      return {
        reply: "Please let me know how I can assist you today! 🎙️",
        verified: false
      };
    }

    // 1. Check for complaint patterns
    const isComplaint = cleanText.includes("report") || 
                        cleanText.includes("broken") || 
                        cleanText.includes("not working") || 
                        cleanText.includes("leak") || 
                        cleanText.includes("leakage") || 
                        cleanText.includes("clogged") || 
                        cleanText.includes("noise") || 
                        cleanText.includes("complaint");

    if (isComplaint) {
      let matchedCategory = COMPLAINT_CATEGORIES.find(cat => 
        cat.keywords.some(keyword => cleanText.includes(keyword))
      ) || { category: "General Maintenance", prefix: "MAINT" };

      const ticketId = `${matchedCategory.prefix}-${Math.floor(1000 + Math.random() * 9000)}`;

      let reply = "";
      if (language === "Hindi") {
        reply = `मैंने आपकी शिकायत दर्ज कर ली है। यह ${matchedCategory.category} श्रेणी में है। आपका टिकट नंबर #${ticketId} है। 🛠️`;
      } else if (language === "Hinglish") {
        reply = `Maine aapki complaint register kar li hai. Ye ${matchedCategory.category} category me aati hai. Aapka ticket number #${ticketId} hai!`;
      } else if (language === "Assamese") {
        reply = `মই আপোনাৰ অভিযোগ পঞ্জীয়ন কৰিছোঁ। এইটো ${matchedCategory.category} শ্ৰেণীৰ অধীনত পৰিব। আপোনাৰ টিকট নম্বৰ হৈছে #${ticketId}। 🛠️`;
      } else {
        reply = `I've created a ticket for this ${matchedCategory.category} issue. Your ticket number is #${ticketId} 🛠️. Our team has been notified.`;
      }

      return {
        reply,
        verified: true,
        ticketCreated: true,
        ticketDetails: {
          id: ticketId,
          title: text.replace(/^(report|complaint|there is|someone is)\s+/i, ""),
          category: matchedCategory.category,
          status: "Received",
          date: new Date().toLocaleDateString(),
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          technician: "Assigning soon..."
        }
      };
    }

    // 2. Check for rulebook Q&A patterns
    for (const rule of SOCIETY_RULES) {
      if (rule.keywords.some(keyword => cleanText.includes(keyword))) {
        let reply = rule.answer;
        if (language === "Hindi") {
          reply = `नियमों के अनुसार: ${rule.answer}`;
        } else if (language === "Hinglish") {
          reply = `Society rules ke mutabik: ${rule.answer}`;
        } else if (language === "Assamese") {
          reply = `সমাজৰ নিয়ম অনুসৰি: ${rule.answer}`;
        }

        return {
          reply,
          verified: true,
          ruleRef: rule.ruleRef,
          originalQuestion: rule.question
        };
      }
    }

    // 3. Routing to services
    const isServiceQuery = cleanText.includes("plumber") ||
                           cleanText.includes("electrician") ||
                           cleanText.includes("laundry") ||
                           cleanText.includes("cleaner") ||
                           cleanText.includes("car wash") ||
                           cleanText.includes("repair") ||
                           cleanText.includes("carpenter");

    if (isServiceQuery) {
      let serviceType = "maintenance";
      if (cleanText.includes("plumber")) serviceType = "Plumber";
      else if (cleanText.includes("electrician")) serviceType = "Electrician";
      else if (cleanText.includes("laundry")) serviceType = "Laundry";
      else if (cleanText.includes("clean")) serviceType = "Cleaning";
      else if (cleanText.includes("car")) serviceType = "Car Wash";

      return {
        reply: `I found some local verified ${serviceType} providers available in your community. You can book them immediately through the Services tab! 🧑‍🔧`,
        verified: true,
        routeToTab: "services",
        searchFilter: serviceType
      };
    }

    // 4. Default Chat responses based on language
    if (language === "Hindi") {
      return {
        reply: "मुझे आपके सवाल का सही जवाब नहीं मिला। क्या आप शिकायत दर्ज करना चाहते हैं, या किसी सेवा के बारे में पूछना चाहते हैं?",
        verified: false
      };
    } else if (language === "Hinglish") {
      return {
        reply: "Mujhe iska answer nahi mila. Kya aap koi issue report karna chahte hain, ya help chaiye?",
        verified: false
      };
    } else if (language === "Assamese") {
      return {
        reply: "মই আপোনাৰ প্ৰশ্নৰ সঠিক উত্তৰ বিচাৰি নাপালোঁ। আপুনি কিবা অভিযোগ কৰিব বিচাৰে নেকি?",
        verified: false
      };
    }

    return {
      reply: "I couldn't find a specific answer in the rulebook, but I can register a complaint or help you find a service technician. What would you like me to do? 🏡",
      verified: false
    };
  },

  // Rulebook natural search
  async searchRulebook(query) {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const cleanQuery = query.toLowerCase();

    const matches = SOCIETY_RULES.filter(rule =>
      rule.keywords.some(keyword => cleanQuery.includes(keyword)) ||
      rule.question.toLowerCase().includes(cleanQuery) ||
      rule.answer.toLowerCase().includes(cleanQuery)
    );

    return matches;
  }
};
