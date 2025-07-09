async function getData(symbol) {
  const url = "http://localhost:8000/quote/" + symbol ;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }
    const json = await response.json();
    return json;
  } catch (error) {
    return false
  }
}
document.getElementById("form").addEventListener(
  "submit",
  async function (event) {
    event.preventDefault();
    const symbol = document.getElementById('symbol').value.toUpperCase();
    const name = document.getElementById('name').value;
    const description = document.getElementById('description').value;
    const data = await getData(symbol);
    if (data === false) {
     alert("Ce symbol n'existe pas");
      return;
    }
    localStorage.setItem(symbol, JSON.stringify([symbol, name, description, data.regularMarketPrice]));
    updateIndices(); 
  },
  false,
);
function updateIndices() {
  const list = document.getElementById("list");
  list.innerHTML = "";
  const header = document.createElement("div");
header.classList.add("list-header");

const nomCol = document.createElement("span");
nomCol.textContent = "Nom";
header.appendChild(nomCol);

const symbolCol = document.createElement("span");
symbolCol.textContent = "Symbole";
header.appendChild(symbolCol);

const priceCol = document.createElement("span");
priceCol.textContent = "Cours actuel";
header.appendChild(priceCol);

list.appendChild(header);

  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    const indice = JSON.parse(localStorage.getItem(key));
    const div = document.createElement("div");
    div.className = "listElement";
    const nom = document.createElement("p");
  nom.innerHTML = indice[1];
  div.appendChild(nom);

const symbol = document.createElement("p");
symbol.innerHTML = indice[0];
div.appendChild(symbol);


    const actualValue = document.createElement("p");
    actualValue.innerHTML = indice[3];
    div.appendChild(actualValue);

    div.addEventListener("click", async function () {
      const data = await getData(symbol.innerHTML);
      const modal = document.getElementById("indiceData");
      modal.innerHTML = "";
      const key = ["Symbol", "Nom", "Dernier", "Var", "Bas", "Haut", "Description"];
      const value = [
        data.symbol,
        JSON.parse(localStorage.getItem(data.symbol))[1],
        data.regularMarketPrice,
        data.regularMarketChange,
        data.regularMarketDayRange.low,
        data.regularMarketDayRange.high,
        JSON.parse(localStorage.getItem(data.symbol))[2]
      ];

      for (let index = 0; index < key.length; index++) {
        const line = document.createElement("div");
        const label = document.createElement("label");
        label.innerHTML = key[index];
        line.appendChild(label);

        if (key[index] === "Name") {
          const input = document.createElement("input");
          input.id = "inputName";
          input.value = value[index];
          line.appendChild(input);
        } else if (key[index] === "Description") {
          const textarea = document.createElement("textarea");
          textarea.id = "textarea";
          textarea.value = value[index];
          line.appendChild(textarea);
        } else {
          const p = document.createElement("p");
          p.innerHTML = value[index];
          line.appendChild(p);
        }

        modal.appendChild(line);
      }

      const modify = document.createElement("button");
      modify.innerHTML = "Modifier";
      modify.addEventListener("click", function () {
        localStorage.setItem(
          symbol.innerHTML,
          JSON.stringify([value[0], document.getElementById("inputName").value, document.getElementById("textarea").value, data.regularMarketPrice])
        );
        updateIndices();
        document.getElementById("modalDetail").style.display = "none";
      });

      const remove = document.createElement("button");
      remove.innerHTML = "Supprimer";
      remove.addEventListener("click", function () {
        localStorage.removeItem(symbol.innerHTML);
        document.getElementById("modalDetail").style.display = "none";
        updateIndices();
      });

      modal.appendChild(modify);
      modal.appendChild(remove);
      showDetail();
    });

    list.appendChild(div);
  }
}
const modalDetail = document.getElementById("modalDetail");
const spanDetail = document.getElementById("closeDetail");
function showDetail() {
  modalDetail.style.display = "block";
}
spanDetail.onclick = function() {
  modalDetail.style.display = "none";
}
const modalAdd = document.getElementById("modalAdd");
const spanAdd = document.getElementById("closeAdd");
function show() {
  modalAdd.style.display = "block";
}
spanAdd.onclick = function() {
  modalAdd.style.display = "none";
}
window.onclick = function(event) {
  if (event.target == modalAdd) {
    modalAdd.style.display = "none";
  }
  if (event.target == modalDetail) {
    modalDetail.style.display = "none";
  }
} 
updateIndices();
