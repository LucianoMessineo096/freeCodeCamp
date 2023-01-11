require('dotenv').config();
const mongoose = require('mongoose');
const {Schema} = mongoose

mongoose.connect(process.env.MONGO_URI,{ useUnifiedTopology: true,useNewUrlParser: true })
.then(()=>{console.log('mongo connected')})
.catch((err)=>{console.log(err)});

const personSchema = new Schema({
  name: { type: String, required: true },
  age: Number,
  favoriteFoods: [String]
});

/** 3) Create and Save a Person */
var Person = mongoose.model('Person', personSchema);

var createAndSavePerson = function(done) {
  var janeFonda = new Person({name: "Jane Fonda", age: 84, favoriteFoods: ["eggs", "fish", "fresh fruit"]});

  janeFonda.save(function(err, data) {
    if (err) return console.error(err);
    done(null, data)
  });
};

/** 4) Create many People with `Model.create()` */
var arrayOfPeople = [
  {name: "Frankie", age: 74, favoriteFoods: ["Del Taco"]},
  {name: "Sol", age: 76, favoriteFoods: ["roast chicken"]},
  {name: "Robert", age: 78, favoriteFoods: ["wine"]}
];

var createManyPeople = function(arrayOfPeople, done) {
  Person.create(arrayOfPeople, function (err, people) {
    if (err) return console.log(err);
    done(null, people);
  });
};

const findPeopleByName = (personName, done) => {

  Person.find({name:personName},(err,people)=>{

    if(err) return console.log(err);

    done(null,people);

  })
  
};

const findOneByFood = (food, done) => {
  Person.findOne({favoriteFoods:food},(err,people)=>{

    if(err) console.log(err)

    done(null,people)
  })
};

const findPersonById = (personId, done) => {
  Person.findById(personId,(err,people)=>{

    if(err) console.log(err)

    done(null,people)
  })
};

const findEditThenSave = (personId, done) => {
  const foodToAdd = 'hamburger';

  Person.findById(personId, (err, person) => {
    if(err) return console.log(err); 
  
    person.favoriteFoods.push(foodToAdd);

    person.save((err, updatedPerson) => {
      if(err) return console.log(err);
      done(null, updatedPerson)
    })
  })
};

const findAndUpdate = (personName, done) => {
  const ageToSet = 20;

  Person.findOneAndUpdate({name:personName},{age:ageToSet},{new:true},(err,updated)=>{

    if(err) console.log(err);

    done(null,updated)
  })

};

const removeById = (personId, done) => {

  Person.findByIdAndRemove(personId,(err,deleted)=>{

    if(err) console.log(err)

    done(null,deleted)
  })
};

const removeManyPeople = (done) => {
  const nameToRemove = "Mary";

  Person.remove({name:nameToRemove},(err,deleted)=>{

    if(err) console.log(err)
    done(null,deleted)
  })
};

const queryChain = (done) => {
  const foodToSearch = "burrito";

  Person
  .find({favoriteFoods:foodToSearch})
  .sort({name : "asc"})
  .limit(2).select("-age")
  .exec((err, data) => {
    if(err)
      done(err);
   done(null, data);
 })
};

/** **Well Done !!**
/* You completed these challenges, let's go celebrate !
 */

//----- **DO NOT EDIT BELOW THIS LINE** ----------------------------------

exports.PersonModel = Person;
exports.createAndSavePerson = createAndSavePerson;
exports.findPeopleByName = findPeopleByName;
exports.findOneByFood = findOneByFood;
exports.findPersonById = findPersonById;
exports.findEditThenSave = findEditThenSave;
exports.findAndUpdate = findAndUpdate;
exports.createManyPeople = createManyPeople;
exports.removeById = removeById;
exports.removeManyPeople = removeManyPeople;
exports.queryChain = queryChain;
