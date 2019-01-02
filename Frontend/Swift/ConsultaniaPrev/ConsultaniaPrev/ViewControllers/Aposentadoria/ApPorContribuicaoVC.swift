//
//  ApPorContribuicaoVC.swift
//  ConsultaniaPrev
//
//  Created by Gustavo Tavares on 10/05/2018.
//  Copyright © 2018 Plazaz. All rights reserved.
//

import UIKit

class ApPorContribuicaoVC: UIViewController {

    public static func instantiate(using coordinator: AppCoordinador, with profile: Beneficiario) -> ApPorContribuicaoVC? {
        
        let bd = Bundle.init(for: NavigationVC.self)
        let sb = UIStoryboard.init(name: "Aposentadoria", bundle: bd)
        let vc = sb.instantiateViewController(withIdentifier: "ApPorContribuicaoVC") as? ApPorContribuicaoVC
        vc?.title = "Simulador"
        vc?.coordinator = coordinator
        vc?.user = profile
        return vc
        
    }
    
    private var coordinator: AppCoordinador!
    private var user: Beneficiario!
    
    override func viewDidLoad() {
        
        super.viewDidLoad()
        self.setUpTheming()
        
    }
    
}

extension ApPorContribuicaoVC: Themed {
    
    func applyTheme(_ theme: AppTheme) {
        
        let background = UIImage(named: "background")!
        self.view.layer.contents = background.cgImage
        
        //        let labels = [self.lbl0, self.lbl1, self.lbl2]
        //        labels.forEach {
        //            $0?.textColor = theme.darkText
        //            $0?.font = theme.font
        //        }
        //
        
    }
    
}
