const hidden_cart = document.querySelector(".hidden_cart")
const cart = document.querySelector(".cart")


hidden_cart.addEventListener("mouseenter", () =>{
    if (cart.classList.contains("hidden")) {
        cart.classList.remove("hidden")
    }
    else {
        cart.classList.add("hidden")
    }
})

const hidden = () =>{
    cart.classList.add("hidden")
}