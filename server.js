import express from 'express'
import { productsRouter } from './routes/products.js'
import { authRouter } from './routes/auth.js'

const app = express()
const PORT = 8000

app.use(express.json())

app.use(express.static('public'))

app.use('/api/products', productsRouter)
app.use('/api/register', authRouter)

app.use((req, res) => {
    res.status(400).json({
        message: "invalid url"
    })
})




app.listen(PORT, () => {
    console.log(`Server running and listening at port: ${PORT}`)
}).on('error', (err) => {
    console.log('Failed to start server: ', err) // endiaferon error handling
})


