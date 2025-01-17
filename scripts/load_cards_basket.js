let totalPrice = 0;
let actionURL = `https://edu.std-900.ist.mospolytech.ru/exam-2024-1/api/orders?api_key=737c057b-c5e8-436c-8588-13c96515f475`;
let actionURLTest = "https://httpbin.org/post";

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

// preparing form to be sent to server
let formData = new FormData(
    document.querySelector(".order_form"),
    document.querySelector("#submit_button")
);
// let formData = new FormData();
// formData.set("full_name", "Oscar_tester");
// formData.set("subscribe", "1");
// formData.set("delivery_date", "30.01.2025");
// formData.set("delivery_address", "address");
// formData.set("good_ids", "59, 60, 61, 62");
// formData.set("phone", "89999999999");
// formData.set("email", "someaddress@somemail.com");
// formData.set("comment", "");
// formData.set("delivery_interval", "12:00-14:00");
async function sendFormData() {
    let response = await fetch(actionURL, {
        method: "POST",
        mode: "cors",
        body: formData
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
// document.querySelector(".order_form").action = actionURL;
document.querySelector(".order_form").addEventListener("submit", sendFormData);

function setFormDataField(event) {
    let inputField = event.currentTarget;
    formData.set(inputField.name, inputField.value);
}

let inputField = document.getElementById("delivery_date");
inputField.addEventListener("input", () => {
    let dt = new Date(inputField.value);
    formData.set(inputField.name, 
        String(dt.getDate()) + "." +
        String(dt.getMonth()+1) + "." +
        String(dt.getFullYear())
    );
    for (let [name, value] of formData) {
        console.log(name, value);
    }
});
let inputField1 = document.getElementById("subscribe");
inputField1.addEventListener("input", () => {
    formData.set(inputField1.name, Number(inputField1.checked));
    for (let [name, value] of formData) {
        console.log(name, value);
    }
});
let inputField2 = document.getElementById("full_name");
inputField2.addEventListener("input", setFormDataField);
let inputField3 = document.getElementById("phone");
inputField3.addEventListener("input", setFormDataField);
let inputField4 = document.getElementById("email");
inputField4.addEventListener("input", setFormDataField);
let inputField5 = document.getElementById("order_comment");
inputField5.addEventListener("input", setFormDataField);
let inputField6 = document.getElementById("delivery_address");
inputField6.addEventListener("input", setFormDataField);
let inputField7 = document.getElementById("delivery_interval");
inputField7.addEventListener("input", setFormDataField);


document.addEventListener("DOMContentLoaded", async () => {
    let goodsIDs = localStorage.getItem("goods_IDs");
    let totalPriceElement = document.getElementById("full_price_phrase");
    console.log("inners of localStorage:\n", goodsIDs);

    // getting goods from server and adding them to html page
    document.getElementById("goods_IDs").value = goodsIDs;
    console.log("value of goods_IDs element", document.getElementById("goods_IDs").value);
    formData.set("good_ids", goodsIDs);
    formData.set("subscribe", 0);
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
    document.getElementById("delivery_interval").value = ""; 
    // unfortunatly it fixed the problem in unexpected way 
    // by deleting inners of delivery_interval field
    for (let [name, value] of formData) {
        console.log(name, value);
    }
});

