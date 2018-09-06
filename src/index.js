document.addEventListener('DOMContentLoaded', function() {
  fetchDogs()
})

function fetchDogs() {
  fetch(`http://localhost:3000/pups`)
  .then(response => response.json())
  .then(jsonData => {
    jsonData.forEach(dog => {renderDogBar(dog)})
  })
}

function renderDogBar(dog) {
  let bar = document.querySelector('#dog-bar')
  let dogSpan = document.createElement('span')
  bar.appendChild(dogSpan)
  dogSpan.innerHTML = dog.name
  dogSpan.id = `span-${dog.id}`
  dogSpan.addEventListener('click', fetchOneDog)

}

function fetchOneDog(event) {
  let dogId = event.target.id.split('-')[1]
  fetch(`http://localhost:3000/pups/${dogId}`)
  .then(response => response.json())
  .then(oneDogData => renderOneDog(oneDogData))
  document.getElementById('dog-info').innerHTML = ''
}

function renderOneDog(oneDogData) {
  let dogInfo = document.querySelector('#dog-info')
  let dogTitle = document.createElement('h2')
  dogInfo.appendChild(dogTitle)
  dogTitle.innerHTML = oneDogData.name
  let dogImg = document.createElement('img')
  dogInfo.appendChild(dogImg)
  dogImg.src = oneDogData.image

  let goodBadButton = document.createElement('button')

  //no need to have === true
  if (oneDogData.isGoodDog){
     goodBadButton.innerText = 'Good Dog!'
   } else {
     goodBadButton.innerText = 'Bad Dog :('
   }
  dogInfo.appendChild(goodBadButton)
  goodBadButton.classList.add('good-bttn')
  goodBadButton.id = `button-${oneDogData.id}`
  goodBadButton.dataset.good = oneDogData.isGoodDog
  // goodBadButton.addEventListener('click', function() {
  //   editPatchFetch(oneDogData)
  //function is being created here
  // })
  goodBadButton.addEventListener('click', editPatchFetch)
  //function is only being invoked, that's why you don't have access to OneDogData at editPatchFetch

}

function editPatchFetch(editData){
  //dogGood --> old value
  let dogGood = editData.target.dataset.good
  //needed === "true" because this is the dataset, which is a string, not a boolean
  // if (editData.target.dataset.good === "true") {
  //   editData.target.dataset.good = false
  // } else {
  //   editData.target.dataset.good = true
  // }

  dogGood = JSON.parse(dogGood)

  //updating variable dogGood, not the DOM
  if (dogGood) {
    dogGood = false
    editData.target.dataset.good = false
  } else {
    dogGood = true
    editData.target.dataset.good = true
  }
  //dogGood --> new value
  let editId = editData.target.id.split('-')[1]

  let data = {isGoodDog: dogGood}

  fetch(`http://localhost:3000/pups/${editId}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    }
  })
  .then(response => response.json())
  .then(jsonData => {
    if (dogGood === false) {
      document.querySelector('.good-bttn').innerText = 'Bad Dog :('
      // jsonData.isGoodDog = false

    } else {
      document.querySelector('.good-bttn').innerText = 'Good Dog!'
      // jsonData.isGoodDog = true
    }

  })

}
