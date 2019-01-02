//
//  PericiaVC.swift
//  ConsultaniaPrev
//
//  Created by Gustavo Tavares on 10/05/2018.
//  Copyright © 2018 Plazaz. All rights reserved.
//

import UIKit

class PericiaVC: UIViewController {

    public static func instantiate(using coordinator: AppCoordinador, with user: Beneficiario) -> PericiaVC? {
        
        let bd = Bundle(for: ResultadosVC.self)
        let sb = UIStoryboard(name: "Pericia", bundle: bd)
        let vc = sb.instantiateViewController(withIdentifier: "PericiaVC") as? PericiaVC
        vc?.title = AppActivity.showPericia.title
        vc?.coordinator = coordinator
        vc?.user = user
        return vc
        
    }
    
    @IBOutlet weak var labelDescription: UILabel!
    @IBOutlet weak var buttonJunta: UIButton!
    @IBOutlet weak var imageJunta: UIImageView!
    @IBOutlet weak var imageJuntaRecognizer: UITapGestureRecognizer!
    @IBOutlet weak var tableView: UITableView!
    
    private var coordinator: AppCoordinador!
    private var user: Beneficiario!
    
    override func viewDidLoad() {
        
        super.viewDidLoad()
        self.setUpTheming()
        self.configVC()
        
    }
    
    private func configVC() {

        let cellNib = UINib.init(nibName: PericiaCell.cellId, bundle: Bundle.init(for: ResultadosVC.self))
        self.tableView.register(cellNib, forCellReuseIdentifier: PericiaCell.cellId)
        self.tableView.dataSource = self
        self.tableView.delegate = self
        
        NotificationCenter.default.addObserver(self, selector: #selector(self.updatedList(_:)), name: NSNotification.Name.AppPericiaListUpdated, object: nil)
        
        self.addAgendarButton()

    }
    
    private func addAgendarButton() {
        
        let image = UIImage(named: "iconCalendar")!
        let button = UIBarButtonItem(image: image, style: .plain, target: self, action: #selector(self.buttonAgendarTapped(_:)))
        self.navigationItem.rightBarButtonItem = button
        
    }
    
    @objc private func buttonAgendarTapped(_ sender: Any) -> Void {self.coordinator.perform(.showAgendamento(nil), with: self)}
    @objc private func updatedList(_ notification: NSNotification) -> Void {self.tableView.reloadData()}
    
    @IBAction func buttonJuntaTapped(sender: AnyObject) -> Void {self.showJuntaMedica()}
    @IBAction func buttonGestureRecognizerTapped(sender: AnyObject) -> Void {self.showJuntaMedica()}
    
    private func showJuntaMedica() -> Void {self.coordinator.perform(.showJuntaMedica, with: self)}

}

extension PericiaVC: UITableViewDataSource {
    
    func numberOfSections(in tableView: UITableView) -> Int {return 1}
    
    func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {return self.user.pericias.count}
    
    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        
        guard let cell = tableView.dequeueReusableCell(withIdentifier: PericiaCell.cellId) as? PericiaCell else {return UITableViewCell()}
        
        let pericia = self.user.pericias[indexPath.row]
        cell.configure(pericia)
        return cell
        
    }
    
}

extension PericiaVC: UITableViewDelegate {
    
    func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
        
        let selected = self.user.pericias[indexPath.row]
        self.coordinator.perform(.showAgendamento(selected), with: self)
        
    }
    
}

extension PericiaVC: Themed {
    
    func applyTheme(_ theme: AppTheme) {
        
        let background = UIImage(named: "background")!
        self.view.layer.contents = background.cgImage
        
        self.tableView.setCornerRadious()

        if let font = theme.font {
            
            self.buttonJunta.titleLabel?.font = font
            
        }
        
        let labels = [self.labelDescription]
        labels.forEach {
            $0?.textColor = theme.darkText
            $0?.font = theme.font
        }
        
    }
    
}
