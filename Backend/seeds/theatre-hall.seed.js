// Seed data for Theatre Hall model
// Note: Replace theatreRef with actual theatre ObjectId when inserting into DB
// Different theatres have different numbers of halls with varying capacities

const theatreHallSeedData = [
  // Bangalore - PVR INOX Forum Mall (5 halls - Premium multiplex)
  {
    theatreRef: "PVR INOX Forum Mall",
    number: 1,
    seatingCapacity: 280,
  },
  {
    theatreRef: "PVR INOX Forum Mall",
    number: 2,
    seatingCapacity: 220,
  },
  {
    theatreRef: "PVR INOX Forum Mall",
    number: 3,
    seatingCapacity: 180,
  },
  {
    theatreRef: "PVR INOX Forum Mall",
    number: 4,
    seatingCapacity: 150,
  },
  {
    theatreRef: "PVR INOX Forum Mall",
    number: 5,
    seatingCapacity: 120,
  },

  // Bangalore - Cinépolis Royal Meenakshi Mall (7 halls - Large multiplex)
  {
    theatreRef: "Cinépolis Royal Meenakshi Mall",
    number: 1,
    seatingCapacity: 320,
  },
  {
    theatreRef: "Cinépolis Royal Meenakshi Mall",
    number: 2,
    seatingCapacity: 280,
  },
  {
    theatreRef: "Cinépolis Royal Meenakshi Mall",
    number: 3,
    seatingCapacity: 240,
  },
  {
    theatreRef: "Cinépolis Royal Meenakshi Mall",
    number: 4,
    seatingCapacity: 200,
  },
  {
    theatreRef: "Cinépolis Royal Meenakshi Mall",
    number: 5,
    seatingCapacity: 180,
  },
  {
    theatreRef: "Cinépolis Royal Meenakshi Mall",
    number: 6,
    seatingCapacity: 140,
  },
  {
    theatreRef: "Cinépolis Royal Meenakshi Mall",
    number: 7,
    seatingCapacity: 100,
  },

  // Bangalore - INOX Garuda Mall (4 halls - Medium multiplex)
  {
    theatreRef: "INOX Garuda Mall",
    number: 1,
    seatingCapacity: 250,
  },
  {
    theatreRef: "INOX Garuda Mall",
    number: 2,
    seatingCapacity: 200,
  },
  {
    theatreRef: "INOX Garuda Mall",
    number: 3,
    seatingCapacity: 160,
  },
  {
    theatreRef: "INOX Garuda Mall",
    number: 4,
    seatingCapacity: 130,
  },

  // Bangalore - PVR Orion Mall (6 halls - Premium multiplex)
  {
    theatreRef: "PVR Orion Mall",
    number: 1,
    seatingCapacity: 350,
  },
  {
    theatreRef: "PVR Orion Mall",
    number: 2,
    seatingCapacity: 300,
  },
  {
    theatreRef: "PVR Orion Mall",
    number: 3,
    seatingCapacity: 240,
  },
  {
    theatreRef: "PVR Orion Mall",
    number: 4,
    seatingCapacity: 200,
  },
  {
    theatreRef: "PVR Orion Mall",
    number: 5,
    seatingCapacity: 160,
  },
  {
    theatreRef: "PVR Orion Mall",
    number: 6,
    seatingCapacity: 120,
  },

  // Bangalore - Cinépolis Nexus Shantiniketan (3 halls - Boutique multiplex)
  {
    theatreRef: "Cinépolis Nexus Shantiniketan",
    number: 1,
    seatingCapacity: 180,
  },
  {
    theatreRef: "Cinépolis Nexus Shantiniketan",
    number: 2,
    seatingCapacity: 150,
  },
  {
    theatreRef: "Cinépolis Nexus Shantiniketan",
    number: 3,
    seatingCapacity: 120,
  },

  // Mumbai - PVR Phoenix Palladium (8 halls - Premium flagship)
  {
    theatreRef: "PVR Phoenix Palladium",
    number: 1,
    seatingCapacity: 400,
  },
  {
    theatreRef: "PVR Phoenix Palladium",
    number: 2,
    seatingCapacity: 350,
  },
  {
    theatreRef: "PVR Phoenix Palladium",
    number: 3,
    seatingCapacity: 300,
  },
  {
    theatreRef: "PVR Phoenix Palladium",
    number: 4,
    seatingCapacity: 280,
  },
  {
    theatreRef: "PVR Phoenix Palladium",
    number: 5,
    seatingCapacity: 240,
  },
  {
    theatreRef: "PVR Phoenix Palladium",
    number: 6,
    seatingCapacity: 200,
  },
  {
    theatreRef: "PVR Phoenix Palladium",
    number: 7,
    seatingCapacity: 180,
  },
  {
    theatreRef: "PVR Phoenix Palladium",
    number: 8,
    seatingCapacity: 150,
  },

  // Mumbai - INOX R-City Mall (5 halls - Standard multiplex)
  {
    theatreRef: "INOX R-City Mall",
    number: 1,
    seatingCapacity: 280,
  },
  {
    theatreRef: "INOX R-City Mall",
    number: 2,
    seatingCapacity: 220,
  },
  {
    theatreRef: "INOX R-City Mall",
    number: 3,
    seatingCapacity: 180,
  },
  {
    theatreRef: "INOX R-City Mall",
    number: 4,
    seatingCapacity: 160,
  },
  {
    theatreRef: "INOX R-City Mall",
    number: 5,
    seatingCapacity: 140,
  },

  // Mumbai - Cinépolis Seawoods Grand Central (6 halls - Large multiplex)
  {
    theatreRef: "Cinépolis Seawoods Grand Central",
    number: 1,
    seatingCapacity: 320,
  },
  {
    theatreRef: "Cinépolis Seawoods Grand Central",
    number: 2,
    seatingCapacity: 280,
  },
  {
    theatreRef: "Cinépolis Seawoods Grand Central",
    number: 3,
    seatingCapacity: 240,
  },
  {
    theatreRef: "Cinépolis Seawoods Grand Central",
    number: 4,
    seatingCapacity: 200,
  },
  {
    theatreRef: "Cinépolis Seawoods Grand Central",
    number: 5,
    seatingCapacity: 160,
  },
  {
    theatreRef: "Cinépolis Seawoods Grand Central",
    number: 6,
    seatingCapacity: 120,
  },

  // Mumbai - PVR INOX Juhu (4 halls - Premium boutique)
  {
    theatreRef: "PVR INOX Juhu",
    number: 1,
    seatingCapacity: 220,
  },
  {
    theatreRef: "PVR INOX Juhu",
    number: 2,
    seatingCapacity: 180,
  },
  {
    theatreRef: "PVR INOX Juhu",
    number: 3,
    seatingCapacity: 150,
  },
  {
    theatreRef: "PVR INOX Juhu",
    number: 4,
    seatingCapacity: 120,
  },

  // Mumbai - Cinépolis Viviana Mall (7 halls - Large multiplex)
  {
    theatreRef: "Cinépolis Viviana Mall",
    number: 1,
    seatingCapacity: 340,
  },
  {
    theatreRef: "Cinépolis Viviana Mall",
    number: 2,
    seatingCapacity: 300,
  },
  {
    theatreRef: "Cinépolis Viviana Mall",
    number: 3,
    seatingCapacity: 260,
  },
  {
    theatreRef: "Cinépolis Viviana Mall",
    number: 4,
    seatingCapacity: 220,
  },
  {
    theatreRef: "Cinépolis Viviana Mall",
    number: 5,
    seatingCapacity: 180,
  },
  {
    theatreRef: "Cinépolis Viviana Mall",
    number: 6,
    seatingCapacity: 150,
  },
  {
    theatreRef: "Cinépolis Viviana Mall",
    number: 7,
    seatingCapacity: 110,
  },

  // Mumbai - INOX Nariman Point (3 halls - Classic cinema)
  {
    theatreRef: "INOX Nariman Point",
    number: 1,
    seatingCapacity: 200,
  },
  {
    theatreRef: "INOX Nariman Point",
    number: 2,
    seatingCapacity: 160,
  },
  {
    theatreRef: "INOX Nariman Point",
    number: 3,
    seatingCapacity: 130,
  },

  // Nagpur - PVR Emporia Mall (4 halls - Standard multiplex)
  {
    theatreRef: "PVR Emporia Mall",
    number: 1,
    seatingCapacity: 240,
  },
  {
    theatreRef: "PVR Emporia Mall",
    number: 2,
    seatingCapacity: 200,
  },
  {
    theatreRef: "PVR Emporia Mall",
    number: 3,
    seatingCapacity: 160,
  },
  {
    theatreRef: "PVR Emporia Mall",
    number: 4,
    seatingCapacity: 130,
  },

  // Nagpur - Cinépolis City One Mall (5 halls - Standard multiplex)
  {
    theatreRef: "Cinépolis City One Mall",
    number: 1,
    seatingCapacity: 260,
  },
  {
    theatreRef: "Cinépolis City One Mall",
    number: 2,
    seatingCapacity: 220,
  },
  {
    theatreRef: "Cinépolis City One Mall",
    number: 3,
    seatingCapacity: 180,
  },
  {
    theatreRef: "Cinépolis City One Mall",
    number: 4,
    seatingCapacity: 150,
  },
  {
    theatreRef: "Cinépolis City One Mall",
    number: 5,
    seatingCapacity: 120,
  },

  // Nagpur - INOX Jaswant Tuli Mall (3 halls - Medium multiplex)
  {
    theatreRef: "INOX Jaswant Tuli Mall",
    number: 1,
    seatingCapacity: 220,
  },
  {
    theatreRef: "INOX Jaswant Tuli Mall",
    number: 2,
    seatingCapacity: 180,
  },
  {
    theatreRef: "INOX Jaswant Tuli Mall",
    number: 3,
    seatingCapacity: 140,
  },

  // Nagpur - Cinépolis VR Nagpur (6 halls - Large multiplex)
  {
    theatreRef: "Cinépolis VR Nagpur",
    number: 1,
    seatingCapacity: 300,
  },
  {
    theatreRef: "Cinépolis VR Nagpur",
    number: 2,
    seatingCapacity: 260,
  },
  {
    theatreRef: "Cinépolis VR Nagpur",
    number: 3,
    seatingCapacity: 220,
  },
  {
    theatreRef: "Cinépolis VR Nagpur",
    number: 4,
    seatingCapacity: 180,
  },
  {
    theatreRef: "Cinépolis VR Nagpur",
    number: 5,
    seatingCapacity: 150,
  },
  {
    theatreRef: "Cinépolis VR Nagpur",
    number: 6,
    seatingCapacity: 110,
  },

  // Delhi - PVR Select Citywalk (7 halls - Premium multiplex)
  {
    theatreRef: "PVR Select Citywalk",
    number: 1,
    seatingCapacity: 380,
  },
  {
    theatreRef: "PVR Select Citywalk",
    number: 2,
    seatingCapacity: 320,
  },
  {
    theatreRef: "PVR Select Citywalk",
    number: 3,
    seatingCapacity: 280,
  },
  {
    theatreRef: "PVR Select Citywalk",
    number: 4,
    seatingCapacity: 240,
  },
  {
    theatreRef: "PVR Select Citywalk",
    number: 5,
    seatingCapacity: 200,
  },
  {
    theatreRef: "PVR Select Citywalk",
    number: 6,
    seatingCapacity: 160,
  },
  {
    theatreRef: "PVR Select Citywalk",
    number: 7,
    seatingCapacity: 120,
  },

  // Delhi - PVR Priya Vasant Vihar (3 halls - Classic cinema)
  {
    theatreRef: "PVR Priya Vasant Vihar",
    number: 1,
    seatingCapacity: 250,
  },
  {
    theatreRef: "PVR Priya Vasant Vihar",
    number: 2,
    seatingCapacity: 180,
  },
  {
    theatreRef: "PVR Priya Vasant Vihar",
    number: 3,
    seatingCapacity: 140,
  },

  // Delhi - INOX Nehru Place (4 halls - Standard multiplex)
  {
    theatreRef: "INOX Nehru Place",
    number: 1,
    seatingCapacity: 240,
  },
  {
    theatreRef: "INOX Nehru Place",
    number: 2,
    seatingCapacity: 200,
  },
  {
    theatreRef: "INOX Nehru Place",
    number: 3,
    seatingCapacity: 170,
  },
  {
    theatreRef: "INOX Nehru Place",
    number: 4,
    seatingCapacity: 130,
  },

  // Delhi - Cinépolis DLF Place (6 halls - Premium multiplex)
  {
    theatreRef: "Cinépolis DLF Place",
    number: 1,
    seatingCapacity: 320,
  },
  {
    theatreRef: "Cinépolis DLF Place",
    number: 2,
    seatingCapacity: 280,
  },
  {
    theatreRef: "Cinépolis DLF Place",
    number: 3,
    seatingCapacity: 240,
  },
  {
    theatreRef: "Cinépolis DLF Place",
    number: 4,
    seatingCapacity: 200,
  },
  {
    theatreRef: "Cinépolis DLF Place",
    number: 5,
    seatingCapacity: 160,
  },
  {
    theatreRef: "Cinépolis DLF Place",
    number: 6,
    seatingCapacity: 120,
  },

  // Delhi - PVR Rivoli Connaught Place (2 halls - Heritage cinema)
  {
    theatreRef: "PVR Rivoli Connaught Place",
    number: 1,
    seatingCapacity: 300,
  },
  {
    theatreRef: "PVR Rivoli Connaught Place",
    number: 2,
    seatingCapacity: 220,
  },

  // Delhi - INOX Sapphire 83 (5 halls - Standard multiplex)
  {
    theatreRef: "INOX Sapphire 83",
    number: 1,
    seatingCapacity: 280,
  },
  {
    theatreRef: "INOX Sapphire 83",
    number: 2,
    seatingCapacity: 230,
  },
  {
    theatreRef: "INOX Sapphire 83",
    number: 3,
    seatingCapacity: 190,
  },
  {
    theatreRef: "INOX Sapphire 83",
    number: 4,
    seatingCapacity: 150,
  },
  {
    theatreRef: "INOX Sapphire 83",
    number: 5,
    seatingCapacity: 120,
  },
];

module.exports = theatreHallSeedData;
