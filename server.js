const express = require('express');
const bodyParser = require('body-parser');
const bCrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex')({
	client: 'pg',
	connection: {
		host: '127.0.0.1',
		port: '5432',
		user: 'postgres',
		password: 'gutodb', //See QA "Postgres Database Password | Environment Variables" https://www.udemy.com/course/the-complete-web-developer-zero-to-mastery/learn/lecture/8860474#questions/17909340
		database: 'facedetector'
	}
});

const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profileget');
const image = require('./controllers/image');

console.log(knex.select('*').from('users'));

const app = express ();
app.use(bodyParser.json());

app.use(cors());

app.post('/signin', (req, res) => { signin.handleSignIn(req, res, knex, bCrypt) })
app.post('/register', (req, res) => { register.handleRegister(req, res, knex, bCrypt) })
app.get('/profile/:id', (req, res) => { profile.handleProfileGet(req, res, knex) })
app.put('/image', (req, res) => { image.handleImage(req, res, knex) })
app.post('/imageurl', (req, res) => { image.handleApiCall(req, res) })


app.listen(3001, ()=> {
	console.log('app is running on port 3001');
})
