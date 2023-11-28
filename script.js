 import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";
import { getFirestore, collection, addDoc, doc, getDocs, onSnapshot, setDoc} from 'https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js'


let first = true
let container = document.querySelector("#container")
let refresh = document.querySelector("#refresh")
let submit = document.querySelector('.submit')
let bTitleText = document.querySelector(".TITLE")
let bDescText = document.querySelector(".DESCRIPTION")
let bCostText = document.querySelector(".COST")

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


function createF(num) {
  for (let i = 0; i < num; i++) {
    let body = document.createElement("div")
    let head = document.createElement("div")
    let header = document.createElement("h2")
    header.classList.add("Header")
    header.textContent = "Path"
    if (first) {header.textContent = "Path 0: The Start"}
    first = false
    head.append(header)
    
    let story = document.createElement("div")
    let storyhead = document.createElement("h3")
    let storywrite = document.createElement("textarea")
    story.append(storyhead)
    story.append(storywrite)
    storyhead.textContent = "Story: "
    
    let options = document.createElement("div")
    for (let j = 0; j < 2; j++) {
      let option = document.createElement("div")
      let optionhead = document.createElement("h3")
      optionhead.textContent = "Path: "
      let optionwrite = document.createElement("input")
      optionwrite.type = "number"
      let titlehead = document.createElement("h3")
      titlehead.textContent = "Title: "
      let titlewrite = document.createElement("input")
      titlewrite.type = "text"
      option.append(optionhead)
      option.append(optionwrite)
      option.append(titlehead)
      option.append(titlewrite)
      option.classList.add("option")
      options.append(option)
    }

    let endDiv = document.createElement("div")
    let ending = document.createElement("div")
    ending.classList.add("end")
    let endingText = document.createElement("h4")
    endingText.textContent = "Is this an ending?"
    let endingCheck = document.createElement("input")
    endingCheck.type = "checkbox"
    ending.append(endingText)
    ending.append(endingCheck)
    endDiv.append(ending)

    body.append(head)
    body.append(story)
    body.append(options)
    body.append(endDiv)
    container.append(body)
  }
}

function refreshF() {
  let bodys = container.children
  Array.from(bodys).forEach((options) => {
    let titles = options.children[2].children
    Array.from(titles).forEach((title) => {
      let name = title.children[3].value
      let path = title.children[1].value
      
      try {
        container.children[path].querySelector(".Header").textContent = "Path " + path + ": " + name
      } catch(error) {
        if (path > 0) {
          createF((path * 1) + 1 - container.children.length)
          refreshF()
        }

      }
    })
      let checker = options.children[3].children[0].children[1]
      options.children[0].addEventListener('click', function() {
        options.children[1].classList.toggle("hide")
        if (!(options.children[2].classList.contains("hide") && checker.checked)) {
          options.children[2].classList.toggle("hide")
        }
        options.children[3].classList.toggle("hide")
      })
    let bools = checker.checked
      options.children[3].addEventListener('click', function() { 
        bools = !bools
        checker.checked = bools
        options.children[2].classList.toggle("hide")
      })
  })


}

function submitF() {
  let bodys = Array.from(container.children)
  let bTitle = bTitleText.value
  let bDesc = bDescText.value
  let bCost = bCostText.value
  addDoc(colRef, {name: bTitle, description: bDesc, cost: bCost})
  let index = 0
  let daDoc
  bodys.forEach((body) => {
    let docRef = doc(colRef, bTitle)
    let dbRef = collection(docRef, "0")
    let data = {
      story: body.children[1].children[1].value,
      path1: body.children[2].children[0].children[1].value,
      path2: body.children[2].children[1].children[1].value,
      option1: body.children[2].children[0].children[3].value,
      option2: body.children[2].children[1].children[3].value,
      ending: body.children[3].children[0].children[1].checked
    }
    daDoc = doc(dbRef, index.toString())
    setDoc(daDoc, data)
    index++
    console.log(index)
  })
}


refresh.addEventListener('click', function() {
  refreshF()
})
submit.addEventListener('click', function() {submitF()})

createF(3)
refreshF()
