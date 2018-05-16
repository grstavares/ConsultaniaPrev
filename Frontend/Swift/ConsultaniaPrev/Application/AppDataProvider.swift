//
//  AppDataProvider.swift
//  ConsultaniaPrev
//
//  Created by Gustavo Tavares on 08/05/2018.
//  Copyright © 2018 Plazaz. All rights reserved.
//

import Foundation
class AppDataProvider {
    
    public static let shared = AppDataProvider()
    init() {}

    public func getResultado(for periodo: (Int, Int)) -> Resultado? {return nil}
    
}
