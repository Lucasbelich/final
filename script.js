// Tienda de video-juegos
// 1) Bienvenida al cliente
// 2) Seleccion de video-juegos
// 3) Carro de compras
// 4) Almacenar carrito en localStorage

const items = document.getElementById("items");
const footer = document.getElementById("footer");
const templateFooter = document.getElementById("template-footer").content;
const templateCart = document.getElementById("template-cart").content;
const fragment = document.createDocumentFragment();
let cart = {};

//Incorporacion de Fetch
async function getGames() {
  const response = await fetch("./juegos.json");
  return await response.json();
}

items.addEventListener("click", (e) => {
  btnAction(e);
});

const welcome = () => {
  let formPerson = document.getElementById("idForm");
  let inputName = document.getElementById("nameForm");
  let inputSurname = document.getElementById("surnameForm");
  let greeting = document.getElementById("greeting");

  formPerson.addEventListener("submit", (e) => {
    e.preventDefault();
    greeting.innerHTML = `Bienvenido ${inputName.value} ${inputSurname.value}`;
  });
};

const userGameSelector = () => {
  let divGames = document.getElementById("divGames");

  divGames.addEventListener("click", (e) => {
    addCart(e);
  });

  getGames().then((juegos) => {
    juegos.forEach((juegos) => {
      divGames.innerHTML += `
              <div class="card" id="juego${juegos.id}" style="width: 18rem;">
                  <img src="./img/${juegos.img}" class="card-img-top" alt="${juegos.nombre}">
                  <div class="card-body">
                      <h5 class="card-title">${juegos.nombre}</h5>
                      <p class="card-text">${juegos.precio}</p>
                      <button id="${juegos.id}" class="btn btn-primary" > Comprar </button>
                      </div>
                  </div>
              `;
    });
  });

  let addCart = (e) => {
    if (e.target.classList.contains("btn-primary")) {
      setCart(e.target.parentElement);
      sweetToast(
        `green`,
        `success`,
        `bottom-start`,
        `Se ha añadido un producto`
      );
    }
  };
};

const setCart = (juegos) => {
  const product = {
    id: juegos.querySelector(".btn-primary").id,
    nombre: juegos.querySelector("h5").textContent,
    precio: juegos.querySelector("p").textContent,
    cantidad: 1,
  };

  if (cart.hasOwnProperty(product.id)) {
    product.cantidad = cart[product.id].cantidad + 1;
  }

  cart[product.id] = { ...product };
  showCart();
};

const showCart = () => {
  items.innerHTML = "";
  Object.values(cart).forEach((juegos) => {
    templateCart.querySelector("th").textContent = juegos.id;
    templateCart.querySelectorAll("td")[0].textContent = juegos.nombre;
    templateCart.querySelectorAll("td")[1].textContent = juegos.cantidad;
    templateCart.querySelector(".btn-info").id = juegos.id;
    templateCart.querySelector(".btn-danger").id = juegos.id;
    templateCart.querySelector("span").textContent =
      juegos.cantidad * juegos.precio;
    const clone = templateCart.cloneNode(true);
    fragment.appendChild(clone);
  });

  items.appendChild(fragment);
  showFooter();

  localStorage.setItem("cart", JSON.stringify(cart));
};

const showFooter = () => {
  footer.innerHTML = "";
  if (Object.keys(cart).length === 0) {
    footer.innerHTML = `
        <th scope="row" colspan="5">Carrito vacío</th>
        `;
    return;
  }

  const nCant = Object.values(cart).reduce(
    (acc, { cantidad }) => acc + cantidad,
    0
  );
  const nPrice = Object.values(cart).reduce(
    (acc, { cantidad, precio }) => acc + cantidad * precio,
    0
  );

  templateFooter.querySelectorAll("td")[0].textContent = nCant;
  templateFooter.querySelector("span").textContent = nPrice;

  const clone = templateFooter.cloneNode(true);
  fragment.appendChild(clone);
  footer.appendChild(fragment);

  const cleanCart = document.getElementById("cleanCart");
  cleanCart.addEventListener(`click`, () => {
    cart = {};
    showCart();
    sweetAlert(`error`, `El carrito ha sido eliminado`);
  });

  const payOut = document.getElementById("payOut");
  payOut.addEventListener(`click`, () => {
    if(!cart == 0){
      sweetPay();
    }
    cart = {};
    showCart();
  });
};

const btnAction = (e) => {
  //sumar elemento
  if (e.target.classList.contains("btn-info")) {
    const product = cart[e.target.id];

    //optimizacion utilizando sugar syntax, operador++
    /* product.cantidad = cart[e.target.id].cantidad + 1; */
    product.cantidad++;
    // utilizo operador avanzado spread para insertar contenido
    cart[e.target.id] = { ...product };
    showCart();
    sweetToast(`green`, `success`, `bottom-start`, `Se ha añadido un producto`);
  }

  if (e.target.classList.contains("btn-danger")) {
    const product = cart[e.target.id];

    //optimizacion utilizando sugar syntax, operador--
    /* product.cantidad = cart[e.target.id].cantidad - 1; */
    product.cantidad--;
    if (product.cantidad === 0) {
      delete cart[e.target.id];
    }
    showCart();
    sweetToast(`red`, `error`, `bottom-start`, `Se ha eliminado un producto`);
  }
  //evitar la propagacion del evento
  e.stopPropagation();
};

if (localStorage.getItem("cart")) {
  cart = JSON.parse(localStorage.getItem("cart"));
  showCart();
}
//El setItem ubicado dentro de la funcion showCart para obtenerlo de una forma dinamica y no cargarlo de a uno.

//Incorporacion de librerias (notificaciones, alertas)
const sweetAlert = (icono, texto) => {
  Swal.fire({
    icon: icono,
    showConfirmButton: false,
    text: texto,
    timer: 3000,
    timerProgressBar: true,
    showClass: {
      popup: "animate__animated animate__bounceInRight ",
    },
    hideClass: {
      popup: "animate__animated animate__bounceOutRight ",
    },
  });
};

const sweetToast = (color, icono, posicion, texto) => {
  Swal.fire({
    background: color,
    icon: icono,
    color: `#fff`,
    position: posicion,
    showConfirmButton: false,
    text: texto,
    timer: 3000,
    timerProgressBar: true,
    toast: true,
    showClass: {
      popup: "animate__animated animate__bounceInRight ",
    },
    hideClass: {
      popup: "animate__animated animate__bounceOutRight ",
    },
  });
};

const sweetPay = () => {
  Swal.fire({
    title: "La compra ha sido realizada correctamente",
    icon: "success",
  });
};

welcome();
userGameSelector();

