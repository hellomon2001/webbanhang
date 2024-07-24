const search = document.querySelector(".search")
const hidden_search = document.querySelector(".hidden_search")
const content_search = document.querySelector(".content_search")
const over_search = document.querySelector(".over_search")

search.addEventListener("click", () =>{
    if (hidden_search.classList.contains("hidden")) {
        hidden_search.classList.remove("hidden")
    }
    else {
        hidden_search.classList.add("hidden")
    }
})

const hidden = () =>{
    hidden_search.classList.add("hidden")
}

over_search.addEventListener("click", hidden)

content_search.addEventListener("click", (e) =>{
    e.stopPropagation()
})