import passport from "passport";
import LocalStrategy from "passport-local";
import bcrypt from "bcrypt";
import User from "../../models/user.model.ts";

const saltRounds = 10;
const localStrategy = LocalStrategy.Strategy;


// SIGNUP MIDDLEWARE
passport.use(
  'signup',
  new localStrategy(
    { usernameField: "email", passReqToCallback: true },
    async (req, email, password, done) => {
      try {
        const { name, email, password } = req.body;
        bcrypt.hash(password, saltRounds, async (err, hash) => {
          if (err) {
            done(err);
          } else {
            const newUser = new User({
              name,
              email,
              password: hash,
            });

            // Save the user to the database
            const savedUser = await newUser.save();
            done(null, savedUser);
          }
        });
      } catch (error) {
        done(error);
      }
    }
  )
);


// LOGIN MIDDLEWARE
passport.use(
  'login',
  new localStrategy(
    { usernameField: "email", passwordField: "password", passReqToCallback: true },
    async (req, email, password, done) => {
      try {
           // Find the user by email
          const user = await User.findOne({ email });

          if (!user) {
            return done(null, false, { message: 'Incorrect email or password' });
          }

          // Compare password
          bcrypt.compare(password, user.password, async function(err, result) {
            if(err){
              done(err)
            }
            if(result){
                done(null, user, { message: "Successfully logged in"})
            } else {
                done({ message: "Invalid credentials" })
            }
        }
    );
      } catch (error) {
        done(error)
      }
    }
  )
)

