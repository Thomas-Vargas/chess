const express = require("express");
const router = express.Router();
const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = process.env.SUPABASE_PROJECT_URL;
const supabaseKey = process.env.SUPABASE_API_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

router.get("/", async (req, res) => {
  try {
    // Use 'chess_puzzles' instead of 'data' in the console.log
    let { data: chess_puzzles, error } = await supabase.from("chess_puzzles").select("*");

    // Check for errors
    if (error) {
      console.error("Error fetching chess puzzles:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    // Log the fetched data
    console.log(chess_puzzles);

    // Send the data in the response
    res.json(chess_puzzles);
  } catch (error) {
    console.error("Unexpected error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/puzzleByID/:id", async (req, res) => {
  let puzzleId = req.params.id;
  try {
    // Use 'chess_puzzles' instead of 'data' in the console.log
    let { data: chess_puzzles, error } = await supabase.from("chess_puzzles").select("*").eq("id", puzzleId).single();

    // Check for errors
    if (error) {
      console.error("Error fetching chess puzzle by id in /puzzleByID route:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    // Log the fetched data
    console.log(chess_puzzles);

    // Send the data in the response
    res.json(chess_puzzles);
  } catch (error) {
    console.error("Unexpected error in /puzzleByID route:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
