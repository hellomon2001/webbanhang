document.addEventListener("DOMContentLoaded", () => {
    const togglePasswordVisibility = (inputId, iconId) => {
      const passwordInput = document.getElementById(inputId);
      const toggleIcon = document.getElementById(iconId);

      if (passwordInput.type === "password") {
        passwordInput.type = "text";
        toggleIcon.classList.remove("fa-eye-slash");
        toggleIcon.classList.add("fa-eye");
      } else {
        passwordInput.type = "password";
        toggleIcon.classList.remove("fa-eye");
        toggleIcon.classList.add("fa-eye-slash");
      }
    };

    const toggleButtons = document.querySelectorAll(".toggle-password");

    toggleButtons.forEach(button => {
      button.addEventListener("click", () => {
        const inputId = button.getAttribute("data-target");
        const iconId = button.getAttribute("data-icon");
        togglePasswordVisibility(inputId, iconId);
      });
    });

    const joinUsButton = document.getElementById("joinUsButton");
    const signInButton = document.getElementById("signInButton");

    const signInSection = document.getElementById("sign_in_section");
    const registerSection = document.getElementById("register_section");

    signInSection.style.display = "block";
    registerSection.style.display = "none";

    joinUsButton.addEventListener("click", () => {
      signInSection.style.display = "none";
      registerSection.style.display = "block";
    });

    signInButton.addEventListener("click", () => {
      signInSection.style.display = "block";
      registerSection.style.display = "none";
    });

    const loginForm = document.getElementById("loginForm");
    loginForm.onsubmit = async (e) => {
      e.preventDefault();
      const dataForm = new FormData(loginForm);
      const username = dataForm.get("username");
      const password = dataForm.get("password");

      try {
        const response = await fetch("/api/auth/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username, password }),
        });
        const result = await response.json();
        if (response.ok && result.meta.success) {
          localStorage.setItem("user", JSON.stringify(result.data));
          window.location.href = "/account.html"; 
        } else {
            alert("Login failed!"); 
        }
        
      } catch (error) {
        alert("An error occurred!");
      }
    };

    const registerForm = document.getElementById("registerForm");
    registerForm.onsubmit = async (e) => {
      e.preventDefault();
      const dataForm = new FormData(registerForm);
      const username = dataForm.get("username");
      const password = dataForm.get("password");

      try {
        const response = await fetch("/api/auth/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username, password }),
        });
        const result = await response.json();
        if (response.ok && result.meta.success) {

          signInSection.style.display = "block"; 
          registerSection.style.display = "none";
        } else {
            alert("Register failed!"); 
        }
      } catch (error) {
        alert("An error occurred!"); 
      }
    };
  });