document.getElementById("continueToDelivery").addEventListener("click", function (e) {
    // Ngừng hành động mặc định của nút nếu cần (ví dụ, nếu đây là một form)
    e.preventDefault();
    
    // Xóa tất cả sản phẩm trong localStorage
    localStorage.removeItem("cart");
  
    // Bạn có thể thêm một hành động sau khi xóa, ví dụ, điều hướng tới trang khác
    window.location.href = "/order.html"; // Chuyển hướng tới trang delivery
  });
  