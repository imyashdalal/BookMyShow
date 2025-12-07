// Seed data for Critic Reviews
// Each movie gets 5-10 unique critic reviews from different publications

const criticProfiles = [
  { name: "Roger Ebert", publication: "Chicago Sun-Times" },
  { name: "Peter Travers", publication: "Rolling Stone" },
  { name: "A.O. Scott", publication: "The New York Times" },
  { name: "Manohla Dargis", publication: "The New York Times" },
  { name: "Richard Roeper", publication: "Chicago Sun-Times" },
  { name: "David Edelstein", publication: "New York Magazine" },
  { name: "Owen Gleiberman", publication: "Variety" },
  { name: "Lisa Schwarzbaum", publication: "Entertainment Weekly" },
  { name: "Kenneth Turan", publication: "Los Angeles Times" },
  { name: "Todd McCarthy", publication: "The Hollywood Reporter" },
  { name: "Stephanie Zacharek", publication: "Time Magazine" },
  { name: "Justin Chang", publication: "Los Angeles Times" },
  { name: "Rajeev Masand", publication: "CNN-News18" },
  { name: "Anupama Chopra", publication: "Film Companion" },
  { name: "Taran Adarsh", publication: "Bollywood Hungama" },
  { name: "Sudhir Srinivasan", publication: "The Hindu" },
  { name: "Baradwaj Rangan", publication: "Film Companion" },
  { name: "Saibal Chatterjee", publication: "NDTV" },
  { name: "Raja Sen", publication: "Rediff.com" },
  { name: "Shubhra Gupta", publication: "Indian Express" },
];

const criticReviewTemplates = {
  // Exceptional (4.5-5.0)
  exceptional: [
    "A masterpiece of cinema that transcends the boundaries of its genre. Every frame is meticulously crafted, and the performances are nothing short of extraordinary. This is filmmaking at its absolute finest.",
    "An unforgettable cinematic experience that will be remembered for generations. The director's vision is executed with stunning precision, creating a work of art that resonates on multiple levels.",
    "Brilliant, bold, and breathtaking. This film sets a new standard for excellence. The narrative complexity is matched only by the emotional depth of its characters.",
    "A tour de force that showcases the very best of contemporary cinema. The technical achievements are matched by profound storytelling that stays with you long after the credits roll.",
    "Absolutely phenomenal! A rare gem that combines artistic vision with mass appeal. The craftsmanship on display is simply remarkable.",
    "This is what great cinema looks like. Every element works in perfect harmony to create something truly special. A must-watch for any serious film enthusiast.",
  ],
  
  // Excellent (4.0-4.5)
  excellent: [
    "A thoroughly entertaining and well-crafted film that delivers on all fronts. The performances are stellar, and the direction is confident and assured.",
    "Impressive storytelling with exceptional technical execution. While not perfect, it's a highly engaging experience that showcases tremendous skill.",
    "A remarkable achievement that balances entertainment with substance. The film's strengths far outweigh any minor weaknesses.",
    "Superbly directed with outstanding performances. The narrative keeps you hooked from start to finish, making it a highly recommended watch.",
    "An excellent piece of filmmaking that demonstrates why cinema remains such a powerful medium. Highly entertaining and emotionally resonant.",
    "Strong on all technical fronts with compelling performances. A thoroughly satisfying cinematic experience that delivers more than expected.",
  ],
  
  // Good (3.5-4.0)
  good: [
    "A solid and entertaining film that accomplishes what it sets out to do. The performances are good, and the production values are impressive.",
    "Well-executed with moments of brilliance. While it has some minor flaws, the overall experience is quite enjoyable and worth your time.",
    "A competent and engaging film that succeeds more often than it stumbles. The cast delivers strong performances in a well-told story.",
    "Entertaining and well-made, though not groundbreaking. It's a quality piece of cinema that satisfies its genre requirements admirably.",
    "A good watch with several standout moments. The filmmakers clearly know their craft, even if the final product isn't quite exceptional.",
    "Solidly entertaining with impressive technical work. It may not reinvent the wheel, but it's a smooth and enjoyable ride nonetheless.",
  ],
  
  // Average (3.0-3.5)
  average: [
    "A decent effort with some good moments, but it doesn't quite come together as successfully as it could have. Still worth watching for fans of the genre.",
    "Competently made with flashes of inspiration, but ultimately feels somewhat conventional. The execution is professional, if not particularly memorable.",
    "A mixed bag that has both strengths and weaknesses. Some aspects shine while others feel underdeveloped, resulting in an uneven experience.",
    "Adequately entertaining but lacking that special spark to make it truly memorable. It's serviceable without being particularly distinguished.",
    "Hits the expected marks without exceeding them. A safe, middle-of-the-road effort that plays it too cautiously at times.",
    "Neither great nor terrible, just solidly average. It fulfills its basic requirements without taking many risks or achieving greatness.",
  ],
  
  // Below Average (2.5-3.0)
  belowAverage: [
    "Despite some individual merits, the film struggles to overcome its fundamental flaws. The execution doesn't match the ambition.",
    "A disappointing effort that fails to capitalize on its potential. There are good ideas here, but the execution leaves much to be desired.",
    "Watchable but forgettable. The film never quite finds its footing, resulting in an experience that's more frustrating than fulfilling.",
    "While not without its moments, the film is hampered by uneven pacing and questionable creative choices. It's a letdown given the talent involved.",
  ],
};

// Function to generate critic reviews for all movies
function generateCriticReviews(movieIds) {
  const reviews = [];
  
  movieIds.forEach((movieId, movieIndex) => {
    // Each movie gets 5-10 critic reviews
    const numReviews = 5 + Math.floor(Math.random() * 6); // Random between 5-10
    const usedCritics = new Set();
    
    for (let i = 0; i < numReviews; i++) {
      // Ensure unique critic per movie
      let critic;
      let attempts = 0;
      do {
        critic = criticProfiles[Math.floor(Math.random() * criticProfiles.length)];
        attempts++;
      } while (usedCritics.has(`${critic.name}-${critic.publication}`) && attempts < 50);
      
      if (usedCritics.has(`${critic.name}-${critic.publication}`)) {
        continue;
      }
      
      usedCritics.add(`${critic.name}-${critic.publication}`);
      
      // Determine rating tier based on distribution
      // 30% exceptional, 35% excellent, 20% good, 10% average, 5% below average
      const rand = Math.random();
      let rating, reviewCategory;
      
      if (rand < 0.30) {
        rating = 4.5 + Math.random() * 0.5; // 4.5-5.0
        reviewCategory = 'exceptional';
      } else if (rand < 0.65) {
        rating = 4.0 + Math.random() * 0.5; // 4.0-4.5
        reviewCategory = 'excellent';
      } else if (rand < 0.85) {
        rating = 3.5 + Math.random() * 0.5; // 3.5-4.0
        reviewCategory = 'good';
      } else if (rand < 0.95) {
        rating = 3.0 + Math.random() * 0.5; // 3.0-3.5
        reviewCategory = 'average';
      } else {
        rating = 2.5 + Math.random() * 0.5; // 2.5-3.0
        reviewCategory = 'belowAverage';
      }
      
      // Round to 1 decimal place
      rating = Math.round(rating * 10) / 10;
      
      // Pick a random review from the category
      const reviewTexts = criticReviewTemplates[reviewCategory];
      const review = reviewTexts[Math.floor(Math.random() * reviewTexts.length)];
      
      // Random review date within the last year
      const reviewDate = new Date();
      reviewDate.setDate(reviewDate.getDate() - Math.floor(Math.random() * 365));
      
      reviews.push({
        movieId,
        criticName: critic.name,
        publication: critic.publication,
        rating,
        review,
        reviewDate,
      });
    }
  });
  
  return reviews;
}

module.exports = { generateCriticReviews, criticProfiles, criticReviewTemplates };
