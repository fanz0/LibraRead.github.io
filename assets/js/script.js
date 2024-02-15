// get the elements of search engine
const bookSearched = document.getElementById('book-searched')
const button = document.getElementById('search')

// search all
button.addEventListener("click", () => {
    while(container.firstChild) {
        container.removeChild(container.firstChild)
    }
    fetch(`https://openlibrary.org/search.json?q=${bookSearched.value}`)
        .then(response => response.json())
        .then(data => {
            if (data) {
                    let arrData = data.docs;
                    (arrData || []).forEach( element => {
                        let {cover_i, title, author_name, publish_year, key} = element
                        addValue(title, author_name, publish_year, cover_i, key)
                    })
            }
        })
        .catch(e => console.log("Errore: ", e))
})


// define the container of the cards
const container = document.getElementById("elements")

// function that creates the card
function addValue(title, author, date, cover_id, key) {

    const div = document.createElement("div")
    div.className = "relative flex w-[70%] h-64 mt-8 bg-sky-200 rounded-lg gap-10 mb-10 max-[600px]:gap-1 max-[600px]:w-[100%] max-[768px]:w-[90%] max-[1024px]:w-[80%]"

    const img = document.createElement('img')
    if (cover_id != undefined) {
        img.src = `https://covers.openlibrary.org/b/id/${cover_id}-M.jpg`
    } else {
        img.src = "assets/images/not_found_cornice-removebg-preview.png"
    }
    img.className = "flex-initial h-64 max-w-52 w-1/5 max-[480px]:w-16 max-[600px]:w-32 rounded-lg"

    const information = document.createElement('div')
    information.className = "w-[70%] flex flex-col gap-1"

    const titleH3 = document.createElement('h3')
    titleH3.className = "ml-10 font-bold h-16 mt-5"
    titleH3.textContent = title

    const authorH4 = document.createElement('h4')
    authorH4.textContent = author
    authorH4.className = "ml-10 font-semibold h-16"

    const ul = document.createElement('ul')
    ul.className = "ml-10 h-16 overflow-y-auto"
    ul.textContent = "-Pubblicazioni-"
    if (typeof date == "array") {
        (date).forEach(element => {
            const li = document.createElement("li")
            li.textContent = element
            ul.appendChild(li)
        })
    } else {
        const li = document.createElement("li")
        li.textContent = date
        ul.appendChild(li)
    }

    information.appendChild(titleH3)
    information.appendChild(authorH4)
    information.appendChild(ul)

    div.appendChild(img)
    div.appendChild(information)

    container.appendChild(div)

    const descriptionParagraph = document.createElement("p")

    fetch(`https://openlibrary.org${key}.json`)
        .then(response => response.json())
        .then(data => {
            if (data) {
                let {description} = data
                if (description != undefined && typeof description != "object") {
                    descriptionParagraph.textContent = description
                    descriptionParagraph.className = "my-4 overflow-y-auto hidden"
                    div.appendChild(readMore)
                } else if (description != undefined && typeof description == "object") {
                    let {value} = description
                    descriptionParagraph.textContent = value
                    descriptionParagraph.className = "my-4 overflow-y-auto hidden"
                    div.appendChild(readMore)
                }       
            }
        })
        .catch(error => console.log("Errore: ", error))

    information.appendChild(descriptionParagraph)

    const readMore = document.createElement("button")

    readMore.className = "border flex-initial h-min mr-0 rounded-lg text-lg hover:bg-slate-200 w-fit max-w-40 absolute right-0"
    readMore.textContent = "Trama"

    readMore.addEventListener("click", () => {
        if (readMore.textContent == "Trama") {
            titleH3.classList.add("hidden")
            authorH4.classList.add("hidden")
            ul.classList.add("hidden")
            descriptionParagraph.classList.remove("hidden")
            readMore.textContent = "Indietro"
        } else {
            titleH3.classList.remove("hidden")
            authorH4.classList.remove("hidden")
            ul.classList.remove("hidden")
            descriptionParagraph.classList.add("hidden")
            readMore.textContent = "Trama"
        }
    })

}

// switch options in select
const select = document.getElementById("select")

select.addEventListener("change", () => {
    button.addEventListener("click", () => {
        while(container.firstChild) {
            container.removeChild(container.firstChild)
        }
        if (select.value == "Argomento") {
            fetch(`https://openlibrary.org/subjects/${bookSearched.value}.json?limit=100`)
            .then(response => response.json())
            .then(data => {
                if (data) {
                    let arrData = data.works
                    arrData.forEach(element => {
                        let {cover_id, title, authors, first_publish_year, key} = element
                        authors.forEach(keyObj => {
                            let authors_name = Object.values(keyObj)[1]
                            addValue(title, authors_name, first_publish_year, cover_id , key)
                        })
                    })
                }
            })
            .catch(e => console.log(e))
        } else if (select.value == "Tutto") {
            fetch(`https://openlibrary.org/search.json?q=${bookSearched.value}`)
            .then(response => response.json())
            .then(data => {
                if (data) {
                    let arrData = data.docs;
                    (arrData || []).forEach( element => {
                        let {cover_i, title, author_name, publish_year, key} = element
                        addValue(title, author_name, publish_year, cover_i, key)
                    })
                }
            })
            .catch(e => console.log(e))
        }
    })
})