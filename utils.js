function capitalize(str){

    return str.includes(' ') ?
        str
            .split(' ')
            .map(e => capitalize(e))
            .join(' ')
        :
        str[0].toUpperCase() + 
        Array.from(str.slice(1))
            .map(e => e.toLowerCase())
            .join('')
}

module.exports = {
    capitalize
}