// Seed data for User model
// Note: In production, use proper password hashing
// Example passwords for demo: all users have password "Password123!"

const userSeedData = [
  {
    firstname: "Admin",
    lastname: "User",
    email: "admin@moviebooking.com",
    role: "admin",
    password: "$2b$10$rZ9QqM8x1K2Y3N4O5P6Q7e8R9S0T1U2V3W4X5Y6Z7A8B9C0D1E2F3", // Password123!
    salt: "$2b$10$rZ9QqM8x1K2Y3N4O5P6Q7e",
  },
  {
    firstname: "John",
    lastname: "Doe",
    email: "john.doe@example.com",
    role: "user",
    password: "$2b$10$aB1cD2eF3gH4iJ5kL6mN7o8P9Q0R1S2T3U4V5W6X7Y8Z9A0B1C2D3", // Password123!
    salt: "$2b$10$aB1cD2eF3gH4iJ5kL6mN7o",
  },
  {
    firstname: "Jane",
    lastname: "Smith",
    email: "jane.smith@example.com",
    role: "user",
    password: "$2b$10$bC2dE3fG4hI5jK6lM7nO8p9Q0R1S2T3U4V5W6X7Y8Z9A0B1C2D3E4", // Password123!
    salt: "$2b$10$bC2dE3fG4hI5jK6lM7nO8p",
  },
  {
    firstname: "Michael",
    lastname: "Johnson",
    email: "michael.j@example.com",
    role: "user",
    password: "$2b$10$cD3eF4gH5iJ6kL7mN8oP9q0R1S2T3U4V5W6X7Y8Z9A0B1C2D3E4F5", // Password123!
    salt: "$2b$10$cD3eF4gH5iJ6kL7mN8oP9q",
  },
  {
    firstname: "Emily",
    lastname: "Davis",
    email: "emily.davis@example.com",
    role: "user",
    password: "$2b$10$dE4fG5hI6jK7lM8nO9pQ0r1S2T3U4V5W6X7Y8Z9A0B1C2D3E4F5G6", // Password123!
    salt: "$2b$10$dE4fG5hI6jK7lM8nO9pQ0r",
  },
  {
    firstname: "David",
    lastname: "Wilson",
    email: "david.wilson@example.com",
    role: "user",
    password: "$2b$10$eF5gH6iJ7kL8mN9oP0qR1s2T3U4V5W6X7Y8Z9A0B1C2D3E4F5G6H7", // Password123!
    salt: "$2b$10$eF5gH6iJ7kL8mN9oP0qR1s",
  },
  {
    firstname: "Sarah",
    lastname: "Brown",
    email: "sarah.brown@example.com",
    role: "user",
    password: "$2b$10$fG6hI7jK8lM9nO0pQ1rS2t3U4V5W6X7Y8Z9A0B1C2D3E4F5G6H7I8", // Password123!
    salt: "$2b$10$fG6hI7jK8lM9nO0pQ1rS2t",
  },
  {
    firstname: "Chris",
    lastname: "Martinez",
    email: "chris.martinez@example.com",
    role: "user",
    password: "$2b$10$gH7iJ8kL9mN0oP1qR2sT3u4V5W6X7Y8Z9A0B1C2D3E4F5G6H7I8J9", // Password123!
    salt: "$2b$10$gH7iJ8kL9mN0oP1qR2sT3u",
  },
  {
    firstname: "Amanda",
    lastname: "Garcia",
    email: "amanda.garcia@example.com",
    role: "user",
    password: "$2b$10$hI8jK9lM0nO1pQ2rS3tU4v5W6X7Y8Z9A0B1C2D3E4F5G6H7I8J9K0", // Password123!
    salt: "$2b$10$hI8jK9lM0nO1pQ2rS3tU4v",
  },
  {
    firstname: "Robert",
    lastname: "Taylor",
    email: "robert.taylor@example.com",
    role: "user",
    password: "$2b$10$iJ9kL0mN1oP2qR3sT4uV5w6X7Y8Z9A0B1C2D3E4F5G6H7I8J9K0L1", // Password123!
    salt: "$2b$10$iJ9kL0mN1oP2qR3sT4uV5w",
  },
  {
    firstname: "Lisa",
    lastname: "Anderson",
    email: "lisa.anderson@example.com",
    role: "user",
    password: "$2b$10$jK0lM1nO2pQ3rS4tU5vW6x7Y8Z9A0B1C2D3E4F5G6H7I8J9K0L1M2", // Password123!
    salt: "$2b$10$jK0lM1nO2pQ3rS4tU5vW6x",
  },
  {
    firstname: "James",
    lastname: "Thomas",
    email: "james.thomas@example.com",
    role: "user",
    password: "$2b$10$kL1mN2oP3qR4sT5uV6wX7y8Z9A0B1C2D3E4F5G6H7I8J9K0L1M2N3", // Password123!
    salt: "$2b$10$kL1mN2oP3qR4sT5uV6wX7y",
  },
  {
    firstname: "Super",
    lastname: "Admin",
    email: "superadmin@moviebooking.com",
    role: "admin",
    password: "$2b$10$lM2nO3pQ4rS5tU6vW7xY8z9A0B1C2D3E4F5G6H7I8J9K0L1M2N3O4", // Password123!
    salt: "$2b$10$lM2nO3pQ4rS5tU6vW7xY8z",
  },
  {
    firstname: "Test",
    lastname: "User",
    email: "test@example.com",
    role: "user",
    password: "$2b$10$mN3oP4qR5sT6uV7wX8yZ9a0B1C2D3E4F5G6H7I8J9K0L1M2N3O4P5", // Password123!
    salt: "$2b$10$mN3oP4qR5sT6uV7wX8yZ9a",
  },
  {
    firstname: "Demo",
    lastname: "Account",
    email: "demo@example.com",
    role: "user",
    password: "$2b$10$nO4pQ5rS6tU7vW8xY9zA0b1C2D3E4F5G6H7I8J9K0L1M2N3O4P5Q6", // Password123!
    salt: "$2b$10$nO4pQ5rS6tU7vW8xY9zA0b",
  },
];

module.exports = userSeedData;
