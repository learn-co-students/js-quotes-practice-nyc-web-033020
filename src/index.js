const quotesUrl = 'http://localhost:3000/quotes'
const likesUrl = "http://localhost:3000/likes"
const quiteList = document.querySelector('#quote-list')
const likeButtons = document.querySelectorAll('btn-success')
  
  /// display quotes method
  function displayQuotes(element){
     const singleQ = document.createElement('li')
      singleQ.setAttribute('class','quote-card')
      singleQ.setAttribute('id',`${element.id}`)
      singleQ.innerHTML = ` <blockquote class="blockquote">
      <p class="mb-0">${element.quote}</p>
      <footer class="blockquote-footer">${element.author}</footer>
      <br>
      <button class='btn-success' id='${element.id}' >Likes: <span>0</span></button>
      <button class='btn-danger'>Delete</button>
      </blockquote>`
      quiteList.appendChild(singleQ)
}

/// add likes to display 
function displayLikes(array){
    array.forEach(like => {
        const idQ = parseInt(like.quoteId)
        console.log(idQ)
        const quoteToLike = document.querySelectorAll('span')[idQ - 1]
        console.log(quoteToLike)
        const num = parseInt(quoteToLike.innerHTML)
        quoteToLike.innerText = num + 1
    })
}




document.addEventListener('DOMContentLoaded', function(){

  fetch(quotesUrl).then(res => res.json()).then(quotes => {quotes.map(element => {displayQuotes(element)})})

/// fetch likes 
  fetch(likesUrl).then(res => res.json()).then(likes => displayLikes(likes))



 /// like and delete quotes 
document.addEventListener('click', function(e){
   const id = parseInt(e.target.parentElement.parentElement.id)
  if (e.target.className === "btn-success"){
    //  const currentLikes = e.target.parentElement.querySelector('span')
    //  const newLikes = parseInt(currentLikes.innerHTML) + 1 
          fetch(`${likesUrl}`, {
              method: 'POST',
              headers: {
                  "content-type": "application/json",
                  Accept: "application/json"
              },
              body: JSON.stringify({
                  quoteId: id
              })
          })       
                 /// adding a like on the page
                    const idQnew = parseInt(id)
                    const quoteToLikenew = document.querySelectorAll('span')[idQnew - 1]
                    const likesAmountNew = parseInt(quoteToLikenew.innerHTML) + 1
                    console.log(likesAmountNew)
                    quoteToLikenew.innerHTML = `${likesAmountNew}`

  } else if (e.target.className === 'btn-danger'){
    const bookToRemove = document.getElementById(`${id}`)
    bookToRemove.remove()
                    fetch(`${quotesUrl}/${id}`,{
                        method: 'DELETE',
                        headers: {
                            "content-type": "application/json",
                            Accept: "application/json"
                        }
                    })

  }
})


  /// add new quote 
  document.addEventListener('submit', function(e){
      e.preventDefault()
      const form = document.querySelector('form')
      const quote = document.querySelectorAll('input')[0].value 
      const author = document.querySelectorAll('input')[1].value 
          fetch(quotesUrl,{
              method: 'POST',
              headers: {
                  "content-type": "application/json",
                  Accept: "application/json"
              },
              body: JSON.stringify({
                  'quote': quote,
                  'author': author 
              })
          }).then(res => res.json()).then(newQs => {
                let newsingleQ = document.createElement('li')
                newsingleQ.setAttribute('class','quote-card')
                newsingleQ.innerHTML = ` <blockquote class="blockquote">
                <p class="mb-0">${newQs.quote}</p>
                <footer class="blockquote-footer">${newQs.author}</footer>
                <br>
                <button class='btn-success'>Likes: <span>0</span></button>
                <button class='btn-danger'>Delete</button>
                </blockquote>`
                quiteList.appendChild(newsingleQ)}
            )
      
      form.reset()
  })
  





})