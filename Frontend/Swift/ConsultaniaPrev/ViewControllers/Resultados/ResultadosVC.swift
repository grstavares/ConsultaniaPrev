//
//  ResultadosVC.swift
//  ConsultaniaPrev
//
//  Created by Gustavo Tavares on 08/05/2018.
//  Copyright © 2018 Plazaz. All rights reserved.
//

import UIKit

class ResultadosVC: UIViewController {

    public static func instantiate(using coordinator: AppCoordinador, with result: Resultado, title: String?) -> ResultadosVC? {
        
        let bd = Bundle(for: ResultadosVC.self)
        let sb = UIStoryboard(name: "Resultados", bundle: bd)
        let vc = sb.instantiateViewController(withIdentifier: "ResultadosVC") as? ResultadosVC
        vc?.title = title
        vc?.coordinator = coordinator
        vc?.resultado = result
        vc?.selectedData = Date()
        return vc
        
    }
    
    @IBOutlet weak var buttonPrevious: UIButton!
    @IBOutlet weak var buttonNext: UIButton!
    @IBOutlet weak var buttonComissaoFiscal: UIButton!
    @IBOutlet weak var imageComissaoFiscal: UIImageView!
    @IBOutlet weak var imageComissaoFiscalRecognizer: UITapGestureRecognizer!
    @IBOutlet weak var labelData: UILabel!
    @IBOutlet weak var tableView: UITableView!
    
    @IBOutlet weak var labelSaldoInicial: UILabel!
    @IBOutlet weak var labelSaldoInicialValue: UILabel!
    @IBOutlet weak var labelResultado: UILabel!
    @IBOutlet weak var labelResultadoValue: UILabel!
    @IBOutlet weak var labelSaldoFinal: UILabel!
    @IBOutlet weak var labelSaldoFinalValue: UILabel!
    
    private var coordinator: AppCoordinador!
    private var resultado: Resultado!
    private var selectedData: Date!
    private var dateFormatter: DateFormatter?
    private var currencyFormatter: NumberFormatter?
    
    override func viewDidLoad() {
        
        super.viewDidLoad()
        
        self.setUpTheming()
        self.updateDate(date: self.selectedData)

        let cellNib = UINib.init(nibName: ResultadoCell.cellId, bundle: Bundle.init(for: ResultadosVC.self))
        self.tableView.register(cellNib, forCellReuseIdentifier: ResultadoCell.cellId)
        self.tableView.dataSource = self
        self.tableView.delegate = self

    }
    

    @IBAction func buttonPreviousTapped(sender: AnyObject) -> Void {self.updateDate(date: self.updateMonth(data: self.selectedData, numberofMonths: -1))}
    @IBAction func buttonNextTapped(sender: AnyObject) -> Void {self.updateDate(date: self.updateMonth(data: self.selectedData, numberofMonths: 1))}
    @IBAction func buttonComissaoFiscalTapped(sender: AnyObject) -> Void {self.showComissaoFiscal()}
    @IBAction func buttonGestureRecognizerTapped(sender: AnyObject) -> Void {self.showComissaoFiscal()}

    private func showComissaoFiscal() -> Void {self.coordinator.perform(.showComissaoFiscal, with: self)}
    
    private func updateMonth(data: Date, numberofMonths: Int) -> Date {
        
        return Calendar.current.date(byAdding: .month, value: numberofMonths, to: data, wrappingComponents: false)!
        
    }
    
    private func updateDate(date: Date) -> Void {
        
        if self.dateFormatter == nil {
            self.dateFormatter = DateFormatter()
            self.dateFormatter?.timeStyle = .none
            self.dateFormatter?.dateFormat = "MMMM yyyy";
            self.dateFormatter?.calendar = Calendar.current
        }
        
        if self.currencyFormatter == nil {
            self.currencyFormatter = NumberFormatter()
            self.currencyFormatter?.numberStyle = .currency
        }
        
        self.selectedData = date
        self.labelData.text = self.dateFormatter?.string(from: date)
        
        let inicial = self.resultado.saldoInicial
        let resultado = self.resultado.categorias.reduce(0) { (acum, lanc) in acum + lanc.valor}
        let final = inicial + resultado
        
        self.labelSaldoInicialValue.text = self.currencyFormatter?.string(from: NSNumber.init(value: inicial))
        self.labelResultadoValue.text = self.currencyFormatter?.string(from: NSNumber.init(value: resultado) )
        self.labelSaldoFinalValue.text = self.currencyFormatter?.string(from: NSNumber.init(value: final) )
        
    }
    
}

extension ResultadosVC: UITableViewDataSource {
    
    func numberOfSections(in tableView: UITableView) -> Int {return 1}
    
    func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {return self.resultado.categorias.count}
    
    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        
        guard let cell = tableView.dequeueReusableCell(withIdentifier: ResultadoCell.cellId) as? ResultadoCell else {return UITableViewCell()}
        
        let resultado = self.resultado.categorias[indexPath.row]
        cell.configure(resultado)
        return cell
        
    }
    
}

extension ResultadosVC: UITableViewDelegate {
    
    func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
        
        let selected = self.resultado.categorias[indexPath.row]
        if selected.detalhes.count > 0 {
            
            let newResultado = Resultado(periodo: self.resultado.periodo, saldoInicial: 0, categorias: selected.detalhes)
            if let newVC = ResultadosVC.instantiate(using: self.coordinator, with: newResultado, title: selected.descricao) {
                self.navigationController?.pushViewController(newVC, animated: true)
            }
            
        } else {
            
            let alert = UIAlertController(title: "Seleção Inválida", message: "Este Lançamento não possui detalhes para serem mostrados!", preferredStyle: .alert)
            let action = UIAlertAction(title: "Fechar", style: .cancel) { (action) in alert.dismiss(animated: true, completion: nil)}
            alert.addAction(action)
            self.present(alert, animated: true, completion: nil)
            
        }
        
    }
    
}

extension ResultadosVC: Themed {
    
    func applyTheme(_ theme: AppTheme) {
        
        let background = UIImage(named: "background")!
        self.view.layer.contents = background.cgImage

        self.tableView.setCornerRadious()
        
        self.buttonPrevious.setTitleColor(theme.darkText, for: .normal)
        self.buttonNext.setTitleColor(theme.darkText, for: .normal)
        self.buttonComissaoFiscal.setTitleColor(theme.darkText, for: .normal)

        if let font = theme.font {
            
            self.buttonPrevious.titleLabel?.font = font
            self.buttonNext.titleLabel?.font = font
            self.buttonComissaoFiscal.titleLabel?.font = font
            
        }
        
        let labels = [self.labelData, self.labelSaldoInicial, self.labelSaldoInicialValue, self.labelResultado, self.labelResultadoValue, self.labelSaldoFinal, self.labelSaldoFinalValue]
        labels.forEach {
            $0?.textColor = theme.darkText
            $0?.font = theme.font
        }

    }

}
