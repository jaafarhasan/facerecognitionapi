module.exports.handleSignin = (db, bcrypt) => (req, res) => {
    const user = req.body;
    const { email, pass } = user;
    db.select("email", "hash")
        .from("login")
        .where("email", email)
        .then((data) => {
            bcrypt.compare(pass, data[0].hash, (err, response) => {
                if (response) {
                    db.select("*")
                        .from("users")
                        .where("email", data[0].email)
                        .then((user) => res.json(user[0]))
                        .catch(() => res.status(400).json("fail"));
                } else {
                    return res.status(400).json("fail");
                }
            });
        })
        .catch(() => res.status(400).json("fail"));
};
