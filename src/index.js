

//fetch quotes
//think of it as, get data from server and then render data somewhere
//first that happens a list 

//command + p
// >format document

function getQuotesData() {
    fetch(`http://localhost:3000/quotes?_embed=likes`)
        .then(response => response.json())
        .then(quotes => {
            renderQuotes(quotes)
        })
}

function renderQuotes(quotes) {
    const quotesList = document.getElementById("quote-list")
    quotesList.innerHTML = ""

    quotes.forEach(quote => {
        quotesList.innerHTML += `
        <li class='quote-card'>
        <blockquote class="blockquote">
        <p class="mb-0">${quote.quote}</p>
        <footer class="blockquote-footer">${quote.author}</footer>
        <br>
        <button class='btn-success'>Likes: <span>${quote.likes.length}</span></button>
        <button class='btn-danger'>Delete</button>
        </blockquote>
        </li>`
    })
}

function addAQuote() {
    document.addEventListener("submit", function (event) {
        event.preventDefault()

        const form = event.target
        const quote = form.quote.value
        const author = form.author.value

        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                quote: quote,
                author: author
            })
        };

        fetch(`http://localhost:3000/quotes?_embed=likes`, options)
            .then(response => response.json())
            .then(getQuotesData)
    })
}

document.addEventListener("click", function (event) {
    if (event.target.className === "btn-success") {
        
        const likeButton = event.target
        const likeButtonSpan = likeButton.querySelector("span")       

        let likeCount = parseInt(likeButtonSpan.innerHTML, 10)

        likeCount++

        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                quoteId: likeCount
            })
        };

        fetch(`http://localhost:3000/likes`,options)
        .then(response => response.json())
        .then(() => {likeButtonSpan.innerHTML= likeCount})
    }
})

document.addEventListener("DOMContentLoaded", function (event) {
    getQuotesData()
    addAQuote()
})


//if they ask you to refresh a page after a fetch, do the initial fetch in your DOM part of the fetch