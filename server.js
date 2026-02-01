import express from 'express'
import { productsRouter } from './routes/products.js'
import { authRouter } from './routes/auth.js'
import { meRouter } from './routes/me.js'
import { cartRouter } from './routes/cart.js'
import session from 'express-session'
import dotenv from 'dotenv'

dotenv.config() // setting up the dot env file to store the secret

const app = express()
const PORT = 8000
const secret = process.env.SPIRAL_SESSION_SECRET || 'jellyfish-baskingshark' // secret for the session

app.use(express.json())

// ---- express-session set for authentication credentials and cookies
app.use(session({
    secret: secret,
    resave: false,
    saveUninitialized: false, 
    cookie: {
        httpOnly: true,
        secure: false,
        sameSite: 'lax'
    }
}))

app.use(express.static('public'))

app.use('/api/products', productsRouter)
app.use('/api/auth/me', meRouter)
app.use('/api/auth', authRouter)
app.use('/api/cart', cartRouter)

app.use((req, res) => {
    res.status(400).json({
        error: "invalid url"
    })
})




app.listen(PORT, () => {
    console.log(`Server running and listening at port: ${PORT}`)
}).on('error', (err) => {
    console.log('Failed to start server: ', err) // endiaferon error handling
})


