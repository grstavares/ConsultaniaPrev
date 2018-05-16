//
//  ResultadoCell.swift
//  ConsultaniaPrev
//
//  Created by Gustavo Tavares on 09/05/2018.
//  Copyright © 2018 Plazaz. All rights reserved.
//

import UIKit

class ResultadoCell: UITableViewCell {
    
    public static let cellId: String = "ResultadoCell"
    
    @IBOutlet weak var labelDesc: UILabel!
    @IBOutlet weak var labelVal: UILabel!
    
    private var detalhes: [Resultado.Lancamento] = []
    private static var normalColor: UIColor = UIColor.darkText
    private static let redColor = UIColor(red: 148 / 255, green: 17 / 255 , blue: 0 / 255, alpha: 1)
    private static var formatter: NumberFormatter?
    
    override func awakeFromNib() {
        
        super.awakeFromNib()
        
        if let theme = AppDelegate.theme?.currentTheme {

            ResultadoCell.normalColor = theme.darkText
            self.labelDesc.textColor = theme.darkText
            self.labelDesc.font = theme.font
            self.labelVal.textColor = theme.darkText
            self.labelVal.font = theme.font

        }
        
    }

    override func setSelected(_ selected: Bool, animated: Bool) {
        super.setSelected(selected, animated: animated)
    }

    public func configure(_ resultado: Resultado.Lancamento) {
        
        if ResultadoCell.formatter == nil {
            
            ResultadoCell.formatter = NumberFormatter()
            ResultadoCell.formatter?.numberStyle = .currency
            
        }
        
        self.labelDesc.text = resultado.descricao
        self.labelVal.text = ResultadoCell.formatter?.string(from: NSNumber.init(value: resultado.valor))
        self.detalhes = resultado.detalhes
        
        self.labelVal.textColor = resultado.valor < 0 ? ResultadoCell.redColor : ResultadoCell.normalColor
        
    }
    
}
