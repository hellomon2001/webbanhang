document.addEventListener("DOMContentLoaded", () => {
  // Toggle hiển thị mật khẩu
  const togglePasswordVisibility = (inputId, iconId) => {
    const passwordInput = document.getElementById(inputId);
    const toggleIcon = document.getElementById(iconId);

    const isHidden = passwordInput.type === "password";
    passwordInput.type = isHidden ? "text" : "password";
    toggleIcon.classList.toggle("fa-eye-slash", !isHidden);
    toggleIcon.classList.toggle("fa-eye", isHidden);
  };

  document.querySelectorAll(".toggle-password").forEach(button => {
    button.addEventListener("click", () => {
      const inputId = button.getAttribute("data-target");
      const iconId = button.getAttribute("data-icon");
      togglePasswordVisibility(inputId, iconId);
    });
  });

  // Giao diện: chuyển tab giữa Đăng nhập và Đăng ký
  const signInSection = document.getElementById("sign_in_section");
  const registerSection = document.getElementById("register_section");
  const toggleSection = (showSignIn) => {
    signInSection.style.display = showSignIn ? "block" : "none";
    registerSection.style.display = showSignIn ? "none" : "block";
  };

  toggleSection(true); // Mặc định hiển thị đăng nhập

  document.getElementById("joinUsButton").addEventListener("click", () => toggleSection(false));
  document.getElementById("signInButton").addEventListener("click", () => toggleSection(true));

  // Xử lý đăng nhập
  const loginForm = document.getElementById("loginForm");
  loginForm.onsubmit = async (e) => {
    e.preventDefault();
    const submitBtn = loginForm.querySelector("button[type='submit']");
    submitBtn.disabled = true;

    const dataForm = new FormData(loginForm);
    const username = dataForm.get("username");
    const password = dataForm.get("password");

    if (!username || !password) {
      alert("Vui lòng nhập đầy đủ tài khoản và mật khẩu.");
      submitBtn.disabled = false;
      return;
    }

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const result = await response.json();

      if (response.ok && result.meta.success) {
        // Chỉ lưu token nếu có
        localStorage.setItem("token", result.data.token);
        const role = result.data.role;
        if (role === "admin") {
          window.location.href = "/admin";
        } else {
          window.location.href = "/welcome.html";
        }
      } else {
        alert(result.meta.message || "Đăng nhập thất bại!");
      }
    } catch (error) {
      alert("Lỗi khi gửi yêu cầu đăng nhập!");
    } finally {
      submitBtn.disabled = false;
    }
  };

  // Xử lý đăng ký
  const registerForm = document.getElementById("registerForm");
  registerForm.onsubmit = async (e) => {
    e.preventDefault();
    const submitBtn = registerForm.querySelector("button[type='submit']");
    submitBtn.disabled = true;

    const dataForm = new FormData(registerForm);
    const username = dataForm.get("username");
    const password = dataForm.get("password");

    if (!username || !password) {
      alert("Vui lòng nhập đầy đủ tài khoản và mật khẩu.");
      submitBtn.disabled = false;
      return;
    }

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const result = await response.json();

      if (response.ok && result.meta.success) {
        alert("Đăng ký thành công! Vui lòng đăng nhập.");
        toggleSection(true);
      } else {
        alert(result.meta.message || "Đăng ký thất bại!");
      }
    } catch (error) {
      alert("Lỗi khi gửi yêu cầu đăng ký!");
    } finally {
      submitBtn.disabled = false;
    }
  };
});
