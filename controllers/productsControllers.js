import { getDBConnection } from "../db/db.js"


export async function getGenres(req, res) {
    
    console.log('genres')

    const db = await  getDBConnection() // get what is returned from getDBConnection and store it in a const (didnt know that)

    const genreRows = await db.all('SELECT DISTINCT genre FROM products') // select all only unique values from the db
    
    const genres = genreRows.map(row => row.genre) // convert array of objects into array of strings

    res.json(genres)




}

export async function getProducts() {

    console.log('products')

}