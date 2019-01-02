//
//  AppMockDataProvider.swift
//  ConsultaniaPrev
//
//  Created by Gustavo Tavares on 08/05/2018.
//  Copyright © 2018 Plazaz. All rights reserved.
//

import Foundation
class AppMockDataProvider: AppDataProvider {
    
    public static let mock = AppMockDataProvider()
    override init() {
        
        super.init()

    }
    
    override public func getResultado(for periodo: (Int, Int)) -> Resultado? {
        
        let saldo: Double = 5063094.74
        let receitasL = self.generateReceita()
        let receitas: Resultado.Lancamento = Resultado.Lancamento(descricao: "Receitas Previdenciárias", qtd: nil, valor: receitasL.reduce(0) { (x, l) in x + l.valor}, detalhes: receitasL)
        
        let despPrevL = self.generateDespPrev()
        let despPrev: Resultado.Lancamento = Resultado.Lancamento(descricao: "Despesas Previdenciárias", qtd: nil, valor: despPrevL.reduce(0) { (x, l) in x + l.valor}, detalhes: despPrevL)
        
        let despAdmL = self.generateDespAdm()
        let despAdm: Resultado.Lancamento = Resultado.Lancamento(descricao: "Despesas Administrativas", qtd: nil, valor: despAdmL.reduce(0) { (x, l) in x + l.valor}, detalhes: despAdmL)
        
        let consigL = self.generateConsig()
        let consig: Resultado.Lancamento = Resultado.Lancamento(descricao: "Consignação em Folha", qtd: nil, valor: consigL.reduce(0) { (x, l) in x + l.valor}, detalhes: consigL)
        
        let rendimL = self.generateRendimentos()
        let rendimentos: Resultado.Lancamento = Resultado.Lancamento(descricao: "Rendimentos", qtd: nil, valor: rendimL.reduce(0) { (x, l) in x + l.valor}, detalhes: rendimL)
        
        return Resultado(periodo: periodo, saldoInicial: saldo, categorias: [receitas, despPrev, despAdm, consig, rendimentos])

    }
    
    private func generateReceita() ->  [Resultado.Lancamento] {
        
        let lan1 = Resultado.Lancamento(descricao: "Contribução Servidores (11%)", qtd: 137, valor: 55658.87, detalhes: [])
        let lan2 = Resultado.Lancamento(descricao: "Contribuição Patronal (24%)", qtd: nil, valor: 118972.71, detalhes: [])
        let lan3 = Resultado.Lancamento(descricao: "Contribuição Inativos", qtd: nil, valor: 83838.68, detalhes: [])
        let lan4 = Resultado.Lancamento(descricao: "Dedução Salário Família", qtd: 1, valor: -63.42, detalhes: [])
        return [lan1, lan2, lan3, lan4]
        
    }

    private func generateDespPrev() -> [Resultado.Lancamento] {

        let lan1 = Resultado.Lancamento(descricao: "Aposentados", qtd: 66, valor: -196252.33, detalhes: [])
        let lan2 = Resultado.Lancamento(descricao: "Pensionistas", qtd: nil, valor: -43286.76, detalhes: [])
        let lan3 = Resultado.Lancamento(descricao: "Salário-Família", qtd: nil, valor: -63.42, detalhes: [])
        let lan4 = Resultado.Lancamento(descricao: "Salário-Maternidade", qtd: 0, valor: 0.0, detalhes: [])
        let lan5 = Resultado.Lancamento(descricao: "Auxílio Doença", qtd: 1, valor: -3721.57, detalhes: [])
        let lan6 = Resultado.Lancamento(descricao: "Auxílio Reclusão", qtd: 0, valor: 0.0, detalhes: [])
        let lan7 = Resultado.Lancamento(descricao: "Outras Despesas", qtd: 0, valor: 0.0, detalhes: [])
        return [lan1, lan2, lan3, lan4, lan5, lan6, lan7]
        
    }
    
    private func generateDespAdm() -> [Resultado.Lancamento] {

        let lan1 = Resultado.Lancamento(descricao: "Assessoria Técnica - Adm", qtd: nil, valor: -1500.00, detalhes: [])
        let lan2 = Resultado.Lancamento(descricao: "Contribuição Previdenciária Patronal", qtd: nil, valor: 0.0, detalhes: [])
        let lan3 = Resultado.Lancamento(descricao: "Assessoria Contábil", qtd: nil, valor: -2320.4, detalhes: [])
        let lan4 = Resultado.Lancamento(descricao: "Assessoria de Investimentos", qtd: nil, valor: -650.0, detalhes: [])
        let lan5 = Resultado.Lancamento(descricao: "Folha de Pagamento", qtd: nil, valor: 0.0, detalhes: [])
        let lan6 = Resultado.Lancamento(descricao: "Outros (Energia, Água, Telefone, Tarifas)", qtd: nil, valor: -265.2, detalhes: [])
        return [lan1, lan2, lan3, lan4, lan5, lan6]
        
    }
    
    private func generateConsig() -> [Resultado.Lancamento]  {

        let lan1 = Resultado.Lancamento(descricao: "Ipasgo", qtd: 66, valor: 0.0, detalhes: [])
        let lan2 = Resultado.Lancamento(descricao: "Outras Despesas", qtd: nil, valor: -442.09, detalhes: [])
        let lan3 = Resultado.Lancamento(descricao: "INSS", qtd: nil, valor: 0.0, detalhes: [])
        let lan4 = Resultado.Lancamento(descricao: "IRRF", qtd: nil, valor: -11726.94, detalhes: [])
        let lan5 = Resultado.Lancamento(descricao: "Sindicato", qtd: nil, valor: -37.22, detalhes: [])
        let lan6 = Resultado.Lancamento(descricao: "Empréstimos Bancários", qtd: nil, valor: -13151.74, detalhes: [])
        let lan7 = Resultado.Lancamento(descricao: "Salário Maternidade/Auxílio Doença", qtd: 0, valor: -409.37, detalhes: [])
        let lan8 = Resultado.Lancamento(descricao: "Aposentados/Pensionistas", qtd: 0, valor: -1129.71, detalhes: [])
        let lan9 = Resultado.Lancamento(descricao: "Servidores a Disposição", qtd: 0, valor: 0.0, detalhes: [])
        return [lan1, lan2, lan3, lan4, lan5, lan6, lan7, lan8, lan9]
        
    }
    
    private func generateRendimentos() -> [Resultado.Lancamento]  {

        let lan1 = Resultado.Lancamento(descricao: "Aplicação Itaú Soberano, Fixa IR", qtd: nil, valor: 23388.04, detalhes: [])
        let lan2 = Resultado.Lancamento(descricao: "Aplicação Itaú Soberano, RF DI", qtd: nil, valor: 3646.36, detalhes: [])
        let lan3 = Resultado.Lancamento(descricao: "Aplicação Itaú Soberano, Renda Fixa FI", qtd: nil, valor: 0.0, detalhes: [])
        let lan4 = Resultado.Lancamento(descricao: "Aplicação Itaú Institucional RF", qtd: 1, valor: 3582.42, detalhes: [])
        return [lan1, lan2, lan3, lan4]
        
    }
    
}
