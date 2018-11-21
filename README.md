# Integração Institutos e Beneficiários

Solução criada para implementar mecanismos de integração entre Institutos de Previdência Privada e Beneficiários.

![](DiagramaNegocio.png?raw=true)

## Domínio de Negócio

### Entidades

#### Instituto de Previdência
Representa um instituto que tem por objetivo gerir de maneira centralizada os recursos recolhidos junto aos seus segurados. O Instituto de Previdência é uma personalidade jurídica determinada que é formada a partir da união de seus segurados.

#### Segurado
O segurado é uma pessoa física que, por opção pessoal ou como consequência de um contrato de trabalho, faz parte de um Instituto de Previdência que é responsável por gerenciar as contribuições e benefícios previdenciários.

#### Políticas de Contribuição
Regras formais que descrevem e determinam o processo e os parâmetros de contribuição dos segurados para o Instituto de Previdência.

#### Políticas de Benefício
Regras formais que descrevem e determinam o processo e os parâmetros de acesso aos benefícios por parte dos segurados junto ao Instituo de Previdência.

#### Prestador de Serviço
É uma pessoa física, que pode ou não ser um segurado, que presta serviços para o Instituto de Previdência por meio de uma relação de serviço.

#### Relação de Serviço
Vínculo entre um prestador de serviço e um Instituto de Previdência. Este vínculo possui características próprias e pode ser do tipo permanente ou temporário, remunerado ou não remunerado, contratual ou não contratual.

#### Procedimento Administrativo
Ação ou atividade realizada por um segurado ou por um prestador de serviço que é rgistrada de maneira formal e ocasiona ou não uma consequência.

#### Processo Administrativo
Conjunto de procedimentos administrativos agrupados segundo regras próprias que representam uma ação maior realizada de maneira coordenada e controlada, objetivando uma consequência pré-determinada. São tipos possíveis de processos administrativos admitidos na solução:
- Processo de Disponibilização de Benefício;
- Processo de Contratação Formal de Prestadores de Serviço;
- Processo de Aquisição de Bens e Serviços;
- Processo de Prestação de Contas;
- Processo de Apuração de Resultados Financeiros;
- Processo de Divulgação de Informações;

## Arquitetura Tecnológica

![](ArquiteturaTecnologica.png?raw=true)

## Arquitetura Tecnológica

