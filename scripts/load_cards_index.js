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

document.getElementById("load_more_btn").addEventListener("click", () => {
    let container = document.querySelector(".container");
    for (let i = currentProdNumber; i < currentProdNumber + 12; i++) {
        container.append(CardFromJSON(prodCardsData[String(i)], "Добавить", addToBasket));
    }
    currentProdNumber += 12;
});

document.addEventListener("DOMContentLoaded", async () => {
    console.log("document is loaded");
    
    await getProdCards();

    let container = document.querySelector(".container");
    for (let i = 0; i < 12; i++) {
        container.append(CardFromJSON(prodCardsData[String(i)], "Добавить", addToBasket));
    }
    currentProdNumber += 12;
    console.log("Product cards are successfully made and shown");
    console.log(prodCardsData);
})
