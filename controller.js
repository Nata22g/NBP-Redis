import client from "./redis-config.js" 

export const vratiUsere = async (req, res) => {
    console.log("blabla")
    if (!client.isOpen)
    {
        await client.connect()
    }
    const users = await client.sMembers("usernames")
    await client.disconnect()
    return res.status(200).json(users)
}

export const dodajUsera = async(req, res) => {
    if (!client.isOpen)
    {
        await client.connect()
    }
    //console.log("sad ovde")
    const users = await client.sMembers("usernames")
    //console.log(users)
    //console.log(req.body.username)
    if ( users.includes(req.body.username) )
    {
        return res.status(400).json("Username već postoji!")
    }
    const response = await client.sAdd("usernames", req.body.username)
    const response2 = await client.set("active:" + req.body.username, "x")
    const response3 = await client.expire("active:" + req.body.username, 50)
    const response4 = await client.hSet("odgovori:" + req.body.username, 
                                                            {
                                                                correct: 0,
                                                                incorrect: 0
                                                            })
    //console.log(response3)
    await client.disconnect()
    return res.status(200).json("Uspešno dodavanje usera")
}

export const prijaviSe = async (req, res) => {
    if (!client.isOpen)
    {
        await client.connect()
    }
    
    const users = await client.sMembers("usernames")
    //console.log(users)
    //console.log(req.body.username)
    if ( !users.includes(req.body.username) )
    {
        return res.status(400).json("Username ne postoji!")
    }
    const response = await client.set("active:" + req.body.username, "x")
    const response2 = await client.expire("active:" + req.body.username, 50)
    //console.log(response)
    await client.disconnect()
    return res.status(200).json("Uspešno prijavljivanje")
}

export const vratiAktivneUsere = async (req, res) => {
    if (!client.isOpen)
    {
        await client.connect()
    }

    const response = await client.keys("active*")
    //console.log(response)
    let aktivni = []
    for ( let user of response)
    {
        aktivni.push(user.replace("active:", ""))
    }
    client.disconnect()
    return res.status(200).json(aktivni)
}

export const dodajScore = async (req, res) => { //ovo se ne koristi
    if (!client.isOpen)
    {
        await client.connect()
    }

    const users = await client.sMembers("usernames")
    if ( !users.includes(req.body.username) )
    {
        return res.status(400).json("Username ne postoji!")
    }

    const score = req.body.score
    const username = req.body.username
    //console.log(score)
    //console.log(username)
    const respone = await client.zAdd("leaderboard",[{score: score, value: username}])
    //console.log(respone)
    await client.disconnect()
    return res.status(200).json("Uspešno dodavanje score-a")
}

export const vratiLeaderboard = async (req, res) => {
    if (!client.isOpen)
    {
        await client.connect()
    }
    const leaderboard = await client.zRangeWithScores("leaderboard", 0, -1)
    //console.log(leaderboard)
    leaderboard.reverse()
    client.disconnect()
    return res.status(200).json(leaderboard)
}

export const dodajTest = async (req, res) => {
    if (!client.isOpen)
    {
        await client.connect()
    }

    const response = await client.exists(req.body.testname + ":pitanja")
    //console.log(response)
    if ( response )
    {
        return res.status(400).json("Naziv testa već postoji")
    }

    for (let i in req.body.txt)
    {
        //console.log(typeof(i))
        let pitanje = {
            questionText: req.body.txt[i],
            options: req.body.opts[i],
            rightAnswer: req.body.ra[i]
        }

        const response = await client.sAdd(req.body.testname + ":pitanja", JSON.stringify(pitanje))
        //console.log(response)
        let j = parseInt(i) + 1
        //console.log(j)
        const response2 = await client.hSet(req.body.testname + ":pitanje" + j, 
                                                            {
                                                                questionNumber: j,
                                                                correct: 0,
                                                                incorrect: 0
                                                            })
        //console.log(response2)
    }

    await client.disconnect()
    return res.status(200).json("Test uspešno dodat")
}

export const vratiTest = async (req, res) => {
    if (!client.isOpen)
    {
        await client.connect()
    }

    const response = await client.sMembers(req.params.testname + ":pitanja")
    //console.log(response)
    let objs = []
    for ( let obj of response)
    {
        // console.log(obj)
        // console.log(JSON.parse(obj))
        objs.push(JSON.parse(obj))
    }
    //console.log(objs)
    client.disconnect()
    return res.status(200).json(objs)
}

export const vratiSveTestove = async (req, res) => {
    if (!client.isOpen)
    {
        await client.connect()
    }

    const response = await client.keys("*pitanja")
    //console.log(response)
    let testovi = []
    for ( let str of response)
    {
        testovi.push(str.replace("pitanja", ""))
    }
    client.disconnect()
    return res.status(200).json(testovi)
}

export const vratiStatistikuTesta = async (req, res) => {
    if (!client.isOpen)
    {
        await client.connect()
    }

    const response = await client.keys(req.params.testname + ":pitanje*")
    let result = []
    //console.log(response)
    for ( let pitanje of response)
    {
        result.push(await client.hGetAll(pitanje))
    }
    //console.log(result)
    client.disconnect()
    return res.status(200).json(result)
}

export const vratiStatistikuUsera = async (req, res) => {
    if (!client.isOpen)
    {
        await client.connect()
    }

    const response = await client.hGetAll("odgovori:" + req.params.username)
    console.log(response)
    client.disconnect()
    return res.status(200).json(response)
}

export const odgovoriTacno = async (req, res) => {
    if (!client.isOpen)
    {
        await client.connect()
    }

    const users = await client.sMembers("usernames")
    if ( !users.includes(req.body.username) )
    {
        return res.status(400).json("Username ne postoji!")
    }

    const response = await client.keys("active*")
    if (!response.includes("active:" + req.body.username))
    {
        return res.status(400).json("Niste prijavljeni")
    }

    const response2 = await client.zIncrBy("leaderboard", 10, req.body.username)
    const response3 = await client.hIncrBy("odgovori:" + req.body.username, "correct", 1)
    const response4 = await client.hIncrBy(req.body.question, "correct", 1)
    //console.log(response)
    await client.disconnect()
    return res.status(200).json("Tačan odgovor")
}

export const odgovoriNetacno = async (req, res) => {
    if (!client.isOpen)
    {
        await client.connect()
    }

    const users = await client.sMembers("usernames")
    if ( !users.includes(req.body.username) )
    {
        return res.status(400).json("Username ne postoji!")
    }

    const response = await client.keys("active*")
    if (!response.includes("active:" + req.body.username))
    {
        return res.status(400).json("Niste prijavljeni")
    }

    const response2 = await client.zIncrBy("leaderboard", -5, req.body.username)
    const response3 = await client.hIncrBy("odgovori:" + req.body.username, "incorrect", 1)
    const response4 = await client.hIncrBy(req.body.question, "incorrect", 1)
    //console.log(response)
    await client.disconnect()
    return res.status(200).json("Netačan odgovor")
}