const search = document.querySelector(".search")
const hidden_search = document.querySelector(".hidden_search")
const content_search = document.querySelector(".content_search")
const over_search = document.querySelector(".over_search")

search.addEventListener("click" ,(e) =>{
    e.preventDefault()
})

search.addEventListener("click", () =>{
    if (hidden_search.classList.contains("off")) {
        hidden_search.classList.remove("off")
    }
    else {
        hidden_search.classList.add("off")
    }
})

const off = () =>{
    hidden_search.classList.add("off")
}

over_search.addEventListener("click", off)

content_search.addEventListener("click", (e) =>{
    e.stopPropagation()
})