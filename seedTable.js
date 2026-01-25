import sqlite3 from 'sqlite3'
import { open } from 'sqlite'
import path from 'node:path'
import { vinyl } from './data.js'

async function seedTable() {
 
  const db = await open({
    filename: path.join('database.db'),
    driver: sqlite3.Database
  })

  try {
    
    // this starts the function which puts data into the db
    await db.exec('BEGIN TRANSACTION')

    
    
    // specify which columns will be populated 
    for (const {title, artist, price, image, year, genre, stock} of vinyl) {
        await db.run(`
            INSERT INTO products (title, artist, price, image, year, genre, stock)
            VALUES (?, ?, ?, ?, ?, ?, ?)
            `, [title, artist, price, image, year, genre, stock])
    }

    // this commits the new insterts into the db and logs out the success msg 
    await db.exec('COMMIT')
    console.log('All records inserted successfully.')


  } catch (err) {
    
    // this, if an error happens, it takes us back to the beginning
    await db.exec('ROLLBACK')
    console.error('Error inserting data:', err.message)


  } finally {

    // if its successful or failed, this closes the whole database mess
    await db.close()
    console.log('Database connection closed.')

  }
}

seedTable()