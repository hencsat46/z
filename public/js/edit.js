var editedItem = false
const wrapper = document.querySelector('.wrapper');
const navbar = wrapper.querySelector('nav.navbar')
const itemWrappers = wrapper.querySelectorAll('.products-block')
let itemData = new Array()

function editElem(element) {
    const selectedElement = element.parentElement.parentElement
    const saveButton = selectedElement.querySelector('.save-button')
    let blur, pointer, text, button;

    if (!editedItem) {
        blur = 'blur(5px)'
        pointer = 'none'
        text = 'Отменить'
        button = 'block'
        selectedElement.querySelectorAll('.item-name, .item-text').forEach(function(element) {
            var input = document.createElement('input');
            input.setAttribute('class', element.classList[0]);
            input.setAttribute('value', element.innerText)
            element.parentNode.replaceChild(input, element);
            itemData.push(element.innerText)
        });
    }
    else {
        let i = 0
        text = 'Изменить'
        blur = 'none'
        pointer = 'auto'
        button = 'none'
        selectedElement.querySelectorAll('.item-name, .item-text').forEach(function(element) {
            var input = document.createElement('div');
            input.setAttribute('class', element.classList[0]);
            input.innerText = itemData[i++]
            element.parentNode.replaceChild(input, element);
        });

        itemData = []
    }

    editedItem = !editedItem
    itemWrappers.forEach(function(element) {
        const items = element.querySelectorAll('.item')
        items.forEach(function(element) {
            if (element != selectedElement) {
                element.style.filter = blur;
                element.style.pointerEvents = pointer
            }
        })
    });
    navbar.style.filter = blur
    element.innerText = text
    saveButton.style.display = button


}

async function sendElemData(element) {
    const item = element.parentElement.parentElement
    const name = item.querySelector('.item-name').value
    const description = item.querySelector('.item-text').value
    const id = item.getAttribute('id')

    const data = {
        id: id,
        name: name,
        description: description,
    }

    const request = new Request('http://localhost:3000/item_handle/', {
        method: 'PUT',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    })

    console.log(id)

    const response = await fetch(request)
    if (response.status == 200) {
        window.location.reload()
    }
}

async function deleteElem(element) {
    const item = element.parentElement.parentElement
    const id = item.getAttribute('id')

    const data = {
        id: id
    }

    const request = new Request('http://localhost:3000/delete_item_handle', {
        method: 'DELETE',
        mode: "cors",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data)
    })

    const response = await fetch(request)

    if (response.status == 200) {
        window.location.reload()
    }
}