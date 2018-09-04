let goodDogFilter = false;

document.addEventListener('DOMContentLoaded', init);

function init() {
  getAllDogData();
  filterHandler();
}

function getAllDogData() {
  fetch('http://localhost:3000/pups')
  .then(r => r.json())
  .then(json => json.forEach(dog => dogAnalyzer(dog)))
}

function getDogData(id) {
  fetch(`http://localhost:3000/pups/${id}`)
  .then(r => r.json())
  .then(json => renderDogInfo(json))
}

function patchDogStatus(id, dogStatus) {
  let data = {isGoodDog: !dogStatus}

  fetch(`http://localhost:3000/pups/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    }
  })
  .then(r => r.json())
  .then(json => {
    renderDogInfo(json);
    document.querySelector('#dog-bar').innerHTML = '';
    getAllDogData();
  })
}

function dogAnalyzer(dog) {
  if (goodDogFilter) {
    if (dog.isGoodDog) {
      renderDogBar(dog);
    }
  } else {
    renderDogBar(dog);
  }
}

function renderDogBar(dog) {
  const dogBar = document.querySelector('#dog-bar');
  const dogSpan = document.createElement('span');
  dogSpan.innerText = dog.name;
  dogSpan.id = `dog-span-${dog.id}`;
  dogSpan.addEventListener('click', e => getDogData(e.target.id.split('-')[2]));

  dogBar.appendChild(dogSpan);
}

function renderDogInfo(dog) {
  const dogInfo = document.querySelector('#dog-info');
  dogInfo.innerHTML = '';

  const dogImage = document.createElement('img');
  const dogName = document.createElement('h2');
  const dogStatus = document.createElement('button');

  dogImage.src = dog.image;
  dogName.innerText = dog.name;
  dogStatus.innerText = dog.isGoodDog ? 'Good Dog!' : 'Bad Dog!';
  dogStatus.id = `dog-status-${dog.id}`;

  dogStatus.addEventListener('click', e => {
    patchDogStatus(e.target.id.split('-')[2], dog.isGoodDog);
  })

  dogInfo.appendChild(dogImage);
  dogInfo.appendChild(dogName);
  dogInfo.appendChild(dogStatus);
}

function filterHandler() {
  const filterButton = document.querySelector('#good-dog-filter');
  filterButton.addEventListener('click', e => {
    if (goodDogFilter) {
      filterButton.innerText = 'Filter good dogs: OFF';
      goodDogFilter = !goodDogFilter;
      document.querySelector('#dog-bar').innerHTML = '';
      getAllDogData();
    } else {
      filterButton.innerText = 'Filter good dogs: ON';
      goodDogFilter = !goodDogFilter;
      document.querySelector('#dog-bar').innerHTML = '';
      getAllDogData();
    }
  })
}
