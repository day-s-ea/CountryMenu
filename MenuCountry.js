//quando metto async davanti a una funzione, me la traforma in promise
async function Paesi() {
  //quando sono in async posso usare gli await
  const risposta = await fetch("https://restcountries.com/v3.1/all");
  const dati = await risposta.json();
  return dati;
}

//creo un oggetto regions
let regions = {};
let dati = null;

//Per avere la lista per creare il menù
let regionsArray = [];

//better
Paesi().then((paesi) => {
  dati = paesi;
  dati.forEach((paese) => {
    //se nell'oggetto json non c'è la chiave valore di quel Cauntry allora crealo come array e aggiungi quello stato
    if (!(paese.region in regions)) {
      regions[paese.region] = [paese.name.common];
      regionsArray.push(paese.region);
      //altrimenti se c'è già la chiave valore, aggiungici solo lo stato
    } else {
      regions[paese.region].push(paese.name.common);
    }
  });
  GeneraMenu();
  addEvent();
});

/* GENERA MENU --------------------------------------------------------------------------*/

function GeneraMenu() {
  //Creo il contenitore della lista
  let ul = document.getElementById("ul");
  //Creo la lista con dati casuali
  let countryMenu = [];
  let numCountry = NumeroCasuale(1, 6);

  ArrayCasual(numCountry, countryMenu, regionsArray);

  for (let i = 0; i < countryMenu.length; i++) {
    let liElemento = document.createElement("li");
    let aElemento = document.createElement("a");
    aElemento.textContent = countryMenu[i];
    liElemento.appendChild(aElemento);
    liElemento.classList.add("menu-link");
    ul.appendChild(liElemento);

    GeneraSottotitoli(aElemento, liElemento);
  }
}

/* GENERA SOTTOVOCI MENU --------------------------------------------------------------------------*/

function GeneraSottotitoli(aText, liElemento) {
  let state = [];
  let stateCasual = [];
  let numState = NumeroCasuale(1, 10);
  let country = regions[aText.textContent];

  let ulSottotitoli = document.createElement("ul");
  ulSottotitoli.classList.add("submenu");

  country.forEach((x) => {
    state.push(x);
  });

  //Nel caso in cui il Continente non ha fino a 10 stati minimo (Antarctic)
  if (country.length < numState) {
    numState = country.length;
  }

  ArrayCasual(numState, stateCasual, state);

  for (let i = 0; i < stateCasual.length; i++) {
    let liSottotitoli = document.createElement("li");
    let aSottotitoli = document.createElement("a");

    aSottotitoli.textContent = stateCasual[i];
    aSottotitoli.href =
      "https://www.google.com/maps/search/?api=1&query=" +
      aSottotitoli.textContent;
    aSottotitoli.setAttribute("target", "_blank");
    liSottotitoli.appendChild(aSottotitoli);
    ulSottotitoli.appendChild(liSottotitoli);
  }

  liElemento.appendChild(ulSottotitoli);
}

/* altre funzioni */

function NumeroCasuale(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

//Genera un array di stati o continenti casuale
function ArrayCasual(num, arrayNew, obj) {
  let count = 0;

  //Per creare un array di dati casuale
  while (count < num) {
    let n = NumeroCasuale(0, num - 1); //Perchè l'index parte da 0
    //se c'è mi darà il numero del index altrimenti -1
    if (arrayNew.indexOf(obj[n]) == -1) {
      arrayNew.push(obj[n]);
      count++;
    }
  }
}

function addEvent() {
  var menuItems = document.querySelectorAll(".menu .submenu");

  menuItems.forEach(function (item) {
    item.parentElement.addEventListener("click", function (e) {
      e.stopPropagation();
      // Chiudi tutte le altre voci di menu
      menuItems.forEach(function (otherItem) {
        if (otherItem !== item) {
          otherItem.style.display = "none";
        }
      });
      item.style.display = item.style.display === "block" ? "none" : "block";
    });

    // Evita che il click sulla sottovoce si propaghi e chiuda il menu
    item.addEventListener("click", function (e) {
      e.stopPropagation();
    });
  });

  // Se si clicca in un punto qualsiasi della pagina si chiude il menu
  document.addEventListener("click", function (e) {
    menuItems.forEach(function (item) {
      if (!item.parentElement.contains(e.target)) {
        item.style.display = "none";
      }
    });
  });
}
