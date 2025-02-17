const express = require('express');
const app = express();
const halls = require('../halls.json');  // Assuming you have halls.json data
const router = express.Router();  // Use the router here

// Use express.json() middleware to parse JSON body of incoming requests
app.use(express.json());

router.get('/api/hallreq', (req, res) => {
    res.send("hello from hallreq")
  })

// Define the POST route for getting halls  
router.post("/api/get-halls", (req, res) => {
    const { city, movieName } = req.body;

    // Check if city and movieName are provided
    if (!city || !movieName) {
        return res.status(400).json({ error: "City or Movie Name are required" });
    }

    // Find the data matching the city and movieName
    const cityData = halls.find((data) => {
        // Check for movie name match in the array of movies
        const movieMatch = data.movie.some(movie => movie.name.toLowerCase() === movieName.toLowerCase());
        return data.city.toLowerCase() === city.toLowerCase() && movieMatch;
    });

    // If cityData is found, find the matching movie and return the halls data (name and seats)
    if (cityData) {
        const movieData = cityData.movie.find(movie => movie.name.toLowerCase() === movieName.toLowerCase());
        
        // Return halls for the matched movie
        if (movieData) {
            return res.json({ halls: movieData.halls });
        } else {
            return res.status(400).json({ error: "Movie data not found" });
        }
    } else {
        return res.status(400).json({ error: "No halls found for this city or movie" });
    }
});


// Attach the router to the express app
app.use(router);

// Set the port for your server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

module.exports = router;
