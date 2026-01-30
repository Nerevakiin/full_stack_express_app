import { getDBConnection } from "../db/db.js";

export async function getCurrentUser(req, res) {
    try{
        
        const db = await getDBConnection()

        if (!req.session.userId) {
            return res.status(200).json({ isLoggedIn: false })
        } else {

            const user = await db.run(`SELECT name FROM users WHERE id = ?`, [req.session.userId])
            res.json( { isLoggedIn: true, name: user.name } )
        }



    } catch (err) {

        console.error('getCurrentUser error: ', err)
        res.status(500).json({ error: 'Internal server error'})

    }
}