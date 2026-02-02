export function requireAuth(req, res, next) {

    if (!req.session.userId) {
        console.log('Access has been blocked')
        return res.status(401).json({error: 'Unauthorized'})
    }

    next()

}