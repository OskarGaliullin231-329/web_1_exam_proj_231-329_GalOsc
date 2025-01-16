let totalPrice = 0;
let actionURL = "https://edu.std-900.ist.mospolytech.ru/exam-2024-1/api/orders?api_key=737c057b-c5e8-436c-8588-13c96515f475";
let actionURLTest = "https://httpbin.org/post";
let checkBoxState = 0;

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
        nothingChosen.innerHTML = "Корзина пуста. Перейдите в каталог, чтобы добавить товары.";
        document.querySelector(".content_container").append(nothingChosen);
        totalPrice -= 500;
    }

    document.getElementById("full_price_phrase").innerHTML = "Итоговая стоимость: " + String(totalPrice) + "&#8381;";

    console.log(`element with ${actionTarget.getAttribute("data-id")} ID is now deleted from basket`);

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
    document.querySelector(".message_part").innerHTML = `Товар с ID ${actionTarget.getAttribute("data-id")} удалён из корзины`;
}

let deliveryDateElement = document.getElementById("delivery_date");
let deliveryDateElementFalse = document.getElementById("delivery_date_false");
deliveryDateElementFalse.addEventListener("input", () => {
    let deliveryDate = new Date(deliveryDateElementFalse.value);
    deliveryDateElement.value = 
          String(deliveryDate.getDate()) + "." 
        + String(deliveryDate.getMonth()+1) + "." 
        + String(deliveryDate.getFullYear());
    console.log(deliveryDateElement.value);
});

                                    // document.querySelector(".order_form").action = actionURLTest;
                                    // document.querySelector(".order_form").action = actionURL;

let checkBox = document.getElementById("subscribe_false");
let checkBoxInput = document.getElementById("subscribe");
checkBox.addEventListener("input", () => {
    if (checkBoxState == 0) {
        checkBoxState = 1;
        checkBoxInput.value = String(checkBoxState);
    }
    else {
        checkBoxState = 0;
        checkBoxInput.value = String(checkBoxState);
    }
    console.log(checkBox.value, checkBoxInput.value);
});

async function sendFormData() {
    let formData = new FormData(
        document.querySelector(".order_form"),
        document.querySelector("#submit_button")
    );
    let response = await fetch(actionURL, {
        method: "post",
        mode: "cors", 
        body: JSON.stringify(Object.fromEntries(formData)) ,
    });
    try {
        if (!response.ok) {
            throw new Error(`Sending order status: ${response.status}`);
        }
        let responseJSON = await response.json();
        console.log(responseJSON);
    } catch(error) {
        console.log(error.message);
    }
}
sendFormData();

document.addEventListener("DOMContentLoaded", async () => {
    let goodsIDs = localStorage.getItem("goods_IDs");
    let totalPriceElement = document.getElementById("full_price_phrase");
    console.log("inners of localStorage:\n", goodsIDs);

    // getting goods from server and adding them to html page
    document.getElementById("goods_IDs").value = goodsIDs;
    console.log(document.getElementById("goods_IDs").value);
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
        nothingChosen.innerHTML = "Корзина пуста. Перейдите в каталог, чтобы добавить товары.";
        document.querySelector(".content_container").append(nothingChosen);
    }
    totalPriceElement.innerHTML = "Итоговая стоимость: " + String(totalPrice) + "&#8381;";

    // setting delivery_interval default value
    document.getElementById("delivery_interval").value = "08:00-12:00"; 
    // unfortunatly it fixed the problem in unexpected way 
    // by deleting inners of delivery_interval field
});

