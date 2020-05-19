document.addEventListener('DOMContentLoaded', () => {
    let quoteList = document.getElementById('quote-list')
        
    function renderQuote(params) {
        let li = document.createElement('li')
            let blockquote = document.createElement('blockquote')
            blockquote.className = 'blockquote'
            blockquote.id = params.id
            blockquote.innerHTML =`
            <p class="mb-0">${params.quote}</p>
            <footer class="blockquote-footer">${params.author}</footer>
            <br>
            <button class='btn-success'>Likes: <span>${params.likes.length}</span></button>
            <button class='btn-danger'>Delete</button>`
            li.appendChild(blockquote)
            quoteList.appendChild(li)
    }

    fetch('http://localhost:3000/quotes?_embed=likes')
    .then(resp => resp.json())
    .then(json => {json.map(quote => {renderQuote(quote)} ) })

    let form = document.getElementById('new-quote-form')
    form.addEventListener('submit', (e) => {
        e.preventDefault()
        fetch('http://localhost:3000/quotes', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                quote: e.target.quote.value,
                author: e.target.author.value
            }),
        }).then(resp => resp.json())
        .then(newQuote => { renderQuote(newQuote)})
    })
    document.addEventListener('click', (e)=> {
        if (e.target.className === "btn-danger"){
            fetch(`http://localhost:3000/quotes/${e.target.parentElement.id}`, {
                method: 'DELETE'
            }).then(resp => resp.json())
            .then(() =>{
                e.target.parentElement.parentElement.remove()
            })
        }else if (e.target.className === "btn-success"){
            fetch('http://localhost:3000/likes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    quoteId: parseInt(e.target.parentElement.id)
                }),
            }).then(resp => resp.json())
            .then(() => {
                e.target.children[0].innerText = parseInt(e.target.children[0].innerText) + 1
            })
        }
    })
})