const express = require('express')
const {WebhookClient} = require('dialogflow-fulfillment');
const GlobalEnv = require('./GlobalEnv')
const calendar = require('./calendar.js');
const { call_nlocrm } = require('./pycaller');
const { capitalize } = require('./utils');
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
        
        call_nlocrm({
          lastname: capitalize(data['last-name'].join(' ')),
          givenname: capitalize(data['given-name'].join(' ')),
          email: data['email'],
          company: data['any'].toUpperCase(), // TODO fix var name
          phone: data['phone-number'],
          service: capitalize(data['Servicio']),
          date: data['date'],
          time: data['time'],
        })

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