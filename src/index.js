let filter

document.addEventListener('DOMContentLoaded', function() {
  fetchDogs()
  filter = false
  document.querySelector('#good-dog-filter').addEventListener('click', switchFilter)
})

function fetchDogs() {
  document.querySelector('#dog-bar').innerHTML = ""
  fetch('http://localhost:3000/pups')
  .then(response => response.json())
  .then(dogData => dogData.forEach(
    dog => addDogToDogBar(dog)
  )
)}

function addDogToDogBar(dog) {
  let dogBar = document.querySelector('#dog-bar')
  let dogSpan = document.createElement('span')
  dogSpan.innerText = dog.name
  dogSpan.addEventListener('click', function() {
    displayDog(dog)
  })
  dogBar.appendChild(dogSpan)
}

function displayDog(dog) {
  let dogInfoDiv = document.querySelector('#dog-info')
  dogInfoDiv.innerHTML = ""
  let dogImg = document.createElement('img')
  let dogName = document.createElement('h2')
  let dogButton = document.createElement('button')
  dogImg.src = dog.image
  dogName.innerText = dog.name
  if (dog.isGoodDog === true) {
    dogButton.innerText = 'Good Dog!'
  } else {
    dogButton.innerText = 'Bad Dog!'
  }
  dogButton.id = `dog-${dog.id}`
  dogButton.addEventListener('click', switchGoodDog)
  dogInfoDiv.appendChild(dogImg)
  dogInfoDiv.appendChild(dogName)
  dogInfoDiv.appendChild(dogButton)
}

function switchGoodDog(event) {
  let button = event.target
  let goodDog
  if (button.innerText === 'Good Dog!') {
    goodDog = false
  } else {
    goodDog = true
  }
  let dogId = button.id.split("-")[1]
  fetch(`http://localhost:3000/pups/${dogId}`, {
    method: "PATCH",
    body: JSON.stringify({isGoodDog: goodDog}),
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"}
  })
  .then(response => response.json())
  .then(jsonData => displayDog(jsonData))
  if (filter === false) {
    fetchDogs()
  } else {
    getGoodDogs()
  }
}

function switchFilter() {
  if (document.querySelector('#good-dog-filter').innerText === "Filter good dogs: OFF") {
    document.querySelector('#good-dog-filter').innerText = "Filter good dogs: ON"
    filter = !filter
    console.log(filter)
    getGoodDogs()
  } else {
    document.querySelector('#good-dog-filter').innerText = "Filter good dogs: OFF"
    filter = !filter
    fetchDogs()}
}

function getGoodDogs() {
  document.querySelector('#dog-bar').innerHTML = ""
  fetch('http://localhost:3000/pups')
  .then(response => response.json())
  .then(dogData => dogData.filter(dog => dog.isGoodDog === true).forEach(dog => addDogToDogBar(dog)))
}
