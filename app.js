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
    const data7  = await getDolarTarjeta()
                res.send(`
                <head>
                    <title>Dolar Update Pagina - v2.0</title>
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <meta name="title" content="Cotización del dolar!">
                    <meta property="og:type" content="website">
                    <meta property="og:site_name" content="@dolarupdate">
                    <meta property="og:image"
                      content="https://i.imgur.com/tpFifLb.jpeg">
                    <meta property="og:title" content="Cotización del dolar!">
                    <meta property="og:description"
                      content="Contamos con la cotización del Dolar Blue, Oficial, Contado Con Liqui, Bolsa, Promedio, Tarjeta y el Valor de Riesgo de país. Tambien contamos con un conversor online de dolares!">
                    <meta content="#f0f8ff" data-react-helmet="true" name="theme-color" />
                    <meta property="twitter:title" content="@dolarupdate">
                    <meta property="twitter:card" content="summary_large_image">
                    <meta name="twitter:site" content="@dolarupdate">
                    <meta name="twitter:creator" content="@dolarupdate">
                    <meta name="author" content="Chicho#4281" />                    
                    
                    <style>
                    body{
                        margin: 0;
                        padding: 0;
                        background: #f0eeee;
                        background-image: url(https://i.imgur.com/tpFifLb.jpeg);
                    }

                    .cuadro {
                        margin: 1rem;
                        padding: 1rem;
                        border-radius: 3px;
                        border: 1px solid rgba(0, 0, 0, 0.65);
                        text-shadow: 0px 0px 5px rgb(255 255 255 / 75%);
                        background-color: rgba(0, 0, 0, 0.5);
                        float: left
                    }

                    h1 {
                        font-size: 2.25rem;
                        margin: 0.25rem;
                        text-align: center;
                    }
                    
                    h2 {
                        font-size: 1.0rem;
                    }
                    
                    input {
                        border-radius: 2px;
                        margin-left: 0.25rem;
                        margin-right: 0.25rem;
                        width: 75px;
                        background-color:#010101;
                        border: none;
                        box-shadow: 0px 0px 20px #000000;
                        height: 35px;
                        color: white;
                        text-align: center;
                        -webkit-transition: all .2s ease-out;
                        -moz-transition: all .2s ease-out;
                        -ms-transition: all .2s ease-out;
                        -o-transition: all .2s ease-out;
                        transition: all .2s ease-out
                    }
                    
                    ::placeholder {
                        color: white;
                    }
                    
                    input:focus {
                        outline: none;
                        box-shadow: 0px 0px 20px rgba(256, 256, 256, 0.5);
                    }
                    
                    strong {
                        font-weight: bolder;
                        color:#6aa84f;
                        text-decoration: underline;
                    }
                    
                    .submit {
                        margin: 1rem;
                    }
                    
                    .submitBtn {
                        text-transform: uppercase;
                        background: linear-gradient(#000000, #001111);
                        border: none;
                        border-radius: 5px;
                        font-size: 2.5rem;
                        color: #ffffff;
                        padding: 1.25rem;
                        padding-left: 3rem;
                        padding-right: 3rem;
                        cursor: pointer;
                    
                        -webkit-transition: all .5s ease-out;
                        -moz-transition: all .5s ease-out;
                        -ms-transition: all .5s ease-out;
                        -o-transition: all .5s ease-out;
                        transition: all .5s ease-out
                    }
                    
                    .submitBtn:hover {
                        filter:invert();
                    }
                    
                    .pesos {
                        margin: 0.5rem;
                        padding: 0.5rem;
                        border-radius: 3px;
                        border: 1px solid rgba(0, 0, 0, 0.65);
                        text-shadow: 0px 0px 5px rgba(256, 256, 256, 0.75);
                        background-color: rgba(0, 0, 0, 0.5)
                    }
                    </style>
                </head>

                <body>

                <script>

function calcdolares() {

    const conversor1 = document.getElementById('conversor1');
    const conversor_title = document.getElementById('conversor-title');
    let conversor = document.getElementById('conversor').value;
    let d = document.getElementById("decision").value;
    if (d=="dolar blue")
    valor12 = conversor*${data.blue.value_sell};
    if(d=="dolar oficial")
    valor12 = conversor*${data2.oficial.value_sell}
    if(d=="dolar contado con liqui")
    valor12 = conversor*${data3.venta};
    if(d=="dolar tarjeta")
    valor12 = conversor*${data7.venta};
    if(d=="dolar promedio")
    valor12 = conversor*${data5.venta}

    let num = valor12
    let valor1 = num.toLocaleString("en-US");

    if (!conversor) {
        conversor_title.innerHTML = 'ERROR:';
        conversor1.innerHTML = 'Especifica el monto que quieres convertir.'
        return;
    } else if (isNaN(valor12)) {
        conversor_title.innerHTML = 'ERROR:';
        conversor1.innerHTML = 'Los puntos deben estar expresados con números, no letras. En caso de ser decimales usar "." y no ",".';
        return;
    }

    function isNaN(x) {
        return x !== x;
    };

    conversor_title.innerHTML = 'Tu monto en ' + d + ' (' + conversor + '):';
    conversor1.innerText = 'A pesos argentinos es: ' + valor1;
}; 
</script>

<center>
<section>
<div class="container">
<div class="cuadro">
    <div class="box">
        <h1>Conversor de <strong>Dolares</strong>
        !</h1>
        <div id="dolares1">
            <div class="dolares">
                <h2 style="text-transform: uppercase;">Ingrese el monto e elija el tipo de dolar!</h2>
                <select id="decision">
                <option value="dolar blue">Dolar Blue</option>
                <option value="dolar oficial">Dolar oficial</option>
                <option value="dolar contado con liqui">Dolar Contado con liqui</option>
                <option value="dolar tarjeta">Dolar Tarjeta</option>
                <option value="dolar promedio">Dolar Promedio</option>
            </select>
                <input type="text" placeholder="***" id="conversor">
            </div>
        </div>

        <div class="submit">
            <button class="submitBtn" onclick="calcdolares()">Calcular</button>
        </div>

        <div class="pesos">
            <h2 id="conversor-title" style="text-transform: uppercase;"></h2>
            <p id="conversor1">Aún no se ha convertido ningun monto.</p>
        </div>
    </div>
    </div>
</div>
</section>
</center>


                    <div class="cuadro">
                    <a><b>Dolar Blue:</b> <br>Compra: ${data.blue.value_buy} <br>Venta: ${data.blue.value_sell} <br>Fecha: ${data3.fecha}</a><br><br></div>
                    <div class="cuadro">
                    <a><b>Dolar Oficial</b>: <br>Compra: ${data2.oficial.value_buy} <br>Venta: ${data2.oficial.value_sell} <br>Fecha: ${data3.fecha}</a><br><br></div>
                    <div class="cuadro">
                    <a><b>Dolar Contado con liqui</b>: <br>Compra: ${data3.compra} <br>Venta: ${data3.venta} <br>Fecha: ${data3.fecha}</a><br><br></div>
                    <div class="cuadro">
                    <a><b>Dolar Bolsa</b>: <br>Compra: ${data4.compra} <br>Venta: ${data4.venta} <br>Fecha: ${data4.fecha}</a><br><br></div>
                    <div class="cuadro">
                    <a><b>Dolar Promedio</b>: <br>Compra: ${data5.compra} <br>Venta: ${data5.venta} <br>Fecha: ${data5.fecha}</a><br><br></div>
                    <div class="cuadro">
                    <a><b>Dolar Tarjeta</b>: <br>Compra: ${data7.compra} <br>Venta: ${data7.venta} <br>Fecha: ${data7.fecha}</a><br><br></div>
                    <div class="cuadro">
                    <a><b>Riesgo Pais</b>: <br>Valor: ${data6.valor} <br>Fecha: ${data6.fecha}</a><br><br></center></div>
                </body>
            `)
})

app.listen(port, () => {
    console.log("Server running on port " + port)
})

cron.schedule("15,30,00 7-21 * * 1,2,3,4,5,6", function(){
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
        const data7  = await getDolarTurista()
        const date = moment().tz(timezone).format('DD/MM/YYYY hh:mm');
        const tweet = `Precio Del Dólar` + "\n" + "#DolarBlue #Dolar" + "\n" + "\n" + "» Dólar Blue: " + "$" + data.blue.value_buy + " / " + "$" + data.blue.value_sell + "\n" + "» Dólar Oficial: " + "$" + data2.oficial.value_buy + " / " + "$" + data2.oficial.value_sell + "\n" + "» Dólar Contado con liqui: " + "$" + data3.compra + " / " + "$" + data3.venta + "\n" + "» Dólar Bolsa: " + "$" + data4.compra + " / " + "$" + data4.venta + "\n" + "» Dólar Promedio: " + "$" + data5.compra + " / " + "$" + data5.venta + "\n" + "» Dólar Turista: " + "$" + data7.compra + " / " + "$" + data7.venta + "\n" + "» Fecha: " + data3.fecha
        await postTweet(tweet)
    }
    catch (e) {
       console.log(e) 
    }
}

async function getDolarInfo(){
    try {
       const res = await axios.get('https://api.bluelytics.com.ar/v2/latest')
       return res.data
    }
    catch (e) {
        console.log(e)
    }
}

async function getDolarOficialInfo(){
    try {
       const res = await axios.get('https://api.bluelytics.com.ar/v2/latest')
       return res.data
    }
    catch (e) {
        console.log(e)
    }
}

async function getDolarContadoliquiInfo(){
    try {
       const res = await axios.get('https://dolarupdatebot.vercel.app/api/dolar/contadoliqui')
       return res.data
    }
    catch (e) {
        console.log(e)
    }
}

async function getDolarBolsarInfo(){
    try {
       const res = await axios.get('https://dolarupdatebot.vercel.app/api/dolar/bolsa')
       return res.data
    }
    catch (e) {
        console.log(e)
    }
}

async function getDolarPromedioInfo(){
    try {
       const res = await axios.get('https://dolarupdatebot.vercel.app/api/dolar/promedio')
       return res.data
    }
    catch (e) {
        console.log(e)
    }
}

async function getRiesgoPaisInfo(){
    try {
        const res = await axios.get('https://dolarupdatebot.vercel.app/api/bcra/riesgopais')
        return res.data
    }
    catch (e) {
        console.log(e)
    }
}

async function getDolarTarjeta(){
    try {
        const res = await axios.get('https://dolarupdatebot.vercel.app/api/dolar/tarjeta')
        return res.data
    }
    catch (e) {
        console.log(e)
    }
}

async function getDolarTurista(){
    try {
        const res = await axios.get('https://dolarupdatebot.vercel.app/api/dolar/turista')
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
