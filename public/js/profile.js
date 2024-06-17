let isEdited = false

let data = new Array()
const sendButton = document.querySelector('button.send-button')

function editProfile(editButton) {
    if (!isEdited) {
        document.querySelectorAll('.name-text, .surname-text, .patronomyc-text, .phone-text').forEach(function(element) {
            data.push(element.innerText)
            var input = document.createElement('input');
            input.setAttribute('class', element.classList[0]);
            input.setAttribute('placeholder', element.innerText);
            element.parentNode.replaceChild(input, element);
        });

        sendButton.style.display = 'block';
    
        editButton.innerText = 'Отменить'
        isEdited = !isEdited
    } else {
        let i = 0
        document.querySelectorAll('.name-text, .surname-text, .patronomyc-text, .phone-text').forEach(function(element) {
            var input = document.createElement('div');
            input.setAttribute('class', element.classList[0]);
            input.innerText = data[i++]
            element.parentNode.replaceChild(input, element);
        });

        sendButton.style.display = 'none';
    
        editButton.innerText = 'Изменить'
        data = []
        isEdited = !isEdited
    }
}

async function sendData() {
    const data = {
        name: document.querySelector('.name-text').value,
        surname: document.querySelector('.surname-text').value,
        patronomyc: document.querySelector('.patronomyc-text').value,
        phone: document.querySelector('.phone-text').value
    }

    const request = new Request('http://localhost:3000/update_handler/', {
        method: 'PUT',
        mode: "cors",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    })

    const response = await fetch(request)

    if (response.status == 200) {
        window.location.reload()
    }
}

function editProducts() {
    window.location.replace("http://localhost:3000/edit")
}

function quit() {
    document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    window.location.replace('http://localhost:3000/')
}

async function deleteFromCart(element) {
    const item = element.parentElement

    const id = item.getAttribute('id')
    const data = {
        id: id,
    }

    const request = new Request('http://localhost:3000/delete_handle', {
        method: 'DELETE',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    })

    const response = await fetch(request)

    if (response.status == 200)
        window.location.reload()
}

function addProducts() {
    window.location.replace('http://localhost:3000/profile/add')
}