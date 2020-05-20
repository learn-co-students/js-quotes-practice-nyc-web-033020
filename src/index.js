const quotesUrl = "http://localhost:3000/quotes"
const quotesUrlWithLikes = "http://localhost:3000/quotes?_embed=likes"
const quoteListUl = document.getElementById('quote-list')


document.addEventListener('DOMContentLoaded', () => {
  fetch(quotesUrlWithLikes)
  .then(resp => resp.json())
  .then(addQuoteLis)
});

// below two functions create li for each quote from fetch and add to DOM

const addQuoteLis = (quotesArray) => {
  
  quotesArray.forEach(quote => {
    const quoteLi = makeQuoteLi(quote)
    quoteListUl.appendChild(quoteLi)
  })
}; 

const makeQuoteLi = (quote) => {
  const li = document.createElement('li')
  li.className = 'quote-card'
  li.dataset.id = quote.id
  li.innerHTML = `
    <blockquote class="blockquote">
      <p class="mb-0">
        ${quote.quote}
      </p>
      <footer class="blockquote-footer">
        ${quote.author}
      </footer>
      <br>
      <button class='btn-success'>
        Likes: <span>${quote.likes.length}</span>
      </button>
      <button class='btn-danger'>Delete</button>
    </blockquote>
  `
  return li
};

// adding new quote to DB and DOM

document.addEventListener('submit', (e) => {
  e.preventDefault()
  const form = e.target
  
  const formData = {
    quote: form.quote.value,
    author: form.author.value,
    likes: []
  }

  addNewQuote(formData)
  e.target.reset()
});

const addNewQuote = (formData) => {
  fetch(quotesUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify(formData)
  })
  .then(resp => resp.json())
  .then(quote => {
    quoteListUl.appendChild(makeQuoteLi(quote))
  })
};