let adventureInput = document.querySelector('#adventure')
let diveOptions = document.querySelector('.dive-assist')
let AdvBookBtn = document.querySelector('#AdvBookBtn')

let AdltNum = document.querySelector('#Advadults')
let ChildNum = document.querySelector('#Advchildren')
let AdlDiveAssist = document.querySelector('#diveAdA')
let ChiDiveAssist = document.querySelector('#diveChA')
let localRad = document.querySelector('#local')
let ForeignRad = document.querySelector('#foreign')
let checkDate = document.querySelector('#Advdate')

let advForm = document.querySelector('#adv-form')
let advInputs = Array.from(document.querySelectorAll('input'))

let advCurrentDate = new Date().toISOString().split('T')[0];

let divePricess = {
    'lAdult': 5000,
    'lChild': 2000,
    'fAdult': 10000,
    'fChild': 5000,
    'AAssist': 1000,
    'CAssist': 500,
}

let divObject = {
    'Single-Room': 0,
    'Double-Room': 0,
    'Triple-Room': 0,
    'Adults': 1,
    'Children': 0,
    'Extra-Bed': false,
    'WiFi': false,
    'view': '',
    'Days': 1,
    'checkin': 0,
}

advInputs.forEach(inpField => {
    inpField.addEventListener('change', (event) => {
        setAdvPrice();
    })
});

function setAdvPrice() {
    let price = 0;
    let typeAdultPrice = (localRad.checked) ? divePricess['lAdult'] : divePricess['fAdult']
    let typeChildPrice = (localRad.checked) ? divePricess['lChild'] : divePricess['fChild']
    price = AdltNum.value * typeAdultPrice + ChildNum.value * typeChildPrice;
    if (AdlDiveAssist.checked) price += divePricess['AAssist']
    if (ChiDiveAssist.checked) price += divePricess['CAssist']


    document.querySelector('#Advcurrentbookingcost').textContent = `$${price}.00`
}

AdvBookBtn.addEventListener('click', () => {
    let valid = true;

    if (AdltNum.value == 0 && ChildNum.value == 0) valid = false;

    if (advCurrentDate > checkDate.value) valid = false;

    if (valid) {
        alert('Adventure booked Completed!')
        window.location.reload();
    }
    else {
        alert('Error: Fill Correctly!')
    }
})


