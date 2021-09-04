const axios = require('axios')

function pushNotification({k, t, c, u}){

    // http://xdroid.net/api/message?
    // k=k-6a967da27023&
    // t=sample&
    // c=from+samsung+SM-J600G&
    // u=http%3A%2F%2Fgoogle.com

    const url = 'https://whatever.com/todos' + 
        new URLSearchParams({k, t, c, u}).toString() 

    axios
    .post(url)
    .then(res => {
        console.log(`[Push notificacion] statusCode: ${res.statusCode}`)
        console.log(res)
    })
    .catch(error => {
        console.error(error)
    })
}

module.exports = {
    pushNotification
}

/*
let req = null

axios.get('https://jsonplaceholder.typicode.com/comments?postId=1', {
}).then(r => {
    req = r
    console.log(req.request.socket._httpMessage.res.responseUrl)
})

axios.get('https://jsonplaceholder.typicode.com/comments', {}, {
    params: {
        postId: 1
    }
}).then(r => {
    req = r
    console.log(req.request.socket._httpMessage.res.responseUrl)
})

axios.get('https://jsonplaceholder.typicode.com/comments', {}, {
    params: {
        postId: 1
    }
}).then(r => console.log)
*/