const express = require("express");
const router = express.Router();
const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = process.env.SUPABASE_PROJECT_URL;
const supabaseKey = process.env.SUPABASE_API_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

router.post("/signUp", async (req, res) => {
  try {
    let { data, error } = await supabase.auth.signUp({
        email: req.body.email,
        password: req.body.password
      })

    // Check for errors
    if (error) {
      console.error("Error signing user up:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    // Log the fetched data
    console.log(data);

    // Send the data in the response
    res.json(data);
  } catch (error) {
    console.error("Unexpected error in /signUp route:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/login", async (req, res) => {
  try {
    let { data, error } = await supabase.auth.signInWithPassword({
        email: req.body.email,
        password: req.body.password
      })

      const { access_token, refresh_token } = data.user;


    // Check for errors
    if (error) {
      console.error("Error logging user in:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    // Log the fetched data
    console.log(data.user);

    // Send the data in the response
    res.json(data.user);
  } catch (error) {
    console.error("Unexpected error in /login route:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/logout", async (req, res) => {
  try {
    let { error } = await supabase.auth.signOut()

    // Check for errors
    if (error) {
      console.error("Error logging user out:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    // Log the fetched data
    console.log(error);

    // Send the data in the response
    if (error === null) {
        res.json({success: 1});
    } else {
        res.json({success: 0})
    }
  } catch (error) {
    console.error("Unexpected error in /logout route:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/session", async (req, res) => {
    try {
        const { data, error } = await supabase.auth.getSession()
    
        // Check for errors
        if (error) {
          console.error("Error getting session:", error);
          return res.status(500).json({ error: "Internal Server Error" });
        }
    
        // Log the fetched data
        console.log(data);
    
        // Send the data in the response
        res.json(data);
      } catch (error) {
        console.error("Unexpected error in /session route:", error);
        res.status(500).json({ error: "Internal Server Error" });
      }
});

// router.get("/session", async (req, res) => {
//     try {
//         const { data, error } = await supabase.auth.getSession()
    
//         // Check for errors
//         if (error) {
//           console.error("Error getting session:", error);
//           return res.status(500).json({ error: "Internal Server Error" });
//         }
    
//         // Log the fetched data
//         console.log(data);
    
//         // Send the data in the response
//         res.json(data);
//       } catch (error) {
//         console.error("Unexpected error in /session route:", error);
//         res.status(500).json({ error: "Internal Server Error" });
//       }
// })


module.exports = router;
