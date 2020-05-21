const QUOTES_URL = "http://localhost:3000/quotes"
const QUOTES_WITH_LIKES = "http://localhost:3000/quotes?_embed=likes"
const LIKES_URL = "http://localhost:3000/likes"

document.addEventListener("DOMContentLoaded", () => {
    loadQuotes()
    document.addEventListener('submit', (event)=>{
        event.preventDefault()
        makeQuoteForm()
    })
    document.addEventListener('click', (event)=>{
        if(event.target.textContent === "Delete"){
            let quoteId = event.target.parentNode.parentNode.dataset.quoteId
            let quoteLi = event.target.parentNode.parentNode
            deleteButton(quoteId,quoteLi)
        } else if( event.target.className ==="btn-success"){
            console.log("working")
            let quoteId = event.target.parentNode.parentNode.dataset.quoteId
            const likeBox = event.target
            likeButton(quoteId, likeBox)
        }
    })
})


// delete button

const deleteButton = (quoteId, quoteLi) =>{
    fetch(`${QUOTES_URL}/${quoteId}`,{
        method: "DELETE",
        headers: {
            "Content-Type":"application/json",
            "Accept":"application/json"
                }
    })
    .then(response => response.json())
    .then(data => {
        console.log("Quote Deleted")
        quoteLi.remove()
    })
}

const likeButton = (quoteId, likeBox) =>{
    const intQuoteId = parseInt(quoteId)
    let currentLikeCountSpan = likeBox.children[0]
    console.log(currentLikeCountSpan)
    let likeCount = parseInt(currentLikeCountSpan.textContent)
    likeCount++
    console.log(likeCount)
    fetch(LIKES_URL,{
        method: "POST",
        headers: {"Content-Type" : "application/json",
            "Accept": "application/json"},
        body: JSON.stringify({
            quoteId : intQuoteId
        })
    })
    .then(response => response.json())
    .then(currentLikeCountSpan.textContent = likeCount)
    
}


const makeQuoteForm = ()=>{
    let quoteForm = document.querySelector('#new-quote-form')
    const newQuoteInput = document.querySelector('#new-quote')
    const newAuthorInput = document.querySelector('#author')
    fetch(QUOTES_URL,{
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept" : "application/json"
        },
        body: JSON.stringify({
            quote: newQuoteInput.value,
            author: newAuthorInput.value
        })
    })
    .then(response => response.json())
    .then(data => renderNewQuote(data))
    quoteForm.reset()
}

// rendering new Quote

const renderNewQuote = (quote) =>{
    const quoteList = document.querySelector('#quote-list')
    const quoteElement = document.createElement('li')
    quoteElement.className = "quote-card"
    quoteElement.innerHTML = `
    <blockquote class="blockquote">
        <p class="mb-0">${quote.quote}</p>
        <footer class="blockquote-footer">${quote.author}</footer>
        <br>
        <button class='btn-success'>Likes: <span>0</span></button>
        <button class='btn-danger'>Delete</button>
    </blockquote>
    `
    quoteList.appendChild(quoteElement)
}

// Loading the Quotes

const loadQuotes = () =>{
    fetch(QUOTES_WITH_LIKES)
    .then(resp => resp.json())
    .then(data => renderQuotes(data))
}

const renderQuotes = (data) =>{
    data.forEach(quote => renderSingleQuote(quote))
}

const renderSingleQuote = (quote) =>{
    const quoteList = document.querySelector('#quote-list')
    const quoteElement = document.createElement('li')
    quoteElement.className = "quote-card"
    quoteElement.dataset.quoteId = quote.id
    quoteElement.innerHTML = `
    <blockquote class="blockquote">
        <p class="mb-0">${quote.quote}</p>
        <footer class="blockquote-footer">${quote.author}</footer>
        <br>
        <button class='btn-success'>Likes: <span>${quote.likes.length}</span></button>
        <button class='btn-danger'>Delete</button>
    </blockquote>
    `
    quoteList.appendChild(quoteElement)
}