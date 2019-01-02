//
//  StartVC.swift
//  ConsultaniaPrev
//
//  Created by Gustavo Tavares on 08/05/2018.
//  Copyright © 2018 Plazaz. All rights reserved.
//

import UIKit

class StartVC: UIViewController {

    public static func instantiate(with coordinator: AppCoordinador) -> StartVC? {

        let bd = Bundle.init(for: NavigationVC.self)
        let sb = UIStoryboard.init(name: "Start", bundle: bd)
        let vc = sb.instantiateViewController(withIdentifier: "StartVC") as? StartVC
        vc?.coordinator = coordinator
        vc?.title = "ConsultaniaPrev"
        return vc
        
    }
    
    @IBOutlet weak var buttonProfile: UIBarButtonItem!
    @IBOutlet weak var tableView: UITableView!
    
    @IBOutlet weak var color1: UIView!
    @IBOutlet weak var color2: UIView!
    @IBOutlet weak var color3: UIView!
    @IBOutlet weak var color4: UIView!
    @IBOutlet weak var color5: UIView!
    @IBOutlet weak var color6: UIView!
    
    private var coordinator: AppCoordinador!
    
    override func viewDidLoad() {
        
        super.viewDidLoad()
        
        let cellNib = UINib.init(nibName: AppFunctionCell.cellId, bundle: Bundle.init(for: StartVC.self))
        self.tableView.register(cellNib, forCellReuseIdentifier: AppFunctionCell.cellId)
        self.tableView.dataSource = self
        self.tableView.delegate = self

        let background = UIImage(named: "background")!
        self.view.layer.contents = background.cgImage

        self.showTheme()
        
    }

    @IBAction func buttonProfileTapped(sender: Any) -> Void {AppDelegate.coordinator?.perform(.showProfile, with: self)}
    
    private func showTheme() -> Void {
        self.color1.backgroundColor = AppDelegate.theme?.currentTheme.first
        self.color2.backgroundColor = AppDelegate.theme?.currentTheme.second
        self.color3.backgroundColor = AppDelegate.theme?.currentTheme.third
        self.color4.backgroundColor = AppDelegate.theme?.currentTheme.fourth
        self.color5.backgroundColor = AppDelegate.theme?.currentTheme.barBackgroundColor
        self.color6.backgroundColor = AppDelegate.theme?.currentTheme.barForegroundColor
    }
    
}

extension StartVC: UITableViewDataSource {
    
    func numberOfSections(in tableView: UITableView) -> Int {return 1}
    func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {return self.coordinator.menuActivities.count}
    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        
        guard let cell = tableView.dequeueReusableCell(withIdentifier: AppFunctionCell.cellId) as? AppFunctionCell else {return UITableViewCell()}
        
        let activity = self.coordinator.menuActivities[indexPath.row]
        cell.configure(activity: activity)
        return cell
        
    }
    
    
}

extension StartVC: UITableViewDelegate {

    func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {

        if let cell = tableView.cellForRow(at: indexPath) {

            let compressAnimation = UIViewPropertyAnimator(duration: 0.2, curve: .easeInOut) {cell.contentView.transform = CGAffineTransform(scaleX: 1.1, y: 1.1)}

            compressAnimation.addCompletion { _ in
                cell.contentView.transform = CGAffineTransform.identity
                let selected = self.coordinator.menuActivities[indexPath.row]
                self.coordinator.perform(selected, with: self)

            }

            compressAnimation.startAnimation()

        }

    }
    
}

class AppFunctionCell: UITableViewCell {
    
    public static let cellId: String = "AppFunctionCell"
    
    @IBOutlet weak var content: UIView!
    @IBOutlet weak var activityImage: UIImageView!
    @IBOutlet weak var activitylabel: UILabel!
    public var activity: AppActivity?
    
    override func awakeFromNib() {
        
        super.awakeFromNib()
        
        if let font = AppDelegate.theme?.currentTheme.font {
            let withNewSize = font.withSize(20)
            self.activitylabel.font = withNewSize
        }
        
        self.activitylabel.textColor = AppDelegate.theme?.currentTheme.darkText
        self.content.setCornerRadious(10)
        
    }
    
    override func setSelected(_ selected: Bool, animated: Bool) {
        super.setSelected(false, animated: animated)
    }
    
    public func configure(activity: AppActivity) -> Void {
        
        self.activity = activity
        self.activityImage?.image = activity.image
        self.activitylabel.text = activity.title
        
    }
    
}
