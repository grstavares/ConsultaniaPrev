//
//  ApPorIdadeVC.swift
//  ConsultaniaPrev
//
//  Created by Gustavo Tavares on 10/05/2018.
//  Copyright © 2018 Plazaz. All rights reserved.
//

import UIKit

class ApPorIdadeVC: UIViewController {

    public static func instantiate(using coordinator: AppCoordinador, with profile: Beneficiario) -> ApPorIdadeVC? {
        
        let bd = Bundle.init(for: NavigationVC.self)
        let sb = UIStoryboard.init(name: "Aposentadoria", bundle: bd)
        let vc = sb.instantiateViewController(withIdentifier: "ApPorIdadeVC") as? ApPorIdadeVC
        vc?.title = "Aposentadoria"
        vc?.coordinator = coordinator
        vc?.user = profile
        return vc
        
    }
    
    @IBOutlet weak var animationCanvas: UIView!
    @IBOutlet weak var labelIdade: CounterLabel!
    @IBOutlet weak var labelAlvo: CounterLabel!
    @IBOutlet weak var labelIntervalo: UILabel!
    
    private var coordinator: AppCoordinador!
    private var user: Beneficiario!
    
    private let pathLayer = CAShapeLayer()
    private var animationColor: UIColor!
    private var animationTime: TimeInterval = 2.0
    
    override func viewDidLoad() {
        
        super.viewDidLoad()
        self.setUpTheming()
        self.setUpData()

    }

    override func viewDidAppear(_ animated: Bool) {

        let midY = self.animationCanvas.bounds.height / 2
        let controlX = self.animationCanvas.bounds.width - 20
        let path = UIBezierPath()
        path.move(to: CGPoint.init(x: 0, y: self.animationCanvas.bounds.height))
        path.addCurve(to: CGPoint.init(x: self.animationCanvas.bounds.width, y: 0), controlPoint1: CGPoint.init(x: 20, y: midY), controlPoint2: CGPoint.init(x: controlX, y: midY))

        pathLayer.path = path.cgPath
        pathLayer.strokeColor = self.animationColor.cgColor
        pathLayer.fillColor = UIColor.clear.cgColor
        pathLayer.lineWidth = 5.0
        pathLayer.lineCap = CAShapeLayerLineCap.round
        
        let alvo = 65
        let idade = Calendar.current.dateComponents([.year], from: self.user.nascimento, to: Date()).year!
        let endDate = Calendar.current.date(byAdding: .year, value: alvo, to: self.user.nascimento)!
        let intervalo = Calendar.current.dateComponents([.year, .month], from: Date(), to: endDate)
        let qteAnos = intervalo.year!
        let qteMeses = intervalo.month!
        let anosFloat = Float(idade)
        let alvoFloat = Float(alvo)
        
        DispatchQueue.main.asyncAfter(deadline: .now() + animationTime) {self.labelIntervalo.text = "Restam \(qteAnos) anos e \(qteMeses) meses"}
        self.labelIdade.count(from: 0, to: anosFloat, withDuration: animationTime, animationType: CounterLabel.CounterAnimationType.easeOut, countingType: CounterLabel.CounterType.int)
        self.labelAlvo.count(from: 0, to: alvoFloat, withDuration: animationTime, animationType: CounterLabel.CounterAnimationType.easeOut, countingType: CounterLabel.CounterType.int)
        
        self.animationCanvas.layer.addSublayer(pathLayer)
        
        let animation = CABasicAnimation(keyPath: "strokeEnd")
        animation.fromValue = 0.0
        animation.toValue = 1.0
        animation.duration = animationTime
        animation.isRemovedOnCompletion = false
        animation.fillMode = CAMediaTimingFillMode.forwards
        pathLayer.add(animation, forKey: "drawLineAnimation")
        
    }
    
    private func setUpData() -> Void {

        self.labelIdade.text = "0"
        self.labelAlvo.text = "0"
        self.labelIntervalo.text = ""
        
    }
    
}

extension ApPorIdadeVC: Themed {
    
    func applyTheme(_ theme: AppTheme) {
        
        let background = UIImage(named: "background")!
        self.view.layer.contents = background.cgImage
        self.animationColor = theme.barBackgroundColor
        
        let labels = [self.labelIntervalo]
        labels.forEach {
            $0?.textColor = theme.darkText
            $0?.font = theme.font
        }

        let bigFont = theme.font?.withSize(30)
        let labelsBig = [self.labelIdade, self.labelAlvo]
        labelsBig.forEach {
            $0?.textColor = theme.darkText
            $0?.font = bigFont
        }

    }
    
}
