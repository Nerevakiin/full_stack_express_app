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

