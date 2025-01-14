let prodCardsData = ""
let currentProdNumber = 0;

function addToBasket() {}

async function getProdCards() {
    let url = "https://edu.std-900.ist.mospolytech.ru/exam-2024-1/api/goods?api_key=737c057b-c5e8-436c-8588-13c96515f475";
    try {
        let response = await fetch(url, {
            method: "get",
            mode: "cors",
            api_key: "737c057b-c5e8-436c-8588-13c96515f475"
        });
        if (!response.ok) {
            throw new Error(`Getting prod cards status: ${response.status}`);
        }
        prodCardsData = await response.json();
    } 
    catch(error) {
        console.error(error.message);
    }
}

function starsFromNumber(num) {
    let starsNum = Math.round(num);
    let res = "";
    for (let i = 0; i < starsNum; i++) {
        res += "&starf;";
    }
    for (let i = starsNum; i < 5; i++) {
        res += "&star;";
    }
    return res;
}

function cardFromJSON(obj) {
    let res = document.createElement("div");
    res.className = "product";
    res.setAttribute("data-id", obj.id);

    let upperPart = document.createElement("div");
    upperPart.className = "upper_part";

    let cardImg = document.createElement("img");
    cardImg.src = obj.image_url;
    cardImg.alt = "product_card_image";

    let cardName = document.createElement("p");
    cardName.className = "product_name";
    cardName.innerText = obj.name;
    res.setAttribute("data-name", obj.name);

    upperPart.append(cardImg);
    upperPart.append(cardName);

    res.append(upperPart);

    let lowerPart = document.createElement("div");
    lowerPart.className = "lower_part";

    let prodRate = document.createElement("p");
    prodRate.className = "product_rate";
    prodRate.innerHTML = obj.rating + " " + starsFromNumber(obj.rating);
    res.setAttribute("data-rating", obj.rating);

    let prodPrice = document.createElement("p");
    prodPrice.className = "product_price";
    prodPrice.innerHTML = "Цена:" + obj.actual_price + "&#8381";
    res.setAttribute("data-price", obj.actual_price);

    let prodButton = document.createElement("button");
    prodButton.className = "product_btn";
    prodButton.innerHTML = "Добавить";
    prodButton.addEventListener("click", addToBasket());

    lowerPart.append(prodRate);
    lowerPart.append(prodPrice);
    lowerPart.append(prodButton);

    res.append(lowerPart);

    return res;
}

document.getElementById("load_more_btn").addEventListener("click", () => {
    let container = document.querySelector(".container");
    for (let i = currentProdNumber; i < currentProdNumber + 12; i++) {
        container.append(cardFromJSON(prodCardsData[String(i)]));
    }
    currentProdNumber += 12;
});

document.addEventListener("DOMContentLoaded", async () => {
    console.log("document is loaded");
    await getProdCards();

    let container = document.querySelector(".container");
    for (let i = 0; i < 12; i++) {
        container.append(cardFromJSON(prodCardsData[String(i)]));
    }
    currentProdNumber += 12;
})
