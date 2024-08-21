const dropList = document.querySelectorAll('.drop-list select');
const fromCurrency = document.querySelector('.from select');
const toCurrency = document.querySelector('.to select');

const amountInput = document.querySelector('.amount input');
const exchangeRateTxt = document.querySelector('.exchange-rate');

for (let i = 0; i < dropList.length; i++) {
    for (let currency_code in country_code) {
        let selected = '';
        if (i === 0) {
            selected = currency_code === 'TRY' ? 'selected' : '';
        } else if (i === 1) {
            selected = currency_code === 'BGN' ? 'selected' : '';
        }
        
        let optionTagForCurrency = `<option value="${currency_code}" ${selected}>${currency_code}</option>`;
        
        dropList[i].insertAdjacentHTML('beforeend', optionTagForCurrency);
    }
    dropList[i].addEventListener('change', e => {
        loadFlag(e.target);
        getExchangeRate();
    });
}

function loadFlag(element) {
    for (let code in country_code) {
        if (code === element.value) {
            let imgTag = element.parentElement.querySelector('img');
            if (imgTag) {
                imgTag.src = `https://flagsapi.com/${country_code[code]}/shiny/64.png`;
            }
        }
    }
}

amountInput.addEventListener('input', () => {
    let value = amountInput.value;
    
    // Convert commas to periods
    value = value.replace(/,/g, '.');

    // Remove any invalid characters (anything that's not a number or decimal point)
    value = value.replace(/[^0-9.]/g, '');

    // Handle the case where the user types multiple decimal points
    let decimalParts = value.split('.');
    if (decimalParts.length > 2) {
        value = decimalParts[0] + '.' + decimalParts.slice(1).join('');
    }

    // Update the input field with the valid value
    amountInput.value = value;

    // Check if the value is empty or not a valid number
    if (value === '' || isNaN(parseFloat(value))) {
        exchangeRateTxt.innerText = `0 ${fromCurrency.value} = 0.00 ${toCurrency.value}`;
    } else {
        getExchangeRate();
    }
});

window.addEventListener('load', () => {
    getExchangeRate();
});

const exchangeIcon = document.querySelector('.drop-list .icon');
exchangeIcon.addEventListener('click', () => {
    let tempCode = fromCurrency.value;
    fromCurrency.value = toCurrency.value;
    toCurrency.value = tempCode;
    loadFlag(fromCurrency);
    loadFlag(toCurrency);
    getExchangeRate();
});

function getExchangeRate() {
    let amountValue = parseFloat(amountInput.value);

    if (isNaN(amountValue) || amountValue <= 0) {
        amountValue = 0;
        amountInput.value = 0;
    }

    let url = `https://v6.exchangerate-api.com/v6/01dd23e50f983352e09328d1/latest/${fromCurrency.value}`;

    fetch(url)
    .then(response => response.json())
    .then(result => {
        let exchangeRate = result.conversion_rates[toCurrency.value];
        let totalExchangeRate = (amountValue * exchangeRate).toFixed(2);
        exchangeRateTxt.innerText = `${amountValue} ${fromCurrency.value} = ${totalExchangeRate} ${toCurrency.value}`;
    })
    .catch(() => {
        exchangeRateTxt.innerText = 'Something went wrong';
    });
}
