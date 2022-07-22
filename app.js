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

app.get('/', async function(req, res) {
    const data  = await getDolarInfo()
    const data2  = await getDolarOficialInfo()
    const data3  = await getDolarContadoliquiInfo()
    const data4  = await getDolarBolsarInfo()
    const data5  = await getDolarPromedioInfo()
    const data6  = await getRiesgoPaisInfo()
    const data7  = await getDolarTurista()
                res.send(`
                <head>
                    <title>Chicho Dolar Bot - v1.0</title>
                <head>
                <body>
                    <a href="https://twitter.com/dolarupdate">Chicho Dolar Bot</a> - v<b>1.0</b><br>
                    <a>Creado por </a><a href="https://github.com/Chichx">Chicho</a><br><br><br>
                    <a><b>Dolar blue:</b> <br>Compra: ${data.compra} <br>Venta: ${data.venta} <br>Fecha: ${data.fecha}</a><br><br>
                    <a><b>Dolar Oficial</b>: <br>Compra: ${data2.compra} <br>Venta: ${data2.venta} <br>Fecha: ${data2.fecha}</a><br><br>
                    <a><b>Dolar Contado con liqui</b>: <br>Compra: ${data3.compra} <br>Venta: ${data3.venta} <br>Fecha: ${data3.fecha}</a><br><br>
                    <a><b>Dolar Bolsa</b>: <br>Compra: ${data4.compra} <br>Venta: ${data4.venta} <br>Fecha: ${data4.fecha}</a><br><br>
                    <a><b>Dolar Promedio</b>: <br>Compra: ${data5.compra} <br>Venta: ${data5.venta} <br>Fecha: ${data5.fecha}</a><br><br>
                    <a><b>Dolar Turista</b>: <br>Compra: ${data7.compra} <br>Venta: ${data7.venta} <br>Fecha: ${data7.fecha}</a><br><br>
                    <a><b>Riesgo Pais</b>: <br>Compra: ${data6.compra} <br>Venta: ${data6.venta} <br>Fecha: ${data6.fecha}</a><br><br>
                </body>
            `)
})

app.listen(port, () => {
    console.log("Server running on port " + port)
})

cron.schedule("5,10,20,30,40,50 0-23 * * 1,2,3,4,5,6", function(){
    console.log("Tiempo cumplido, hora de publicar el tweet!")
    main()
})

async function main(){
    try {
        publishDolar()
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
        const tweet = `Precio Del Dólar` + "\n" + "#DolarBlue #Dolar" + "\n" + "\n" + "» Dólar Blue: " + "$" + data.compra + " / " + "$" + data.venta + "\n" + "» Dólar Oficial: " + "$" + data2.compra + " / " + "$" + data2.venta + "\n" + "» Dólar Contado con liqui: " + "$" + data3.compra + " / " + "$" + data3.venta + "\n" + "» Dólar Bolsa: " + "$" + data4.compra + " / " + "$" + data4.venta + "\n" + "» Dólar Promedio: " + "$" + data5.compra + " / " + "$" + data5.venta + "\n" + "» Riesgo País: " + data6.valor + "\n" + "\n" + "» Fecha: " + date
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

async function getDolarTurista(){
    try {
        const res = await axios.get('https://api-dolar-argentina.herokuapp.com/api/dolarturista')
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