let opcoes = require('./estadoCivil.json')

let estadoMap = null;

function initMap() {

    estadoMap = {};

    opcoes.forEach(element => {
        
        const cod = element['cod'];
        const des = element['descricao'];
        estadoMap[cod] = element;

    });

}

function getEstadoCivil(withcode) {

    if (withcode === null) {return {}}
    if (estadoMap === null) {initMap()}
    return estadoMap[withcode];

}

module.exports.getEstadoCivil = getEstadoCivil;