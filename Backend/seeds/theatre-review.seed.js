// Seed data for Theatre Reviews
// Each theatre gets 15-20 unique reviews from different users

const theatreReviewTemplates = [
  // Positive Reviews
  {
    rating: 5,
    review: "Absolutely fantastic experience! The seating is incredibly comfortable with great legroom. The sound and screen quality are top-notch. The staff is very courteous and helpful.",
    categories: { seating: 5, soundQuality: 5, screenQuality: 5, cleanliness: 5, foodAndBeverages: 5 },
  },
  {
    rating: 5,
    review: "Best theatre in the area! Crystal clear picture quality and immersive sound. The cleanliness is maintained impeccably. Great food options too!",
    categories: { seating: 5, soundQuality: 5, screenQuality: 5, cleanliness: 5, foodAndBeverages: 4 },
  },
  {
    rating: 5,
    review: "Premium movie-watching experience! The Dolby Atmos sound is mind-blowing. Seats are plush and recline perfectly. Worth every penny!",
    categories: { seating: 5, soundQuality: 5, screenQuality: 5, cleanliness: 4, foodAndBeverages: 5 },
  },
  {
    rating: 4,
    review: "Great theatre with excellent facilities. The IMAX screen is huge and the sound system is powerful. Could improve the food menu variety a bit.",
    categories: { seating: 4, soundQuality: 5, screenQuality: 5, cleanliness: 4, foodAndBeverages: 3 },
  },
  {
    rating: 5,
    review: "Wonderful ambiance and top-quality equipment. Staff is professional and helpful. The lobby area is well-designed and spacious.",
    categories: { seating: 5, soundQuality: 5, screenQuality: 4, cleanliness: 5, foodAndBeverages: 4 },
  },
  {
    rating: 4,
    review: "Very good experience overall. Comfortable seating and good sound quality. The 3D glasses are clean and well-maintained. Parking is convenient.",
    categories: { seating: 4, soundQuality: 4, screenQuality: 4, cleanliness: 4, foodAndBeverages: 4 },
  },
  {
    rating: 5,
    review: "Outstanding theatre! The picture clarity is exceptional even in the back rows. Air conditioning is perfect. Premium food options available.",
    categories: { seating: 4, soundQuality: 5, screenQuality: 5, cleanliness: 5, foodAndBeverages: 5 },
  },
  {
    rating: 4,
    review: "Love this place! Recliner seats are super comfortable. Sound system creates an immersive experience. Washrooms are clean and well-stocked.",
    categories: { seating: 5, soundQuality: 4, screenQuality: 4, cleanliness: 5, foodAndBeverages: 3 },
  },
  {
    rating: 5,
    review: "Best movie experience ever! The 4DX seats with motion effects are amazing. Screen size is perfect. Staff maintains excellent hygiene standards.",
    categories: { seating: 5, soundQuality: 5, screenQuality: 5, cleanliness: 5, foodAndBeverages: 4 },
  },
  {
    rating: 4,
    review: "Really impressed with the quality. Screen angles are perfect from all seats. Snack counter has good variety. Online booking process is smooth.",
    categories: { seating: 4, soundQuality: 4, screenQuality: 5, cleanliness: 4, foodAndBeverages: 4 },
  },
  
  // Mixed Reviews
  {
    rating: 3,
    review: "Good theatre but could be better. Sound quality is excellent but seats could use an upgrade. Food is okay but a bit overpriced.",
    categories: { seating: 3, soundQuality: 5, screenQuality: 4, cleanliness: 3, foodAndBeverages: 2 },
  },
  {
    rating: 4,
    review: "Decent experience. The screen quality is good but the air conditioning is sometimes too cold. Staff is friendly and responsive.",
    categories: { seating: 4, soundQuality: 4, screenQuality: 4, cleanliness: 4, foodAndBeverages: 3 },
  },
  {
    rating: 3,
    review: "Average theatre. Picture quality is fine but sound could be better balanced. Cleanliness is maintained but seats show some wear.",
    categories: { seating: 3, soundQuality: 3, screenQuality: 4, cleanliness: 3, foodAndBeverages: 3 },
  },
  {
    rating: 4,
    review: "Nice theatre with modern facilities. Seating arrangement is good. Food quality is decent but the queue at the counter is often long.",
    categories: { seating: 4, soundQuality: 4, screenQuality: 4, cleanliness: 4, foodAndBeverages: 3 },
  },
  {
    rating: 3,
    review: "Okay experience. The screen is good but the sound feels a bit loud at times. Parking space is limited. Washrooms need better maintenance.",
    categories: { seating: 3, soundQuality: 3, screenQuality: 4, cleanliness: 2, foodAndBeverages: 3 },
  },
  {
    rating: 4,
    review: "Pretty good theatre. Seats are comfortable and screen is clear. Staff could be more attentive. Food options are standard cinema fare.",
    categories: { seating: 4, soundQuality: 4, screenQuality: 4, cleanliness: 3, foodAndBeverages: 3 },
  },
  {
    rating: 3,
    review: "Mixed feelings. Great projection quality but legroom is cramped. Snacks are fresh but expensive. Overall okay for occasional visits.",
    categories: { seating: 2, soundQuality: 4, screenQuality: 5, cleanliness: 3, foodAndBeverages: 2 },
  },
  {
    rating: 4,
    review: "Good value for money. Picture and sound are clear. Seats could be more spacious. The mobile app for booking works well.",
    categories: { seating: 3, soundQuality: 4, screenQuality: 4, cleanliness: 4, foodAndBeverages: 4 },
  },
  {
    rating: 3,
    review: "Acceptable theatre. Equipment is good but venue needs some renovation. Staff is helpful. Food counter needs more options.",
    categories: { seating: 3, soundQuality: 4, screenQuality: 4, cleanliness: 3, foodAndBeverages: 2 },
  },
  {
    rating: 4,
    review: "Nice place to watch movies. Screen quality is excellent. Seating is comfortable. Just wish they had better snack options and pricing.",
    categories: { seating: 4, soundQuality: 4, screenQuality: 5, cleanliness: 4, foodAndBeverages: 3 },
  },
];

// Function to generate reviews for all theatres
// This will be called from the main seeding script
function generateTheatreReviews(theatreIds, userIds) {
  const reviews = [];
  
  theatreIds.forEach((theatreId, theatreIndex) => {
    // Each theatre gets 15-20 reviews
    const numReviews = 15 + Math.floor(Math.random() * 6); // Random between 15-20
    const usedUserIds = new Set();
    
    for (let i = 0; i < numReviews; i++) {
      // Ensure unique user per theatre
      let userId;
      let attempts = 0;
      do {
        userId = userIds[Math.floor(Math.random() * userIds.length)];
        attempts++;
      } while (usedUserIds.has(userId.toString()) && attempts < 50);
      
      if (usedUserIds.has(userId.toString())) {
        continue; // Skip if we can't find a unique user
      }
      
      usedUserIds.add(userId.toString());
      
      // Pick a random review template
      const template = theatreReviewTemplates[Math.floor(Math.random() * theatreReviewTemplates.length)];
      
      // Add some variation to ratings
      const ratingVariation = Math.random() < 0.3 ? (Math.random() < 0.5 ? -1 : 1) : 0;
      const finalRating = Math.max(1, Math.min(5, template.rating + ratingVariation));
      
      // Add variation to category ratings
      const categories = {};
      for (const [key, value] of Object.entries(template.categories)) {
        const variation = Math.random() < 0.4 ? (Math.random() < 0.5 ? -1 : 1) : 0;
        categories[key] = Math.max(1, Math.min(5, value + variation));
      }
      
      reviews.push({
        theatreId,
        userId,
        rating: finalRating,
        review: template.review,
        categories,
        isVerifiedBooking: Math.random() > 0.3, // 70% verified bookings
      });
    }
  });
  
  return reviews;
}

module.exports = { generateTheatreReviews, theatreReviewTemplates };
