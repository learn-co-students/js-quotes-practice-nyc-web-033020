document.addEventListener('DOMContentLoaded', () => {

const quotesUrl = 'http://localhost:3000/quotes?_embed=likes'
const baseUrl = 'http://localhost:3000/quotes'
const likesUrl = 'http://localhost:3000/likes'

function displayQuotes(array){
    const quoteList = document.querySelector('#quote-list')
    array.forEach(quote => {
        const li = document.createElement('li')
        li.setAttribute('class', 'quote-card')
        li.setAttribute('data-id', `${quote.id}`)
        li.innerHTML =
        `
        <blockquote class="blockquote">
            <p class="mb-0">${quote.quote}</p>
            <footer class="blockquote-footer">${quote.author}</footer>
            <br>
            <button class='btn-success' data-id='${quote.id}'>Likes: <span>${quote.likes.length}</span></button>
            <button class='btn-danger'>Delete</button>
        </blockquote>
        `
        quoteList.append(li)
    })
}

document.addEventListener('submit', e => {
    e.preventDefault()
    const form = document.querySelector('#new-quote-form')
    const newQuote = form.quote.value
    const newAuthor = form.author.value
    fetch(quotesUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            quote: newQuote,
            author: newAuthor,
            likes: []
        })
    })
    .then(res => res.json())
    .then(quote => {
        const quoteArray = [quote]
        displayQuotes(quoteArray)
    })
})

document.addEventListener('click', e => {
    if (e.target.className === 'btn-danger'){
        const quoteToDelete = e.target.parentElement.parentElement
        const id = quoteToDelete.getAttribute('data-id')
        fetch(baseUrl + '/' + id, {
            method: 'DELETE',
            headers:{
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
            
        })
        .then(res => res.json())
        .then(() => window.location.reload())
    }else if (e.target.className === 'btn-success'){
        quoteId = parseInt(e.target.getAttribute('data-id'))
        fetch(likesUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                quoteId: quoteId,
                // createdAt: Math.floor(+ new Date() / 1000)
                createdAt:  Math.floor(Date.now() / 1000)
            })
        })
        let currentLikes =  e.target.querySelector('span')
        currentLikes.innerHTML = parseInt(currentLikes.innerHTML) + 1 

        // .then(res => res.json())
        // .then(() => window.location.reload())
    }
})

fetch(quotesUrl)
.then(res => res.json())
.then(quotes => displayQuotes(quotes))


})