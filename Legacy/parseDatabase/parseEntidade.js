const uuidv4 = require('uuid/v4');
let data = require('./seed_entidade.json');

const itens = data.map(item => {

    let endereco = {};
    endereco.cep = item['cep'];
    endereco.cidade = { codigoIbge: 5215306, uf: 'GO', nome: 'Orizona'};
    endereco.bairro = item['setor'];
    endereco.complemento = item['complemento'];
    endereco.numero = item['numero'];
    endereco.logradouro = item['logradouro'];

    let email = {}
    email.tipo = 'email';
    email.contato = item['email'];

    let site = {}
    site.tipo = 'website';
    site.contato = item['site'];

    let phone = {}
    phone.tipo = 'telefone';
    phone.contato = item['telcomercial1'];
    
    let fax = {}
    fax.tipo = 'fax';
    fax.contato = item['fax'];

    let parsed = {};
    parsed.id = uuidv4()
    parsed.cnpj = item['cnpj'];
    parsed.nome = item['razaosocial'];
    parsed.alias = item['nome'];
    parsed.cnae = { code: item['cnae'], description: '' };
    parsed.natureza = { code: item['naturezajuridica'], description: '' };
    parsed.enderecos = [endereco];
    parsed.contatos = [email, site, phone, fax];

    return parsed;

})


console.log(JSON.stringify(itens, null, 2));
