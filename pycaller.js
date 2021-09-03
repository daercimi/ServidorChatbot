const { spawn } = require('child_process');

const test_data = [
    "nlocrm.py",
    "--lastname",  "Lopez Aliaga",
    "--givenname", "Rafael",
    "--email", "porky@gmail.com",
    "--company", "Nike",
    "--phone", "123456789",
    "--service", "Testeando pycaller",
    "--date", "2021-09-07T12:00:00-05:00",
    "--time", "2021-09-03T10:00:00-05:00",
]

function call_nlocrm(data){
   
    const {
        lastname,
        givenname,
        email,
        company,
        phone,
        service,
        date,
        time,
    } = data;

    const childPython = !data? 
        spawn('python', test_data) :
        spawn('python', [
            "scripts/nlocrm.py",
            "--lastname",  lastname,
            "--givenname", givenname,
            "--email", email,
            "--company", company,
            "--phone", phone,
            "--service", service,
            "--date", date,
            "--time", time,
        ])

    childPython.stdout.on('data', (data) => {
        console.log(`stdout: \n${data}`);
    });

    childPython.stderr.on('data', (data) => {
        console.error(`stderr: \n${data}`);
    });

    childPython.on('close', (code) => {
        console.log(`nlocrm.py process exited with code ${code}`);
    });
}

module.exports = {
    call_nlocrm
}