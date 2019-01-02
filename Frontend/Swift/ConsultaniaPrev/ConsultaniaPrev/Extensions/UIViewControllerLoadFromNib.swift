//
//  UIViewControllerLoadFromNib.swift
//  ConsultaniaPrev
//
//  Created by Gustavo Tavares on 08/05/2018.
//  Copyright © 2018 Plazaz. All rights reserved.
//

import UIKit

extension UIViewController {
    
    class func loadFromNib<T: UIViewController>() -> T {
        return T(nibName: String(describing: self), bundle: nil)
    }
    
}
