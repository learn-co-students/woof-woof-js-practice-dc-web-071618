
// WHEN LOOKING AT PUP PUPS USER SHOULD BE ABLE TO:
document.addEventListener('DOMContentLoaded', function(){
  console.log (`🐶 🐕🐶 🐕🐶 🐕🐶 🐕🐶 🐕`)
  fetchDoggos()
  goodDogFilterEvent()
})

let goodDogftr = false

function goodDogFilterEvent(){
  const filterBtn = document.getElementById('good-dog-filter')
  filterBtn.addEventListener('click', goodDogFilter)
}

function goodDogFilter(e){
  if (e.target.innerText === "Filter good dogs: OFF"){
    goodDogftr = true
    e.target.innerText = "Filter good dogs: ON"
  } else {
    goodDogftr = false
    e.target.innerText = "Filter good dogs: OFF"
  }
  fetchDoggos()
}

function fetchDoggos(){
  fetch(`http://localhost:3000/pups`)
  .then(res => res.json())
  .then(json => doleOutDoggos(json))
}

function doleOutDoggos(json){
  document.getElementById(`dog-bar`).innerHTML = ""
  json.forEach(function(oneDoggo){
    if(goodDogftr && oneDoggo.isGoodDog){
      renderDoggo(oneDoggo)
    } else if (!goodDogftr) {
      renderDoggo(oneDoggo)
    }
  })
}

function renderDoggo(oneDoggo){
  const dogBar = document.getElementById(`dog-bar`)
  dogSpan = document.createElement('span')
  dogSpan.innerText = oneDoggo.name
  dogSpan.id  = `dogId_${oneDoggo.id}`
  dogSpan.addEventListener('click', fetchOneDoggo)
  dogBar.appendChild(dogSpan)
}

function fetchOneDoggo(e){
  let dogId = parseInt(e.target.id.split("_")[1])
  fetch(`http://localhost:3000/pups/${dogId}`)
  .then(res => res.json())
  .then(json => renderOneDogsInfo(json))
}

function renderOneDogsInfo(json){
  let dogShow = document.getElementById(`dog-info`)
  dogShow.innerHTML = ""
  let dogPic = document.createElement('img')
  let dogName = document.createElement('h2')
  let goodDogButton = document.createElement('button')

  dogPic.src = json.image
  goodDogButton.addEventListener('click', doggoIsGood)
  goodDogButton.id = `dogId_${json.id}`
  dogName.innerText = json.name
  if (json.isGoodDog) {
    goodDogButton.innerText = `Good Dog!`
  }else{
    goodDogButton.innerText = `Bad Dog!`
  }

  dogShow.appendChild(dogName)
  dogShow.appendChild(dogPic)
  dogShow.appendChild(goodDogButton)
}

function doggoIsGood(e){
  let goodDog
  if (e.target.innerText === "Good Dog!"){
    goodDog = false
  }else {
    goodDog = true
  }
  fetch(`http://localhost:3000/pups/${e.target.id.split("_")[1]}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      isGoodDog: goodDog
    })
  })
    .then(res => res.json())
    .then(json => renderOneDogsInfo(json))
}
