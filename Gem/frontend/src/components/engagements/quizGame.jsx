import React, { useState } from "react";
import {
  Container,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
} from "@mui/material";

const masterQuizQuestions = [
  {
    id: 1,
    question: "What is the capital of France?",
    options: ["Paris", "London", "Berlin", "Rome"],
    correctAnswer: "Paris",
  },
  {
    id: 2,
    question: "Who wrote 'To Kill a Mockingbird'?",
    options: [
      "Harper Lee",
      "Mark Twain",
      "J.K. Rowling",
      "F. Scott Fitzgerald",
    ],
    correctAnswer: "Harper Lee",
  },
  {
    id: 3,
    question: "What is the chemical symbol for water?",
    options: ["H2O", "CO2", "NaCl", "O2"],
    correctAnswer: "H2O",
  },
  {
    id: 4,
    question: "What is the largest planet in our solar system?",
    options: ["Jupiter", "Saturn", "Earth", "Mars"],
    correctAnswer: "Jupiter",
  },
  {
    id: 5,
    question: "Who painted the Mona Lisa?",
    options: [
      "Leonardo da Vinci",
      "Pablo Picasso",
      "Vincent van Gogh",
      "Michelangelo",
    ],
    correctAnswer: "Leonardo da Vinci",
  },
  {
    id: 6,
    question: "What is the currency of Japan?",
    options: ["Yen", "Won", "Dollar", "Rupee"],
    correctAnswer: "Yen",
  },
  {
    id: 7,
    question: "Which planet is known as the Red Planet?",
    options: ["Mars", "Venus", "Earth", "Jupiter"],
    correctAnswer: "Mars",
  },
  {
    id: 8,
    question: "What is the tallest mountain in the world?",
    options: ["Mount Everest", "K2", "Kangchenjunga", "Lhotse"],
    correctAnswer: "Mount Everest",
  },
  {
    id: 9,
    question: "What gas do plants absorb from the atmosphere?",
    options: ["Oxygen", "Nitrogen", "Carbon Dioxide", "Hydrogen"],
    correctAnswer: "Carbon Dioxide",
  },
  {
    id: 10,
    question: "Which animal is known as the King of the Jungle?",
    options: ["Lion", "Tiger", "Elephant", "Bear"],
    correctAnswer: "Lion",
  },
  {
    id: 11,
    question: "What is the smallest prime number?",
    options: ["1", "2", "3", "5"],
    correctAnswer: "2",
  },
  {
    id: 12,
    question: "In which year did the Titanic sink?",
    options: ["1912", "1905", "1920", "1898"],
    correctAnswer: "1912",
  },
  {
    id: 13,
    question: "Which element has the chemical symbol 'O'?",
    options: ["Oxygen", "Gold", "Silver", "Iron"],
    correctAnswer: "Oxygen",
  },
  {
    id: 14,
    question: "Who discovered penicillin?",
    options: ["Alexander Fleming", "Marie Curie", "Isaac Newton", "Albert Einstein"],
    correctAnswer: "Alexander Fleming",
  },
  {
    id: 15,
    question: "What is the capital of Australia?",
    options: ["Canberra", "Sydney", "Melbourne", "Brisbane"],
    correctAnswer: "Canberra",
  },
  {
    id: 16,
    question: "What is the largest mammal in the world?",
    options: ["Blue Whale", "Elephant", "Giraffe", "Great White Shark"],
    correctAnswer: "Blue Whale",
  },
  {
    id: 17,
    question: "What is the main ingredient in guacamole?",
    options: ["Avocado", "Tomato", "Onion", "Pepper"],
    correctAnswer: "Avocado",
  },
  {
    id: 18,
    question: "Who is known as the Father of Geometry?",
    options: ["Euclid", "Archimedes", "Pythagoras", "Newton"],
    correctAnswer: "Euclid",
  },
  {
    id: 19,
    question: "What is the hardest natural substance on Earth?",
    options: ["Diamond", "Gold", "Iron", "Coal"],
    correctAnswer: "Diamond",
  },
  {
    id: 20,
    question: "Which country is known as the Land of the Rising Sun?",
    options: ["Japan", "China", "Thailand", "India"],
    correctAnswer: "Japan",
  },
  {
    id: 21,
    question: "What is the largest continent?",
    options: ["Asia", "Africa", "North America", "South America"],
    correctAnswer: "Asia",
  },
  {
    id: 22,
    question: "Which ocean is the largest?",
    options: ["Pacific Ocean", "Atlantic Ocean", "Indian Ocean", "Arctic Ocean"],
    correctAnswer: "Pacific Ocean",
  },
  {
    id: 23,
    question: "What is the freezing point of water?",
    options: ["0°C", "100°C", "32°F", "212°F"],
    correctAnswer: "0°C",
  },
  {
    id: 24,
    question: "Who is the author of the Harry Potter series?",
    options: [
      "J.K. Rowling",
      "Stephen King",
      "J.R.R. Tolkien",
      "George R.R. Martin",
    ],
    correctAnswer: "J.K. Rowling",
  },
  {
    id: 25,
    question: "Which planet is known for its rings?",
    options: ["Saturn", "Jupiter", "Uranus", "Neptune"],
    correctAnswer: "Saturn",
  },
  {
    id: 26,
    question: "What is the main language spoken in Brazil?",
    options: ["Portuguese", "Spanish", "English", "French"],
    correctAnswer: "Portuguese",
  },
  {
    id: 27,
    question: "Which vitamin is produced when a person is exposed to sunlight?",
    options: ["Vitamin A", "Vitamin B12", "Vitamin C", "Vitamin D"],
    correctAnswer: "Vitamin D",
  },
  {
    id: 28,
    question: "What is the capital of Italy?",
    options: ["Rome", "Venice", "Milan", "Florence"],
    correctAnswer: "Rome",
  },
  {
    id: 29,
    question: "What is the largest organ in the human body?",
    options: ["Skin", "Liver", "Heart", "Lung"],
    correctAnswer: "Skin",
  },
  {
    id: 30,
    question: "Which gas is most abundant in the Earth's atmosphere?",
    options: ["Nitrogen", "Oxygen", "Carbon Dioxide", "Hydrogen"],
    correctAnswer: "Nitrogen",
  },
  {
    id: 31,
    question: "What is the hardest rock?",
    options: ["Diamond", "Granite", "Marble", "Basalt"],
    correctAnswer: "Diamond",
  },
  {
    id: 32,
    question: "Which is the longest river in the world?",
    options: ["Amazon", "Nile", "Yangtze", "Mississippi"],
    correctAnswer: "Nile",
  },
  {
    id: 33,
    question: "Which planet is closest to the Sun?",
    options: ["Mercury", "Venus", "Earth", "Mars"],
    correctAnswer: "Mercury",
  },
  {
    id: 34,
    question: "Who is known for developing the theory of relativity?",
    options: ["Albert Einstein", "Isaac Newton", "Galileo Galilei", "Nikola Tesla"],
    correctAnswer: "Albert Einstein",
  },
  {
    id: 35,
    question: "Which is the smallest country in the world?",
    options: ["Vatican City", "Monaco", "Nauru", "Malta"],
    correctAnswer: "Vatican City",
  },
  {
    id: 36,
    question: "What is the most widely spoken language in the world?",
    options: ["Mandarin", "Spanish", "English", "Hindi"],
    correctAnswer: "Mandarin",
  },
  {
    id: 37,
    question: "What is the boiling point of water?",
    options: ["100°C", "90°C", "212°F", "32°F"],
    correctAnswer: "100°C",
  },
  {
    id: 38,
    question: "Which famous scientist developed the laws of motion?",
    options: ["Isaac Newton", "Albert Einstein", "Galileo Galilei", "Nikola Tesla"],
    correctAnswer: "Isaac Newton",
  },
  {
    id: 39,
    question: "Which ocean lies between Africa and Australia?",
    options: ["Indian Ocean", "Pacific Ocean", "Atlantic Ocean", "Arctic Ocean"],
    correctAnswer: "Indian Ocean",
  },
  {
    id: 40,
    question: "Which animal is known for its ability to change color?",
    options: ["Chameleon", "Octopus", "Cuttlefish", "All of the above"],
    correctAnswer: "All of the above",
  },
  {
    id: 41,
    question: "What is the largest desert in the world?",
    options: ["Sahara", "Arabian", "Gobi", "Kalahari"],
    correctAnswer: "Sahara",
  },
  {
    id: 42,
    question: "Who was the first President of the United States?",
    options: ["George Washington", "Thomas Jefferson", "Abraham Lincoln", "John Adams"],
    correctAnswer: "George Washington",
  },
  {
    id: 43,
    question: "What is the main ingredient in bread?",
    options: ["Flour", "Sugar", "Yeast", "Salt"],
    correctAnswer: "Flour",
  },
  {
    id: 44,
    question: "In which year did World War II end?",
    options: ["1945", "1944", "1939", "1950"],
    correctAnswer: "1945",
  },
  {
    id: 45,
    question: "What is the largest island in the world?",
    options: ["Greenland", "New Guinea", "Borneo", "Madagascar"],
    correctAnswer: "Greenland",
  },
  {
    id: 46,
    question: "Who wrote '1984'?",
    options: ["George Orwell", "Aldous Huxley", "Ray Bradbury", "F. Scott Fitzgerald"],
    correctAnswer: "George Orwell",
  },
  {
    id: 47,
    question: "Which planet has the most moons?",
    options: ["Jupiter", "Saturn", "Mars", "Earth"],
    correctAnswer: "Jupiter",
  },
  {
    id: 48,
    question: "What is the smallest unit of life?",
    options: ["Cell", "Atom", "Molecule", "Organ"],
    correctAnswer: "Cell",
  },
  {
    id: 49,
    question: "Which fruit is known as the king of fruits?",
    options: ["Mango", "Durian", "Banana", "Apple"],
    correctAnswer: "Durian",
  },
  {
    id: 50,
    question: "What is the primary component of the sun?",
    options: ["Hydrogen", "Helium", "Oxygen", "Carbon"],
    correctAnswer: "Hydrogen",
  },
  {
    id: 51,
    question: "Which famous artist is known for the painting 'Starry Night'?",
    options: ["Vincent van Gogh", "Pablo Picasso", "Claude Monet", "Leonardo da Vinci"],
    correctAnswer: "Vincent van Gogh",
  },
  {
    id: 52,
    question: "What is the capital city of Canada?",
    options: ["Ottawa", "Toronto", "Vancouver", "Montreal"],
    correctAnswer: "Ottawa",
  },
  {
    id: 53,
    question: "What is the most spoken language in the world?",
    options: ["Mandarin", "Spanish", "English", "Hindi"],
    correctAnswer: "Mandarin",
  },
  {
    id: 54,
    question: "What type of animal is a Komodo dragon?",
    options: ["Lizard", "Snake", "Bird", "Mammal"],
    correctAnswer: "Lizard",
  },
  {
    id: 55,
    question: "What is the primary ingredient in sushi?",
    options: ["Rice", "Fish", "Seaweed", "Vegetables"],
    correctAnswer: "Rice",
  },
  {
    id: 56,
    question: "Which continent is known as the Dark Continent?",
    options: ["Africa", "Asia", "Europe", "Australia"],
    correctAnswer: "Africa",
  },
  {
    id: 56,
    question: "Which planet is known as the Earth's twin?",
    options: ["Venus", "Mars", "Mercury", "Jupiter"],
    correctAnswer: "Venus",
  },
  {
    id: 57,
    question: "What is the capital of Egypt?",
    options: ["Cairo", "Alexandria", "Giza", "Luxor"],
    correctAnswer: "Cairo",
  },
  {
    id: 58,
    question: "Which gas do humans breathe in to survive?",
    options: ["Oxygen", "Carbon Dioxide", "Nitrogen", "Hydrogen"],
    correctAnswer: "Oxygen",
  },
  {
    id: 59,
    question: "What is the longest bone in the human body?",
    options: ["Femur", "Tibia", "Humerus", "Radius"],
    correctAnswer: "Femur",
  },
  {
    id: 60,
    question: "Which organ is responsible for pumping blood throughout the body?",
    options: ["Liver", "Heart", "Lungs", "Kidneys"],
    correctAnswer: "Heart",
  },
  {
    id: 61,
    question: "What is the main ingredient in chocolate?",
    options: ["Cocoa", "Sugar", "Milk", "Butter"],
    correctAnswer: "Cocoa",
  },
  {
    id: 62,
    question: "Which continent is the Sahara Desert located in?",
    options: ["Africa", "Asia", "Australia", "North America"],
    correctAnswer: "Africa",
  },
  {
    id: 63,
    question: "What is the process of converting sunlight into food called?",
    options: ["Photosynthesis", "Respiration", "Digestion", "Transpiration"],
    correctAnswer: "Photosynthesis",
  },
  {
    id: 64,
    question: "Which element is represented by the symbol 'Na'?",
    options: ["Sodium", "Nitrogen", "Nickel", "Neon"],
    correctAnswer: "Sodium",
  },
  {
    id: 65,
    question: "Who is the author of 'Pride and Prejudice'?",
    options: ["Jane Austen", "Charlotte Brontë", "Emily Brontë", "Mary Shelley"],
    correctAnswer: "Jane Austen",
  },
  {
    id: 66,
    question: "What is the capital of India?",
    options: ["New Delhi", "Mumbai", "Kolkata", "Chennai"],
    correctAnswer: "New Delhi",
  },
  {
    id: 67,
    question: "What is the largest ocean on Earth?",
    options: ["Pacific Ocean", "Atlantic Ocean", "Indian Ocean", "Arctic Ocean"],
    correctAnswer: "Pacific Ocean",
  },
  {
    id: 68,
    question: "Which animal is known for its ability to fly and swim?",
    options: ["Penguin", "Dolphin", "Duck", "Eagle"],
    correctAnswer: "Duck",
  },
  {
    id: 69,
    question: "What is the hardest known natural material?",
    options: ["Diamond", "Emerald", "Ruby", "Sapphire"],
    correctAnswer: "Diamond",
  },
  {
    id: 70,
    question: "What is the capital of Brazil?",
    options: ["Brasília", "Rio de Janeiro", "São Paulo", "Salvador"],
    correctAnswer: "Brasília",
  },
  {
    id: 71,
    question: "Who painted the ceiling of the Sistine Chapel?",
    options: ["Michelangelo", "Raphael", "Leonardo da Vinci", "Donatello"],
    correctAnswer: "Michelangelo",
  },
  {
    id: 72,
    question: "What is the main language spoken in France?",
    options: ["French", "Spanish", "Italian", "German"],
    correctAnswer: "French",
  },
  {
    id: 73,
    question: "Which planet is known for its Great Red Spot?",
    options: ["Jupiter", "Saturn", "Mars", "Venus"],
    correctAnswer: "Jupiter",
  },
  {
    id: 74,
    question: "What is the name of the longest river in South America?",
    options: ["Amazon", "Nile", "Mississippi", "Yangtze"],
    correctAnswer: "Amazon",
  },
  {
    id: 75,
    question: "What is the most abundant gas in the Earth's atmosphere?",
    options: ["Nitrogen", "Oxygen", "Carbon Dioxide", "Helium"],
    correctAnswer: "Nitrogen",
  },
  {
    id: 76,
    question: "What is the largest planet in our solar system?",
    options: ["Jupiter", "Saturn", "Earth", "Mars"],
    correctAnswer: "Jupiter",
  },
  {
    id: 77,
    question: "Which gas is most commonly used in balloons?",
    options: ["Hydrogen", "Helium", "Oxygen", "Nitrogen"],
    correctAnswer: "Helium",
  },
  {
    id: 78,
    question: "Who wrote the play 'Romeo and Juliet'?",
    options: ["William Shakespeare", "Charles Dickens", "Mark Twain", "Jane Austen"],
    correctAnswer: "William Shakespeare",
  },
  {
    id: 79,
    question: "Which planet is known for its rings?",
    options: ["Saturn", "Jupiter", "Uranus", "Neptune"],
    correctAnswer: "Saturn",
  },
  {
    id: 80,
    question: "What is the smallest prime number?",
    options: ["1", "2", "3", "5"],
    correctAnswer: "2",
  },
  {
    id: 81,
    question: "What is the main currency used in Japan?",
    options: ["Yen", "Won", "Dollar", "Euro"],
    correctAnswer: "Yen",
  },
  {
    id: 82,
    question: "In which year did the Titanic sink?",
    options: ["1912", "1905", "1920", "1898"],
    correctAnswer: "1912",
  },
  {
    id: 83,
    question: "What is the chemical symbol for gold?",
    options: ["Au", "Ag", "Pb", "Fe"],
    correctAnswer: "Au",
  },
  {
    id: 84,
    question: "Who discovered penicillin?",
    options: ["Alexander Fleming", "Marie Curie", "Louis Pasteur", "Isaac Newton"],
    correctAnswer: "Alexander Fleming",
  },
  {
    id: 85,
    question: "Which animal is known as the 'King of the Jungle'?",
    options: ["Lion", "Tiger", "Elephant", "Cheetah"],
    correctAnswer: "Lion",
  },
  {
    id: 86,
    question: "What is the main ingredient in guacamole?",
    options: ["Avocado", "Tomato", "Onion", "Pepper"],
    correctAnswer: "Avocado",
  },
  {
    id: 87,
    question: "Which country is known as the Land of the Rising Sun?",
    options: ["China", "Japan", "Thailand", "Vietnam"],
    correctAnswer: "Japan",
  },
  {
    id: 88,
    question: "What is the process by which plants make their food?",
    options: ["Photosynthesis", "Respiration", "Transpiration", "Fermentation"],
    correctAnswer: "Photosynthesis",
  },
  {
    id: 89,
    question: "What is the capital city of Canada?",
    options: ["Toronto", "Ottawa", "Vancouver", "Montreal"],
    correctAnswer: "Ottawa",
  },
  {
    id: 90,
    question: "Which organ in the human body is primarily responsible for detoxification?",
    options: ["Liver", "Kidneys", "Heart", "Lungs"],
    correctAnswer: "Liver",
  },
  {
    id: 91,
    question: "What is the main language spoken in Brazil?",
    options: ["Spanish", "Portuguese", "French", "English"],
    correctAnswer: "Portuguese",
  },
  {
    id: 92,
    question: "What is the hardest natural substance on Earth?",
    options: ["Diamond", "Emerald", "Ruby", "Sapphire"],
    correctAnswer: "Diamond",
  },
  {
    id: 93,
    question: "What is the term for a baby kangaroo?",
    options: ["Cub", "Joey", "Calf", "Pup"],
    correctAnswer: "Joey",
  },
  {
    id: 94,
    question: "Who painted the Mona Lisa?",
    options: ["Leonardo da Vinci", "Vincent van Gogh", "Pablo Picasso", "Claude Monet"],
    correctAnswer: "Leonardo da Vinci",
  },
  {
    id: 95,
    question: "Which planet is known as the Red Planet?",
    options: ["Mars", "Venus", "Earth", "Jupiter"],
    correctAnswer: "Mars",
  },
  {
    id: 96,
    question: "What is the main ingredient in traditional hummus?",
    options: ["Chickpeas", "Lentils", "Fava beans", "Peas"],
    correctAnswer: "Chickpeas",
  },
  {
    id: 97,
    question: "What is the tallest mountain in the world?",
    options: ["K2", "Kangchenjunga", "Mount Everest", "Lhotse"],
    correctAnswer: "Mount Everest",
  },
  {
    id: 98,
    question: "Which planet is closest to the Sun?",
    options: ["Mercury", "Venus", "Earth", "Mars"],
    correctAnswer: "Mercury",
  },
  {
    id: 99,
    question: "What is the largest continent on Earth?",
    options: ["Asia", "Africa", "North America", "Europe"],
    correctAnswer: "Asia",
  },
  {
    id: 100,
    question: "What is the main theme of George Orwell's '1984'?",
    options: ["Totalitarianism", "Romance", "Friendship", "Adventure"],
    correctAnswer: "Totalitarianism",
  },
  {
    id: 101,
    question: "What is the most widely spoken language in the world?",
    options: ["English", "Mandarin Chinese", "Spanish", "Hindi"],
    correctAnswer: "Mandarin Chinese",
  },
  {
    id: 102,
    question: "What is the term for a group of wolves?",
    options: ["Pack", "Herd", "Flock", "Gaggle"],
    correctAnswer: "Pack",
  },
  {
    id: 103,
    question: "What is the capital of France?",
    options: ["Paris", "Rome", "Berlin", "Madrid"],
    correctAnswer: "Paris",
  },
  {
    id: 104,
    question: "Which instrument is used to measure atmospheric pressure?",
    options: ["Barometer", "Thermometer", "Hygrometer", "Anemometer"],
    correctAnswer: "Barometer",
  },
  {
    id: 105,
    question: "What is the currency of the United Kingdom?",
    options: ["Dollar", "Euro", "Pound Sterling", "Yen"],
    correctAnswer: "Pound Sterling",
  },
  {
    id: 106,
    question: "What is the chemical symbol for water?",
    options: ["HO", "H2O", "O2", "H2"],
    correctAnswer: "H2O",
  },
  {
    id: 107,
    question: "Which planet has the most moons?",
    options: ["Mars", "Earth", "Jupiter", "Saturn"],
    correctAnswer: "Jupiter",
  },
  {
    id: 108,
    question: "What is the primary diet of a panda?",
    options: ["Bamboo", "Fruits", "Meat", "Fish"],
    correctAnswer: "Bamboo",
  },
  {
    id: 109,
    question: "Who was the first woman to fly solo across the Atlantic Ocean?",
    options: ["Amelia Earhart", "Bessie Coleman", "Harriet Quimby", "Valentina Tereshkova"],
    correctAnswer: "Amelia Earhart",
  },
  {
    id: 110,
    question: "What is the main function of the white blood cells in the human body?",
    options: ["Transport oxygen", "Fight infections", "Clot blood", "Provide energy"],
    correctAnswer: "Fight infections",
  },
  {
    id: 111,
    question: "What is the chemical formula for table salt?",
    options: ["NaCl", "KCl", "CaCO3", "MgO"],
    correctAnswer: "NaCl",
  },
  {
    id: 112,
    question: "What is the capital of Italy?",
    options: ["Rome", "Venice", "Florence", "Milan"],
    correctAnswer: "Rome",
  },
  {
    id: 113,
    question: "Which gas is responsible for the greenhouse effect?",
    options: ["Oxygen", "Carbon Dioxide", "Nitrogen", "Hydrogen"],
    correctAnswer: "Carbon Dioxide",
  },
  {
    id: 114,
    question: "What is the main purpose of the respiratory system?",
    options: ["Digestion", "Circulation", "Breathing", "Excretion"],
    correctAnswer: "Breathing",
  },
  {
    id: 115,
    question: "What is the most popular sport in the world?",
    options: ["Basketball", "Cricket", "Soccer", "Tennis"],
    correctAnswer: "Soccer",
  },
  {
    id: 116,
    question: "What is the largest land animal?",
    options: ["Elephant", "Giraffe", "Rhino", "Hippo"],
    correctAnswer: "Elephant",
  },
  {
    id: 117,
    question: "What is the most spoken language in the world?",
    options: ["Spanish", "English", "Mandarin", "Hindi"],
    correctAnswer: "Mandarin",
  },
  {
    id: 118,
    question: "What is the term for the study of living organisms?",
    options: ["Biology", "Chemistry", "Physics", "Geology"],
    correctAnswer: "Biology",
  },
  {
    id: 119,
    question: "What is the name of the fairy in Peter Pan?",
    options: ["Tinkerbell", "Cinderella", "Ariel", "Snow White"],
    correctAnswer: "Tinkerbell",
  },
  {
    id: 120,
    question: "What is the fastest land animal?",
    options: ["Cheetah", "Lion", "Horse", "Kangaroo"],
    correctAnswer: "Cheetah",
  },
  {
    id: 121,
    question: "What is the capital city of Australia?",
    options: ["Sydney", "Melbourne", "Canberra", "Brisbane"],
    correctAnswer: "Canberra",
  },
  {
    id: 122,
    question: "Which gas do plants absorb during photosynthesis?",
    options: ["Oxygen", "Carbon Dioxide", "Nitrogen", "Hydrogen"],
    correctAnswer: "Carbon Dioxide",
  },
  {
    id: 123,
    question: "What is the largest mammal in the world?",
    options: ["Blue Whale", "Elephant", "Giraffe", "Great White Shark"],
    correctAnswer: "Blue Whale",
  },
  {
    id: 124,
    question: "Who is known as the Father of Modern Physics?",
    options: ["Isaac Newton", "Albert Einstein", "Galileo Galilei", "Niels Bohr"],
    correctAnswer: "Albert Einstein",
  },
  {
    id: 125,
    question: "What is the primary function of the roots of a plant?",
    options: ["Photosynthesis", "Support", "Water absorption", "Reproduction"],
    correctAnswer: "Water absorption",
  },
  {
    id: 126,
    question: "What is the capital of Egypt?",
    options: ["Cairo", "Alexandria", "Giza", "Luxor"],
    correctAnswer: "Cairo",
  },
  {
    id: 127,
    question: "What is the freezing point of water in Celsius?",
    options: ["0°C", "32°C", "100°C", "50°C"],
    correctAnswer: "0°C",
  },
  {
    id: 128,
    question: "What is the process of converting a liquid into a gas called?",
    options: ["Condensation", "Evaporation", "Sublimation", "Deposition"],
    correctAnswer: "Evaporation",
  },
  {
    id: 129,
    question: "Who wrote 'The Great Gatsby'?",
    options: ["F. Scott Fitzgerald", "Ernest Hemingway", "Mark Twain", "John Steinbeck"],
    correctAnswer: "F. Scott Fitzgerald",
  },
  {
    id: 130,
    question: "Which element is represented by the symbol 'Fe'?",
    options: ["Lead", "Iron", "Copper", "Zinc"],
    correctAnswer: "Iron",
  },
  {
    id: 131,
    question: "Which ocean is the largest?",
    options: ["Atlantic Ocean", "Indian Ocean", "Arctic Ocean", "Pacific Ocean"],
    correctAnswer: "Pacific Ocean",
  },
  {
    id: 132,
    question: "What is the capital city of India?",
    options: ["New Delhi", "Mumbai", "Kolkata", "Chennai"],
    correctAnswer: "New Delhi",
  },
  {
    id: 133,
    question: "What is the main component of the human body?",
    options: ["Water", "Oxygen", "Carbon", "Hydrogen"],
    correctAnswer: "Water",
  },
  {
    id: 134,
    question: "Which planet is known for its prominent ring system?",
    options: ["Jupiter", "Saturn", "Neptune", "Uranus"],
    correctAnswer: "Saturn",
  },
  {
    id: 135,
    question: "What is the capital city of the United States?",
    options: ["New York", "Washington, D.C.", "Los Angeles", "Chicago"],
    correctAnswer: "Washington, D.C.",
  },
  {
    id: 136,
    question: "What is the main ingredient in beer?",
    options: ["Barley", "Corn", "Rice", "Wheat"],
    correctAnswer: "Barley",
  },
  {
    id: 137,
    question: "What is the name of the first manned mission to the Moon?",
    options: ["Apollo 11", "Apollo 12", "Gemini 8", "Mercury 7"],
    correctAnswer: "Apollo 11",
  },
  {
    id: 138,
    question: "What is the primary function of the skin?",
    options: ["Protection", "Absorption", "Secretion", "Digestion"],
    correctAnswer: "Protection",
  },
  {
    id: 139,
    question: "Who was the first President of the United States?",
    options: ["George Washington", "Thomas Jefferson", "Abraham Lincoln", "John Adams"],
    correctAnswer: "George Washington",
  },
  {
    id: 140,
    question: "What is the longest river in the world?",
    options: ["Amazon River", "Nile River", "Yangtze River", "Mississippi River"],
    correctAnswer: "Nile River",
  },
  {
    id: 141,
    question: "What is the process of water vapor changing into liquid water called?",
    options: ["Condensation", "Evaporation", "Precipitation", "Transpiration"],
    correctAnswer: "Condensation",
  },
  {
    id: 142,
    question: "What is the most abundant gas in the Earth's atmosphere?",
    options: ["Oxygen", "Nitrogen", "Carbon Dioxide", "Argon"],
    correctAnswer: "Nitrogen",
  },
  {
    id: 143,
    question: "What is the name of the galaxy that contains our solar system?",
    options: ["Andromeda", "Milky Way", "Triangulum", "Whirlpool"],
    correctAnswer: "Milky Way",
  },
  {
    id: 144,
    question: "Which vitamin is primarily produced when exposed to sunlight?",
    options: ["Vitamin A", "Vitamin B12", "Vitamin C", "Vitamin D"],
    correctAnswer: "Vitamin D",
  },
  {
    id: 145,
    question: "What is the most widely consumed fruit in the world?",
    options: ["Banana", "Apple", "Orange", "Mango"],
    correctAnswer: "Banana",
  },
  {
    id: 146,
    question: "What is the capital city of Germany?",
    options: ["Berlin", "Munich", "Frankfurt", "Hamburg"],
    correctAnswer: "Berlin",
  },
  {
    id: 147,
    question: "Who is known for developing the theory of relativity?",
    options: ["Isaac Newton", "Albert Einstein", "Galileo Galilei", "Stephen Hawking"],
    correctAnswer: "Albert Einstein",
  },
  {
    id: 148,
    question: "What is the name of the currency used in the European Union?",
    options: ["Dollar", "Euro", "Pound", "Franc"],
    correctAnswer: "Euro",
  },
  {
    id: 149,
    question: "What is the chemical symbol for sodium?",
    options: ["S", "Na", "K", "Ca"],
    correctAnswer: "Na",
  },
  {
    id: 150,
    question: "What is the name of the first artificial Earth satellite?",
    options: ["Apollo 11", "Sputnik 1", "Explorer 1", "Hubble Space Telescope"],
    correctAnswer: "Sputnik 1",
  },
];


// Function to get 5 random questions
const getRandomQuestions = (questions, num = 5) => {
  // Shuffle the questions array
  const shuffled = questions.sort(() => 0.5 - Math.random());
  // Return the first 'num' questions
  return shuffled.slice(0, num);
};

// Get 5 random questions
const quizQuestions = getRandomQuestions(masterQuizQuestions);
console.log(quizQuestions);

const positiveAffirmations = [
  "You are capable of overcoming any challenge.",
  "You are valued and loved just as you are.",
  "You have the strength to keep going, even when it's tough.",
  "You are not alone. Reach out for support when you need it.",
  // Add more affirmations as needed...
];

function Quiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState("");
  const [score, setScore] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [incorrectAnswers, setIncorrectAnswers] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [answeredCorrectly, setAnsweredCorrectly] = useState(false);
  const [quizQuestions, setQuizQuestions] = useState(getRandomQuestions(masterQuizQuestions)); // Initialize quiz questions here

  const resetQuiz = () => {
    // Reset all states to initial values
    setCurrentQuestion(0);
    setSelectedOption("");
    setScore(0);
    setCorrectAnswers(0);
    setIncorrectAnswers(0);
    setShowScore(false);
    setAnsweredCorrectly(false);
    setQuizQuestions(getRandomQuestions(masterQuizQuestions));
  };

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
  };

  const handleNextQuestion = () => {
    // Check if the selected option is correct
    const correctAnswer = quizQuestions[currentQuestion].correctAnswer;
    if (selectedOption === correctAnswer) {
      setScore(score + 1);
      setCorrectAnswers(correctAnswers + 1);
      setAnsweredCorrectly(true);
    } else {
      setIncorrectAnswers(incorrectAnswers + 1);
      setAnsweredCorrectly(false);
    }

    // Move to the next question
    const nextQuestion = currentQuestion + 1;
    if (nextQuestion < quizQuestions.length) {
      setCurrentQuestion(nextQuestion);
      setSelectedOption("");
    } else {
      setShowScore(true);
    }
  };

  const handleSkipQuestion = () => {
    const nextQuestion = currentQuestion + 1;
    if (nextQuestion < quizQuestions.length) {
      setCurrentQuestion(nextQuestion);
      setSelectedOption("");
    } else {
      setShowScore(true);
    }
  };

  const isOptionSelected = (option) => {
    return option === selectedOption;
  };

  const calculateScorePercentage = () => {
    const totalQuestions = quizQuestions.length;
    const percentage = (score / totalQuestions) * 100;
    return percentage.toFixed(2);
  };

  return (
    <> 
    <hr />     <br />
                 <Typography variant="h4">
                  Quiz Time 
             
              </Typography>
         
      <div className="quiz-container">
      <br />
        {!showScore ? (
          <Card variant="outlined" className="question-section">
            <CardContent>
              <Typography variant="h6">
                Question {currentQuestion + 1}
              </Typography>
              <Typography variant="body1" gutterBottom>
                {quizQuestions[currentQuestion].question}
              </Typography>
              <Grid container spacing={2} alignItems="center">
                {quizQuestions[currentQuestion].options.map((option, index) => (
                  <Grid item xs={6} key={index}>
                    <Button
                      variant="outlined"
                      fullWidth
                      style={{
                        borderColor: isOptionSelected(option)
                          ? "#000"
                          : "black",
                        backgroundColor: isOptionSelected(option)
                          ? "#00752f"
                          : "#fff",
                        borderWidth: "2px",
                        borderRadius: "4px",
                        color: isOptionSelected(option)
                          ? "#fff"
                          : "#000",
                      }}
                      onClick={() => handleOptionSelect(option)}
                    >
                      {option}
                    </Button>
                  </Grid>
                ))}
              </Grid>
              <Grid
                container
                spacing={2}
                justifyContent="space-between"
                marginTop={2}
              >
                <Grid item>
                  <Button
                    variant="outlined"
                    disabled={currentQuestion === quizQuestions.length - 1}
                    onClick={handleSkipQuestion}
                  >
                    Skip
                  </Button>
                </Grid>
                <Grid item>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleNextQuestion}
                    disabled={!selectedOption}
                  >
                    Next
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        ) : (
          <Card variant="outlined" className="score-section">
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Quiz Results
              </Typography>
              <Typography variant="body1">
                Correct Answers: {correctAnswers} / {quizQuestions.length}
              </Typography>
              <Typography variant="body1">
                Incorrect Answers: {incorrectAnswers} / {quizQuestions.length}
              </Typography>
              <Typography variant="body1">
                Total Score: {score} / {quizQuestions.length}
              </Typography>
              <Typography variant="body1">
                Score Percentage: {calculateScorePercentage()}%
              </Typography>
            </CardContent>
            {/* Display correct answers */}
            <CardContent>
              <Typography variant="h6" gutterBottom style={{ marginTop: "16px" }}>
                Correct Answers:
              </Typography>
              {quizQuestions.map((question) => (
                <Typography key={question.id} variant="body1" gutterBottom>
                  {question.question} - {question.correctAnswer}
                </Typography>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Display positive affirmations */}
        <br />
        {/* <div className="affirmation-section">
          <Typography variant="h6" gutterBottom>
            Positive Affirmation:
          </Typography>
          <Typography variant="body1">
            {positiveAffirmations[currentQuestion % positiveAffirmations.length]}
          </Typography>
        </div> */}


           {/* Refresh Button */}
           <Grid container justifyContent="center" marginTop={2}>
          <Button variant="contained" color="secondary" onClick={resetQuiz}>
            Refresh Quiz
          </Button>
        </Grid>

      </div>

   
    </>
  );
}

export default Quiz;
