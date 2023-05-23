//installing important modules
const express = require('express');
const server = express();
const cors = require('cors'); //cross origin resource sharing- allows a request from one origin to another
const session = require('express-session');
const QRCode = require('qrcode');


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
const { User, Vendor, Transaction } = require('./mongo');




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


    const { firstName, lastName, email, password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
        return res.status(400).json({ message: 'Passwords do not match' });
    }

    try {

        const hashedPassword = await bcrypt.hash(password, saltRounds);


        const user = new mongoose.models.User({ firstName, lastName, email, password: hashedPassword });


        await user.save();

        console.log('User registered successfully'); // Log after user is saved
        return res.status(201).json({ message: 'User registered successfully', redirectUrl: "/UserHomepage.html" });
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


    const { firstName, lastName, email, password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
        return res.status(400).json({ message: 'Passwords do not match' });
    }

    try {

        const hashedPassword = await bcrypt.hash(password, saltRounds);


        const vendor = new mongoose.models.Vendor({ firstName, lastName, email, password: hashedPassword });
        const qrCodeData = await QRCode.toDataURL(email);
        vendor.qrCodeData = qrCodeData;

        await vendor.save();

        console.log('Vendor registered successfully'); // Log after vendor is saved
        return res.status(201).json({ message: 'Vendor registered successfully', redirectUrl: "/VendorHomepage.html" });
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
const handleLogin1 = async (req, res) => {
    const { email, password } = req.body;
    console.log('Login attempt:', email, password);



    //checking if email exists
    const user = await mongoose.models.User.findOne({ email });



    if (!user) {
        return res.status(404).json({ message: "No user found with this email.Please create an account." });
    }
    console.log('User found: ', user);



    const passwordMatch = await bcrypt.compare(password, user.password);


    console.log('Passwords match', passwordMatch);

    if (!passwordMatch) {
        return res.status(401).json({ message: "Incorrect email/password." });
    }


    req.session.email = email;


    return res.status(200).json({ message: "Logged in successfully", redirectUrl: "/UserHomepage.html" });

};

const handleLogin2 = async (req, res) => {
    const { email, password } = req.body;
    console.log('Login attempt:', email, password);



    //checking if email exists
    const vendor = await mongoose.models.Vendor.findOne({ email });



    if (!vendor) {
        return res.status(404).json({ message: "No user found with this email.Please create an account." });
    }
    console.log('Vendor found: ', vendor);



    const passwordMatch = await bcrypt.compare(password, vendor.password);


    console.log('Passwords match', passwordMatch);

    if (!passwordMatch) {
        return res.status(401).json({ message: "Incorrect email/password." });
    }


    req.session.email = email;


    return res.status(200).json({ message: "Logged in successfully", redirectUrl: "/VendorHomepage.html" });

};

server.post('/UserLogin', handleLogin1);
server.post('/VendorLogin', handleLogin2);



server.post('/user-data', async (req, res) => {
    const { email } = req.body;
    console.log('Fetch user data attempt:', email);
    const user = await mongoose.models.User.findOne({ email });
    if (!user) {
        return res.status(404).json({ message: "No user found with this email." });
    }
    console.log('User found: ', user);
    return res.status(200).json({ firstName: user.firstName, email: user.email, money: user.money });
});

server.post('/vendor-data', async (req, res) => {
    const { email } = req.body;
    console.log('Fetch vendor data attempt:', email);
    const vendor = await mongoose.models.Vendor.findOne({ email });
    if (!vendor) {
        return res.status(404).json({ message: "No vendor found with this email." });
    }
    console.log('Vendor found: ', vendor);
    return res.status(200).json({ firstName: vendor.firstName, email: vendor.email, money: vendor.money });
});


server.post('/complete-transaction', async (req, res) => {
    const { vendorEmail, userEmail, price } = req.body;
    console.log("Scanned data recieved");

    const vendor = await Vendor.findOne({ email: vendorEmail });
    const user = await User.findOne({ email: userEmail });

    if (!vendor || !user || user.money < price) {
        res.status(400).json({ message: 'Transaction couldn\'t be completed' });
        return;
    }



    user.money -= price;
    vendor.money += price;

    await user.save();
    await vendor.save();

    const transaction = new Transaction({
        userEmail,
        vendorEmail,
        price
    });
    transaction.save()
        .then(() => console.log('Transactoin saved successfully'))
        .catch(err => console.error(err));
    res.status(200).json({ message: 'Transaction completed successfully', success: true });


});

server.get('/get-transaction-history', (req, res) => {
    const userEmail = req.query.userEmail;
    Transaction.find({ userEmail })
        .then(transactions => res.json(transactions))
        .catch(err => console.error(err));
});
server.get('/logout', function (req, res, next) {
    if (req.session) {
        // delete session object
        req.session.destroy(function (err) {
            if (err) {
                return next(err);
            } else {
                return res.redirect('Homepage.html');
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



module.exports = { User, Vendor };
