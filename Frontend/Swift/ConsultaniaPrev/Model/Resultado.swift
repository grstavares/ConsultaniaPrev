//
//  Resultado.swift
//  ConsultaniaPrev
//
//  Created by Gustavo Tavares on 08/05/2018.
//  Copyright © 2018 Plazaz. All rights reserved.
//

import Foundation
struct Resultado {
    
    typealias Periodo = (Int, Int)
    
    let periodo: Periodo
    let saldoInicial: Double
    let categorias: [Lancamento]

    struct Lancamento {
        
        let descricao: String
        let qtd: Int?
        let valor: Double
        let detalhes: [Lancamento]
        
    }
    
}
