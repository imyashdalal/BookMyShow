// Seed data for Movie Reviews (User Reviews)
// Each movie gets 15-20 unique user reviews

const movieReviewTemplates = [
  // 5 Star Reviews
  {
    rating: 5,
    review: "Absolutely loved this movie! One of the best films I've watched this year. The story kept me hooked from beginning to end. Highly recommended!",
  },
  {
    rating: 5,
    review: "Mind-blowing! Every scene was perfectly executed. The acting, direction, and cinematography - everything was top-notch. A must-watch masterpiece!",
  },
  {
    rating: 5,
    review: "What an incredible experience! The movie exceeded all my expectations. I was on the edge of my seat throughout. Will definitely watch it again!",
  },
  {
    rating: 5,
    review: "Phenomenal movie! The performances were outstanding and the story was brilliantly told. This is why I love cinema. Don't miss this one!",
  },
  {
    rating: 5,
    review: "Perfect in every way! The emotional depth, stunning visuals, and powerful soundtrack made this an unforgettable cinematic experience.",
  },
  {
    rating: 5,
    review: "Best movie I've seen in years! The storytelling is exceptional and the characters are so well-developed. Left the theatre with tears in my eyes.",
  },
  {
    rating: 5,
    review: "Absolutely brilliant! A perfect blend of entertainment and substance. The director has created something truly special here.",
  },
  
  // 4 Star Reviews
  {
    rating: 4,
    review: "Really enjoyed this movie! Great performances and engaging story. A few minor pacing issues, but overall an excellent watch.",
  },
  {
    rating: 4,
    review: "Fantastic film with stunning visuals and solid acting. Could have been perfect with a slightly tighter script, but still highly entertaining.",
  },
  {
    rating: 4,
    review: "Very good movie! The cast did an amazing job and the story was compelling. Definitely worth watching in theatres.",
  },
  {
    rating: 4,
    review: "Impressive work! Strong performances and beautiful cinematography. Had a great time watching this with family.",
  },
  {
    rating: 4,
    review: "Excellent entertainment! The movie delivers on its promise. Some predictable moments, but the execution makes up for it.",
  },
  {
    rating: 4,
    review: "Great movie experience! Loved the action sequences and emotional moments. The music score was particularly memorable.",
  },
  {
    rating: 4,
    review: "Really well-made film! Engaging from start to finish with some truly memorable scenes. The lead performances were outstanding.",
  },
  {
    rating: 4,
    review: "Thoroughly enjoyed it! Good mix of drama, action, and emotion. The second half was particularly gripping.",
  },
  
  // 3 Star Reviews
  {
    rating: 3,
    review: "Decent movie, worth a watch. The concept was interesting but the execution could have been better. Good performances though.",
  },
  {
    rating: 3,
    review: "Average film with some good moments. The first half was engaging, but it lost steam in the second half. Not bad, not great.",
  },
  {
    rating: 3,
    review: "Okay movie. Has its moments but also some dull stretches. Fine for a one-time watch if you're a fan of the genre.",
  },
  {
    rating: 3,
    review: "Mixed feelings about this one. Some scenes were brilliant while others felt forced. Decent overall but expected more.",
  },
  {
    rating: 3,
    review: "Watchable film with good production values. Story is somewhat predictable but the performances keep it interesting.",
  },
  {
    rating: 3,
    review: "Not bad but could have been much better. Good acting and decent direction, but the script needed more work.",
  },
  {
    rating: 3,
    review: "Average entertainer. Works in parts but doesn't leave a lasting impression. Good for killing time but nothing exceptional.",
  },
  
  // 2 Star Reviews
  {
    rating: 2,
    review: "Disappointing. Had high hopes but the movie failed to deliver. Poor script and weak character development.",
  },
  {
    rating: 2,
    review: "Below expectations. Some good performances wasted on a mediocre story. Could have been so much better.",
  },
  {
    rating: 2,
    review: "Not impressed. The movie drags in many places and the storyline is quite weak. Only for die-hard fans.",
  },
  
  // Additional varied reviews
  {
    rating: 5,
    review: "A cinematic gem! The attention to detail is remarkable. Every actor gave their 100%. This is what great filmmaking looks like!",
  },
  {
    rating: 4,
    review: "Loved the visual effects and action sequences! The story could have been stronger, but it's still a fun ride. Worth the ticket price.",
  },
  {
    rating: 5,
    review: "Emotional roller coaster! Laughed, cried, and cheered throughout. The chemistry between the leads is amazing. A complete package!",
  },
  {
    rating: 4,
    review: "Solid entertainment! Great for the whole family. The music is catchy and the performances are heartfelt. Will recommend to friends.",
  },
  {
    rating: 3,
    review: "Decent attempt. Good performances save an otherwise average script. The cinematography is beautiful though.",
  },
  {
    rating: 5,
    review: "Masterclass in filmmaking! The director's vision is crystal clear in every frame. This will be studied in film schools.",
  },
  {
    rating: 4,
    review: "Engaging thriller that keeps you guessing! Some plot holes but the suspense more than makes up for it. Edge-of-seat experience!",
  },
  {
    rating: 5,
    review: "Pure magic on screen! The special effects are groundbreaking and the story is deeply moving. A landmark film!",
  },
  {
    rating: 3,
    review: "Entertaining in parts. The comedy works well but the drama feels forced. One-time watch for casual viewers.",
  },
  {
    rating: 4,
    review: "Great performances all around! The story is familiar but told with freshness and energy. Left the theatre satisfied.",
  },
  {
    rating: 5,
    review: "Absolutely stunning! The world-building is incredible and the characters feel real. Can't wait for the sequel!",
  },
  {
    rating: 4,
    review: "Well-crafted film with strong emotional core. A few slow moments but overall a very satisfying watch. Good direction!",
  },
  {
    rating: 3,
    review: "Okay film. Good technical aspects but the story doesn't quite click. Still, there's enough here for genre fans.",
  },
];

// Function to generate movie reviews for all movies
function generateMovieReviews(movieIds, userIds) {
  const reviews = [];
  
  movieIds.forEach((movieId, movieIndex) => {
    // Each movie gets 15-20 user reviews
    const numReviews = 15 + Math.floor(Math.random() * 6); // Random between 15-20
    const usedUserIds = new Set();
    
    for (let i = 0; i < numReviews; i++) {
      // Ensure unique user per movie
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
      const template = movieReviewTemplates[Math.floor(Math.random() * movieReviewTemplates.length)];
      
      // Add some variation to ratings (±1 star with 20% probability)
      const ratingVariation = Math.random() < 0.2 ? (Math.random() < 0.5 ? -1 : 1) : 0;
      const finalRating = Math.max(1, Math.min(5, template.rating + ratingVariation));
      
      reviews.push({
        movieId,
        userId,
        rating: finalRating,
        review: template.review,
        isVerifiedBooking: Math.random() > 0.4, // 60% verified bookings
      });
    }
  });
  
  return reviews;
}

module.exports = { generateMovieReviews, movieReviewTemplates };
