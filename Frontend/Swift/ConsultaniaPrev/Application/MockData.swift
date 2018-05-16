//
//  MockData.swift
//  ConsultaniaPrev
//
//  Created by Gustavo Tavares on 10/05/2018.
//  Copyright © 2018 Plazaz. All rights reserved.
//

import Foundation
struct MockData {}

extension MockData {
    
    public static var user: Beneficiario {
        
        let threeMonthsAgo = Calendar.current.date(byAdding: .day, value: -90, to: Date())!
        let lastyear = Calendar.current.date(byAdding: .day, value: -380, to: Date())!
        let nextWeek = Calendar.current.date(byAdding: .day, value: 8, to: Date())!
        
        let periciaA = Pericia(data: threeMonthsAgo, status: .realizada, resultado: nil)
        let periciaB = Pericia(data: lastyear, status: .realizada, resultado: nil)
        let periciaC = Pericia(data: nextWeek, status: .agendada, resultado: nil)
        
        let birth = Calendar.current.date(from: DateComponents(calendar: Calendar.current, timeZone: TimeZone.current, era: nil, year: 1978, month: 10, day: 31, hour: 0, minute: 0, second: 0, nanosecond: nil, weekday: nil, weekdayOrdinal: nil, quarter: nil, weekOfMonth: nil, weekOfYear: nil, yearForWeekOfYear: nil))!
        let carls = Beneficiario(nome: "Carlos Henrique Siqueira Gomes", nascimento: birth, inscricao: "12345-98", pericias: [periciaA, periciaB, periciaC])
        return carls
        
    }
    
}
