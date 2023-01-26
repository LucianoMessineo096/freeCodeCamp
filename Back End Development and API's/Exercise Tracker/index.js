let submit = document.getElementById('exercise-submit');

submit.addEventListener('click', (e) => {

  e.preventDefault();

  let _id = document.getElementById(':_id');
  let description = document.getElementById('description');
  let duration = document.getElementById('duration');
  let date = document.getElementById('date');

  const data = {

    _id: _id,
    description: description,
    duration: duration,
    date: date

  }

  const url = '/api/users/' + data._id + '/exercises';

  const param = {

    method: 'POST',
    mode: 'cors',
    cache: 'no-cache',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)

  }

  fetch(url, param)

})
