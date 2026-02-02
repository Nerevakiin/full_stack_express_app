import { getDBConnection } from "../db/db.js";

export async function addToCart(req, res) {
    const db = await getDBConnection()

    try {

        const productId = parseInt(req.body.productId, 10) // get the product id from the body of the POST req and be sure its a number

        // --- ensure it is a number 
        if (isNaN(productId)){
            return res.status(400).json({ error: 'Invalid product ID' })
        }

        const userId = req.session.userId // get the user id that is logged in

        if (!userId) {
            return res.status(401).json({ error: 'please log in first'})
        }

        // --- query the db to see if the item is already selected in the cart ---
        const existing = await db.get(`SELECT * FROM cart_items WHERE user_id = ? AND product_id = ?`, [userId, productId]) 

        if (existing) {
            console.log('already an item. increment it.')
            await db.run(`UPDATE cart_items SET quantity = quantity + 1 WHERE id = ?`, [existing.id])

        } else {
            console.log('0 items. add it to cart')
            
            await db.run(`INSERT INTO cart_items (user_id, product_id, quantity)
                VALUES (?, ?, 1)`, [userId, productId])
        }

    res.json({ message: 'Added to cart' })

    } catch (err) {
        console.error('adding to cart error: ', err.message)
    }

}



export async function getCartCount(req, res) {
    const db = await getDBConnection()

    const userId = req.session.userId // get the user id that is logged in
    const cartCount = await db.get(`SELECT SUM(quantity) AS totalItems FROM cart_items WHERE user_id = ?`, [userId]) 
    
    res.json({ totalItems: cartCount.totalItems || 0 })
}




export async function getAll(req, res) {
    const db = await getDBConnection()
    
    try {
    
        if (!req.session.userId) {
            return res.json({error: 'you must login first'})
        }

        const items = await db.all(` SELECT ci.id AS cartItemId, ci.quantity, p.title, p.artist, p.price
            FROM cart_items ci JOIN products p ON p.id = ci.product_id WHERE ci.user_id = ?`, [req.session.userId])

        res.json({ items: items })



    } catch (err) {
        console.error('get all error: ', err.message)
    }

}



export async function deleteItem(req, res) {
    const db = await getDBConnection()

    try {

        const itemId = parseInt(req.params.itemId, 10) // getting the item id and checking if its a number

        if (isNaN(itemId)) {
            return res.status(400).json({error: 'Invalid item ID'})
        }

        // getting the item itself by checking the quantity
        const item = await db.get('SELECT quantity FROM cart_items WHERE id = ? AND user_id = ?', [itemId, req.session.userId])

        if (!item) {
            return res.status(400).json({error: 'item not found'})
        }

        // actually deleting the item from the db
        await db.run(`DELETE FROM cart_items WHERE id = ? AND user_id = ?`, [itemId, req.session.userId])

        res.status(204).send() // the proper response to send when there is no json that is to be returned



    } catch (err) {
        console.error('delete item error: ', err.message)
    }
}



export async function deleteAll(req, res) {

    const db = await getDBConnection()
    await db.run('DELETE FROM cart_items WHERE user_id = ?', [req.session.userId])
    res.status(204).send()
    
}