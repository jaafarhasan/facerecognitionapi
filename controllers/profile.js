module.exports.handleProfileGet = (db) => (req, res) => {
    const { id } = req.params;
    db("users")
        .where("id", id)
        .then((user) => {
            if (user[0]) {
                res.json(user[0]);
            } else {
                res.status(400).json(`fail`);
            }
        })
        .catch(() => res.status(400).json(`fail`));
};
