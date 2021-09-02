'use strict';

 const {google} = require('googleapis');
 
 // Enter your calendar ID below and service account JSON below
 const calendarId = "7bt0tpamdmaptdgocbohion4nc@group.calendar.google.com"
 const serviceAccount = {
    "type": "service_account",
    "project_id": "nextlevelbot-bujr",
    "private_key_id": "16f3caf58803a66eb54fe68e34059f741e2404bb",
    "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDhtLIp49sDdelz\nCnfjscS+/GsBlgQJYUb/KvL6B1jZF/I6KAaswYPOjPm/NzzGUuSOsV62CwZn4uUx\nmH14qsukMwG185bkxEgdv0c053srqhvHEWlbysFCKwQdrqBqLtahRHsOMa7VKEYY\nXNO2lpNOibhm+4iH5XwGch/mZ1faTBM6JTO2QZW7DUFAnvm11a5s0ILEr5rjsyXQ\npBARX8K5zF19JkVEETK8uRH2a+hAj98tL4S7ZIxTHe5MVQ7FQ+OlHvmVmCRFr23L\nMM+0Ku6zmo1y9u5QUGXZUK96b87RfSrM+fMiakuz/SfuIR41Z7hVG7rMRS6OjYmH\n5jAfC3bxAgMBAAECggEAC9FhyMa493/rhs4EBASRWCywT6dys6kHxiGSElxjHw7d\nbIUfAFmrlJuWEhiK0pmRhRUtb9u47KSZOpUQ8MoEmqbfDo9gFb9fRUt4J4F9VgZ0\nqOI1AYzmvJezAfjcRmMIcu46gT5BuMCAlxL5NOTCdsjIQoAmIHN4IIBGQlKj63aa\nF1oYgsw6MG7hVuKtMPo7G3HxaHi3RbCvzgsn4HUlHBJyuvIAufOnYq8cDG+N7Ry/\nIU/MCmB7Ca3cQ6weVW0Lrq6i49x5hQ6YsUDBmXJ7RHSz2mYEKnxt+2dbchztjXnp\npEzoc8kROKz7psVRnSeP3EQrxark4vwPAjjtOeiM4QKBgQD11hyImTtYzp9E0Igy\nv+xraGLp7WK+bfGOMurR9UO/hNnuFkFIr1BZmayCscKVxG6wwSuJ/9KiULO9rb6i\n6YiTCxzCPXfvT2aRZ9jmSCXC8EFoNWj4APuuPHVQPmdPJrP7ArfeCS/jj4Ms9RNk\n3maqdznrSHxiT608Q4/yKK22eQKBgQDrCYbLf75b6LtKrTAGSXjnR6RBMF3tU8cT\ncJd9oDE7Z2ld8+n45EBubfNmrkqfwtcerSY7suoZ5IGxrh0d0gFIyeFGCoyAfsMU\nRuLe7NDu0TB2vJNnQjGU5cGIh4px1d8mAE3jXHsy7rW2gXehp8k2dqqjjGN7pWwI\nnHwudQ8GOQKBgQChEKkdLhfd9XIQKfgyF+CT9o5n6Wn6jhnnKqEC8ohyoF4QSXB4\naLRiH/cQodp1OX+0OruF7KBaTDmXGpB+ODeM74jmElPT7NesiLdpGPf0omiYF/Yw\nFqTO4TmTW29gQmFFIeDJjodbtpkhCWite7EUGo1OA+3Kk51SkIltBQ3bMQKBgARV\nEJ7/o8qd55Xgy1nSUOAyedyZv6F4Qdsh4Cj4ou+tYEvTCyUDUAy5ChuCau228bAn\nEOVYzufbRmi4BOFf1ZY54mUgHKbhr0bYZ6YkR1WflX0azLzCg5dzBLY3iV2/y3Uv\n3D+snLi7na3XhRT9ur++QDbzh4Hn8q3V9JQGpFhBAoGBAKXK+SPQGG4jTX0zhcc5\nw2uaHvj7Tf06o65gZdYWVbDNyrD9GSugY6dL5HTQ/G7B4evKflqsNNsogFR7yUwl\nLKPlG6vAJMgq29uMLQbozp9ezo8yKeGBhD4AHk5dfSxukX1Lsn4w5WPzO7dGByNy\n9ULXqLo0aLlhtyImV9BYkeW0\n-----END PRIVATE KEY-----\n",
    "client_email": "google-calendar@nextlevelbot-bujr.iam.gserviceaccount.com",
    "client_id": "107228562764100345230",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/google-calendar%40nextlevelbot-bujr.iam.gserviceaccount.com"
  }
  ; // Starts with {"type": "service_account",...
 
 // Set up Google Calendar Service account credentials
 const serviceAccountAuth = new google.auth.JWT({
   email: serviceAccount.client_email,
   key: serviceAccount.private_key,
   scopes: 'https://www.googleapis.com/auth/calendar'
 });
 
 const calendar = google.calendar('v3');
 //process.env.DEBUG = 'dialogflow:*'; // enables lib debugging statements
 
 const timeZone = 'UTC';
 const timeZoneOffset = '-05:00';
 
function makeAppointment (agent) {
    // Calculate appointment start and end datetimes (end = +1hr from start)
    //console.log("Parameters", agent.parameters.date);
    const dateTimeStart = new Date(Date.parse(agent.parameters.date.split('T')[0] + 'T' + agent.parameters.time.split('T')[1].split('-')[0] + timeZoneOffset));
    const dateTimeEnd = new Date(new Date(dateTimeStart).setHours(dateTimeStart.getHours() + 1));
    const appointmentTimeString = dateTimeStart.toLocaleString(
    'es-PE',
    { month: 'long', day: 'numeric', hour: 'numeric', timeZone: timeZone }
    );

    // Check the availibility of the time, and make an appointment if there is time on the calendar
    return createCalendarEvent(dateTimeStart, dateTimeEnd, agent).then(() => {
    agent.add(`Ok, fuiste agendado para ${appointmentTimeString}.`);
    }).catch(() => {
    agent.add(`Lo sentimos, ${appointmentTimeString} No está disponible.`);
    });
}

 function createCalendarEvent (dateTimeStart, dateTimeEnd, agent) {
   return new Promise((resolve, reject) => {
     calendar.events.list({
       auth: serviceAccountAuth, // List events for time period
       calendarId: calendarId,
       timeMin: dateTimeStart.toISOString(),
       timeMax: dateTimeEnd.toISOString()
     }, (err, calendarResponse) => {
       // Check if there is a event already on the Calendar
       if (err || calendarResponse.data.items.length > 0) {
         reject(err || new Error('Requested time conflicts with another appointment'));
         console.log("error :c");
         console.log(err);
       } else {
         // Create event for the requested time period
         calendar.events.insert({ auth: serviceAccountAuth,
           calendarId: calendarId,
           resource: {summary: ' Reunión', description: "Email: " + agent.parameters.email + "\nTeléfono: " + agent.parameters['phone-number'],
             start: {dateTime: dateTimeStart},
             end: {dateTime: dateTimeEnd}}
         }, (err, event) => {
             if(err){
                reject(err)
                console.log(err);
             }
             else{
                 resolve(event);
             }
         }
         );
       }
     });
   });
 }

module.exports ={
    makeAppointment
}