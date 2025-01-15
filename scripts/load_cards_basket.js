let totalPrice = 0;
let discountSize = 0;

async function ProdCardJSON(goodID) {
    let url = `https://edu.std-900.ist.mospolytech.ru/exam-2024-1/api/goods/${goodID}?api_key=737c057b-c5e8-436c-8588-13c96515f475`;
    let prodCardData = "";
    try {
        let response = await fetch(url, {
            method: "get",
            mode: "cors"
        });
        if (!response.ok) {
            throw new Error(`Getting prod_cards status: ${response.status}`);
        }
        prodCardData = await response.json();
    } catch(error) {
        console.error(error.message);
    }

    return prodCardData;
}

function DeleteFromBasket(event) {
    let actionTarget = event.currentTarget.parentNode.parentNode;
    let basketGoodsSet = new Set;
    let basketGoods = localStorage.getItem("goods_IDs").split(",");
    basketGoods.forEach(el => basketGoodsSet.add(el));
    basketGoodsSet.delete(actionTarget.getAttribute("data-id"));
    basketGoods = [];
    basketGoodsSet.forEach(el => basketGoods.push(el));
    localStorage.setItem("goods_IDs", basketGoods);

    actionTarget.parentNode.removeChild(actionTarget);

    if (actionTarget.getAttribute("data-discount_price") != "null") {
        totalPrice -= Number(actionTarget.getAttribute("data-discount_price"));
    }
    else {
        totalPrice -= Number(actionTarget.getAttribute("data-actual_price"));
    }

    if (!localStorage.getItem("goods_IDs")) {
        let nothingChosen = document.createElement("div");
        nothingChosen.className = "nothing_chosen";
        nothingChosen.innerHTML = "Пока ничего не выбрано...";
        document.querySelector(".content_container").append(nothingChosen);
        totalPrice -= 500;
    }

    document.getElementById("full_price_phrase").innerHTML = "Итоговая стоимость: " + String(totalPrice) + "&#8381;";

    console.log(`element with ${actionTarget.getAttribute("data-id")} ID is now deleted from basket`);
}

document.addEventListener("DOMContentLoaded", async () => {
    let goodsIDs = localStorage.getItem("goods_IDs");
    let totalPriceElement = document.getElementById("full_price_phrase");
    console.log("inners of localStorage:\n", goodsIDs);
    if (goodsIDs) {
        goodsIDs = goodsIDs.split(",");
        for (let el of goodsIDs) {
            let prodCardJSON = await ProdCardJSON(el);
            if (prodCardJSON) {
                document.querySelector(".content_container")
                    .append(CardFromJSON(prodCardJSON, "Удалить", DeleteFromBasket));
                if (prodCardJSON.discount_price) {
                    totalPrice += prodCardJSON.discount_price;
                }
                else {
                    totalPrice += prodCardJSON.actual_price;
                }
            }
        }
        totalPrice += 500;
    }
    else {
        let nothingChosen = document.createElement("div");
        nothingChosen.className = "nothing_chosen";
        nothingChosen.innerHTML = "Пока ничего не выбрано...";
        document.querySelector(".content_container").append(nothingChosen);
    }
    totalPriceElement.innerHTML = "Итоговая стоимость: " + String(totalPrice) + "&#8381;";
});
