const toggleButton = document.querySelector("#toggleButton")
const toggleMenu = document.querySelector(".toggleMenu")
const overlay = document.querySelector(".overlay")
const contain_menu = document.querySelector(".contain_menu")
const close_menu = document.querySelector(".close_menu")

toggleButton.addEventListener("click", () =>{
    if (toggleMenu.classList.contains("hidden")) {
        toggleMenu.classList.remove("hidden")
    }
    else {
        toggleMenu.classList.add("hidden")
    }
})

const hidden = () =>{
    toggleMenu.classList.add("hidden")
}

close_menu.addEventListener("click", hidden)
contain_menu.addEventListener("click", hidden)

overlay.addEventListener("click", (e) =>{
    e.stopPropagation()
})