//
//  AppCoordinator.swift
//  ConsultaniaPrev
//
//  Created by Gustavo Tavares on 08/05/2018.
//  Copyright © 2018 Plazaz. All rights reserved.
//

import UIKit

class AppCoordinador {

    private let _activities: [AppActivity] = [.showProfile, .showResultados, .showAposPorIdade, .showAposPorContrib, .showPericia]
    public var activities: [AppActivity] {return self._activities}
    public var menuActivities: [AppActivity] = [.showResultados, .showAposPorIdade, .showAposPorContrib, .showPericia]

    private var _dataProvider: AppDataProvider
    private var _user: Beneficiario
    
    public var dataProvider: AppDataProvider {return self._dataProvider}
    
    public init(dataProvider: AppDataProvider) {
        
        self._dataProvider = dataProvider
        self._user = MockData.user
        
    }
    
    public func initialVC(for mode: AppLaunchMode) -> UIViewController? {
        
        switch mode {
        case .normal: return StartVC.instantiate(with: self)
        case .notification: return StartVC.instantiate(with: self)
        case .action: return StartVC.instantiate(with: self)
        case .url: return StartVC.instantiate(with: self)
        }
        
    }
    
    public func perform(_ activity: AppActivity, with presenter: UIViewController) -> Void {
        
        switch activity {
        case .showResultados:
            
            let thisMonth = Calendar.current.component(.month, from: Date())
            let thisYear = Calendar.current.component(.year, from: Date())
            if let resultado = self.dataProvider.getResultado(for: (thisMonth, thisYear)) {

                guard let vc = ResultadosVC.instantiate(using: self, with: resultado, title: "Resultados") else {return}
                
                if let navigator = presenter.navigationController {navigator.pushViewController(vc, animated: true)
                } else {presenter.present(vc, animated: true, completion: nil)}
                
            } else {
                
                let alert = UIAlertController(title: "Informação não Disponível", message: "Não existem informações sonbre os resultados financeiros do período \(thisMonth)/\(thisYear)", preferredStyle: .alert)
                let okAction = UIAlertAction(title: "Fechar", style: .cancel) {action in alert.dismiss(animated: true, completion: nil)}
                alert.addAction(okAction)
                presenter.show(alert, sender: nil)
                
            }

        case .showComissaoFiscal:
            
            guard let vc = ComissaoVC.instantiate(using: self) else {return}
            if let navigator = presenter.navigationController {navigator.pushViewController(vc, animated: true)
            } else {presenter.present(vc, animated: true, completion: nil)}

        case .showAposPorIdade:
            
            guard let vc = ApPorIdadeVC.instantiate(using: self, with: self._user) else {return}
            if let navigator = presenter.navigationController {navigator.pushViewController(vc, animated: true)
            } else {presenter.present(vc, animated: true, completion: nil)}

        case .showAposPorContrib:
            
            guard let vc = ApPorContribuicaoVC.instantiate(using: self, with: self._user) else {return}
            if let navigator = presenter.navigationController {navigator.pushViewController(vc, animated: true)
            } else {presenter.present(vc, animated: true, completion: nil)}

        case .showPericia:
            
            guard let vc = PericiaVC.instantiate(using: self, with: self._user) else {return}
            if let navigator = presenter.navigationController {navigator.pushViewController(vc, animated: true)
            } else {presenter.present(vc, animated: true, completion: nil)}
            
        case .showAgendamento(let agendado):
            
            guard let vc = AgendamentoVC.instantiate(using: self, with: agendado) else {return}
            presenter.modalPresentationStyle = .overCurrentContext
            presenter.modalTransitionStyle = .crossDissolve
            presenter.present(vc, animated: true, completion: nil)
            
        case .showJuntaMedica:
            
            guard let vc = JuntaMedicaVC.instantiate(using: self) else {return}
            if let navigator = presenter.navigationController {navigator.pushViewController(vc, animated: true)
            } else {presenter.present(vc, animated: true, completion: nil)}
            
        case .showProfile:
            
            guard let vc = ProfileVC.instantiate(using: self, with: self._user) else {return}
            presenter.modalPresentationStyle = .overCurrentContext
            presenter.modalTransitionStyle = .crossDissolve
            presenter.present(vc, animated: true, completion: nil)
        
        case .solicitarAgendamento(let date):
            
            let newPericia = Pericia(data: date, status: .solicitada, resultado: nil)
            self._user.pericias.append(newPericia)
            
            let notification = Notification(name: Notification.Name.AppPericiaListUpdated, object: newPericia, userInfo: nil)
            NotificationCenter.default.post(notification)
            
        case .solicitarCancelamento(let pericia):
            
            let newPericia = Pericia(data: pericia.data, status: .cancelada, resultado: nil)
            
            var newArray: [Pericia] = []
            for oldValue in self._user.pericias {
                
                if oldValue == pericia {
                    newArray.append(newPericia)
                } else {newArray.append(oldValue)}
                
            }
            
            self._user.pericias = newArray
            
            let notification = Notification(name: Notification.Name.AppPericiaListUpdated, object: newPericia, userInfo: nil)
            NotificationCenter.default.post(notification)

//        default:
//            debugPrint("PerforAction -> \(activity.title)")
        }

    }
    
}
