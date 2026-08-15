// Ranking and U'R Score Service for U'R com

export const rankingService = {
  // Configurable ranking formula
  calculateScore(item) {
    if (!item) return 5.0;

    let popularityPoints = 0;
    
    // Interested users weight
    const interested = item.interestedCount || 0;
    if (interested > 200) popularityPoints += 3.0;
    else if (interested > 100) popularityPoints += 2.0;
    else if (interested > 50) popularityPoints += 1.5;
    else if (interested > 10) popularityPoints += 1.0;
    else popularityPoints += 0.5;

    // Saves weight
    const saves = item.saves || 0;
    if (saves > 50) popularityPoints += 1.5;
    else if (saves > 20) popularityPoints += 1.0;
    else if (saves > 5) popularityPoints += 0.5;

    // Verification bonus
    let verificationBonus = 0;
    if (item.verificationStatus === 'Verified Organizer' || item.verificationStatus === 'Verified Owner') {
      verificationBonus = 2.0;
    } else if (item.verificationStatus === 'Verified Event') {
      verificationBonus = 1.5;
    } else if (item.verificationStatus === 'Community Verified') {
      verificationBonus = 1.0;
    }

    // Freshness & quality weight
    const rating = item.rating || 4.0;
    const ratingWeight = (rating / 5) * 3; // Max 3.0

    // Base score calculation
    let score = popularityPoints + verificationBonus + ratingWeight;

    // Cap score at 9.9 for realism (hard to get a perfect 10!)
    if (score > 9.9) score = 9.9;
    if (score < 4.0) score = 4.0; // base floor for listings

    return parseFloat(score.toFixed(1));
  },

  // Ranks listing items, optionally boosting by user interests
  rankItems(items, userInterests = []) {
    const scored = items.map(item => {
      const baseScore = this.calculateScore(item);
      
      // Personalization boost
      let personalBoost = 0;
      if (userInterests && userInterests.length > 0) {
        const matchesInterest = userInterests.some(interest => 
          item.category?.toLowerCase() === interest.toLowerCase() ||
          item.tags?.some(tag => tag.toLowerCase() === interest.toLowerCase())
        );
        if (matchesInterest) {
          personalBoost = 0.5; // Small boost for matching user interests
        }
      }

      const finalScore = Math.min(9.9, baseScore + personalBoost);

      return {
        ...item,
        urScore: finalScore
      };
    });

    // Sort descending by score
    return scored.sort((a, b) => b.urScore - a.urScore);
  }
};
