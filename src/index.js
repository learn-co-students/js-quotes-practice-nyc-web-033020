document.addEventListener('DOMContentLoaded', () => {

    const baseUrl = 'http://localhost:3000/quotes?_embed=likes'
    const createOrDeleteUrl = 'http://localhost:3000/quotes'
    const likeUrl = 'http://localhost:3000/likes'
    // const form = document.querySelector('#new-quote-form')
    // const formQuote = form.quote.value
    // const formAuthor = form.author.value
    const headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }

    const getQuotes = () => {
        fetch(baseUrl)
            .then(resp => resp.json())
            .then(quotes => {
                renderQuotes(quotes)
            })
                
    }

    const renderQuotes = quotes => {
        quotes.forEach(quoteObj => {
            const quoteList = document.querySelector('#quote-list')
            quoteList.innerHTML += `
                <li class='quote-card' data-id=${quoteObj.id}>
                    <blockquote class="blockquote">
                        <p class="mb-0">${quoteObj.quote}</p>
                        <footer class="blockquote-footer">${quoteObj.author}</footer>
                        <br>
                        <button class='btn-success' data-id=${quoteObj.id}>Likes: <span>0</span></button>
                        <button class='edit' data-id=${quoteObj.id}>Edit</button>
                        <button class='btn-danger'>Delete</button>
                    </blockquote>
                </li>`
        })
    }

    //create new quote after submitting form and add to database
    //add event listener to form 
    //grab input values from form
    //use POST request and pessimistically render new quote to page
    const form = document.querySelector('#new-quote-form')
    form.addEventListener('submit', (e) => {
        e.preventDefault()
        const formQuote = form.quote.value
        const formAuthor = form.author.value

        fetch(createOrDeleteUrl, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify({
                "quote": formQuote,
                "author": formAuthor
            })
        })
            .then(resp => resp.json())
            .then(quoteObj => {
                const quoteArray = [quoteObj]
                renderQuotes(quoteArray)
            })
            form.reset() 

    })

    //grab delete button, add event listener
    //delete target quote from database without refresh
    document.addEventListener('click', (e) => {
        if(e.target.className === 'btn-danger') {
            const quoteId = e.target.parentNode.parentNode.dataset.id 
        
            fetch(`${createOrDeleteUrl}/${quoteId}`, {
                method: 'DELETE',
                headers: headers
            })
                .then(resp => {
                    e.target.parentNode.parentNode.remove()
                })
        //grab like button        
        } else if (e.target.className === 'btn-success'){
            
            const span = e.target.firstElementChild
            span.textContent = parseInt(e.target.firstElementChild.textContent) 
            currentLikes = span.textContent
            const newLikes = parseInt(currentLikes) + 1
            span.textContent = newLikes

            let id = parseInt(e.target.dataset.id)
            
            fetch(likeUrl, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify({
                    quoteId: id
                })
            })
        } else if (e.target.className === 'edit') {
            let id = parseInt(e.target.dataset.id)
            const editForm = document.createElement('form')
            editForm.id = 'edit-form'

            editForm.innerHTML = `
            <label>Quote</label>
            <input type='text' name='quote'>
            <br>
            <label>Author</label>
            <input type='text' name='author'>
            <input type='submit'>
            `
            e.target.insertAdjacentElement('afterend', editForm)

            const editQuote = editForm.quote.value
            const editAuthor = editForm.author.value
            const grabEditForm = document.querySelector('#edit-form')
        
            grabEditForm.addEventListener('submit', (e) => {
                e.preventDefault() 
                fetch(`${createOrDeleteUrl}/${id}`, {
                    method: 'PATCH',
                    headers: headers,
                    body: JSON.stringify({
                        "quote": editQuote,
                        "author": editAuthor
                    })
                })  .then(resp => resp.json())
                    .then(quoteObj => {
                        const quoteArray = [quoteObj]
                        renderQuotes(quoteArray)
                    })
            })    
           
        }
    })

    getQuotes()
})