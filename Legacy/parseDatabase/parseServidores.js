const uuidv4 = require('uuid/v4');
let data = require('./seed_servidor.json');
let cidades = require('./parseCidades');
let estadoCivil = require('./parseEstadoCivil');

const itens = Array.from(data.map(item => {

    let regcivil = {}
    regcivil.docType = 'RegistroCivil';
    regcivil.emissao = item['1974-05-21T00:00:00'];
    regcivil.emissor = item['SSP-GO'];
    regcivil.numero = item['rg'];

    let pispasep = {}
    pispasep.docType = 'PIS/PASEP';
    pispasep.tipo = item['tipopispasep'];
    pispasep.numero = item['pispasep'];

    let ctps = {}
    ctps.docType = 'CTPS';
    ctps.estadoEmissao = item['estadoctps'];
    ctps.serie = item['seriectps'];
    ctps.numero = item['numeroctps'];

    let tituloEleitoral = {}
    tituloEleitoral.docType = 'TituloEleitoral';
    tituloEleitoral.cidade = cidades.getCidade(item['cidadetituloeleitoral']);
    tituloEleitoral.secao = item['secaotituloeleitoral'];
    tituloEleitoral.zona = item['zonatituloeleitoral'];
    tituloEleitoral.numero = item['numerotituloeleitoral'];

    let cnh = {}
    cnh.docType = 'CNH';
    cnh.estado = item['estadocnh'];
    cnh.validade = item['datavalidadecnh'];
    cnh.emissao = item['dataemissaocnh'];
    cnh.numero = item['numerocnh'];


    let endereco = {};
    endereco.cep = item['cep'];
    endereco.cidade = cidades.getCidade(item['cidade']);
    endereco.bairro = item['setor'];
    endereco.complemento = item['complemento'];
    endereco.numero = item['numero'];
    endereco.logradouro = item['logradouro'];

    let email = {}
    email.contactType = 'email';
    email.tipo = 'Particular';
    email.contato = item['email'];

    let phone1 = {}
    phone1.contactType = 'telefone';
    phone1.tipo = 'Celular';
    phone1.contato = item['celular'];
   
    let phone2 = {}
    phone2.contactType = 'telefone';
    phone2.tipo = 'Comercial';
    phone2.contato = item['telefonecomercial'];
   
    let phone3 = {}
    phone3.contactType = 'telefone';
    phone3.tipo = 'Residencial';
    phone3.contato = item['telefoneresidencial'];
    
    let phone4 = {}
    phone4.contactType = 'telefone';
    phone4.tipo = 'Recado';
    phone4.contato = item['telefonerecado'];

    let parsed = {};
    parsed.id = uuidv4()
    parsed.nome = item['nome'];
    parsed.cpf = item['cpf'];
    parsed.alias = '';
    parsed.sexo = item['sexo'];
    parsed.dataNascimento = item['datanascimento'];
    parsed.estadoCivil = estadoCivil.getEstadoCivil( item['estadocivil']);
    parsed.naturalidade = cidades.getCidade(item['naturalidade']);
    parsed.nacionalidade = { code: 76, nome: 'Brasileiro'};
    parsed.filiacao = {
        pai: item['nomepai'],
        mae: item['nomemae']
    }
    parsed.legacyId = item['codigo'];

    parsed.contatos = [];
    Array.from( [email, phone1, phone2, phone3, phone4]).forEach(element => {if (element.contato !== undefined && element.contato !== '') parsed.contatos.push(element)});

    parsed.enderecos = [];
    if (endereco.cep !== undefined) {parsed.enderecos.push(endereco);}

    parsed.documentos = [];
    Array.from([regcivil, pispasep, tituloEleitoral, cnh, ctps]).forEach(element => {
        if (element.numero !== undefined && element.numero !== '') {parsed.documentos.push(element);}
    })

    return parsed;

}))

// const values = itens.map(item => {return item['nacionalidade']})
// const set = new Set(values);
// console.log(set);
console.log(JSON.stringify(itens, null, 2));