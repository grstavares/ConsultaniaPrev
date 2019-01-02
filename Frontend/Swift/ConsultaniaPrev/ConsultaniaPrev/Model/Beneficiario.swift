//
//  Beneficiario.swift
//  ConsultaniaPrev
//
//  Created by Gustavo Tavares on 08/05/2018.
//  Copyright © 2018 Plazaz. All rights reserved.
//

import Foundation
class Beneficiario {
    
    let nome: String
    let nascimento: Date
    let inscricao: String
    var pericias: [Pericia]
    
    init(nome: String, nascimento: Date, inscricao: String, pericias: [Pericia]) {
        self.nome = nome
        self.nascimento = nascimento
        self.inscricao = inscricao
        self.pericias = pericias
    }
    
}
