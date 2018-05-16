//
//  JuntaMedicaVC.swift
//  ConsultaniaPrev
//
//  Created by Gustavo Tavares on 10/05/2018.
//  Copyright © 2018 Plazaz. All rights reserved.
//

import UIKit

class JuntaMedicaVC: UIViewController {

    public static func instantiate(using coordinator: AppCoordinador) -> JuntaMedicaVC? {
        
        let bd = Bundle(for: ResultadosVC.self)
        let sb = UIStoryboard(name: "Pericia", bundle: bd)
        let vc = sb.instantiateViewController(withIdentifier: "JuntaMedicaVC") as? JuntaMedicaVC
        vc?.title = "Junta Médica"
        vc?.coordinator = coordinator
        return vc
        
    }
    
    @IBOutlet weak var lbl0: UILabel!
    @IBOutlet weak var img1: UIImageView!
    @IBOutlet weak var lbl1: UILabel!
    @IBOutlet weak var img2: UIImageView!
    @IBOutlet weak var lbl2: UILabel!
    
    private var coordinator: AppCoordinador!
    
    override func viewDidLoad() {
        
        super.viewDidLoad()
        self.setUpTheming()
        
    }
    
}

extension JuntaMedicaVC: Themed {
    
    func applyTheme(_ theme: AppTheme) {
        
        let background = UIImage(named: "background")!
        self.view.layer.contents = background.cgImage
        
        self.img1.setCornerRadious(self.img1.bounds.height / 2)
        self.img2.setCornerRadious(self.img1.bounds.height / 2)
        
        let labels = [self.lbl0, self.lbl1, self.lbl2]
        labels.forEach {
            $0?.textColor = theme.darkText
            $0?.font = theme.font
        }
        
    }
    
}
