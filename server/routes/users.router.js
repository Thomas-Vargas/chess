const express = require("express");
const router = express.Router();
const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = process.env.SUPABASE_PROJECT_URL;
const supabaseKey = process.env.SUPABASE_API_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

router.post("/signUp", async (req, res) => {
  try {
    // sign user up
    let { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email: req.body.email,
      password: req.body.password,
    });

    if (signUpError) {
      console.error("Error signing user up:", signUpError);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    // once signed up, initialize user data row
    const { data: userData, error: userError } = await supabase
      .from("user_data")
      .insert([
        {
          userID: signUpData.user.id,
          current_elo: 800,
          lowest_elo: 800,
          highest_elo: 800,
          puzzles_played: 0,
        },
      ])
      .select();

    if (userError) {
      console.error("Error inserting new user into user_data table:", userError);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email: req.body.email,
      password: req.body.password,
    });

    if (signInError) {
        console.error("Error inserting new user into user_data table:", signInError);
        return res.status(500).json({ error: "Internal Server Error" });
      }

    console.log("data returned from signing user up", signUpData);
    console.log("data returned from initializing new user_data row", userData);
    console.log("data returned from logging new user in after registering them", signInData);

    // probably want to return success rather than all of the user data
    res.json(signUpData);
  } catch (error) {
    console.error("Unexpected error in /signUp route:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/login", async (req, res) => {
  try {
    let { data, error } = await supabase.auth.signInWithPassword({
      email: req.body.email,
      password: req.body.password,
    });

    const { access_token, refresh_token } = data.user;

    if (error) {
      console.error("Error logging user in:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    console.log(data.user);

    res.json(data.user);
  } catch (error) {
    console.error("Unexpected error in /login route:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/logout", async (req, res) => {
  try {
    let { error } = await supabase.auth.signOut();

    if (error) {
      console.error("Error logging user out:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    console.log(error);

    if (error === null) {
      res.json({ success: 1 });
    } else {
      res.json({ success: 0 });
    }
  } catch (error) {
    console.error("Unexpected error in /logout route:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/session", async (req, res) => {
  try {
    const { data, error } = await supabase.auth.getSession();

    if (error) {
      console.error("Error getting session:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    console.log(data);

    res.json(data);
  } catch (error) {
    console.error("Unexpected error in /session route:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
