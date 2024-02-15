// Questa funzione asincrona ottiene i dati di tutti i paesi dall'API Restcountries
// e restituisce tali dati sotto forma di un oggetto JavaScript.
async function CountriesData() {
  // Effettua una richiesta HTTP per ottenere i dati di tutti i paesi
  const risposta = await fetch("https://restcountries.com/v3.1/all");
  // Estrae i dati dalla risposta e li converte in formato JSON
  const dati = await risposta.json();
  // Restituisce i dati ottenuti
  return dati;
}

// Creo un oggetto chiave valore { Contineti: [Stati] }
let continentStateObj = {};
// Creo un array per memorizzare i nomi dei continenti
let continentArr = [];

// Ottengo i dati dei paesi e li elaboro quando sono disponibili
CountriesData().then((paesi) => {
  paesi.forEach((paese) => {
    //Verifico se il continente è già presente nell'oggetto dei continenti/stati
    if (!(paese.region in continentStateObj)) {
      // Se il continente non è presente, lo aggiungo all'oggetto e gli associo lo stato
      continentStateObj[paese.region] = [paese.name.common];
      // Aggiungo il nome del continente all'array dei continenti
      continentArr.push(paese.region);
    } else {
      // Se il continente è già presente aggiungo(gli associo) lo stato
      continentStateObj[paese.region].push(paese.name.common);
    }
  });

  // Genereo il menù
  GenerateMenuContinent();
  // Gli aggiungo l'evento onClick
  AddEventOpenClose();
});

/* GENERA MENU --------------------------------------------------------------------------*/

function GenerateMenuContinent() {
  // Ottieni il riferimento al contenitore della lista dei continenti
  let ulContinent = document.getElementById("ulContinent");
  // Genera un array di nomi di continenti casuali
  let continentRandomArr = [];
  let continentRandomNumber = RandomNumber(1, 6);
  ContinentStateRandomArr(
    continentArr,
    continentRandomArr,
    continentRandomNumber
  );

  // Itera su ciascun continente casuale e crea un elemento di lista per ciascuno
  for (let i = 0; i < continentRandomArr.length; i++) {
    let liContinent = document.createElement("li");
    let aContinent = document.createElement("a");
    aContinent.textContent = continentRandomArr[i];
    liContinent.appendChild(aContinent);
    liContinent.classList.add("menu-link");
    ulContinent.appendChild(liContinent);

    // Genera il menu degli stati per il continente corrente
    GenerateMenuState(aContinent.textContent, liContinent);
  }
}
/* GENERA SOTTOVOCI MENU --------------------------------------------------------------------------*/

function GenerateMenuState(nameContinent, liContinent) {
  // Ottiene l'array degli stati del continente specificato
  let stateArr = continentStateObj[nameContinent];
  // Array per memorizzare gli stati casuali
  let stateRandomArr = [];
  // Numero casuale di stati da visualizzare
  let stateRandomNumber = RandomNumber(1, 10);
  // Crea un elemento di lista per il menu delle sotto-voci degli stati
  let ulState = document.createElement("ul");
  ulState.classList.add("submenu");

  // Verifica se il numero casuale di stati supera il numero effettivo di stati nel continente
  // Se il numero casuale è maggiore, imposta il numero massimo di stati disponibili come numero casuale (Antarctic)
  if (stateArr.length < stateRandomNumber) {
    stateRandomNumber = stateArr.length;
  }
  // Genera un array casuale di stati dal continente
  ContinentStateRandomArr(stateArr, stateRandomArr, stateRandomNumber);

  // Crea un elemento di lista per ciascuno stato casuale e aggiunge al menu delle sotto-voci
  for (let i = 0; i < stateRandomArr.length; i++) {
    let liState = document.createElement("li");
    let aState = document.createElement("a");

    // Imposta il testo del link come il nome dello stato
    aState.textContent = stateRandomArr[i];
    // Imposta l'URL del link per la ricerca di Google Maps dello stato
    aState.href =
      "https://www.google.com/maps/search/?api=1&query=" + aState.textContent;
    // Imposta l'attributo target per aprire il link in una nuova scheda
    aState.setAttribute("target", "_blank");
    liState.appendChild(aState);
    ulState.appendChild(liState);
  }

  liContinent.appendChild(ulState);
}

/* altre funzioni */

function RandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

//Genera un array di stati o continenti casuale
function ContinentStateRandomArr(array, arrayNew, num) {
  let count = 0;

  // Cicla finché non sono stati generati il numero richiesto di elementi casuali
  while (count < num) {
    let n = RandomNumber(0, array.length - 1); //Perchè l'index parte da 0
    //se c'è mi darà il numero del index altrimenti -1
    if (arrayNew.indexOf(array[n]) == -1) {
      arrayNew.push(array[n]);
      count++;
    }
  }
}

function AddEventOpenClose() {
  // Seleziona tutti gli elementi che hanno menu e successivamente sottomenu
  var menuItems = document.querySelectorAll(".menu .submenu");

  menuItems.forEach(function (item) {
    // Aggiunge al padre (quindi al menu) l'evento click
    item.parentElement.addEventListener("click", function (e) {
      // Evita che l'evento si propaghi verticalmente anche ad altri "genitori"
      e.stopPropagation();
      // Chiudi tutte le altre voci di menu
      menuItems.forEach(function (otherItem) {
        // Seleziona tutti gli elementi di menu che hanno sottomenu
        if (otherItem !== item) {
          otherItem.style.display = "none";
        }
      });
      // Rendi visibile il sottomenu del menu selezionato
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
