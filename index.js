const express = require('express')
const {WebhookClient} = require('dialogflow-fulfillment');
const GlobalEnv = require('./GlobalEnv')

const app = express()
 
app.get('/', function (req, res) {
  res.send('Chatbot Server Next Level Corp.')
})

app.post('/webhook', express.json(),function (req, res) {

    const agent = new WebhookClient({ request:req, response:res });
    // console.log(req.body.queryResult.parameters);
    // console.log('Dialogflow Request headers: ' + JSON.stringify(req.headers));
    // console.log('Dialogflow Request body: ' + JSON.stringify(req.body));
   
    // function welcome(agent) {
    //   agent.add(`Welcome to my agent!`);
    // }
   
    // function fallback(agent) {
    //   agent.add(`I didn't understand`);
    //   agent.add(`I'm sorry, can you try again?`);
    // }

    function meetRespuestas(agent) {
        const data = req.body.queryResult.parameters

        console.log("datos: ", data);

        agent.add(`Respuesta registrada. \n ¿Algo más en lo que puedo ayudarte?`);
      }

    let intentMap = new Map();
    // intentMap.set('Default Welcome Intent', welcome);
    // intentMap.set('Default Fallback Intent', fallback);
    intentMap.set('meetRespuestas', meetRespuestas);

    agent.handleRequest(intentMap);
  })
 
app.listen(GlobalEnv.port, () => {
    console.log(`Servidor web escuchando en ${GlobalEnv.host}:${GlobalEnv.port}`)
    
})