//
//  ProfileVC.swift
//  ConsultaniaPrev
//
//  Created by Gustavo Tavares on 10/05/2018.
//  Copyright © 2018 Plazaz. All rights reserved.
//

import UIKit

class ProfileVC: UIViewController {

    public static func instantiate(using coordinator: AppCoordinador, with profile: Beneficiario) -> ProfileVC? {
        
        let bd = Bundle.init(for: NavigationVC.self)
        let sb = UIStoryboard.init(name: "Start", bundle: bd)
        let vc = sb.instantiateViewController(withIdentifier: "ProfileVC") as? ProfileVC
        vc?.coordinator = coordinator
        vc?.user = profile
        return vc
        
    }
    
    @IBOutlet weak var modalView: UIView!
    @IBOutlet weak var labelNome: UILabel!
    @IBOutlet weak var textNome: UITextField!
    @IBOutlet weak var labelBirth: UILabel!
    @IBOutlet weak var textBirth: UITextField!
    @IBOutlet weak var labelInsc: UILabel!
    @IBOutlet weak var textInsc: UITextField!
    @IBOutlet weak var buttonFechar: UIButton!
    @IBOutlet weak var buttonOk: UIButton!
    
    private var coordinator: AppCoordinador!
    private var user: Beneficiario!
    
    override func viewDidLoad() {
        
        super.viewDidLoad()
        self.fillForm()
        self.setUpTheming()
        self.modalView.alpha = 0
        
    }

    override func viewDidAppear(_ animated: Bool) {
        
        self.modalView.center = self.view.center
        
        self.modalView.transform = CGAffineTransform.init(scaleX: 1.3, y: 1.3)
        UIView.animate(withDuration: 0.1) {
            self.modalView.alpha = 1
            self.modalView.transform = CGAffineTransform.identity
        }
        
    }
    
    @IBAction func buttonFecharTapped(sender: Any) -> Void {self.dismissMe()}
    @IBAction func buttonOkTapped(sender: Any) -> Void {self.dismissMe()}
    
    private func fillForm() -> Void {
        
        self.textNome.text = self.user.nome
        self.textBirth.text = self.user.nascimento.description
        self.textInsc.text = self.user.inscricao
        
    }
    
    private func dismissMe() -> Void {
        
        UIView.animate(withDuration: 0.1, animations: {
            self.modalView.transform = CGAffineTransform.init(scaleX: 1.3, y: 1.3)
            self.modalView.alpha = 0
        }) { (success) in self.dismiss(animated: true, completion: nil)}
        
    }

}

extension ProfileVC: Themed {
    
    func applyTheme(_ theme: AppTheme) {

        self.modalView.backgroundColor = theme.barBackgroundColor
        self.modalView.setCornerRadious()
        
        self.buttonFechar.setTitleColor(theme.lightText, for: .normal)
        self.buttonOk.setTitleColor(theme.lightText, for: .normal)
        
        if let font = theme.font {
            
            self.buttonFechar.titleLabel?.font = font
            self.buttonOk.titleLabel?.font = font
            
        }
        
        let labels = [self.labelNome, self.labelBirth, self.labelInsc]
        labels.forEach {
            $0?.textColor = theme.lightText
            $0?.font = theme.font
        }

        let textFields = [self.textNome, self.textBirth, self.textInsc]
        textFields.forEach {
            $0?.textColor = theme.darkText
            $0?.font = theme.font
        }

        
    }
    
}
