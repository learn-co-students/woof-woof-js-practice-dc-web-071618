const PUPS_URL = 'http://localhost:3000/pups'

document.addEventListener('DOMContentLoaded', init)

function init() {
  fetchPups()
  let filterButton = document.getElementById('good-dog-filter')
  let buttonStatus = filterButton.innerText.split(' ')[3]
  filterButton.addEventListener('click', filterPups)
}

function filterPups() {
  let button = document.getElementById('good-dog-filter')
  let buttonEnd = document.getElementById('good-dog-filter').innerText.split(' ')[3]
  if (buttonEnd === 'OFF') {
    button.innerText = 'Filter good dogs: ON'
  } else {
    button.innerText = "Filter good dogs: OFF"
  }
}

function fetchPups() {
  fetch(`${PUPS_URL}`)
  .then(response => response.json())
  .then(jsonData => jsonData.forEach(pup => {
      renderPup(pup)
  }))
}

function renderPup(pupData) {
  let dogBarDiv = document.getElementById('dog-bar')
  let pupSpan = document.createElement('span')
  pupSpan.id = `span-pup-${pupData.id}`
  pupSpan.innerText = pupData.name

  dogBarDiv.appendChild(pupSpan)

  pupSpan.addEventListener('click', fetchOnePup)
}

function fetchOnePup() {
  let pupId = event.target.id.split('-')[2]
  fetch(`${PUPS_URL}/${pupId}`)
  .then(response => response.json())
  .then(jsonData => {
    showOnePup(jsonData)
  })
  document.getElementById('dog-info').innerHTML = ''
}

function showOnePup(onePupInfo) {
  let pupInfoDiv = document.getElementById('dog-info')
  let dogImage = document.createElement('img')
  dogImage.src = onePupInfo.image

  let dogName = document.createElement('h2')
  dogName.innerText = onePupInfo.name

  let goodDog = document.createElement('button')
  goodDog.id = `button-dog-${onePupInfo.id}`
  if (onePupInfo.isGoodDog === true) {
    goodDog.innerText = 'Good Dog!'
  } else {
    goodDog.innerText = 'Bad Dog!'
  }

  pupInfoDiv.appendChild(dogImage)
  pupInfoDiv.appendChild(dogName)
  pupInfoDiv.appendChild(goodDog)

  goodDog.addEventListener('click', dogBehaviorHandler)
}

function dogBehaviorHandler() {
  let dogButton = event.target
  let pupId = dogButton.id.split('-')[2]
  let goodDog

  if (dogButton.innerText === 'Good Dog!') {
    goodDog = false
  } else {
    goodDog = true
  }
  patchBehavior(goodDog, pupId)
}

function patchBehavior(goodDog, pupId) {
  fetch(`${PUPS_URL}/${pupId}`, {
    method: 'PATCH',
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      isGoodDog: goodDog
    })
  })
  .then(response => response.json())
  .then(jsonData => {
    if (jsonData.isGoodDog) {
      document.getElementById(`button-dog-${pupId}`).innerText = 'Good Dog!'
    } else {
      document.getElementById(`button-dog-${pupId}`).innerText = 'Bad Dog!'
    }
  })
}
