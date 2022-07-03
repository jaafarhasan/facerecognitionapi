module.exports.handleRegister = (db, bcrypt) => (req, res) => {
    const user = req.body;
    const { name, email, password } = user;
    const hash = bcrypt.hashSync(password, 12);
    if (name && email && password) {
        // Using trx as a transaction object:
        db.transaction((trx) => {
            db.insert({
                hash: hash,
                email: email,
            })
                .into("login")
                .transacting(trx)
                .returning("email")
                .then((loginEmail) => {
                    const newUser = {
                        name: name,
                        email: loginEmail[0].email,
                        joined: new Date(),
                    };
                    return db("users")
                        .returning("*")
                        .insert(newUser)
                        .transacting(trx);
                })
                .then(trx.commit)
                .catch(trx.rollback);
        })
            .then((user) => res.json(user[0]))
            .catch(() => res.status(400).json("fail"));
    } else {
        res.status(400).json("fail");
    }
};
