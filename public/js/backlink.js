async function sendReply() {
    const username = document.querySelector('input').value
    const message = document.querySelector('textarea').value

    const data = {
        username: username,
        text: message,
    }

    const request = new Request('http://localhost:3000/backlink_handle/', {
        method: 'POST',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })

    const response = await fetch(request)

    if (response.status == 200) {
        const container = document.querySelector('.container')
        container.style.display = 'none'
        const h1 = document.createElement('h1')
        h1.classList.add('done')
        h1.innerText = 'Форма отправлена'
        const navbar = document.querySelector('nav.navbar')
        navbar.after(h1)
    }
}

