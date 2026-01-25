require("dotenv").config();

const express = require("express")
const cors = require("cors");

const app = express();

app.use(cors({
    origin : 'http://127.0.0.1:3001'
}));

app.get('/city', async function (req, res) {
    const city = req.query.city;
    
    const response = await fetch(`https://open-weather13.p.rapidapi.com/city?city=${city}`, {
        headers : {
            "x-rapidapi-host": process.env.RAPIDAPI_HOST,
            "x-rapidapi-key": process.env.RAPIDAPI_KEY,
        }
    })

    if(!response.ok){
        return res.status(403).json({
            msg : "Not reachable!"
        })
    }

    const data = await response.json();

    return res.json(data);
})

app.listen(3000);