const hidden_cart = document.querySelector(".hidden_cart")
const cart = document.querySelector(".cart")
const overlay_cart = document.querySelector(".overlay_cart")


hidden_cart.addEventListener("mouseenter", () =>{
    cart.classList.remove("obscure");
})

hidden_cart.addEventListener("mouseleave", () =>{
    cart.classList.add("obscure");
})

const obscure = () =>{
    cart.classList.add("obscure")
}
// const showCart = () => {
//     cart.classList.remove("obscure");
// };

cart.addEventListener("mouseenter", obscure)