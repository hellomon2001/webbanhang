const hidden_cart = document.querySelector(".hidden_cart")
const cart = document.querySelector(".cart")
<<<<<<< HEAD


=======
>>>>>>> f69041ca99fd5ef8960729182e6700032a9fce4a

hidden_cart.addEventListener("mouseenter", () =>{
    cart.classList.remove("obscure");
})

hidden_cart.addEventListener("mouseleave", () =>{
    cart.classList.add("obscure");
})

const obscure = () =>{
    cart.classList.add("obscure")
}
const showCart = () => {
    cart.classList.remove("obscure");
};

<<<<<<< HEAD
cart.addEventListener("mouseenter", showCart)
=======
cart.addEventListener("mouseenter", showCart)
cart.addEventListener("mouseleave", obscure)
>>>>>>> f69041ca99fd5ef8960729182e6700032a9fce4a
