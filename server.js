//installing important modules
const express = require('express');
const server = express();
const cors = require('cors'); //cross origin resource sharing- allows a request from one origin to another
const session = require('express-session');


/*fetch(sends a request to server to retrieve data) then middleware like

 app.use( endpoint of server(to where it should be sent), function(req(request object), res(reponse object)) => 
 { *here is specified what should be done by the middleware, intermediate processing; sending the request to server 
    and retrieving the response from the server and send it to the client who requested it.* });
*/

//setting up a constant port
const port = 5665;


//getting bcrypt for hashing and encryption
const bcrypt = require('bcrypt');
const saltRounds = 10;


//getting mongodb modules and initialization
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const User = require('./mongo');
const Vendor = require('./mongo');




//middleware
server.use(cors()); //can take requests from any origiin because of * proprerty.
server.use(express.static("Client System")); //serving static files from the client side
server.use(bodyParser.json()); //easily handle JSON data sent in the request body.
//It automatically parses the JSON and converts it into a 
//JavaScript object, allowing you to access and manipulate 
//the data easily using req.body.

//connecting to MongoDB
mongoose.connect('mongodb+srv://lollasrichandra9:1Srichandra9*@cluster.auuzrze.mongodb.net/E-Coupons', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {   //.then is used with promises in js, it can either fail(code in .catch is excecuted) or succeed( code in .then excecuted).
        console.log('Connected to MongoDB');
    })
    .catch((error) => {
        console.error('Error connecting to MongoDB: ', error);
    });


//Hashing passwords and handling signup
const handleSignup1 = async (req, res) => {
    console.log('Received request body: ', req.body); // Log the request body

    const { firstName, lastName, email, password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
        return res.status(400).json({ message: 'Passwords do not match' });
    }

    try {
        console.log('Hashing password...'); // Log before hashing the password
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        console.log('Creating new User...'); // Log before creating new user
        const user = new mongoose.models.User({ firstName, lastName, email, password: hashedPassword });

        console.log('Saving user...'); // Log before saving the user
        await user.save();

        console.log('User registered successfully'); // Log after user is saved
        return res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error('Error registering user: ', error);
        if (error.code === 11000) { // Check if it's a duplicate key error
            return res.status(409).json({ message: 'Already registered! Please login!' });
        } else if (error.name === 'ValidationError') {
            return res.status(400).json({ message: error.message });
        }
        return res.status(500).json({ message: 'Error registering the user' });
    }
};

const handleSignup2 = async (req, res) => {
    console.log('Received request body: ', req.body); // Log the request body

    const { firstName, lastName, email, password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
        return res.status(400).json({ message: 'Passwords do not match' });
    }

    try {
        console.log('Hashing password...'); // Log before hashing the password
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        console.log('Creating new Vendor...'); // Log before creating new vendor
        const vendor = new mongoose.models.Vendor({ firstName, lastName, email, password: hashedPassword });

        console.log('Saving vendor...'); // Log before saving the vendor
        await vendor.save();

        console.log('Vendor registered successfully'); // Log after vendor is saved
        return res.status(201).json({ message: 'Vendor registered successfully' });
    } catch (error) {
        console.error('Error registering vendor: ', error);
        if (error.code === 11000) { // Check if it's a duplicate key error
            return res.status(409).json({ message: 'Already registered! Please login!' });
        } else if (error.name === 'ValidationError') {
            return res.status(400).json({ message: error.message });
        }
        return res.status(500).json({ message: 'Error registering the vendor' });
    }
};



server.post('/UserSignup', handleSignup1);
server.post('/VendorSignup', handleSignup2);

server.use(session({
    secret: 'your secret key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
  }));
  


//Handling Login
server.post('/UserLogin', async (req, res) => {
    const { email, password } = req.body;
    console.log('Login attempt:', email, password);

    

    //checking if email exists
    const user = await mongoose.models.User.findOne({ email });
    //log user returned from database
    

    if (!user) {
        return res.status(404).json({ message: "No user found with this email.Please create an account." });
    }
    console.log('User found: ', user);

    
    //check if password is correct
    const passwordMatch = await bcrypt.compare(password, user.password);

    //log password comparision
    console.log('Passwords match', passwordMatch);

    if (!passwordMatch) {
        return res.status(401).json({ message: "Incorrect email/password." });
    }

    //user is authenticated, now saving into session
    req.session.email = email;

    return res.status(200).json({ message: "Logged in successfully" });
});

server.get('/logout', function (req, res, next) {
    if (req.session) {
        // delete session object
        req.session.destroy(function (err) {
            if (err) {
                return next(err);
            } else {
                return res.redirect('/');
            }
        });
    }
});


//Server listening at port 5665
server.listen(port, function (err) {
    if (err) {
        console.error('Failure to launch server');
        return;
    }
    console.log(`Listening on port ${port}`);
});


module.exports = User;
module.exports = Vendor;