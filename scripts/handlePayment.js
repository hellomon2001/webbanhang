document
  .getElementById("continueToDelivery")
  .addEventListener("click", function (e) {
    e.preventDefault();


    localStorage.removeItem("cart");

    window.location.href = "/order.html"; 
  });
