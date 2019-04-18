about = document.getElementById('about')
aboutH2 = about.querySelector('h2');
aboutP = about.querySelector('p')

class Book {
    constructor(title, author, id, info) {
        this.title = title;
        this.author = author;
        this.id = id;
        this.info = info;
    }
}

class Store {
    static getBooks() {
        let books 
        if (localStorage.getItem('books') === null) {
            books = []
        } else {
            books = JSON.parse(localStorage.getItem('books'))
        }

        return (books)
    }

    static addBook(book) {
        const books = Store.getBooks()

        books.push(book)
        localStorage.setItem('books', JSON.stringify(books))

    }

    static getInfo(id) {
        const books = Store.getBooks()
        let info = "We don't know anything about this book =("
        books.forEach((book, index) => {
            if (book.id == id) {
                console.log(book.info);
                info = book.info
            }
        })

        return (info)
    }

    static removeBook(id) {
        const books = Store.getBooks()
    
        books.forEach((book, index) => {
            if (book.id == id) {
                books.splice(index, 1);
            }
        })
        localStorage.setItem('books', JSON.stringify(books))
    }
}

class UI {

    static displayBooks() {
        const books =  Store.getBooks();

        books.forEach((book) => UI.addBookToList(book))
    }

    static addBookToList(book) {
        const list = document.querySelector('#book-list')

        const row = document.createElement('tr')

        row.innerHTML= `
        <td> ${book.title} </td>
        <td> ${book.author} </td>
        <td> ${book.id} </td>
        <td> <a href="#" class="btn btn-danger btn-sm delete">delete</a> </td>
        <td> <a href="#" class="btn btn-primary btn-sm about-open">about</a> </td>
        `

        list.appendChild(row)
    }

    static clearFields() {
        document.querySelector('#title').value = ''
        document.querySelector('#author').value = ''
        document.querySelector('#id').value = ''
        document.querySelector('#info').value = ''
        const alert = document.querySelector('.alert')
        if (alert) {
            alert.remove()
        }
    }

    static deleteBook(target) {
        if (target.classList.contains('delete')) {
            target.parentElement.parentElement.remove()
        }
    }

    static showAbout(target) {
        if (target.classList.contains('about-open')) {
            aboutH2.innerHTML = target.parentElement.parentElement.firstElementChild.textContent
            aboutP.innerHTML = Store.getInfo(target.parentElement.previousElementSibling.previousElementSibling.textContent.trim())
            about.style.display = 'block';
        }
    }

    static showAlert(message) {
        if (!document.querySelector('.alert'))
        {
            const div = document.createElement('div')
            div.className = `alert alert-danger`
            div.appendChild(document.createTextNode(message))
            const container = document.querySelector('.container')
            const form = document.querySelector('#book-form')
            container.insertBefore(div, form)
        }
    }
}

document.addEventListener('DOMContentLoaded', UI.displayBooks)

document.querySelector('#book-form').addEventListener('submit', (e) => {
    e.preventDefault()
    const title = document.querySelector('#title').value
    const author = document.querySelector('#author').value
    const id = document.querySelector('#id').value
    const info = document.querySelector('#info').value
    if (title === '' || author === '' || id === '') {
        UI.showAlert("Please, enter all fields")
    }   else {
        const book = new Book(title, author, id, info)
        UI.addBookToList(book)
        Store.addBook(book)
        UI.clearFields()
    }
})

document.querySelector('#book-list').addEventListener('click', (e) => {
    Store.removeBook(e.target.parentElement.previousElementSibling.textContent.trim())
    UI.deleteBook(e.target)
    UI.showAbout(e.target)
})

about.addEventListener('click', (e) => {
    if (e.target.classList.contains('about-close')
        || e.target == about) {
        about.style.display = 'none'
    }
})