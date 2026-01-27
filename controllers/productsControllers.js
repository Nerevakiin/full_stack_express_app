import { getDBConnection } from "../db/db.js"



// gets the top down menu displayed
export async function getGenres(req, res) {
    
    console.log('genres')

    try {
    
        const db = await  getDBConnection() // get what is returned from getDBConnection and store it in a const (didnt know that)

        const genreRows = await db.all('SELECT DISTINCT genre FROM products') // select all only unique values from the db
        
        const genres = genreRows.map(row => row.genre) // convert array of objects into array of strings

        res.json(genres)

    } catch (err) {
        res.status(500).json({error: 'failed to fetch genres', details: err.message})
    }

}

export async function getProducts(req, res) {

    console.log('products')

    try {
    
    const db = await  getDBConnection() // get what is returned from getDBConnection and store it in a const 

    let query = 'SELECT * FROM products' // store the SQL query into a let variable and then pass it down to a const and display it
    let params = [] // initialize an empty array to store the params

    
    const { genre, search } = req.query 

    if (genre) {

        query += ' WHERE genre = ?' // the actual SQL query that filters
        params.push(genre)

    } else if (search) {

        query += ' WHERE title LIKE ? OR artist LIKE ? OR genre LIKE ?' // the actual SQL query that filters
        const searchPattern = `%${search}%` // wildcard for the search function
        params.push(searchPattern, searchPattern, searchPattern) // three times because we are checking 3 things

    }


    
    
    
    
    const products = await db.all(query, params)

    res.json(products)
    
    

    res.json(genres)

    } catch (err) {
        res.status(500).json({error: 'Failed to fetch products', details: err.message})
    }




}