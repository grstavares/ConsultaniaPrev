//
//  ComissaoVC.swift
//  ConsultaniaPrev
//
//  Created by Gustavo Tavares on 10/05/2018.
//  Copyright © 2018 Plazaz. All rights reserved.
//

import UIKit
import MessageUI

class ComissaoVC: UIViewController {

    public static func instantiate(using coordinator: AppCoordinador) -> ComissaoVC? {
        
        let bd = Bundle(for: ResultadosVC.self)
        let sb = UIStoryboard(name: "Resultados", bundle: bd)
        let vc = sb.instantiateViewController(withIdentifier: "ComissaoVC") as? ComissaoVC
        vc?.title = "Comissão Fiscal"
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
        self.addEmailButton()
        
    }

    private func addEmailButton() {
        
        let image = UIImage(named: "iconEmail")!
        let button = UIBarButtonItem(image: image, style: .plain, target: self, action: #selector(self.buttonEmailTapped(_:)))
        self.navigationItem.rightBarButtonItem = button
        
    }
    
    @objc private func buttonEmailTapped(_ sender: Any) -> Void {
        
        if MFMailComposeViewController.canSendMail() {
            let mail = MFMailComposeViewController()
            mail.mailComposeDelegate = self
            mail.setToRecipients(["comissaofiscal@senaprev.com.br"])
            self.present(mail, animated: true, completion: nil)
            
        } else {

            let alert = UIAlertController(title: "Operação não permitida", message: "O seu sistema não está configurado para encaminhar e-mails!", preferredStyle: .alert)
            let action = UIAlertAction(title: "Fechar", style: .cancel) { (action) in alert.dismiss(animated: true, completion: nil)}
            alert.addAction(action)
            self.show(alert, sender: nil)
            
        }
        
    }
    
}

extension ComissaoVC: MFMailComposeViewControllerDelegate {
    
    func mailComposeController(_ controller: MFMailComposeViewController, didFinishWith result: MFMailComposeResult, error: Error?) {
        
//        switch result {
//        case .sent: return
//        case .saved: return
//        case .cancelled: return
//        case .failed: return
//        }
        
        controller.dismiss(animated: true, completion: nil)
        
    }
    
}

extension ComissaoVC: Themed {
    
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
