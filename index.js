 import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";
import { getFirestore, collection, onSnapshot, getDocs, doc} from 'https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js'

const firebaseConfig = {

    authDomain: "mycyoa-66bba.firebaseapp.com",

    projectId: "mycyoa-66bba",

    storageBucket: "mycyoa-66bba.appspot.com",

    messagingSenderId: "202247703335",

    appId: "1:202247703335:web:993a2235d6de0c89cbf702"

  };

const app = initializeApp(firebaseConfig);
const db = getFirestore(app)
const colRef = collection(db, "stories")
let stories = []
let current = 0
let info = []
let cstory = []
let coins
let alreadyPurchased = -1

if (JSON.parse(localStorage.getItem('coins')) != null) {
  coins = Number(JSON.parse(localStorage.getItem('coins')))
  console.log(Number(JSON.parse(localStorage.getItem('coins'))))
} else {
  coins = 100
}

coinamnt.textContent = coins + " coins"


function assemble() {
  getDocs(colRef)
  .then((querySnapshot) => {
    querySnapshot.forEach((shot) => {
        let storyO = [
          {id: 1,text: 'Are you ready to begin the game?',options: [{text: 'Yes', nextText: 2}]}
        ]
        let name = shot.data().name
        let description = shot.data().description
        let cost = shot.data().cost
        let docRef = doc(colRef, name)
        let dbRef = collection(docRef, "0")
        let index = 2
        getDocs(dbRef)
        .then((querySnapshot) => {
          querySnapshot.forEach((shot) => {
            let size = querySnapshot.size
            let story = shot.data().story
            let option1 = shot.data().option1
            let option2 = shot.data().option2
            let path1 = Number(shot.data().path1) + 2
            let path2 = Number(shot.data().path2) + 2
            let ending = shot.data().ending
            let stor = {}
              
  
            if (ending) {
              stor ={id: index,
                      text: story,
                      options: [{text: "Restart", nextText: 2}]
              }
            } else {
              stor = {id: index,
                      text: story,
                      options: [{text: option1, nextText: path1}, {text: option2, nextText: path2}]}

            }

              storyO.push(stor)  

              index++
            
  
        })
      })
        info.push({name: name, description: description, cost: cost})  
        stories.push(storyO)
    })
  show(current)
  })
}

function show(num) {
  header.textContent = info[num].name
  description.textContent = info[num].description
  let sCost = Number(info[num].cost)
  if (sCost == 0) {
    playbutton.textContent = "Play this CYOA!"
  } else {
    playbutton.textContent = "Purchase for " + sCost + " coins"
  }
}

left.addEventListener('click', function() {
  current--
  if (current < 0) {current = 0}
  show(current)
})
right.addEventListener('click', function() {
  current++
  if (current > (info.length - 1)) {current = (info.length - 1)}
  show(current)
})

backbutton.addEventListener('click', function() {
  toggle()
})

function toggle() {
  choicesdiv.classList.toggle('hide')
  playdiv.classList.toggle('hide')
  enddiv.classList.toggle('hide')
  backdiv.classList.toggle('hide')
  if (hintDiv.classList.contains('hide') == false) {
    hintDiv.classList.add('hide')
  }
}   

playbutton.addEventListener('click', function() {
  let cost = info[current].cost
  if (coins - cost < 0 && alreadyPurchased != current) {
    playbutton.style.borderColor = "red"
    setTimeout(function() {
      playbutton.style.borderColor = "white"
    }, 3000)
  } else {
    if (!(alreadyPurchased == current)){coins = coins - cost}
    console.log(alreadyPurchased == current)
    localStorage.setItem('coins', JSON.stringify(coins))
    coinamnt.textContent = coins + " coins"
    info[current].cost = 0
    localStorage.setItem('purchased', JSON.stringify(current))
    cstory = stories[current]
    alreadyPurchased = Number(JSON.parse(localStorage.getItem('purchased')))
    toggle()
    startGame()
  }
})

const textElement = document.getElementById('text')
const optionButtonsElement = document.getElementById('option-buttons')

function startGame() {
  showTextNode(1)
}

function showTextNode(textNodeIndex) {
  const textNode = cstory.find(textNode => textNode.id === textNodeIndex)
  textElement.innerText = textNode.text
  while (optionButtonsElement.firstChild) {
    optionButtonsElement.removeChild(optionButtonsElement.firstChild)
  }

  textNode.options.forEach(option => {
    const button = document.createElement('button')
    button.innerText = option.text
    button.classList.add('btn')
    button.addEventListener('click', () => selectOption(option))
    optionButtonsElement.appendChild(button)
  })
}

function selectOption(option) {
  let nextTextNodeId = option.nextText
  if (nextTextNodeId <= 0) {
    return startGame()
  }

  showTextNode(nextTextNodeId)
}

hintbtn.addEventListener('click', function() {
  let target = endings[current][0]
  let dummy = target

  let instructions = []
  let lengthi = instructions.length
  for (let i = (dummy - 2); i > 0; i--) {

    let options = cstory[i].options
    if (options[0].nextText == target) {
      instructions.splice(lengthi, 0, options[0].text)
      target = cstory[i].id
    } 
    try {
      if (options[1].nextText == target) {
        instructions.splice(lengthi, 0, options[1].text)
        target = cstory[i].id
      }
    } catch(error) {
      console.error(error)
    }

  }
  hintText.textContent = instructions

})


assemble()





let create = document.querySelector('#create')
create.addEventListener('click', function() {
  window.location.href = "/create.html"
})
