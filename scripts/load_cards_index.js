let prodCardsData = ""
let currentProdNumber = 0;

async function getProdCards() {
    let url = "https://edu.std-900.ist.mospolytech.ru/exam-2024-1/api/goods?api_key=737c057b-c5e8-436c-8588-13c96515f475";
    try {
        let response = await fetch(url, {
            method: "get",
            mode: "cors",
        });
        if (!response.ok) {
            throw new Error(`Getting prod_cards status: ${response.status}`);
        }
        prodCardsData = await response.json();
        console.log("Data is loaded from server");
    } 
    catch(error) {
        console.error(error.message);
    }
}

// documet.getElementById("search_btn").addEventListener("click", () => {});

let sortingBar = document.getElementById("sorting_params");
sortingBar.addEventListener("input", () => {
    let prodCardsDataArray = [];
    for (let el in prodCardsData) {
        prodCardsDataArray.push(prodCardsData[String(el)]);
    }
    if (sortingBar.value == "rating_decreasing") {
        prodCardsDataArray.sort((a, b) => {
            return b.rating - a.rating;
        })
    }
    if (sortingBar.value == "rating_increasing") {
        prodCardsDataArray.sort((a, b) => {
            return a.rating - b.rating;
        })
    }
    if (sortingBar.value == "price_decreasing") {
        prodCardsDataArray.sort((a, b) => {
            return b.actual_price - a.actual_price;
        })
    }
    if (sortingBar.value == "price_increasing") {
        prodCardsDataArray.sort((a, b) => {
            return a.actual_price - b.actual_price;
        })
    }
    if (sortingBar.value == "default") {
        prodCardsDataArray.sort((a, b) => {
            return a.id - b.id;
        })
    }

    let container = document.querySelector(".container");
    container.innerHTML = "";
    prodCardsData = {};
    for (let i = 0; i < prodCardsDataArray.length; i++) {
        prodCardsData[String(i)] = prodCardsDataArray[i];
    }
    for (let i = 0; i < 12; i++) {
        container.append(CardFromJSON(prodCardsData[String(i)], "Добавить", addToBasket));
    }
});

document.getElementById("load_more_btn").addEventListener("click", () => {
    if (currentProdNumber + 12 <= Object.keys(prodCardsData).length) {
        let container = document.querySelector(".container");
        for (let i = currentProdNumber; i < currentProdNumber + 12; i++) {
            container.append(CardFromJSON(prodCardsData[String(i)], "Добавить", addToBasket));
        }
        currentProdNumber += 12;
    }
    else {
        let container = document.querySelector(".container");
        for (let i = currentProdNumber; i < Object.keys(prodCardsData).length; i++) {
            container.append(CardFromJSON(prodCardsData[String(i)], "Добавить", addToBasket));
        }
        document.getElementById("load_more_btn").style.display = "none";
    }
});

function addToBasket(event) {
    let actionTarget = event.currentTarget.parentNode.parentNode;

    if (localStorage.getItem("goods_IDs")) {
        let goodsIDs = localStorage.getItem("goods_IDs").split(",");
        goodsIDs.push(actionTarget.getAttribute("data-id"));
        let tmp = new Set();

        goodsIDs.forEach(el => tmp.add(el));
        goodsIDs = [];
        tmp.forEach(el => goodsIDs.push(el));

        localStorage.setItem("goods_IDs", goodsIDs);
        console.log(`ID ${actionTarget.getAttribute("data-id")} of an element is added to localStorage`);
    }
    else {
        localStorage.setItem("goods_IDs", [actionTarget.getAttribute("data-id")]);
        console.log(`ID ${actionTarget.getAttribute("data-id")} of an element is added to localStorage`);
    }
    document.querySelector(".message_part").style = `
        background-color: rgb(200, 255, 190);
        border-top-color: rgb(130, 215, 110);
        border-top-style: solid;
        border-top-width: 2px;
        border-bottom-color: rgb(130, 215, 110);
        border-bottom-style: solid;
        border-bottom-width: 2px;
        padding: 10px;
    `;
    document.querySelector(".message_part").innerHTML = `Товар с ID ${actionTarget.getAttribute("data-id")} добавлен в корзину`;
}

document.addEventListener("DOMContentLoaded", async () => {
    console.log("document is loaded");
    
    await getProdCards();

    let container = document.querySelector(".container");
    for (let i = 0; i < 12; i++) {
        container.append(CardFromJSON(prodCardsData[String(i)], "Добавить", addToBasket));
    }
    currentProdNumber += 12;
    console.log("Product cards are successfully made and shown");
})
