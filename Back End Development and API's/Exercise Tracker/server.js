const express = require('express');
const bodyParser = require('body-parser');
const shortId = require('shortid');
const mongoose = require('mongoose');
const cors = require('cors');
const { Schema } = mongoose;

const app = express();
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cors());
const port = 3000;

mongoose.set('strictQuery', false);
mongoose.connect('mongodb+srv://<user>:<pass>@cluster0.qslhdkv.mongodb.net/test', { useUnifiedTopology: true, useNewUrlParser: true })
  .then(() => { console.log('mongo connected') })
  .catch((err) => { console.log(err) });

//----SCHEMAS AND MODELS
const userSchema = new Schema({

  username: { type: String, required: true },
  _id: { type: String }
})

const userModel = mongoose.model('newUser', userSchema);

const exerciseSchema = new Schema({
  _id: { type: String, unique: true },
  id: { type: String, unique: false },
  description: { type: String },
  duration: { type: String },
  date: { type: String }

})

const exerciseModel = mongoose.model('newExercise', exerciseSchema);

//----------ROUTES
app.get('/', (req, res) => {

  res.sendFile(__dirname + '/index.htm')
})

/*  You can POST to /api/users with form data username to create a new user.

      The returned response from POST /api/users with form data username will be an object with username and _id properties.
*/

app.post('/api/users', async (req, res) => {

  const username = req.body.username;

  if (username !== '') {

    //check if exists

    let userParam = await userModel.findOne({ username: username }).exec();

    if (!userParam) {

      let _id = shortId.generate();

      let newUser = new userModel({ username: username, _id: _id, });
      newUser.save();

      console.log('user <' + username + '> created')

      res.json({ username: username, _id: _id })


    } else {

      console.log('user <' + username + '> already exists')

      res.json({ username: userParam.username, _id: userParam._id })

    }

  } else {

    res.json({ error: 'invalid username' })
  }

})

/*
  You can make a GET request to /api/users to get a list of all users

  The GET request to /api/users returns an array.

  Each element in the array returned from GET /api/users is an object literal containing a user's username and _id.
*/

app.get('/api/users', async (req, res) => {

  let users = await userModel.find({}).exec();

  res.json(users)

})

/*

  You can POST to /api/users/:_id/exercises with form data description, duration, and optionally date. If no date is supplied, the current date will be used.

  X The response returned from POST /api/users/:_id/exercises will be the user object with the exercise fields added.

  
*/

function validate(data) {

  let valid = true;

  data._id === "" ? valid = false : '';
  data.description === "" ? valid = false : '';
  data.duration === "" ? valid = false : '';

  return valid

}

async function getUser(_id) {

  return await userModel.findOne({ _id: _id }).exec();

}

app.post('/api/users/:_id/exercises', async (req, res) => {

  var _id = req.params._id;
  var data = req.body

  if (!validate(data)) {

    res.json({ error: 'invalid data' })
  }
  else {

    let user = await getUser(_id);

    if (user === null) {

      res.json({ error: 'user: ' + _id + ' not exist' })
    }
    else {

        let date = new Date(data.date).toDateString();
        if (date == "Invalid Date") {
            date = new Date().toDateString();
        }

        data.date = date;

        let newExercise = new exerciseModel({
            _id: shortId.generate(),
            id: _id,
            description: data.description,
            duration: data.duration,
            date: data.date
        });

        newExercise.save();

        console.log('exercise for user ' + _id + ' has been inserted')

        res.json({

            username: user.username,
            description: data.description,
            duration: parseInt(data.duration),
            date: data.date,
            _id: user._id

        })

    }

  }

})

/*
  You can make a GET request to /api/users/:_id/logs to retrieve a full exercise log of any user.

  A request to a user's log GET /api/users/:_id/logs returns a user object with a count property 
  representing the number of exercises that belong to that user.

  A GET request to /api/users/:_id/logs will return the user object with a log array of all the exercises added

  Each item in the log array that is returned from GET /api/users/:_id/logs 
  is an object that should have a description, duration, and date properties.

  The description property of any object in the log array 
  that is returned from GET /api/users/:_id/logs should be a string.

  The duration property of any object in the log array 
  that is returned from GET /api/users/:_id/logs should be a number.

  X The date property of any object in the log array that is returned from GET /api/users/:_id/logs 
  should be a string. Use the dateString format of the Date API.

  X You can add from, to and limit parameters to a GET /api/users/:_id/logs request to retrieve part of the 
  log of any user. from and to are dates in yyyy-mm-dd format. 
  limit is an integer of how many logs to send back.

*/

app.get('/api/users/:_id/logs', async (req, res) => {

    var {from,to,limit} = req.query
    console.log(from + to + limit)

    const id = req.params._id;

    const userParams = await userModel.findOne({ _id: id }).exec();

    if (userParams == null) {

        res.json({ error: 'user ' + id + ' not exist' })
    }
    else {

        const userExercises = await exerciseModel.find({ id: id }).exec();

        if (userExercises == null) {

            res.json({ error: 'exercises not found for user ' + id })
        }
        else {

            var len = userExercises.length;

            var data = {

                username: userParams.username,
                count: userExercises.length,
                _id: userParams._id,
                log: []

            }

            userExercises.forEach((ex,index) => {

                limit===undefined ? limit=len : '';

                if(index<limit){

                    let date = new Date(ex.date).toDateString();
                    if (date == "Invalid Date") {
                    date = new Date().toDateString();
                    }
                    ex.date = date;

                    let e = {

                    description: ex.description,
                    duration: parseInt(ex.duration),
                    date: ex.date
                    }

                    data.log.push(e);


                }

                

            })



            res.json(data)


        }

    }

})


app.listen(port, () => { console.log('server running') });
