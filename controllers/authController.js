import validator from 'validator'

export async function registerUser(req, res) {

    console.log('req.body: ', req.body)

    let { name, email, username, password} = req.body 

     if ( !name || !email || !username || !password ) {

        return res.status(400).json({ error: 'All fields are required.' })

     } 

     name = name.trim()
     email = email.trim()
     username = username.trim()

     if (!/^[a-zA-Z0-9_-]{1,20}$/.test(username)) {
        return res.status(400).json({error: "invalid username"})
     }

     if (validator.isEmail(email)) {
        return res.status(400).json({error: "invalid email"})
     }

     console.log(req.body)


}