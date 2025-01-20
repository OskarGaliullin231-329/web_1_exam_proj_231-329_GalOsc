let actionURL = `https://edu.std-900.ist.mospolytech.ru/exam-2024-1/api/orders?api_key=737c057b-c5e8-436c-8588-13c96515f475`;
let orderCards = {};

async function getOrderCards() {
    let response = await fetch(actionURL, {
        method: "get"
    });
    try {
        if (!response.ok) {
            throw new Error(`Getting orders status: ${response.status}`);
        }
        let responseJSON = await response.json();
        Object.assign(orderCards, responseJSON);
    } catch (error) {
        console.error(error.message);
    }
}

async function seeTheOrder(event) {
    document.getElementById("see_modal_window").style.display = "block";
    let actionTarget = event.currentTarget.parentNode.parentNode;
    console.log("--- seeTheOrderButton was clicked ---  ");
    let dataSet = actionTarget.dataset;
    for (let param in dataSet) {
        if (param != "id") {
           document.querySelector("#see_modal_window .order_" + param).innerHTML = dataSet[param];
        }
    }
    let dt = new Date(dataSet["created_at"]);
    document.querySelector("#see_modal_window .order_created_at").innerHTML = String(dt.getDate()) + "." +
                                                                                  String(dt.getMonth()+1) + "." +
                                                                                  String(dt.getFullYear());
    dt = new Date(dataSet["delivery_date"]);
    document.querySelector("#see_modal_window .order_delivery_date").innerHTML = String(dt.getDate()) + "." +
                                                                                  String(dt.getMonth()+1) + "." +
                                                                                  String(dt.getFullYear());

    document.querySelector("#see_modal_window .order_total_price").innerHTML += "&#8381;";

    let goodsContainer = document.querySelector("#see_modal_window .order_good_ids");
    goodsContainer.innerHTML = "";
    for (let id of dataSet["good_ids"].split(",")) {
        let prodNameElement = document.createElement("p");
        let prodCardJSON = await ProdCardJSON(id);
        prodNameElement.innerHTML = prodCardJSON.name;
        goodsContainer.append(prodNameElement);
    }
}

async function correctTheOrder(event) {
    document.getElementById("correct_modal_window").style.display = "block";
    let actionTarget = event.currentTarget.parentNode.parentNode;
    console.log("--- correctTheOrderButton was clicked ---  ");
    let dataSet = actionTarget.dataset;
    for (let param in dataSet) {
        if (param != "id" && param != "total_price" && param != "created_at") {
           document.querySelector("#correct_modal_window .order_" + param).value = dataSet[param];
        }
    }
    let dt = new Date(dataSet["created_at"]);
    document.querySelector("#correct_modal_window .order_created_at").innerHTML = String(dt.getDate()) + "." +
                                                                                  String(dt.getMonth()+1) + "." +
                                                                                  String(dt.getFullYear());
    document.querySelector("#correct_modal_window .order_total_price").innerHTML = dataSet["total_price"] + "&#8381;";

    let goodsContainer = document.querySelector("#correct_modal_window .order_good_ids");
    goodsContainer.innerHTML = "";
    for (let id of dataSet["good_ids"].split(",")) {
        let prodNameElement = document.createElement("p");
        let prodCardJSON = await ProdCardJSON(id);
        prodNameElement.innerHTML = prodCardJSON.name;
        goodsContainer.append(prodNameElement);
    }
    document.querySelector("#correct_modal_window .order_comment").value = "";
    document.getElementById("correct_modal_window").setAttribute(
        "data-good_ids",
        actionTarget.getAttribute("data-good_ids"),
    );
}

async function deleteTheOrder(event) {
    let actionTarget = event.currentTarget.parentNode.parentNode;
    console.log("deleteTheOrderButton was clicked");
    document.getElementById("delete_modal_window").style.display = "block";
    document.getElementById("delete_modal_window").setAttribute(
        "data-id", 
        actionTarget.getAttribute("data-id")
    );
}

async function orderFromJSON(obj, num) {
    let totalPrice = 0;
    let tableRow = document.createElement("div");
    tableRow.className = "table_row";
    
    tableRow.setAttribute("data-comment", obj.comment);
    tableRow.setAttribute("data-delivery_address", obj.delivery_address);
    tableRow.setAttribute("data-delivery_date", obj.delivery_date);
    tableRow.setAttribute("data-delivery_interval", obj.delivery_interval);
    tableRow.setAttribute("data-email", obj.email);
    tableRow.setAttribute("data-good_ids", obj.good_ids);
    tableRow.setAttribute("data-id", obj.id);
    tableRow.setAttribute("data-created_at", obj.created_at);
    tableRow.setAttribute("data-phone", obj.phone);
    tableRow.setAttribute("data-full_name", obj.full_name);
    // tableRow.setAttribute("data-", obj);

    let orderNumber = document.createElement("div");
    orderNumber.className = "order_number";
    orderNumber.innerHTML = String(num+1) + ".";
    tableRow.append(orderNumber);

    let orderDate = document.createElement("div");
    orderDate.className = "order_date";
    let dt = new Date(obj.created_at);
    orderDate.innerHTML = String(dt.getDate()) + "." +
                          String(dt.getMonth()+1) + "." +
                          String(dt.getFullYear());
    tableRow.append(orderDate);

    let orderIncludes = document.createElement("div");
    orderIncludes.className = "order_includes";
    for (let el of obj.good_ids) {
        let position = document.createElement("p");
        let prodCardJSON = await ProdCardJSON(el);
        position.innerHTML = prodCardJSON.name;
        orderIncludes.append(position);
        if (prodCardJSON.discount_price) {
            totalPrice += Number(prodCardJSON.discount_price);
        }
        else {
            totalPrice += Number(prodCardJSON.actual_price);
        }
        totalPrice += 500;
    }
    tableRow.setAttribute("data-total_price", totalPrice);
    tableRow.append(orderIncludes);

    let orderPrice = document.createElement("div");
    orderPrice.className = "order_price";
    orderPrice.innerHTML = String(totalPrice) + "&#8381;";
    tableRow.append(orderPrice);

    let orderDeliveryDateTime = document.createElement("div");
    orderDeliveryDateTime.className = "order_delivery_date_time";
    let orderDeliveryDate = document.createElement("p");
    dt = new Date(obj.delivery_date);
    orderDeliveryDate.innerHTML = String(dt.getDate()) + "." +
                          String(dt.getMonth()+1) + "." +
                          String(dt.getFullYear());
    orderDeliveryDateTime.append(orderDeliveryDate);
    let orderDeliveryTime = document.createElement("p");
    orderDeliveryTime.innerHTML = obj.delivery_interval;
    orderDeliveryDateTime.append(orderDeliveryTime);
    tableRow.append(orderDeliveryDateTime);

    let orderButtonsContainer = document.createElement("div");
    orderButtonsContainer.className = "order_buttons_container";
    let seeTheOrderButton = document.createElement("button");
    seeTheOrderButton.innerHTML = `<img src="profile_images/eye_image.png" alt="see_the_order_button">`;
    seeTheOrderButton.addEventListener("click", seeTheOrder);
    orderButtonsContainer.append(seeTheOrderButton);
    let correctTheOrderButton = document.createElement("button");
    correctTheOrderButton.innerHTML = `<img src="profile_images/pen_image.png" alt="correct_the_order_button">`;
    correctTheOrderButton.addEventListener("click", correctTheOrder);
    orderButtonsContainer.append(correctTheOrderButton);
    let deleteTheOrderButton = document.createElement("button");
    deleteTheOrderButton.innerHTML = `<img src="profile_images/trashbin_image.png" alt="delete_the_order_button">`;
    deleteTheOrderButton.addEventListener("click", deleteTheOrder);
    orderButtonsContainer.append(deleteTheOrderButton);
    tableRow.append(orderButtonsContainer);

    // console.log(tableRow.dataset);

    return tableRow;
}

for (let el of document.querySelectorAll(".modal_window_header button")) {
    el.addEventListener("click", () => {
        let modalWindow = el.parentNode.parentNode;
        modalWindow.style.display = "none";
        console.log(`${modalWindow.id} must be gone`);
    });
}

document.querySelector("#delete_modal_window .confirm_button").addEventListener("click", async (event) => {
    let actionTarget = event.currentTarget.parentNode.parentNode;
    let response = await fetch(`https://edu.std-900.ist.mospolytech.ru/exam-2024-1/api/orders/${actionTarget.getAttribute("data-id")}?api_key=737c057b-c5e8-436c-8588-13c96515f475`, {
        method: "delete",
    });
    try {
        if (!response.ok) {
            throw new Error(`Failed to delete order. Deletion status: ${response.status}`);
        }
    } catch(error) {
        console.error(error.message);
    }
});
document.querySelector("#correct_modal_window .confirm_button").addEventListener("click", async (event) => {
    let actionTarget = event.currentTarget;
    let formData = new FormData(
        actionTarget.parentNode.parentNode,
        actionTarget,
    );
    actionTarget = event.currentTarget.parentNode.parentNode;
    formData.set("full_name", actionTarget.querySelector("order_full_name").value);
    let dt = new Date(actionTarget.querySelector("order_delivery_date").value);
    formData.set("delivery_date", String(dt.getDate())+"."+String(dt.getMonth()+1)+"."+dt.getFullYear());
    formData.set("delivery_interval", actionTarget.querySelector("order_delivery_interval").value);
    formData.set("delivery_address", actionTarget.querySelector("order_delivery_address").value);
    formData.set("email", actionTarget.querySelector("order_email").value);
    formData.set("phone", actionTarget.querySelector("order_phone").value);
    formData.set("full_name", actionTarget.querySelector("order_full_name").value);
    formData.set("comment", actionTarget.querySelector(".order_comment"));
    for (let good of actionTarget.getAttribute("data-good_ids").split(",")) {
        formData.append("good_ids", Number(good));
    }
    let response = await fetch(`https://edu.std-900.ist.mospolytech.ru/exam-2024-1/api/orders/${actionTarget.getAttribute("data-id")}?api_key=737c057b-c5e8-436c-8588-13c96515f475`, {
        method: "put",
        body: formData
    });
    try {
        if (!response.ok) {
            throw new Error(`Failed to replace order. Replacing status: ${response.status}`);
        }
    } catch(error) {
        console.error(error.message);
    }
});

document.addEventListener("DOMContentLoaded", async () => {
    document.getElementById("see_modal_window").style.display = "none";
    document.getElementById("correct_modal_window").style.display = "none";
    document.getElementById("delete_modal_window").style.display = "none";
    await getOrderCards();
    console.log(orderCards);
    console.log(typeof(orderCards));

    let contentContainer = document.querySelector(".content_container");
    for (let index in orderCards) {
        contentContainer.append(await orderFromJSON(orderCards[index], Number(index)));
    }
});
