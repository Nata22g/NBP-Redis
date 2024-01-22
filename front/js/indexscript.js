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

const prikaziStatistikuTesta = async (test) => {
    try {
        const response = await fetch(`http://localhost:5000/vratistat/${test}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        
        if(response.ok) {
            const data = await response.json()
            //console.log(data)

            const resultsContainer = document.querySelector(`.Statistika${test}`);
            resultsContainer.innerText = ''
            data.forEach(result => {
                const paragraph = document.createElement('p');
                //paragraph.textContent = `Pitanje: ${result.questionText} Br. tacnih odgovora: ${result.correct}, Br. netacnih odgovora: ${result.incorrect}`;
                paragraph.classList.add('result-paragraph');
                paragraph.innerHTML = `<span style="color: #007bff;">Pitanje:</span> ${result.questionText} 
                                        <span style="color: #28a745;">Br. tacnih odgovora:</span> ${result.correct} 
                                        <span style="color: #dc3545;">Br. netacnih odgovora:</span> ${result.incorrect}`;
                resultsContainer.appendChild(paragraph);
        });
        }       

    } catch (error) {
        console.error(error)
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

                    //novo
                    const showButton = document.createElement('button');
                    showButton.classList.add('btn', 'btn-info', 'mx-2');
                    showButton.innerHTML = 'PRIKAŽI STATISTIKU';
                    showButton.addEventListener('click', async (event) => {
                        event.preventDefault();
                        prikaziStatistikuTesta(test)
                    });
                    //kraj novog

                    //brisi dovde
                    const roditeljskiDiv = document.createElement('div')
                    roditeljskiDiv.className = 'roditeljski-div-moj'

                    const pitanja = document.createElement('div')
                    pitanja.classList.add(`NazivKviza${test}`)
                    pitanja.classList.add('question-heading')

                    const divZaStat = document.createElement('div')
                    divZaStat.classList.add('question-heading')
                    divZaStat.classList.add(`Statistika${test}`)
                    divZaStat.classList.add(`StatistikaTESTOVA`)

                    roditeljskiDiv.appendChild(pitanja)
                    roditeljskiDiv.appendChild(divZaStat)

                    cardBody.appendChild(nazivElement);
                    cardBody.appendChild(showWorkersButton);
                    //novo
                    cardBody.appendChild(showButton)
                    //kraj novog
                    cardBody.appendChild(roditeljskiDiv)
                    card.appendChild(cardBody);
                    newTestsContainer.appendChild(card);
                });
            } else {
                alert('Nijedan test ne postoji!')
            }

            prikaziLeaderboard()

        } else {
             console.error('Failed to fetch testovi:', response.statusText);
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

const submitForm = async () => {
    try {
        const testname = document.getElementById('testname').value;
        const questions = document.getElementById('questions').value.split('\n');
        const options = document.getElementById('options').value.split('\n').map(option => option.split(', '));
        const rightAnswers = document.getElementById('rightAnswers').value.split('\n');

        // console.log(testname)
        // console.log(questions)
        // console.log(options)
        // console.log(rightAnswers)
 
        if(testname.trim() === '' || questions[0] === '' || options[0] === '' || rightAnswers[0] === '') {
            alert('SVA POLJA SU OBAVEZNA')
            return
        }
        console.log('nije proso')
        const jsonData = {
            "testname": testname,
            "txt": questions,
            "opts": options,
            "ra": rightAnswers
        };

        //console.log(jsonData)

        const response = await fetch('http://localhost:5000/dodajtest', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(jsonData),
        })

        const data = await response.json()

        alert(data)

    } catch(error){
        console.error(error)
    }
}

const prikaziLeaderboard = async () => {
    try {
        const divZaLeaderboard = document.querySelector('.klasaZaLeaderboard')

        const response = await fetch('http://localhost:5000/leaderboard', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        })

        if(response.ok) {
            const data = await response.json()

            const naslov = document.createElement('h3')
            naslov.innerText = 'Leaderboard:'

            divZaLeaderboard.appendChild(naslov)

            data.forEach(test => {
                const card = document.createElement('div');
                card.classList.add('card', 'mb-3');

                const cardBody = document.createElement('div');
                cardBody.classList.add('card-body');

                const nazivElement = document.createElement('h5');
                nazivElement.classList.add('card-title', 'text-dark');
                nazivElement.innerHTML = `username: <span style="font-size: 25px; color: blue;">${test.value}</span> score: <span style="font-size: 25px; color: green;">${test.score}</span>`;

                cardBody.appendChild(nazivElement);
                card.appendChild(cardBody);
                divZaLeaderboard.appendChild(card);
            });

            showAllUsers()
        }

    } catch (error) {
        console.error(error)
    }
}

const prikaziStatUsera = async (user) => {
    try {
        const divZaStatistiku = document.querySelector(`.User${user}`)

        const response = await fetch(`http://localhost:5000/vratistatusera/${user}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        })

        divZaStatistiku.innerText = ''

        if(response.ok) {
            const data = await response.json()

            const nazivElement = document.createElement('h5');
            nazivElement.classList.add('card-title', 'text-dark');
            nazivElement.innerHTML = `Br. tačnih odgovora: <span style="font-size: 25px; color: green;">${data.correct}</span> Br. netačnih odgovora: <span style="font-size: 25px; color: red;">${data.incorrect}</span>`; 
        
            divZaStatistiku.appendChild(nazivElement)
        }

    } catch (error) {
        console.error(error)
    }
}

const showAllUsers = async () => {
    try {
        const divZaUsere = document.querySelector('.klasaZaStatistikuUsera')

        const response = await fetch('http://localhost:5000/vratiusere', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        })

        if(response.ok) {
            const data = await response.json()

            const naslov = document.createElement('h3')
            naslov.innerText = 'Svi useri:'

            divZaUsere.appendChild(naslov)

            data.forEach(user => {
                const card = document.createElement('div');
                card.classList.add('card', 'mb-3');

                const cardBody = document.createElement('div');
                cardBody.classList.add('card-body');

                const nazivElement = document.createElement('h5');
                nazivElement.classList.add('card-title', 'text-dark');
                nazivElement.innerHTML = `username: <span style="font-size: 25px; color: blue;">${user}</span>`;

                const showWorkersButton = document.createElement('button');
                showWorkersButton.classList.add('btn', 'btn-info', 'mx-2');
                showWorkersButton.innerHTML = 'PRIKAŽI STATISTIKU';
                showWorkersButton.addEventListener('click', async (event) => {
                    event.preventDefault();

                    prikaziStatUsera(user)
                });

                const elZaStat = document.createElement('div')
                elZaStat.className = `User${user}`

                cardBody.appendChild(nazivElement);
                cardBody.appendChild(showWorkersButton)
                cardBody.appendChild(elZaStat)
                card.appendChild(cardBody);
                divZaUsere.appendChild(card);
            });
        }

    } catch (error) {
        console.error(error)
    }
}


const el = localStorage.getItem('username')
const user = document.querySelector('.userMojDragi')
user.innerHTML = el

const btnAktivni = document.querySelector('.btnAktivni')
const btnDodajTest = document.querySelector('.btnDodajTest')

btnAktivni.addEventListener('click', (event) => {
    event.preventDefault()

    prikaziAktivne()

})

btnDodajTest.addEventListener('click', (event) => {
    event.preventDefault()

    submitForm()
})

prikaziSveTestove()
