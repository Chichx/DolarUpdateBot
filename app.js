const express = require('express')
const app = express();
const config = require('./config')
const Twitter = require('twitter')
const axios = require('axios')
const cron = require("node-cron")
const moment = require('moment-timezone');
const timezone = 'America/Argentina/Buenos_Aires';
const port = config.PORT || 8080 

const client = new Twitter({
    consumer_key:     config.API_KEY,
    consumer_secret:  config.API_SECRET_KEY,
    access_token_key: config.ACCESS_TOKEN,
    access_token_secret: config.ACCES_TOKEN_SECRET
})


app.set('port', port)

app.get('/', (req, res) => {
                res.send(`
                <head>
                    <title>Chicho Dolar Bot - v1.0</title>
                <head>
                <body>
                    <a href="https://twitter.com/dolarupdate">Chicho Dolar Bot</a> - v<b>1.0</b><br>
                    <a>Creado por </a><a href="https://github.com/Chichx">Chicho</a>
                </body>
            `)
})

app.listen(port, () => {
    console.log("Server running on port " + port)
})

cron.schedule("*/30 * * * *", function(){
    console.log("Tiempo cumplido, hora de publicar el tweet!")
    main()
})

async function main(){
    try {
        publishDolar()
        console.log('Tweets publicados exitosamente')
     } catch (e) {
        console.log(e)
    }
}

async function publishDolar(){
    try {
        const data  = await getDolarInfo()
        const data2  = await getDolarOficialInfo()
        const data3  = await getDolarContadoliquiInfo()
        const data4  = await getDolarBolsarInfo()
        const data5  = await getDolarPromedioInfo()
        const data6  = await getRiesgoPaisInfo()
        const date = moment().tz(timezone).format('DD/MM/YYYY hh:mm');
        const tweet = "Precio Del Dólar 🇦🇷" + "\n" + "#DolarBlue #DolarHoy #Dolar" + "\n" + "\n" + "» Dólar Blue: " + "$" + data.compra + " / " + "$" + data.venta + "\n" + "» Dólar Oficial: " + "$" + data2.compra + " / " + "$" + data2.venta + "\n" + "» Dólar Contado con liqui: " + "$" + data3.compra + " / " + "$" + data3.venta + "\n" + "» Dólar Bolsa: " + "$" + data4.compra + " / " + "$" + data4.venta + "\n" + "» Dólar Promedio: " + "$" + data5.compra + " / " + "$" + data5.venta + "\n" + "» Riesgo País: " + data6.valor + "\n" + "\n" + "» Fecha: " + date
        //const tweet = "💸 " + "Dolar Blue:" + "\n" + "Compra: " + data.compra + "\n" + "Venta: " + data.venta + "\n" + "\n" + "💸 " + "Dolar Oficial:" + "\n" + "Compra: " + data2.compra + "\n" + "Venta: " + data2.venta + "\n" + "\n"+ "💸 " + "Contado con liqui:" + "\n" + "Compra: " + data3.compra + "\n" + "Venta: " + data3.venta + "\n" + "\n" + "💸 " + "Dolar Bolsa:" + "\n" + "Compra: " + data4.compra + "\n" + "Venta: " + data4.venta + "\n" + "\n"+ "💸 " + "Dolar Promedio:" + "\n" + "Compra: " + data5.compra + "\n" + "Venta: " + data5.venta + "\n" + "\n"+ "💣 " + "Riesgo País:" + "\n" + "Puntos: " + data6.valor
        await postTweet(tweet)
    }
    catch (e) {
       console.log(e) 
    }
}

async function getDolarInfo(){
    try {
       const res = await axios.get('https://api-dolar-argentina.herokuapp.com/api/dolarblue')
       return res.data
    }
    catch (e) {
        console.log(e)
    }
}

async function getDolarOficialInfo(){
    try {
       const res = await axios.get('https://api-dolar-argentina.herokuapp.com/api/dolaroficial')
       return res.data
    }
    catch (e) {
        console.log(e)
    }
}

async function getDolarContadoliquiInfo(){
    try {
       const res = await axios.get('https://api-dolar-argentina.herokuapp.com/api/contadoliqui')
       return res.data
    }
    catch (e) {
        console.log(e)
    }
}

async function getDolarBolsarInfo(){
    try {
       const res = await axios.get('https://api-dolar-argentina.herokuapp.com/api/dolarbolsa')
       return res.data
    }
    catch (e) {
        console.log(e)
    }
}

async function getDolarPromedioInfo(){
    try {
       const res = await axios.get('https://api-dolar-argentina.herokuapp.com/api/dolarpromedio')
       return res.data
    }
    catch (e) {
        console.log(e)
    }
}

async function getRiesgoPaisInfo(){
    try {
        const res = await axios.get('https://api-dolar-argentina.herokuapp.com/api/riesgopais')
        return res.data
    }
    catch (e) {
        console.log(e)
    }
}

async function postTweet(data){
    try {
        const result = await client.post('/statuses/update', { status: data })
        console.log(result)
    }
    catch (e) {
        console.log(e)
    }
}
