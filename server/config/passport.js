import dotenv from "dotenv";
dotenv.config();
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import pool from "./database.js";
import { v4 as uuidv4 } from "uuid";

// Common serialization/deserialization
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const [user] = await pool.query("SELECT * FROM users WHERE id = ?", [id]);
    done(null, user[0]);
  } catch (err) {
    done(err, null);
  }
});

// Google Sign-In Strategy
passport.use(
  "google-signin",
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${process.env.API_BASE_URL}/api/auth/google/callback`,
      scope: ["profile", "email"],
      passReqToCallback: true,
    },
    async (req, accessToken, refreshToken, profile, done) => {
      try {
        // Validate profile data
        if (!profile.emails || !profile.emails[0]) {
          return done(new Error("No email found in Google profile"));
        }

        const email = profile.emails[0].value;
        const name =
          profile.displayName || profile.name?.givenName || "Google User";
        const photo = profile.photos?.[0]?.value || null;

        // Check existing user
        const [users] = await pool.query(
          `SELECT * FROM users WHERE email = ? OR google_id = ?`,
          [email, profile.id]
        );

        if (users.length > 0) {
          return done(null, users[0]);
        }

        // Create new user with all required fields
        const userId = uuidv4();
        const username = profile.displayName
          ? profile.displayName.replace(/\s+/g, "").toLowerCase() +
            Math.floor(Math.random() * 1000)
          : `user${Math.floor(Math.random() * 10000)}`;

        await pool.query(
          `INSERT INTO users 
           (id, name, email, google_id, provider, username, phone, password, is_driver, profile_image, rating, ride_count, preferred_language) 
           VALUES (?, ?, ?, ?, 'google', ?, '', '', 0, ?, 0.0, 0, 'en')`,
          [userId, name, email, profile.id, username, photo]
        );

        const [newUser] = await pool.query("SELECT * FROM users WHERE id = ?", [
          userId,
        ]);
        return done(null, newUser[0]);
      } catch (err) {
        console.error("Google Sign-In Error:", err);
        return done(err);
      }
    }
  )
);

// Google Sign-Up Strategy
passport.use(
  "google-signup",
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${process.env.API_BASE_URL}/api/auth/google/signup/callback`,
      scope: ["profile", "email"],
      passReqToCallback: true,
      prompt: "consent",
    },
    async (req, accessToken, refreshToken, profile, done) => {
      try {
        // Validate profile data
        if (!profile.emails || !profile.emails[0]) {
          return done(new Error("No email found in Google profile"));
        }

        const email = profile.emails[0].value;
        const name =
          profile.displayName || profile.name?.givenName || "Google User";
        const photo = profile.photos?.[0]?.value || null;

        // Check existing user
        const [existingUsers] = await pool.query(
          "SELECT * FROM users WHERE email = ?",
          [email]
        );

        if (existingUsers.length > 0) {
          return done(null, false, {
            message: "Account already exists. Please sign in instead.",
          });
        }

        // Create new user with all required fields
        const userId = uuidv4();
        const username = `user${profile.id.substring(0, 8)}${Math.floor(Math.random() * 1000)}`;

        await pool.query(
          `INSERT INTO users 
           (id, name, email, google_id, provider, username, phone, password, is_driver, profile_image, rating, ride_count, preferred_language) 
           VALUES (?, ?, ?, ?, 'google', ?, '', '', 0, ?, 0.0, 0, 'en')`,
          [userId, name, email, profile.id, username, photo]
        );

        const [newUser] = await pool.query("SELECT * FROM users WHERE id = ?", [
          userId,
        ]);
        return done(null, newUser[0]);
      } catch (err) {
        console.error("Google Sign-Up Error:", err);
        return done(err);
      }
    }
  )
);

export default passport;

// // config/passport.js
// import dotenv from "dotenv";
// dotenv.config();
// import passport from "passport";
// import { Strategy as GoogleStrategy } from "passport-google-oauth20";
// import pool from "./database.js";

// // Google Strategy Configuration
// const googleConfig = {
//   clientID: process.env.GOOGLE_CLIENT_ID,
//   clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//   callbackURL: `${process.env.API_BASE_URL}/api/auth/google/callback`,
//   passReqToCallback: true,
// };

// const googleStrategy = new GoogleStrategy(
//   googleConfig,
//   async (req, accessToken, refreshToken, profile, done) => {
//     try {
//       // Extract user data from Google profile
//       const email = profile.emails[0].value;
//       const username = profile.displayName.replace(/\s+/g, "").toLowerCase();

//       // Check existing user
//       const [users] = await pool.query(
//         `SELECT * FROM users
//            WHERE email = ? OR google_id = ?`,
//         [email, profile.id]
//       );

//       if (users.length > 0) {
//         return done(null, users[0]);
//       }

//       // Create new user
//       const [result] = await pool.query(
//         `INSERT INTO users
//            (id, username, email, google_id, provider)
//            VALUES (UUID(), ?, ?, ?, 'google')`,
//         [username, email, profile.id]
//       );

//       const newUser = {
//         id: result.insertId,
//         username,
//         email,
//         provider: "google",
//       };

//       done(null, newUser);
//     } catch (err) {
//       done(err, null);
//     }
//   }
// );

// passport.use("google", googleStrategy); // Explicitly name the strategy

// // Serialization/Deserialization
// // Serialize user into session
// passport.serializeUser((user, done) => {
//   done(null, user.id);
// });

// // Deserialize user from session
// passport.deserializeUser(async (id, done) => {
//   try {
//     const [user] = await pool.query("SELECT * FROM users WHERE id = ?", [id]);
//     done(null, user[0]);
//   } catch (err) {
//     done(err, null);
//   }
// });

// passport.use(
//   "google-signup",
//   new GoogleStrategy(
//     {
//       clientID: process.env.GOOGLE_CLIENT_ID,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//       callbackURL: `${process.env.API_BASE_URL}/api/auth/google/signup/callback`,
//       scope: [
//         "https://www.googleapis.com/auth/userinfo.profile",
//         "https://www.googleapis.com/auth/userinfo.email",
//       ],
//       passReqToCallback: true,
//       scope: ["profile", "email"],
//     },
//     async (req, accessToken, refreshToken, profile, done) => {
//       try {
//         // Check if user already exists
//         const [existingUsers] = await pool.query(
//           "SELECT * FROM users WHERE email = ?",
//           [profile.emails[0].value]
//         );

//         // If user exists, prevent signup
//         if (existingUsers.length > 0) {
//           return done(null, false, {
//             message:
//               "An account already exists with this email. Please sign in instead.",
//           });
//         }

//         // Create new user
//         const [result] = await pool.query(
//           `INSERT INTO users
//        (id, name, email, google_id, provider, username, phone, password, is_driver)
//        VALUES (UUID(), ?, ?, ?, 'google', ?, '', '', 0)`,
//           [
//             profile.displayName,
//             profile.emails[0].value,
//             profile.id,
//             `user${profile.id.substring(0, 8)}`, // Generate unique username
//           ]
//         );

//         // Get the newly created user
//         const [newUser] = await pool.query("SELECT * FROM users WHERE id = ?", [
//           result.insertId,
//         ]);

//         return done(null, newUser[0]);
//       } catch (err) {
//         return done(err);
//       }
//     }
//   )
// );

// export default passport;
