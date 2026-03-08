// pothome btn sign dhori

const loginBtn = document.getElementById("login-btn");

loginBtn.addEventListener("click", function () {
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();

  const defaultUsername = "admin";
  const defaultPassword = "admin123";

  if (username === defaultUsername && password === defaultPassword) {
    // ok>then
    alert("Login Successful");
    // er por porer index jete dibo
    window.location.href = "main.html";
  } else {
    alert("Incorrect username or password");
  }
});
