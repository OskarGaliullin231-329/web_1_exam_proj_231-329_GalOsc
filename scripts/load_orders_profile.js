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
        console.log(responseJSON);
    } catch (error) {
        console.error(error.message);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    getOrderCards();
});
