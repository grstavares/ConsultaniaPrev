//
//  AppOptions.swift
//  ConsultaniaPrev
//
//  Created by Gustavo Tavares on 08/05/2018.
//  Copyright © 2018 Plazaz. All rights reserved.
//

import UIKit

enum AppLaunchMode {case normal, notification, action, url}

enum AppActivity {
    
    case showProfile, showResultados, showComissaoFiscal, showAposPorIdade, showAposPorContrib, showPericia, showAgendamento(Pericia?), showJuntaMedica,
        solicitarAgendamento(Date), solicitarCancelamento(Pericia)
    
    private var imageName: String {
        switch self {
        case .showProfile: return "iconProfile"
        case .showResultados: return "iconResultados"
        case .showComissaoFiscal: return ""
        case .showAposPorIdade: return "iconPorIdade"
        case .showAposPorContrib: return "iconPorContribuicao"
        case .showJuntaMedica: return ""
        case .showAgendamento(_): return ""
        case .showPericia: return "iconPericia"
        case .solicitarAgendamento(_): return ""
        case .solicitarCancelamento(_): return ""
        }
    }
    
    var image: UIImage? {return UIImage(named: self.imageName)}
    
    var title: String {
        
        switch self {
        case .showProfile: return "Perfil do Usuário"
        case .showResultados: return "Resultados"
        case .showComissaoFiscal: return "Comissão Fiscal"
        case .showAposPorIdade: return "Aposentadoria por Idade"
        case .showAposPorContrib: return "Aposentadoria por Contribuição"
        case .showPericia: return "Pericia Médica"
        case .showAgendamento(_): return "Agendamento"
        case .showJuntaMedica: return "Junta Médica"
        case .solicitarAgendamento(_): return "Solicitar Agendamento"
        case .solicitarCancelamento(_): return "Cancelar Solicitação"
        }
        
    }
    
}
