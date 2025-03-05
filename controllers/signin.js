const handleSignIn = (req, res, knex, bCrypt) => {
	const { email, password } = req.body;
	if (!email || !password) {
		return res.status(400).json('Empty fields not supported');
	}
	knex.select('*').from('login').where({email})
	.then(userLogin => {
		const { id , hash } = userLogin[0];
		const isValid = bCrypt.compareSync(password, hash);
		if (isValid) {
			knex.select('*').from('users').where({id})	
				.then(finalUser => {
					res.json(finalUser[0])
				})
				.catch(err => {res.status(400).json('Error signing in')})
		} else {
			res.status(400).json('Password invalid')
		}
	})
	.catch(err => {res.status(400).json('Error signing in')})
}

module.exports = {
	handleSignIn: handleSignIn
};