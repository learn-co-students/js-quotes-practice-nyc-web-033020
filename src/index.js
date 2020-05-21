function runWebApp() {
  const quotesUrl = "http://localhost:3000/quotes"
  const quotesAndLikesUrl = quotesUrl + "?_embed=likes"
  const likesUrl = "http://localhost:3000/likes/"
  const quoteList = document.getElementById("quote-list")
  const newQuoteForm = document.getElementById("new-quote-form")

  function fetchQuotesWithLikes() {
    fetch(quotesAndLikesUrl)
      .then(res => res.json())
      .then(json => displayQuotes(json))
  }

  function postQuote(quoteObj) {
    fetch(quotesUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        quote: quoteObj.quote,
        author: quoteObj.author
      })
    })
      .then(res => res.json())
      .then(json => addQuoteNode(json))
  }

  function deleteQuote(id) {
    fetch(`${quotesUrl}/${id}`, {
      method: "delete",
      headers: {
        "Content-Type": "applcation/json"
      }
    })
  }

  function postLike(quoteId) {
    fetch(likesUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        quoteId: Number(quoteId)
      })
    })
  }

  function addQuoteNode(quote) {
    const quoteLi = document.createElement("li")
    const likes = quote.likes

    quoteLi.dataset.id = quote.id
    quoteLi.className = "quote-card" 
    quoteLi.innerHTML = `
     <blockquote class="blockquote">
      <p class="mb-0">${quote.quote}</p>
      <footer class="blockquote-footer">${quote.author}</footer>
      <br>
      <button data-action='like' class='btn-success'>Likes: <span>${likes ? likes.length : 0}</span></button>
      <button data-action='delete' class='btn-danger'>Delete</button>
    </blockquote>       
    `

    quoteList.appendChild(quoteLi)
  }

  function displayQuotes(quotes) {
    quoteList.innerHTML = ''

    quotes.forEach(quote => {
      addQuoteNode(quote)
    })
  }

  fetchQuotesWithLikes()

  newQuoteForm.addEventListener("submit", e => {
    e.preventDefault()
    newQuote = {
      quote: e.target.quote.value,
      author: e.target.author.value
    }
    postQuote(newQuote)
  })

  quoteList.addEventListener("click", e => {
    const quoteId = e.target.parentNode.parentNode.dataset.id

    if (e.target.dataset.action === "delete") {
      quoteList.querySelector(`[data-id="${quoteId}"]`).remove()

      deleteQuote(quoteId)
    } else if (e.target.dataset.action === "like") {
      const likesCount = e.target.querySelector("span")
      likesCount.textContent++

      postLike(quoteId) 
    }
  })
}

runWebApp()
