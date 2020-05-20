const url = `http://localhost:3000/quotes?_embed=likes`
const urlPurelyForm = 'http://localhost:3000/quotes'
const quoteList = document.querySelector("#quote-list")
let blockQuote = document.createElement("blockquote")
let newForm = document.querySelector("#new-quote-form")
let submitButton = document.querySelector(".btn btn-primary")

fetch(url)
    .then(response => response.json())
    .then(data => renderQuotes(data))

function renderQuotes(quoteData) {
    quoteData.forEach(quote => {
        let quoteLi = document.createElement("li")
        let blockQuote = document.createElement("blockquote")
        quoteLi.className = 'quote-card'
        blockQuote.className = 'blockquote'
        blockQuote.id = `${quote.id}`

        blockQuote.innerHTML = `
          <p class="mb-0">${quote.quote}</p>
          <footer class="blockquote-footer">${quote.author}</footer>
          <br>
          <button class='btn-success'>Likes: <span>${quote.likes.length}</span></button>
          <button class='btn-danger'>Delete</button>
        </blockquote>
      </li>
        `        
        //gives back array of likes, need the length
        quoteLi.append(blockQuote)
        quoteList.append(quoteLi)
    })
}

//submit needs its own event listener

document.addEventListener('submit', function (event) {
    event.preventDefault()
    //purely form bc we are submitting the form
    // which has nothing to do with our previous likes url

    fetch(urlPurelyForm, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            quote: event.target.quote.value,
            author: event.target.author.value, 
        })
    }).then(response => response.json())
    .then(newQuote => {
        let newQuoteLi = document.createElement("li")
        let blockQuote = document.createElement("blockquote")
        newQuoteLi.className = 'quote-card'
        blockQuote.className = 'blockquote'
        blockQuote.id = `${newQuote.id}`
    
        blockQuote.innerHTML = `
          <p class="mb-0">${newQuote.quote}</p>
          <footer class="blockquote-footer">${newQuote.author}</footer>
          <br>
          <button class='btn-success'>Likes: <span>0</span></button>
          <button class='btn-danger'>Delete</button>
        </blockquote>
      </li>
        `        
        //gives back array of likes, need the length
        newQuoteLi.append(blockQuote)
        quoteList.append(newQuoteLi)
    })





})

document.addEventListener('click', function (event) {
    if (event.target.className === "btn-danger") {//only set id after seeing where its best to access
        fetch(`http://localhost:3000/quotes/${event.target.parentElement.id}`, {
            method: 'DELETE'
        }).then(resp => resp.json())
        .then(() => {
            event.target.parentElement.parentElement.remove()
        })
        // http://localhost:3000/quotes/${e.target.parentElement.id}
    } else if (event.target.className === 'btn-success'){
        // changing stuff in the databsae
        fetch('http://localhost:3000/likes', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                //think of quote id as the unique id of the quote
                quoteId: parseInt(event.target.parentElement.id)
                //sending server id number
            }),
            //changing stuff in the dom
        }).then(resp => resp.json())
        .then(() => {
            //taking the event, updating inner text
            event.target.children[0].innerText = parseInt(event.target.children[0].innerText) + 1
            //use children for accessibility and flexibility
        })
    }

})