// AI Discovery Assistant Service for U'R com
import { eventService } from './eventService';
import { listingService } from './listingService';
import { rankingService } from './rankingService';

export const aiService = {
  async processQuery(text, language = "English", userInterests = []) {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const cleanText = text.toLowerCase().trim();

    if (!cleanText) {
      return {
        reply: "Hey! I'm U'R com. Ask me what is happening around you tonight, find apartments, PGs, or discover events! 🤖",
        recommendations: []
      };
    }

    // 1. Fetch data databases
    const allEvents = await eventService.getEvents();
    const rankedEvents = rankingService.rankItems(allEvents, userInterests);
    const allListings = await listingService.getListings();

    // 2. Route by intents
    const isHousingQuery = cleanText.includes("flat") || 
                           cleanText.includes("room") || 
                           cleanText.includes("housing") || 
                           cleanText.includes("pg") || 
                           cleanText.includes("rent") || 
                           cleanText.includes("to-let") || 
                           cleanText.includes("roommate");

    const isTonightQuery = cleanText.includes("tonight") || 
                           cleanText.includes("today") || 
                           cleanText.includes("party") || 
                           cleanText.includes("nightlife") || 
                           cleanText.includes("do now");

    const isFestivalQuery = cleanText.includes("puja") || 
                            cleanText.includes("festival") || 
                            cleanText.includes("bihu") || 
                            cleanText.includes("cultural");

    // 3. Response Generation
    if (isHousingQuery) {
      const roommatesOnly = cleanText.includes("roommate");
      const pgOnly = cleanText.includes("pg");

      let filteredListings = allListings;
      if (roommatesOnly) filteredListings = allListings.filter(l => l.type === 'Roommate');
      else if (pgOnly) filteredListings = allListings.filter(l => l.type === 'PG');
      else filteredListings = allListings.filter(l => l.type === 'Flat' || l.type === 'Room');

      let reply = "";
      if (language === "Hindi") {
        reply = `मुझे आपके लिए आस-पास कुछ बेहतरीन आवास विकल्प मिले हैं। नीचे देखें:`;
      } else if (language === "Hinglish") {
        reply = `Mujhe aapke liye nearby kuch options mile hain. Check out these properties:`;
      } else if (language === "Assamese") {
        reply = `মই আপোনাৰ বাবে ওচৰতে থকা কিছুমান ভাড়াতীয়া ঘৰ বিচাৰি পাইছোঁ। তলত চাওক:`;
      } else {
        reply = `I found some housing options matching your query near your location. Here are the top suggestions:`;
      }

      return {
        reply,
        recommendations: filteredListings.map(l => ({ ...l, cardType: 'housing' }))
      };
    }

    if (isTonightQuery) {
      const tonightEvents = rankedEvents.filter(evt => evt.date.toLowerCase() === 'tonight');
      
      let reply = "";
      if (language === "Hindi") {
        reply = `आज रात को आपके आस-पास होने वाले सबसे चर्चित कार्यक्रम ये हैं:`;
      } else if (language === "Hinglish") {
        reply = `Aaj raat ke liye trending parties and events ye rahe:`;
      } else if (language === "Assamese") {
        reply = `আজি নিশাটোৰ বাবে আপোনাৰ ওচৰত থকা আটাইতকৈ ধুনীয়া অনুষ্ঠানসমূহ:`;
      } else {
        reply = `Here is what is happening around you tonight! These events are trending with high U'R Scores:`;
      }

      return {
        reply,
        recommendations: tonightEvents.map(e => ({ ...e, cardType: 'event' }))
      };
    }

    if (isFestivalQuery) {
      const festEvents = rankedEvents.filter(evt => evt.category === 'Festivals' || evt.tags.includes('Culture'));

      let reply = "";
      if (language === "Hindi") {
        reply = `आस-पास होने वाले सांस्कृतिक और त्योहारों के कार्यक्रम:`;
      } else if (language === "Hinglish") {
        reply = `Apne nearby festival aur cultural events check kijiye:`;
      } else if (language === "Assamese") {
        reply = `ওচৰ-পাজৰে থকা সাংস্কৃতিক আৰু উৎসৱৰ কাৰ্যসূচীসমূহ:`;
      } else {
        reply = `Discover cultural programs, Pujas, and local festivals happening in your city:`;
      }

      return {
        reply,
        recommendations: festEvents.map(e => ({ ...e, cardType: 'event' }))
      };
    }

    // Default recommendation: general trending near you
    let reply = "";
    if (language === "Hindi") {
      reply = `यहाँ आज आपके शहर में सबसे अधिक ट्रेंड करने वाली चीजें हैं:`;
    } else if (language === "Hinglish") {
      reply = `Ye rahe aapki city me sabse zyada trending happening right now:`;
    } else if (language === "Assamese") {
      reply = `আপোনাৰ চহৰত বৰ্তমান ট্ৰেণ্ডিং হৈ থকা কিছুমান অনুষ্ঠান:`;
    } else {
      reply = `I ranked the top activities and listings around you. Check out these highly recommended options:`;
    }

    return {
      reply,
      recommendations: rankedEvents.slice(0, 3).map(e => ({ ...e, cardType: 'event' }))
    };
  }
};
