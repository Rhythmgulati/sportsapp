const registerform = document.querySelector(".register-form");
const loginform = document.querySelector(".login-form");
const showregister = () => {
    registerform.classList.add("display");
    console.log("clicked hai jii");
}
const showlogin = () => {
    loginform.classList.add("display");
    console.log("clicked hai jii");
}
const hideform = ()=>{
    registerform.classList.remove("display");
    loginform.classList.remove("display");
}