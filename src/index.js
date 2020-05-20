const quotesUrl = "http://localhost:3000/quotes" 
const likesUrl = " http://localhost:3000/likes" 
const quoteList = document.querySelector('#quote-list') 
const likeButton = document.querySelector('btn-success') 

function displayQuotes(element) {
    const singleQuote = document.createElement('li') 
    singleQuote.setAttribute('class', 'quote-card') 
    singleQuote.setAttribute('id',`${element.id}`) 
    singleQuote.innerHTML = `<blockquote class="blockquote">
        <p class="mb-0">${element.quote}</p>
        <footer class="blockquote-footer">${element.author}</footer>
        <br>
        <button class='btn-success' id=${element.id}>Likes: <span>0</span></button>
        <button class='btn-danger'>Delete</button> 
        </blockquote>` 
    quoteList.appendChild(singleQuote) 
} 

function displayLikes(array) {
    array.forEach(like => {
        const quoteId = parseInt(like.quoteId) 
        console.log(quoteId) 
        const likeQuote = document.querySelectorAll('span')[quoteId - 1] 
        console.log(likeQuote) 
        const number = parseInt(likeQuote.innerHTML) 
        likeQuote.innerText = number + 1 
    })
} 

document.addEventListener('DOMContentLoaded', function(){
    fetch(quotesUrl)
        .then(res => res.json()) 
        .then(quotes => {quotes.map(element => {displayQuotes(element)})}) 
    
    fetch(likesUrl) 
        .then(res => res.json()) 
        .then(likes => displayLikes(likes)) 
    
    document.addEventListener("click", e => {
        const id = parseInt(e.target.parentElement.parentElement.id) 
        if (e.target.className === "btn-success") {
            fetch(`${likesUrl}`, {
                method: "POST", 
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json"
                }, 
                body: JSON.stringify({
                    quoteId: id 
                })
            }) 
            const newQuoteId = parseInt(id) 
            const newLikeQuote = document.querySelectorAll('span')[newQuoteId - 1] 
            const newLikesCount = parseInt(newLikeQuote.innerHTML) + 1 
            console.log(newLikesCount) 
            newLikeQuote.innerHTML = `${newLikesCount}` 
        } else if (e.target.className === 'btn-danger') {
            const removeBook = document.getElementById(`${id}`) 
            removeBook.remove() 
            fetch(`${quotesUrl}/${id}`, {
                method: "DELETE", 
                headers: {
                    "Content-Type": "application/json", 
                    Accept: "application/json" 
                }
            })
        }
    })
    document.addEventListener("submit", e => {
        e.preventDefault() 
        const form = document.querySelector('form') 
        const quote = document.querySelectorAll('input')[0].value 
        const author = document.querySelectorAll('input')[1].value 
        
        fetch(quotesUrl, {
            method: "POST", 
            headers: {
                "Content-Type": "application/json", 
                Accept: "application/json" 
            }, 
            body: JSON.stringify({
                'quote': quote,
                'author': author
            })
        }) 
        .then(res => res.json()) 
        .then(newQuotes => {
            let newSingleQuote = document.createElement('li') 
            newSingleQuote.setAttribute('class', 'quote-card') 
            newSingleQuote.innerHTML = `<blockquote class="blockquote">
                <p class="mb-0">${newSingleQuote.quote}</p>
                <footer class="blockquote-footer">${newSingleQuote.author}</footer>
                <br>
                <button class='btn-success>Likes: <span>0</span></button>
                <button class='btn-danger'>Delete</button>
                </blockquote>`
            quoteList.appendChild(newSingleQuote) 
        })
        form.reset() 
    })
})