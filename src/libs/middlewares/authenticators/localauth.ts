import passport from 'passport'
import LocalStrategy from 'passport-local'
import bcrypt from 'bcrypt'
import User from '../../../config/database/schemas/user.model'

const saltRounds = 10
const localStrategy = LocalStrategy.Strategy

// SIGNUP MIDDLEWARE
passport.use(
  'signup',
  new localStrategy(
    { usernameField: 'email', passReqToCallback: true },
    async (req, email, password, done) => {
      try {
        const { name, email, password } = req.body

        // check if the name, email and password are provided be done with an error message
        if (!name || !email || !password) {
          return done(null, false, {
            message: 'Name, email and password are required',
          })
        }

        // Find the user by email
        const user = await User.findOne({ email })

        if (user) {
          return done(null, false, {
            message: 'User already exists, Login instead',
          })
        }

        bcrypt.hash(password, saltRounds, async (err, hash) => {
          if (err) {
            done(err)
          } else {
            const newUser = new User({
              name,
              email,
              password: hash,
            })

            // Save the user to the database
            const savedUser = await newUser.save()
            done(null, savedUser)
          }
        })
      } catch (error) {
        done(error)
      }
    }
  )
)

// LOGIN MIDDLEWARE
passport.use(
  'login',
  new localStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback: true,
    },
    async (req, email, password, done) => {
      try {
        // Find the user by email
        const user = await User.findOne({ email })

        // check if the email and password are provided be done with an error message
        if (!email || !password) {
          return done(null, false, {
            message: 'Email and password are required',
          })
        }

        if (!user) {
          return done(null, false, { message: 'User does not exist' })
        }

        // Compare password
        bcrypt.compare(password, user.password, async function (err, result) {
          if (err) {
            done(err)
          }
          if (result) {
            done(null, user, { message: 'Successfully logged in' })
          } else {
            done(null, false, { message: 'Invalid credentials' })
          }
        })
      } catch (error) {
        done(error)
      }
    }
  )
)
