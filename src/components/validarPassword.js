// src/components/validarPassword.js

// Funcion principal de validacion (exportada para onKeyup/onChange)
export function validarPassword(contrasena) {
    const requisitosDiv = document.getElementById("requisitosPassword");

    // Mostrar los requisitos si hay algún carácter ingresado
    if (contrasena.length > 0) {
        requisitosDiv.style.display = "block";
    } else {
        requisitosDiv.style.display = "none";
    }

    // 1. Requisitos y sus expresiones regulares (RegEx)
    const regex = {
        longitud:     /.{8,}/,            // Al menos 8 caracteres
        mayuscula:    /[A-Z]/,            // Al menos una mayúscula
        numero:       /[0-9]/,            // Al menos un número
        especial:     /[!@#$%^&*()_+={}[\]:;"'<>,.?/\\-]/ // Al menos un caracter especial
    };

    // 2. Verificar Longitud
    verificarRegla(regex.longitud.test(contrasena), "req-longitud");

    // 3. Verificar Mayúscula
    verificarRegla(regex.mayuscula.test(contrasena), "req-mayuscula");
    
    // 4. Verificar Número
    verificarRegla(regex.numero.test(contrasena), "req-numero");

    // 5. Verificar Caracter Especial
    verificarRegla(regex.especial.test(contrasena), "req-especial");
}

// Funcion de control visual (exportada para OnBlur)
export function ocultarRequisitos() {
    const requisitosDiv = document.getElementById("requisitosPassword");
    if (requisitosDiv) {
        requisitosDiv.style.display = "none";
    }
}

// Función auxiliar para actualizar el estado de cada regla
function verificarRegla(esValido, idElemento) {
    const elemento = document.getElementById(idElemento);
    
    if (esValido) {
        elemento.classList.remove("invalido");
        elemento.classList.add("valido");
        elemento.innerHTML = '✅' + elemento.innerHTML.substring(1); // Cambia ❌ por ✅
    } else {
        elemento.classList.remove("valido");
        elemento.classList.add("invalido");
        elemento.innerHTML = '❌' + elemento.innerHTML.substring(1); // Mantiene o cambia a ❌
    }
}