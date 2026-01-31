import validator from 'validator'
import { getDBConnection } from '../db/db.js'
import bcrypt from 'bcryptjs'

export async function registerUser(req, res) {

   console.log('req.body: ', req.body)

   let { name, email, username, password} = req.body 

   if ( !name || !email || !username || !password ) { 

      return res.status(400).json({ error: 'All fields are required.' })

   } 

   name = name.trim()
   email = email.trim()
   username = username.trim()

   if (!/^[a-zA-Z0-9_-]{1,20}$/.test(username)) {
      return res.status(400).json({error: "invalid username"})
   }

   if (!validator.isEmail(email)) {
      return res.status(400).json({error: "invalid email"})
   }

   console.log(req.body)

   
   try {

      const hashed = await bcrypt.hash(password, 10)  // hashing the password


      const db = await getDBConnection()
   
      const existing = await db.get(`SELECT id FROM users WHERE email = ? OR username = ?`,
         [email, username]
      )

      if (existing) {
         return res.status(400).json({ error: 'Email or username already in use.' })
      } 

      const result = await db.run('INSERT INTO users (name, email, username, password) VALUES (?, ?, ?, ?)',
         [name, email, username, hashed]
      )

      req.session.userId = result.lastID // this will bind our logged in user to the session !!!! 

      res.status(201).json({ message: 'User registered'})


   } catch (err) {

      console.error('Registration error: ', err.message)
      res.status(500).json({error: 'Registration failed, please try again correctly this time'})

   }

}


export async function loginUser(req, res) {

   let {username, password} = req.body 

   if (!username || !password) {
      return res.status(400).json({ error: "All fields are required"})
   }

   username = username.trim()

   try {
   
      const db = await getDBConnection()

      const user = await db.get(`SELECT * FROM users WHERE username = ?`, [username])

      // --- checking if such username exists in the database 
      if (!user) {
         return res.status(400).json({error: "Invalid credentials"})
      }

      const isValid = bcrypt.compare(password, user.password) // compares th password given with the password hash in the db

      if (!isValid) {
         return res.status(400).json({error: "Invalid credentials"})
      }

      
      req.session.userId = user.id           // start the session for the user !!
      res.json({ message: "Logged in!"} )    // end the response and send an ok message

   } catch (err) {
      console.error('Login error: '. err.message)
      res.status(500).json({ error: 'Login failed. Try again'} )
   }
   
}

