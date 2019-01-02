//
//  PericiaMedica.swift
//  ConsultaniaPrev
//
//  Created by Gustavo Tavares on 10/05/2018.
//  Copyright © 2018 Plazaz. All rights reserved.
//

import Foundation
struct Pericia: Equatable {
    
    let data: Date
    let status: Status
    let resultado: Data?
    
    enum Status {
        
        case solicitada, agendada, cancelada, realizada
        
        public var label: String {
            switch self {
            case .solicitada: return "Solicitada"
            case .agendada: return "Agendada"
            case .cancelada: return "Cancelada"
            case .realizada: return "Realizada"
            }
        }
        
    }
    
}
