let cidades = require('./cidades.json')

let cityMap = null;

function initMap() {

    cityMap = {};

    cidades.forEach(element => {
        
        const cod = element['codigo'];
        const est = element['estado'];
        const nom = element['nome'];
        const ibg = element['codigoibge'];
        cityMap[cod] = { codigoIbge: ibg, uf: est, nome: nom};;

    });

}

function getCidade(withcode) {

    if (withcode === null) {return {}}
    if (cityMap === null) {initMap()}
    return cityMap[withcode];

}

module.exports.getCidade = getCidade;