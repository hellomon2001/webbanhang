function togglePassword(inputId, iconId) {
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
}

function showSignIn() {
  document.getElementById("sign_in_section").style.display = "block";
  document.getElementById("register_section").style.display = "none";
}

function showRegister() {
  document.getElementById("sign_in_section").style.display = "none";
  document.getElementById("register_section").style.display = "block";
}

window.onload = function () {
  showSignIn();
};
