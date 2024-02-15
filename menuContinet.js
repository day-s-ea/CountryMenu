// URL dell'API per ottenere i dati dei paesi
const API_URL = "https://restcountries.com/v3.1/all";

// Funzione asincrona per recuperare i dati dei paesi dall'API
async function fetchCountriesData() {
  try {
    // Effettua una richiesta HTTP per ottenere i dati dei paesi
    const response = await fetch(API_URL);
    // Estrae i dati dalla risposta e li converte in formato JSON
    return await response.json();
  } catch (error) {
    // Gestione degli errori in caso di fallimento della richiesta
    console.error("Errore durante il recupero dei dati:", error);
    throw error;
  }
}

// Funzione per elaborare i dati dei paesi
function processCountriesData(paesi) {
  // Oggetto per memorizzare i continenti e i relativi stati
  const continentStateObj = {};
  // Array per memorizzare i nomi dei continenti
  const continentArr = [];

  // Itera su ciascun paese nei dati ottenuti
  paesi.forEach((paese) => {
    // Verifica se il continente è già presente nell'oggetto dei continenti
    if (!(paese.region in continentStateObj)) {
      // Se il continente non è presente, lo aggiunge all'oggetto e gli assegna lo stato corrente
      continentStateObj[paese.region] = [paese.name.common];
      // Aggiunge il nome del continente all'array dei continenti
      continentArr.push(paese.region);
    } else {
      // Se il continente è già presente, aggiunge solo lo stato all'array dei continenti
      continentStateObj[paese.region].push(paese.name.common);
    }
  });

  // Restituisce un oggetto contenente l'oggetto dei continenti e l'array dei nomi dei continenti
  return { continentStateObj, continentArr };
}

// Recupera i dati dei paesi e avvia il processo di elaborazione
fetchCountriesData().then((paesi) => {
  // Estrae l'oggetto dei continenti e l'array dei nomi dei continenti dall'output della funzione processCountriesData
  const { continentStateObj, continentArr } = processCountriesData(paesi);
  // Genera il menu basato sui continenti
  GenerateMenuContinent(continentStateObj, continentArr);
  // Aggiunge gli eventi di apertura e chiusura al menu
  AddEventOpenClose();
});

/* GENERA MENU --------------------------------------------------------------------------*/

function GenerateMenuContinent(continentStateObj, continentArr) {
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
    GenerateMenuState(continentStateObj, aContinent.textContent, liContinent);
  }
}

/* GENERA SOTTOVOCI MENU --------------------------------------------------------------------------*/

function GenerateMenuState(continentStateObj, nameContinent, liContinent) {
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
