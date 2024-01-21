const ulogujSe = async (usertext) => {
    try{
        const response = await fetch('http://localhost:5000/prijavise', {
            method: 'PUT',
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

const loginLink = document.querySelector('.linkLoginClick')

loginLink.addEventListener('click', (event) => {
    event.preventDefault()

    const inputText = document.querySelector('.userNameInputEl').value
    if(inputText.trim() !== '') {
        ulogujSe(inputText)
    } else {
        alert('Unesite username')
    }
    
})