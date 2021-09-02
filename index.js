const express = require('express')
const {WebhookClient} = require('dialogflow-fulfillment');
const GlobalEnv = require('./GlobalEnv')
const calendar = require('./calendar.js')

const app = express()
 
app.get('/', function (req, res) {
  res.send('Chatbot Server Next Level Corp.')
})

app.post('/webhook', express.json(),function (req, res) {

    const agent = new WebhookClient({ request:req, response:res });

    function meetRespuestas(agent) {
        const data = req.body.queryResult.parameters

        console.log("datos: ", data);
        calendar.makeAppointment(agent)

        agent.add(`Respuesta registrada. \n ¿Algo más en lo que puedo ayudarte?`);
      }

    function consultClient(agent) {
      const data = req.body.queryResult.parameters

      console.log("datos: ", data);

      agent.add(`Respuesta registrada. \n ¿Algo más en lo que puedo ayudarte?`);
    }



    
    let intentMap = new Map();
    intentMap.set('meetRespuestas', meetRespuestas);
    intentMap.set('consultClient', consultClient);

    agent.handleRequest(intentMap);
  })
 
app.listen(GlobalEnv.port, () => {
    console.log(`Servidor web escuchando en ${GlobalEnv.host}:${GlobalEnv.port}`)
    
})