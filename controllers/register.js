const handleRegister = (req, res, knex, bCrypt) => {
	const { name, email, password } = req.body;
	if (!name || !email || !password) {
		return res.status(400).json('Empty fields not supported');
	}
	const hash = bCrypt.hashSync(password);
	knex.transaction(trx => {
		trx.insert({
			name: name,
			email: email,
			joined: new Date()
		})
		.into('users')
		.returning('email')
		.then(loginEmail => {
			return trx('login')
				.returning('email')
				.insert({
					hash: hash,
					email: loginEmail[0].email
				})
				.then(user => {
					const { email } = user[0];
					knex.select('*').from('users').where({email})
						.then(finalUser => {
							res.json(finalUser[0])
						})
				})
		})
		.then(trx.commit)
		.catch(trx.rollback)
	})
	.catch(err => res.status(400).json("Unable to Register"))
}

module.exports = {
	handleRegister: handleRegister
};