//
//  NavigationVC.swift
//  ConsultaniaPrev
//
//  Created by Gustavo Tavares on 08/05/2018.
//  Copyright © 2018 Plazaz. All rights reserved.
//

import UIKit

class NavigationVC: UINavigationController {

    public static func instantiate() -> NavigationVC? {
        
        let bd = Bundle.init(for: NavigationVC.self)
        let sb = UIStoryboard.init(name: "Start", bundle: bd)
        let vc = sb.instantiateViewController(withIdentifier: "NavigationVC") as? NavigationVC
        vc?.navigationBar.barTintColor = AppDelegate.theme?.currentTheme.first
        return vc

    }
    
    @IBOutlet weak var buttonProfile: UIBarButtonItem!
    
    var themedStatusBarStyle: UIStatusBarStyle?
    
    override func viewDidLoad() {

        super.viewDidLoad()
        setUpTheming()
        
    }
    
    override var preferredStatusBarStyle: UIStatusBarStyle {return self.themedStatusBarStyle ?? super.preferredStatusBarStyle}

}

extension NavigationVC: Themed {
    
    func applyTheme(_ theme: AppTheme) {
        
        themedStatusBarStyle = theme.statusBarStyle
        setNeedsStatusBarAppearanceUpdate()

        navigationBar.barTintColor = theme.barBackgroundColor
        navigationBar.tintColor = theme.barForegroundColor
        navigationBar.titleTextAttributes = [NSAttributedStringKey.font: UIFont(name: "Avenir Next", size: 18.0)!, NSAttributedStringKey.foregroundColor: theme.barForegroundColor]
    }
}
