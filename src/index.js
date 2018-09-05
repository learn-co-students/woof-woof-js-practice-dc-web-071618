let filtered = false;

document.addEventListener('DOMContentLoaded', () => {
    
    const filter = document.getElementById('good-dog-filter');
    
    filter.addEventListener('click', (event) => {
        filtered = !filtered;
        console.log(event);
        fetch('http://localhost:3000/pups')
            .then(res => res.json())
            .then(dogs => {
                const filteredDogs = dogs.filter((dog) => {
                    return dog.isGoodDog;
                })
                if(filtered) {
                    displayAllDogs(filteredDogs, dogBar);
                    filter.innerText = 'Filter good dogs: ON'
                }
                else {
                    displayAllDogs(dogs, dogBar);
                    filter.innerText = 'Filter good dogs: OFF'
                }
            })
    })

    const dogBar = document.getElementById('dog-bar');
    console.log(dogBar)
    fetch('http://localhost:3000/pups')
        .then(res => res.json())
        .then(dogs => {
            console.log(dogs)
            displayAllDogs(dogs, dogBar);
            // console.log(dogs);
            
        })
})

function displayAllDogs(dogs, dogBar) {
    dogBar.innerHTML = '';
    dogs.forEach(dog => {
        dogBar.innerHTML += `<span data-dog-id="${dog.id}">${dog.name}</span>`
    })
    document.querySelectorAll('span').forEach(span => {
        span.addEventListener('click', displayDogInfo)
    })
}

function renderDog(dog) {
    const dogInfo = document.getElementById('dog-info');
    dogInfo.innerHTML = '';
    dogInfo.innerHTML += `
        <img src=${dog.image}>
        <h2>${dog.name}</h2>
        <button data-is-good-dog = "${dog.isGoodDog}" data-id="${dog.id}">${dog.isGoodDog ? 'Good dog!' : 'Bad dog!'}</button>`;
    dogInfo.querySelector('button').addEventListener('click', patchDog)
}

function patchDog(event) {
    event.preventDefault();
    const id = event.currentTarget.dataset.id;
    let isGoodDog = event.currentTarget.dataset.isGoodDog;
    let reversedGoodness;
    // console.log(typeof isGoodDog);
    if (isGoodDog === 'true') {
        reversedGoodness = false;
    } else {
        reversedGoodness = true;
    }

    // let notIsGoodDog = !isGoodDog;
    fetch(`http://localhost:3000/pups/${id}`, {
        method: 'PATCH', 
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({isGoodDog: reversedGoodness}) 

    }).then(res => res.json())
        .then(dog => {
            console.log(dog);
            // debugger;
            // console.log(dog);
            // console.log(event)
            renderDog(dog);
        })
}

function displayDogInfo(event) {
    const dogInfo = document.getElementById('dog-info');
    dogInfo.innerHTML = '';
    const id = event.currentTarget.dataset.dogId;
    fetch(`http://localhost:3000/pups/${id}`)
        .then(res => res.json())
        .then(dog => {
            renderDog(dog);      
            // dogInfo.querySelector('button').addEventListener('click', event => {
            //     event.preventDefault()
            //     fetch(`http://localhost:3000/pups/${id}`, {
            //         method: 'PATCH', 
            //         headers: {
            //             'Content-Type': 'application/json',
            //             'Accept': 'application/json'
            //         }, 
            //         body: JSON.stringify({isGoodDog: !dog.isGoodDog})
            //     }).then(res => res.json())
            //         .then(json => {
            //             console.log(json);
            //             renderDog(json);
            //         })
                
            //     })
            })

}





