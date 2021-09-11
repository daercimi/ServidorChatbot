const express = require('express')
const {WebhookClient} = require('dialogflow-fulfillment');
const GlobalEnv = require('./GlobalEnv')
const calendar = require('./calendar.js');
const { call_nlocrm } = require('./pycaller');
const { capitalize } = require('./utils');
const { pushNotification } = require('./pushNotification');
const app = express()

app.get('/', function (req, res) {
  res.send('Chatbot Server Next Level Corp.')
})

app.post('/webhook', express.json(),function (req, res) {

    const agent = new WebhookClient({ request:req, response:res });

    function meetRespuestas(agent) {
        const data = req.body.queryResult.parameters

        console.log("datos: ", data);

        // aplicar formato a los datos
        let lastname = capitalize(data['last-name'].join(' '));
        let givenname = capitalize(data['given-name'].join(' '));
        let phone = data['phone-number'];
        phone.replace(/\s+/g, ''); // eliminar espacios
        phone = phone.slice(-9); // recoger solo ultimos 9 digitos
        let service = capitalize(data['Servicio']);
        let company = data['any'].toUpperCase();
        
        calendar.makeAppointment(agent) // agendar en Google Calendar
        
        call_nlocrm({ // crea lead en Odoo
          lastname,
          givenname,
          email: data['email'],
          company,
          phone,
          service,
          date: data['date'],
          time: data['time'],
        })
  
        pushNotification({ // notificación a gerente de NextLevel
          k: 'k-ecaef4707c25',
          t: '¡Una nueva cita fue registrada!',
          c: `
            Cliente: ${givenname}, ${lastname}
            Empresa: ${company}
            Servicio: ${service}
            Fecha: ${data['date']}
            Hora: ${data['time']}
            Para mas detalles visite el lead creado en Odoo CRM o visite Google Calendar pulsando en esta notificación.
            `,
          u: 'https://calendar.google.com/calendar/',
        })

        agent.add(`Respuesta registrada. \n ¿Algo más en lo que puedo ayudarte?`);
      }

    function consultClient(agent) {
      const data = req.body.queryResult.parameters
      console.log("datos: ", data);

      // datos:  {
      //   any: 'consulta x',
      //   'phone-number': '933231388',
      //   email: 'roger@tes.com'
      // }
      
      // k=k-ecaef4707c25&
      // t=sample&
      // c=from+samsung+SM-J600G&
      // u=http%3A%2F%2Fgoogle.com

      // http://xdroid.net/api/message?k=k-ecaef4707c25&t=sample&c=from+samsung+SM-J600G&u=http%3A%2F%2Fgoogle.com

      // aplicar formato a los datos
      let phone = data['phone-number']
      phone.replace(/\s+/g, '') // eliminar espacios
      phone = phone.slice(-9) // recoger solo ultimos 9 digitos

      pushNotification({ // notificación a gerente de NextLevel
        k: 'k-ecaef4707c25',
        t: '¡Un cliente requiere de tu ayuda!',
        c: `Consulta: ${data['any']} \n Email: ${data['email']}`,
        u: encodeURI(`https://wa.me/51${phone}?text=¡Hola!\nSomos Next Level.\nEn breve responderé tu consulta.`),
      })

      agent.add(`Respuesta registrada. \n ¿Algo más en lo que puedo ayudarte?`);
    }

    function reclamoEnvio(agent) {
      const data = req.body.queryResult.parameters
      console.log("datos: ", data);
    
      agent.add(`Tu reclamo ha sido enviado. ¿Deseas regresar al menú principal?`);
    }

    // http://xdroid.net/api/message?k=k-ecaef4707c25&t=sample&c=from+samsung+SM-J600G&u=http%3A%2F%2Fgoogle.com
    
    let intentMap = new Map();
    intentMap.set('meetRespuestas', meetRespuestas);
    intentMap.set('consultClient', consultClient);
    intentMap.set('reclamoEnvio', reclamoEnvio);

    agent.handleRequest(intentMap);
  })
 
app.listen(GlobalEnv.port, () => {
    console.log(`Servidor web escuchando en ${GlobalEnv.host}:${GlobalEnv.port}`)
    
})