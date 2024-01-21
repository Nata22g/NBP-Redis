const registrujSe = async (usertext) => {
    try{
        const response = await fetch('http://localhost:5000/dodajusera', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({username: usertext})
        })

        const data = await response.json()
        alert(data)
        if(response.status === 200) {
            localStorage.setItem('username', usertext);
            window.location.href = 'index.html';
        }
    } catch(error) {
        console.error('Error: ', error)
    }
}

const registerLink = document.querySelector('.registerNewUser')

registerLink.addEventListener('click', (event) => {
    event.preventDefault()

    const inputText = document.querySelector('.usernameNewUser').value
    if(inputText.trim() !== '') {
        registrujSe(inputText)
    } else {
        alert('Unesite username')
    }
    
})