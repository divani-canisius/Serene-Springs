let bookingForm = document.querySelector('#booking-form');
let bookNowBtn = document.querySelector('#BookNow');
let clearBtn = document.querySelector('#Clear');
let loyalBtn = document.querySelector('#CheckLoyalty');
let favAddBtn = document.querySelector('#AddToFavourites');

let promoInput = document.querySelector('#promocode');
const promoCode = "Promo123"


if (!localStorage.getItem('loyalityPoint')) {
    // If it doesn't exist, set the key-value pair
    localStorage.setItem('loyalityPoint', 0);
}

// console.log(bookingForm);
let currentDate = new Date().toISOString().split('T')[0];
// console.log(currentDate)

let inputFields = Array.from(bookingForm.querySelectorAll('input'));
// console.log(inputFields);

let roomPricess = {
    'Single-Room': 25000,
    'Double-Room': 35000,
    'Triple-Room': 40000,
    'Extra-Bed': 8000,
    'Kid-meal': 5000,
}

let overallBookingText = '';

let textObject = {
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

let overallPrice = 0;
let promoPrice = 0;
let loyalityPoint = 0;

function overallBookingCalculation() {
    overallBookingText = '';
    loyalityPoint = 0;

    overallPrice = textObject['Single-Room'] * roomPricess['Single-Room'] + textObject['Double-Room'] * roomPricess['Double-Room'] + textObject['Triple-Room'] * roomPricess['Triple-Room'];
    // console.log('price :', price);
    if (textObject['Extra-Bed']) overallPrice += roomPricess['Extra-Bed'];
    if (textObject['Children'] > 0) overallPrice += textObject['Children'] * roomPricess['Kid-meal'];

    overallPrice *= textObject['Days'];


    let textReq = ['Single-Room', 'Double-Room', 'Triple-Room', 'Adults', 'Children', 'Days']
    // let overallBookingText = '1 Single-Room, 2 Double-Room, 4 Triple-Room, 3 Adults, 1 Children, Extra-Bed, WiFi, view, for 4 days from 2023-12-10'
    for (const key in textObject) {
        if (textReq.includes(key)) {
            let value = textObject[key];
            if (value > 0) {
                let textPart = ` ${value} ${key},`
                if (key == 'Days') {
                    textPart = ` for ${value} Day,`;
                    if (value > 1) {
                        textPart = ` for ${value} ${key},`
                    }
                }
                if (key == 'Adults') {
                    textPart = ` ${value} Adult,`;
                    if (value > 1) {
                        textPart = ` ${value} ${key},`
                    }
                }
                overallBookingText += textPart;
            }
        }
        if (key == 'Extra-Bed' || key == 'WiFi') {
            if (textObject[key]) overallBookingText += ` ${key},`;
        }
        if (key == 'view') {
            if (textObject[key] != '') overallBookingText += ` ${textObject[key]} view,`;
        }
        if (key == 'checkin') {
            if (textObject[key] > currentDate)
                overallBookingText += ` from ${textObject[key]}`;
        }
    }

    let numberOfRooms = textObject['Single-Room'] * 1 + textObject['Double-Room'] * 1 + textObject['Triple-Room'] * 1;
    if (numberOfRooms > 3) {
        loyalityPoint = numberOfRooms * 20;
    }

    if (promoPrice != 0) promoInput.value = '';

    document.getElementById('pointsdisplay').textContent = `${loyalityPoint}`;
    document.getElementById('overallbooking').textContent = `${overallBookingText}`;
    document.getElementById('overallbookingcost').textContent = `$${overallPrice}.00`;
}


inputFields.forEach(field => {
    let reqFields = ['Single-Room', 'Double-Room', 'Triple-Room', 'Extra-Bed']
    let otherReqFields = ['Adults', 'Children', 'Days', 'checkin']
    field.addEventListener('change', (event) => {
        updateForm(event.target.name)
        let fieldName = event.target.name;
        if (fieldName == 'promocode') return;
        if (fieldName == 'WiFi') textObject[`${fieldName}`] = event.target.checked;
        if (fieldName == 'view') textObject[`${fieldName}`] = field.id;

        if (otherReqFields.includes(fieldName)) {
            textObject[fieldName] = event.target.value;
        }

        if (reqFields.includes(fieldName)) {
            textObject[fieldName] = event.target.value;
            updateCurrentBooking(fieldName, roomPricess[`${fieldName}`])
            if (fieldName == 'Extra-Bed') textObject[`${fieldName}`] = event.target.checked;
        }
        console.log(textObject)
        overallBookingCalculation()
    })
});



function updateCurrentBooking(name, price) {
    document.getElementById('currentbooking').textContent = name
    document.getElementById('currentbookingcost').textContent = `$${price}.00`;
    console.log(name)
}

function updateForm(name) {
    // console.log(name)
}


function formValidation() {
    let data = {}
    let textFields = true
    let roomCount = false;
    let poolGardenCheck = false;
    let dateValid = false;
    inputFields.forEach(field => {
        data[`${field.name}`] = field.value
        if (field.name != 'promocode' && field.value == '')
            textFields = false;
        if (field.name == 'Single-Room' || field.name == 'Double-Room' || field.name == 'Triple-Room') {
            if (field.value > 0) roomCount = true;
        }

        if (field.id == 'pool')
            if (field.checked) poolGardenCheck = true;
        if (field.id == 'garden')
            if (field.checked) poolGardenCheck = true;

    });
    if (data['checkin'] > currentDate) dateValid = true;

    if (!textFields || !roomCount || !poolGardenCheck || !dateValid) {
        alert('Fill the form Correctly')
    }
    else {
        alert('Booked')
        let prevPoints = localStorage.getItem('loyalityPoint')
        let newPoints = prevPoints * 1 + loyalityPoint;
        localStorage.setItem('loyalityPoint', newPoints);
        window.location.reload();

    }
}


promoInput.addEventListener('change', (event) => {
    if (event.target.value == promoCode) {
        promoPrice = overallPrice * 95 / 100;
        document.getElementById('overallbookingcost').textContent = `$${promoPrice}.00 (5% deducted from the total bill)`;
    }
})

clearBtn.addEventListener('click', () => { window.location.reload() })
loyalBtn.addEventListener('click', () => {
    let lpoint = localStorage.getItem('loyalityPoint');
    alert(`You got ${lpoint} Loyalty Points`);
})
favAddBtn.addEventListener('click', () => {
    for (const key in textObject) {
        localStorage.setItem(key, textObject[key]);
    }
})
bookNowBtn.addEventListener('click', formValidation)