const bcrypt = require('bcrypt');
const saltRounds = 10;

const plainTextPassword1 = 'lollasrichandra';

// Hash a password:
bcrypt.hash(plainTextPassword1, saltRounds, function(err, hashedPassword) {
    if (err) {
        console.error(err);
        return;
    }

    console.log(`Hashed password is: ${hashedPassword}`);

    // Check a password:
    bcrypt.compare(plainTextPassword1, hashedPassword, function(err, result) {
        if (err) {
            console.error(err);
            return;
        }

        console.log(`Do the passwords match? ${result}`);
    });
});
