//
//  PericiaCell.swift
//  ConsultaniaPrev
//
//  Created by Gustavo Tavares on 10/05/2018.
//  Copyright © 2018 Plazaz. All rights reserved.
//

import UIKit

class PericiaCell: UITableViewCell {
    
    public static let cellId: String = "PericiaCell"
    
    @IBOutlet weak var labelData: UILabel!
    @IBOutlet weak var labelStatus: UILabel!
    
    private static var formatter: DateFormatter?
    
    override func awakeFromNib() {
        
        super.awakeFromNib()
        
        if let theme = AppDelegate.theme?.currentTheme {
            
            self.labelData.textColor = theme.darkText
            self.labelData.font = theme.font
            self.labelStatus.textColor = theme.darkText
            self.labelStatus.font = theme.font
            
        }
        
    }
    
    override func setSelected(_ selected: Bool, animated: Bool) {
        super.setSelected(selected, animated: animated)
    }
    
    public func configure(_ pericia: Pericia) {
        
        if PericiaCell.formatter == nil {
            
            PericiaCell.formatter = DateFormatter()
            PericiaCell.formatter?.dateFormat = "dd/MM/yyyy"
            
        }
        
        self.labelData.text = PericiaCell.formatter?.string(from: pericia.data)
        self.labelStatus.text = pericia.status.label
        
        
    }
    
}
