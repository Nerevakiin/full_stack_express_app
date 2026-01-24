import express from 'express'

const app = express()
const PORT = 8000

app.use(express.static('public'))






app.listen(PORT, () => {
    console.log(`Server running and listening at port: ${PORT}`)
}).on('error', (err) => {
    console.log('Failed to start server: ', err) // endiaferon error handling
})


