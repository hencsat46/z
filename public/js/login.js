async function send() {
    const username = document.querySelector('.username-text').value
    const password = document.querySelector('.password-text').value

    dataObject = {
        username: username,
        password: password,
    }
    
    const request = new Request('http://localhost:3000/login_handler', {
        method: 'POST',
        mode: 'cors',
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(dataObject)
    })
    
    const response = (await fetch(request))

    if (response.status == 200) {
        document.querySelector('.password-invalid').style.display = 'none'
        window.location.replace('http://localhost:3000/')
    }

    if (response.status == 400) {
        document.querySelector('.password-invalid').style.display = 'block'
    }

}

function moveToSignup() {
    const signupHtml = `
        <div class="username">
            <div class="exists">Такой пользователь существует</div>
            <div class="username-header">Логин</div>
            <input type="text" class="username-text">
        </div>
        <div class="password">
            <div class="password-header">Пароль</div>
            <input type="password" class="password-text">
        </div>
        <div class="password">
            <div class="error">Пароли не совпадают</div>
            <div class="password-header">Повторите пароль</div>
            <input type="password" class="password-text">
        </div>
        <button class="submit" onclick="signup()">Зарегистрироваться</button> 
    `

    const oldLogin = document.querySelector('div.login-section')

    oldLogin.innerHTML = signupHtml

}

async function signup() {
    const username = document.querySelector('.username-text').value
    const passwords = document.querySelectorAll('.password-text')
    const error = document.querySelector('.error')

    const data = {
        username: username,
        password: passwords[0].value,
    }

    if (passwords[0].value != passwords[1].value) {
        error.style.display = 'block'
        return
    } else {
        error.style.display = 'none'
    }

    console.log(data)

    const request = new Request('http://localhost:3000/signup_handler/', {
        method: 'POST',
        mode: 'cors',
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data)
    })

    const response = await fetch(request)

    if (response.status == 200) {
        document.querySelector('.exists').style.display = 'none'
        const request = new Request('http://localhost:3000/login_handler/', {
            method: "POST",
            mode: 'cors',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        })
        const response = await fetch(request)
        if (response.status == 200) {
            window.location.replace('http://localhost:3000/')
        }
        
    } else {
        if (response.status == 400) {
            document.querySelector('.exists').style.display = 'block'
        }
    }

}
