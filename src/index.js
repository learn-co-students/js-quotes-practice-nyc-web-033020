document.addEventListener('DOMContentLoaded', (event) => {
    const list = document.getElementById('quote-list')
    const form = document.getElementsByTagName('form')[0]
    const quoteInput = document.getElementsByClassName('form-group')[0]
    const authorInput = document.getElementsByClassName('form-group')[1]
    // const likeButton = document.getElementsByClassName('btn-success')[10]
    // console.log(likeButton)
    
    getQuotes()
    function getQuotes(){
        fetch('http://localhost:3000/quotes?_embed=likes')
        .then(r => r.json())
        .then(quotes => listQuotes(quotes))
    }
    function listQuotes(datas){
        list.innerHTML = ''
        datas.forEach(data=> {
            
            const li = document.createElement('li')
            li.className = 'quote-card'
            li.innerHTML = `<blockquote class="blockquote">
              <p class="mb-0">${data.quote}</p>
              <footer class="blockquote-footer">${data.author}</footer>
              <br>
              <button data-id='${data.id}' class='btn-success'>Likes: <span>${data.likes.length}</span></button>
              <button data-id='${data.id}' class='btn-danger'>Delete</button>
            </blockquote>`
            list.append(li)   
            li.dataset.id = data.id     

        })
    }
 form.addEventListener('submit', function(event){
    event.preventDefault()
    
     createQuote()
    function createQuote(){
        fetch('http://localhost:3000/quotes', {
            method: "POST", 
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
              },
              body: JSON.stringify({quote: form.quote.value, author: form.author.value})
        })
        .then(r => r.json())
        .then(getQuotes) 
    }
            
     })

     document.addEventListener('click', function (event){



        // console.log( event.target.dataset.id) 
         if (event.target.className ==='btn-success'){
        let span = event.target.children[0]
         newNum = parseInt(span.innerHTML) +1 
        //  span.innerHTML = newNum 

            const id = parseInt(event.target.dataset.id)
        //  const id = event.target.parentNode.parentNode.dataset.id 
         
            fetch(`http://localhost:3000/likes`,{
                method:"POST", 
                headers:  {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'   
                  },
                body: JSON.stringify({quoteId: id, createdA: Date.now()  })
            })
            .then(() =>  span.innerHTML = newNum )
           
         }
     })
});

