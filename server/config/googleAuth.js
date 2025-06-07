// googleAuth.js

import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import pool from "./database.js";

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/api/auth/google/callback",
      scope: ["profile", "email"],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Extract user data from Google profile
        const email = profile.emails[0].value;
        const username = profile.displayName.replace(/\s+/g, "").toLowerCase();

        // Check existing user
        const [users] = await pool.query(
          `SELECT * FROM users 
       WHERE email = ? OR google_id = ?`,
          [email, profile.id]
        );

        if (users.length > 0) {
          return done(null, users[0]);
        }

        // Create new user
        const [result] = await pool.query(
          `INSERT INTO users 
       (id, username, email, google_id, provider) 
       VALUES (UUID(), ?, ?, ?, 'google')`,
          [username, email, profile.id]
        );

        const newUser = {
          id: result.insertId,
          username,
          email,
          provider: "google",
        };

        done(null, newUser);
      } catch (err) {
        done(err, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const [user] = await pool.query("SELECT * FROM users WHERE id = ?", [id]);
    done(null, user[0]);
  } catch (err) {
    done(err);
  }
});
