let filter

document.addEventListener('DOMContentLoaded', function() {
  getAllPups()
  filter = false
  document.querySelector('#good-dog-filter').addEventListener('click', toggleFilter)
})

function getAllPups() {
  document.querySelector('#dog-bar').innerHTML = ""
  fetch('http://localhost:3000/pups')
  .then(response => response.json())
  .then(pupData => pupData.forEach(
    pup => addPupToDogBar(pup)
  )
)}

function addPupToDogBar(dog) {
  let dogBar = document.querySelector('#dog-bar')
  let dogSpan = document.createElement('span')
  dogSpan.innerText = dog.name
  dogSpan.addEventListener('click', function() {
    showPupInfo(dog)
  })
  dogBar.appendChild(dogSpan)
}

function showPupInfo(dog) {
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
  dogButton.addEventListener('click', toggleGoodDog)
  dogInfoDiv.appendChild(dogImg)
  dogInfoDiv.appendChild(dogName)
  dogInfoDiv.appendChild(dogButton)
}

function toggleGoodDog(event) {
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
      "Accept": "application/json"
    }
  })
  .then(response => response.json())
  .then(jsonData => showPupInfo(jsonData))
  if (filter === false) {
    getAllPups()
  } else {
    getGoodPups()
  }
}

function toggleFilter() {
  if (document.querySelector('#good-dog-filter').innerText === "Filter good dogs: OFF") {
    document.querySelector('#good-dog-filter').innerText = "Filter good dogs: ON"
    filter = !filter
    console.log(filter)
    getGoodPups()
  } else {
    document.querySelector('#good-dog-filter').innerText = "Filter good dogs: OFF"
    filter = !filter
    getAllPups()
  }
}

function getGoodPups() {
  document.querySelector('#dog-bar').innerHTML = ""
  fetch('http://localhost:3000/pups')
  .then(response => response.json())
  .then(pupData => pupData.filter(pup => pup.isGoodDog === true).forEach(pup => addPupToDogBar(pup)))
}
