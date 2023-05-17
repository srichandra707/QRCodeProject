const express = require('express');
const server = express();
const cors = require('cors');
const port = 5665;
const bcrypt = require('bcrypt');
const saltRounds = 5;
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const User = require('./mongo');

server.use(cors());
server.use(express.static("Client System"));
server.use(bodyParser.json());

mongoose.connect('mongodb+srv://lollasrichandra9:1Srichandra9*@cluster.auuzrze.mongodb.net/', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((error) => {
        console.error('Error connecting to MongoDB: ', error);
});

const handleSignup = async (req,res) => {
    const {firstname, lastname, email, password, confirmPassword } = req.body;

    if (password !== confirmPassword){
        return res.status(400).json({ message: 'Passwords do not match'});
    }

    try {

        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const user = new mongoose.models.User({
            email,
            password: hashedPassword,
        });
        

        await user.save();

        return res.status(201).json({ message: 'User registered successfully'});
    }catch (error){
        console.error('Error registering user: ', error);
        return res.status(500).json({message: 'Error registering the user'});
    }
};

server.post('/UserSignup.html', handleSignup);
server.post('/VendorSignup.html', handleSignup);



server.listen(port, function (err) {
    if (err) {
        console.error('Failure to launch server');
        return;
    }
    console.log(`Listening on port ${port}`);
});


module.exports = User;