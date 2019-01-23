# Backend Stack for ConsultaniaPrev Solution
Este repositório contém todos os componentes do ambiente de Backend da Solução, a saber:

- Pipeline de CI/CD para os componentes de Backend;
- MasterStack contendo o template principal da solução de Backend;
- Folders com componentes individuais da solução;

## Arquitetura Tecnológica
Cada componente que faz parte da solução é um componente autônomo, que possui o seu próprio ciclo de evolução. Os componentes podem ser implementados utilizando-se de soluções gerenciadas ou soluções customizadas. Para o caso de soluções gerenciadas, o componente será descrito em um template IaC que deverá ser associado ao MasterStack. Para o caso de soluções customizadas, o componente deverá contemplar o seu código de execução, bem como o template IaC necessário para criação dos recursos a ele associados. As dependências entre componentes devem ser descritas no template do Stack Principal.

## Pipeline
