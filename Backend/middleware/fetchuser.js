const jwt = require('jsonwebtoken');
require('dotenv').config();

const fetchUser = (req, res, next) => {

    //Get the user from the jwt token and add id to req object
    const token = req.header('auth-token');
    if (!token) {
        res.status(401).send('Please authenticate using a valid token');
    }

    try {
        const data = jwt.verify(token, process.env.ACCESS_TOKEN);
        req.user = data.id;
        next();
    } catch (error) {
        res.status(401).send('Please authenticate using a valid token');
    }

}

module.exports = fetchUser;