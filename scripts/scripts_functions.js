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

function CardFromJSON(obj, buttonOption, funcOption) {
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

    let prodPriceContainer = document.createElement("div");
    prodPriceContainer.className = "product_price_container";

    let prodPrice = document.createElement("div");
    prodPrice.className = "product_price";
    if (obj.discount_price) {
        prodPrice.innerHTML = "Цена: " + obj.discount_price + "&#8381";
        prodPriceContainer.append(prodPrice);

        let prodPriceBig = document.createElement("s");
        prodPriceBig.innerHTML = obj.actual_price + "&#8381";

        let discountPercent = document.createElement("div");
        discountPercent.className = "discount_percent";
        discountPercent.innerHTML = "-" + 
        String(Math.floor((obj.actual_price - obj.discount_price)/obj.actual_price * 100)) + "%";

        prodPriceContainer.append(prodPrice);
        prodPriceContainer.append(prodPriceBig);
        prodPriceContainer.append(discountPercent);
    }
    else {
        prodPrice.innerHTML = "Цена: " + obj.actual_price + "&#8381";
        res.setAttribute("data-price", obj.actual_price);
        prodPriceContainer.append(prodPrice);
    }
    res.setAttribute("data-actual_price", obj.actual_price);
    res.setAttribute("data-discount_price", obj.discount_price);

    let prodButton = document.createElement("button");
    prodButton.className = "product_btn";
    prodButton.innerHTML = buttonOption;
    prodButton.addEventListener("click", funcOption);

    lowerPart.append(prodRate);
    lowerPart.append(prodPriceContainer);
    lowerPart.append(prodButton);

    res.append(lowerPart);

    return res;
}
