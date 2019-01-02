//
//  AgendamentoVC.swift
//  ConsultaniaPrev
//
//  Created by Gustavo Tavares on 10/05/2018.
//  Copyright © 2018 Plazaz. All rights reserved.
//

import UIKit

class AgendamentoVC: UIViewController {

    public static func instantiate(using coordinator: AppCoordinador, with pericia: Pericia?) -> AgendamentoVC? {
        
        let bd = Bundle.init(for: NavigationVC.self)
        let sb = UIStoryboard.init(name: "Pericia", bundle: bd)
        let vc = sb.instantiateViewController(withIdentifier: "AgendamentoVC") as? AgendamentoVC
        vc?.coordinator = coordinator
        vc?.pericia = pericia
        return vc
        
    }
    
    @IBOutlet weak var modalView: UIView!
    @IBOutlet weak var modalViewBottomConstraint: NSLayoutConstraint!
    @IBOutlet weak var modalViewTopConstraint: NSLayoutConstraint!
    @IBOutlet weak var labelMessage: UILabel!
    @IBOutlet weak var labelData: UILabel!
    @IBOutlet weak var textData: UITextField!
    @IBOutlet weak var labelStatus: UILabel!
    @IBOutlet weak var textStatus: UITextField!
    @IBOutlet weak var buttonFechar: UIButton!
    @IBOutlet weak var buttonOk: UIButton!
    
    private var coordinator: AppCoordinador!
    private var pericia: Pericia?

    private let datePicker = UIDatePicker()
    private let formatter = DateFormatter()
    private var originalBottomConstraintConstant: CGFloat = 0
    private var originalTopConstraintConstant: CGFloat = 0
    
    override func viewDidLoad() {
        
        super.viewDidLoad()
        self.configVC()
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
        
        self.originalBottomConstraintConstant = self.modalViewBottomConstraint.constant
        self.originalTopConstraintConstant = self.modalViewTopConstraint.constant
        
    }
    
    @IBAction func buttonFecharTapped(sender: Any) -> Void {self.dismissMe()}
    
    @IBAction func buttonOkTapped(sender: Any) -> Void {
        
        guard let date = self.textData.text, !date.isEmpty else {
            
            let alert = UIAlertController(title: "Erro", message: "Você deve informar uma data para solicitar a perícia!", preferredStyle: .alert)
            let action = UIAlertAction(title: "Ok", style: .default) { (actionTapped) in alert.dismiss(animated: true, completion: nil)}
            alert.addAction(action)
            self.present(alert, animated: true, completion: nil)
            return
            
        }
        
        if self.pericia == nil {
            
            let parsed = self.formatter.date(from: date)!
            let activity = AppActivity.solicitarAgendamento(parsed)
            self.coordinator.perform(activity, with: self)
            
        } else {
            
            if self.pericia!.status == .solicitada || self.pericia!.status == .agendada {
                
                let activity = AppActivity.solicitarCancelamento(self.pericia!)
                self.coordinator.perform(activity, with: self)
                
            }
            
        }
        
        self.dismissMe()
        
        
    }
    
    private func configVC() -> Void {
        
        NotificationCenter.default.addObserver(self, selector: #selector(self.keyboardWillShow), name: UIResponder.keyboardWillShowNotification, object: nil)
        NotificationCenter.default.addObserver(self, selector: #selector(self.keyboardWillHide), name: UIResponder.keyboardWillHideNotification, object: nil)
        
        self.formatter.dateFormat = "dd/MM/yyyy HH:mm"
        self.datePicker.minimumDate = Date()
        self.datePicker.minuteInterval = 30
        self.datePicker.datePickerMode = .dateAndTime
        
        let toolbar = UIToolbar()
        toolbar.sizeToFit()
        let doneButton = UIBarButtonItem(title: "Selecionar", style: .plain, target: self, action: #selector(donedatePicker));
        let spaceButton = UIBarButtonItem(barButtonSystemItem: UIBarButtonItem.SystemItem.flexibleSpace, target: nil, action: nil)
        let cancelButton = UIBarButtonItem(title: "Cancelar", style: .plain, target: self, action: #selector(cancelDatePicker));
        toolbar.setItems([cancelButton,spaceButton, doneButton], animated: false)
        
        self.textData.inputAccessoryView = toolbar
        self.textData.inputView = datePicker
        
    }
    
    private func fillForm() -> Void {
        
        if self.pericia != nil {
            
            let message = pericia!.status == .realizada ? "A Solicitação não pode mais ser cancelada!" : "Você pode solicitar o cancelamento da Solicitação"
            let buttonLbl = pericia!.status == .realizada ? "Ok" : "Cancelar"
            
            self.labelMessage.text = message
            self.textData.isEnabled = false
            self.textData.text = self.formatter.string(from: self.pericia!.data)
            self.textStatus.text = self.pericia?.status.label
            self.buttonOk.setTitle(buttonLbl, for: .normal)
            
        } else {
            
            self.labelMessage.text = "Escolha a data para solicitar agendamento da Perícia!"
            self.textData.isEnabled = true
            self.textStatus.text = "Nova Solicitação"
            
        }

    }
    
    private func dismissMe() -> Void {
        
        UIView.animate(withDuration: 0.1, animations: {
            self.modalView.transform = CGAffineTransform.init(scaleX: 1.3, y: 1.3)
            self.modalView.alpha = 0
        }) { (success) in self.dismiss(animated: true, completion: nil)}
        
    }
    
    @objc func donedatePicker(){

        textData.text = formatter.string(from: datePicker.date)
        self.view.endEditing(true)
    }
    
    @objc func cancelDatePicker(){
        self.view.endEditing(true)
    }
    
    @objc func keyboardWillShow(notification: NSNotification) {
        
        if let keyboardSize = (notification.userInfo?[UIResponder.keyboardFrameBeginUserInfoKey] as? NSValue)?.cgRectValue {
            
            if self.modalViewTopConstraint.constant == self.originalTopConstraintConstant {
                
                let removeHeigh = keyboardSize.height / 4                
                UIView.animate(withDuration: 0.3) {
                    self.modalViewBottomConstraint.constant = self.originalBottomConstraintConstant + removeHeigh
                    self.modalViewTopConstraint.constant = self.originalTopConstraintConstant - (removeHeigh / 4)
                }
                
            }
            
        }
    }
    
    @objc func keyboardWillHide(notification: NSNotification) {

        if self.modalViewBottomConstraint.constant != self.originalBottomConstraintConstant {
            
            UIView.animate(withDuration: 0.1) {
                self.modalViewTopConstraint.constant = self.originalTopConstraintConstant
                self.modalViewBottomConstraint.constant = self.originalBottomConstraintConstant
            }
            
        }

//        if let keyboardSize = (notification.userInfo?[UIKeyboardFrameBeginUserInfoKey] as? NSValue)?.cgRectValue {
//        }
        
    }
    
}

extension AgendamentoVC: Themed {
    
    func applyTheme(_ theme: AppTheme) {

        self.modalView.backgroundColor = theme.barBackgroundColor
        self.modalView.setCornerRadious()
        
        self.buttonFechar.setTitleColor(theme.lightText, for: .normal)
        self.buttonOk.setTitleColor(theme.lightText, for: .normal)
        
        if let font = theme.font {
            
            self.buttonFechar.titleLabel?.font = font
            self.buttonOk.titleLabel?.font = font
            
        }
        
        let labels = [self.labelMessage, self.labelData, self.labelStatus]
        labels.forEach {
            $0?.textColor = theme.lightText
            $0?.font = theme.font
        }
        
        let textFields = [self.textData, self.textStatus]
        textFields.forEach {
            $0?.textColor = theme.darkText
            $0?.font = theme.font
        }
        
        
    }
    
}
