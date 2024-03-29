const nameInput = document.getElementById("Name-Input");
const emailInput = document.getElementById("E-Mail-Input");
const commentInput = document.getElementById("Commentary-Input");
const successMessageContainer = document.getElementById("success-message-container");
const invalidNameSign = document.getElementById("invalid-name-sign");
const invalidEmailSign = document.getElementById("invalid-email-sign");
const invalidCommentSign = document.getElementById("invalid-comment-sign");

import saveProductsInLocalStorage from "./saveProductsInLocalStorage.js";
import { showQuantityOfItems } from "./add-delete-products-to-ls.js";
const url = 'https://kaffi-ecommerce.onrender.com/api/v1/products';

await saveProductsInLocalStorage(url);
showQuantityOfItems();



// Función principal para validar el formulario
const dataCheckout = (newComment) => {

    resetValues();
    const isNameValid = validateName(newComment.name, nameInput, invalidNameSign);
    const isEmailValid = validateEmail(newComment.email, emailInput, invalidEmailSign);
    const isCommentValid = validateComment(newComment.commentary, commentInput, invalidCommentSign);

    return isNameValid && isEmailValid && isCommentValid;
};

// Función para validar el nombre
const validateName = (name, nameInput, invalidNameSign) => {
    const regex = /^[a-zA-Z\s]+$/;
    if (name === "" || name.length > 25 || name.length < 2 || !regex.test(name)) {
        errorMessage("Introduzca un nombre válido", errorMessageName);
        nameInput.classList.add("invalid");
        invalidNameSign.style.display = "block";
        return false;
    } else {
        errorMessage("", errorMessageName);
        nameInput.classList.remove("invalid");
        invalidNameSign.style.display = "none";
        return true;
    }
};

// Función para validar el correo electrónico
const validateEmail = (email, emailInput, invalidEmailSign) => {
    const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!regex.test(email)) {
        errorMessage("Introduzca un correo electrónico válido", errorMessageEmail);
        emailInput.classList.add("invalid");
        invalidEmailSign.style.display = "block";
        return false;
    } else {
        errorMessage("", errorMessageEmail);
        emailInput.classList.remove("invalid");
        invalidEmailSign.style.display = "none";
        return true;
    }
};

// Función para validar el comentario
const validateComment = (comment, commentInput, invalidCommentSign) => {
    if (comment.length < 10 || comment.length > 120) {
        errorMessage("Tu comentario debe tener entre 10 y 120 caracteres", errorMessageComment);
        commentInput.classList.add("invalid");
        invalidCommentSign.style.display = "block";
        return false;
    } else {
        errorMessage("", errorMessageComment);
        commentInput.classList.remove("invalid");
        invalidCommentSign.style.display = "none";
        return true;
    }
};

//Imprimir mensaje de error en DOM
const errorMessage = (message, messageContainer) => {
    messageContainer.innerHTML = message;

    if (message === "") {
        messageContainer.style.display = "none";
    } else {
        messageContainer.style.display = "block"; // Mostrar el contenedor de mensaje de error si hay un mensaje
    }
};

const getActualDate = () => {
// Obtener la fecha actual
const currentDate = new Date();

// Obtener los componentes de la fecha
const year = currentDate.getFullYear();
const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Ajustar el mes para que tenga dos dígitos
const day = String(currentDate.getDate()).padStart(2, '0'); // Ajustar el día para que tenga dos dígitos

// Formatear la fecha en el formato deseado (YYYY-MM-DD)
const formattedDate = `${year}-${month}-${day}`;

return formattedDate;
}

const checkUserInfo = async (email) => {
    // Fetch data from the local JSON file
    const apiUrl = "https://kaffi-ecommerce.onrender.com/api/v1/users"; // Reemplaza esto con la ruta correcta de tu archivo JSON
    const response = await fetch(apiUrl);
    const data = await response.json();

    // Busca el usuario con el correo electrónico proporcionado
    const user = data.find(user => user.email === email);

    // Si se encuentra un usuario con el correo electrónico, devuélvelo, de lo contrario, devuelve null
    if (user) {
        console.log(user);
        return user;
    } else {
        return null;
    }
};

//Referencia del formulario de contacto
const contactForm = document.forms["contact-form"];
const errorMessageName = document.getElementById("error-message-name");
const errorMessageEmail = document.getElementById("error-message-email");
const errorMessageComment = document.getElementById("error-message-comment");

contactForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const newComment = {
        name: contactForm.elements["Name-Input"].value,
        email: contactForm.elements["E-Mail-Input"].value,
        commentary: contactForm.elements["Commentary-Input"].value
    };

    // Validar el formulario
    const isFormValid = dataCheckout(newComment);

    // Enviar datos solo si el formulario es válido
    if (isFormValid) {
        nameInput.classList.add("valid");
        emailInput.classList.add("valid");
        commentInput.classList.add("valid");

       const commentToJSON = {
        date: getActualDate(),
        comment: newComment.commentary,
        user: await checkUserInfo(newComment.email)
       }

        sendData(commentToJSON);
    }
});

//Envio de datos a correo electronico o a API
const sendData = async (newComment) => {
    try {
        const apiUrl = "https://kaffi-ecommerce.onrender.com/api/v1/comments";
        
        const response = await fetch(apiUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
                // Puedes agregar más encabezados según sea necesario
            },
            body: JSON.stringify(newComment)
        });

        if (!response.ok) {
            throw new Error(`Error al realizar la solicitud. Código de estado: ${response.status}`);
        }

        const responseData = await response.json();
        console.log("Respuesta del servidor:", responseData);
        showSuccessMessage();
        // Puedes realizar acciones adicionales aquí después de recibir una respuesta exitosa
    } catch (error) {
        console.error("Error:", error.message);
        // Puedes manejar errores aquí, por ejemplo, mostrar un mensaje al usuario
    }

};

const showSuccessMessage = () => {
    successMessageContainer.style.display = "flex"; // Mostrar el contenedor de mensaje de éxito
};

const resetValues =()=>{
    successMessageContainer.style.display = "none";
    nameInput.classList.remove("invalid");
    emailInput.classList.remove("invalid");
    commentInput.classList.remove("invalid");
    invalidNameSign.style.display = "none";
    invalidEmailSign.style.display = "none";
    invalidCommentSign.style.display = "none";
    nameInput.classList.remove("valid");
    emailInput.classList.remove("valid");
    commentInput.classList.remove("valid");
}

const userLoginButton = document.getElementById("enlace-login-header");
userLoginButton.addEventListener("click", event => {
  event.preventDefault();
  // Obtener el accessToken encriptado desde el localStorage
  const encryptedAccessToken = localStorage.getItem('accessToken');

  if (encryptedAccessToken) {
    // Clave secreta para desencriptar (debería ser la misma que usaste para encriptar)
    const secretWord = "CodeTitansRafaFerValdoAlan";
    // Desencriptar el accessToken con CryptoJS
    const decryptedBytes = CryptoJS.AES.decrypt(encryptedAccessToken, secretWord);
    // Convertir los bytes desencriptados a cadena JSON
    const decryptedAccessTokenJSON = decryptedBytes.toString(CryptoJS.enc.Utf8);
    // Parsear la cadena JSON a un objeto JavaScript
    const accessToken = JSON.parse(decryptedAccessTokenJSON);
    if (accessToken) {
      console.log("Inicio de sesion detectado")
      console.log("UserType:" + accessToken.userType);
      if (accessToken.userType === 1) {
        window.location.href = "../pages/admin-profile.html";
      } else if (accessToken.userType === 2) {
        window.location.href = "../pages/profile.html";
      }
    }
  } else {
    window.location.href = "../pages/login.html#login-container";
  }
});