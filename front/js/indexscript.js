const prikaziAktivne = async (usertext) => {
    try{
        const response = await fetch('http://localhost:5000/vratiaktivne', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })

        const data = await response.json()

        if(response.status === 200) 
        {
            const container = document.querySelector('.aktivniUseri');
            
            container.innerText = ''

            if(data.length > 0){
                data.forEach((userName) => {
                    const listItem = document.createElement('li');
                    listItem.textContent = userName;

                    // Append the list item to the container
                    container.appendChild(listItem);
                });
            }
            else{
                const p = document.createElement('p')
                p.innerText = "Nijedan korisnik se nije prijavio u poslednja 3 minuta"
                container.appendChild(p)
            }
        }
        
        
    } catch(error) {
        console.error('Error: ', error)
    }
}

const checkAnswer = async (selectedAnswer, correctAnswer, nazivTesta, question) => {
    try{
        const obj = {
            username: localStorage.getItem('username'),
            question: `${nazivTesta}:pitanje:${question}`
        }
        
        if (selectedAnswer === correctAnswer) {
            const response = await fetch('http://localhost:5000/odgtacno', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(obj)
            })
            alert("Correct!");
        } else {
            const response = await fetch('http://localhost:5000/odgnetacno', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(obj)
            })
            alert("Incorrect.");
        }
    } catch(error) {
        console.error('Error: ', error)
    }
}

const vratiKonkretniTest = async (nazivTesta) => {
    try {
        const response = await fetch(`http://localhost:5000/vratitest/${nazivTesta}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            const data = await response.json();
            const quizContainer = document.querySelector(`.NazivKviza${nazivTesta}`);
            quizContainer.innerHTML = ""; // Clear previous content

            data.forEach(question => {
                const questionContainer = document.createElement("div");
                const questionHeading = document.createElement("h5");
                questionHeading.textContent = question.questionText;
                questionContainer.appendChild(questionHeading);

                question.options.forEach(option => {
                    const optionButton = document.createElement("button");
                    optionButton.textContent = option;
                    optionButton.classList.add("btn", "btn-primary", "option-button");

                    optionButton.addEventListener("click", () => checkAnswer(option, question.rightAnswer, nazivTesta, question.questionText));
                    questionContainer.appendChild(optionButton);
                });

                quizContainer.appendChild(questionContainer);
            });
        } else {
             console.error('Failed to fetch test:', response.statusText);
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

const prikaziSveTestove = async () => {
    try {
        const response = await fetch('http://localhost:5000/vratisvetestove', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            const data = await response.json();

            if(data.length > 0) {
                const existingContainer = document.getElementById('testsContainer');
                if (existingContainer) {
                    existingContainer.remove();
                }

                const newTestsContainer = document.createElement('div');
                newTestsContainer.id = 'testsContainer';

                const roditelj = document.querySelector('.klasaZaTestove')
                roditelj.appendChild(newTestsContainer);

                data.forEach(test => {
                    const card = document.createElement('div');
                    card.classList.add('card', 'mb-3');

                    const cardBody = document.createElement('div');
                    cardBody.classList.add('card-body');

                    const nazivElement = document.createElement('h5');
                    nazivElement.classList.add('card-title', 'text-dark'); 
                    const nazivZaPrikaz = test.toUpperCase()
                    nazivElement.textContent = `Naziv: ${nazivZaPrikaz}`;

                    const showWorkersButton = document.createElement('button');
                    showWorkersButton.classList.add('btn', 'btn-info', 'mx-2'); 
                    showWorkersButton.innerHTML = 'RADI TEST';
                    showWorkersButton.addEventListener('click', async (event) => {
                        event.preventDefault();
                        vratiKonkretniTest(test)
                    });

                    const pitanja = document.createElement('div')
                    pitanja.classList.add(`NazivKviza${test}`)
                    pitanja.classList.add('question-heading')

                    cardBody.appendChild(nazivElement);
                    cardBody.appendChild(showWorkersButton);
                    cardBody.appendChild(pitanja)
                    card.appendChild(cardBody);
                    newTestsContainer.appendChild(card);
                });
            } else {
                alert('Nijedan test ne postoji!')
            }
        } else {
             console.error('Failed to fetch testovi:', response.statusText);
        }
    } catch (error) {
        console.error('Error:', error);
    }
}



const el = localStorage.getItem('username')
const user = document.querySelector('.userMojDragi')
user.innerHTML = el

const btnAktivni = document.querySelector('.btnAktivni')

btnAktivni.addEventListener('click', (event) => {
    event.preventDefault()

    prikaziAktivne()
    
})

prikaziSveTestove()