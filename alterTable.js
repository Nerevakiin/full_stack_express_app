import sqlite3 from 'sqlite3'
import {open} from 'sqlite'
import path from 'node:path'


async function alterTable() {

    const db = await open({
        filename: path.join('database.db'),
        driver: sqlite3.Database
    })

    await db.exec(`
        ALTER TABLE products
            ADD image TEXT NOT NULL
        `)

    await db.close()
    console.log("new column added")


}

alterTable()


// i didnt expect this would work but it did holy fucking shit 99999 IQ moment 