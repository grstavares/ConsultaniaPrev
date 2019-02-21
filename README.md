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

### Frontend

Para acesso ao sistema, a solução proporciona três alternativas:

- Aplicativo nativo para iOS;
- Aplicativo nativo para Android;
- Aplicativo disponível via Web Responsiva (Computador e Celular);

As funcionalidades a disposição dos usuários serão determinadas pelos perfis de acesso registrados previamente, podendo estes perfis de acesso serem:

- Usuário administrativo (Prestadores de Serviço);
- Usuário comum (Segurado).

#### Mapa de Funcionalidades - Frontend

|Funcionalidade|Usuário Admin|Usuário Comum|
|----| :-----: | :-----: |
|Consulta e alteração de perfil de usuário | X|X|
|Consulta informações do Intituto | X|X|
|Le e encaminhar mensagens|X|X|
|Visualiza e compartilha documentos públicos|X|X|
|Encaminha reclamações e denúncias|X|X|
|Consulta dados da aposentadoria individual | X|X|
|Consulta dados de prestação de contas | X|X|
|Consulta detalhamento de receitas e despesas | X|X|
|Solicita agendamento de procedimentos|X|X|
|Consulta dados da aposentadoria geral | X| |
|Consulta dados da aposentadoria geral | X| |
|Confirma agendamento de procedimentos|X| |
|Consulta documentos não públicos|X| |
|Adiciona e altera documentos|X| |
|Importa informações de recolhimentos|X| |
|Importa informações de despesas previdenciárias (folha de pagamento)|X| |
|Adiciona e altera informações sobre despesas|X| |
|Controla procedimentos e processos administrativos |X| |
|Controla reclamações e denúncias |X| |

### Backend

O ambiente de backend do sistema deverá ser contruído observando a arquitetura de micro-serviços e o paradigma de computação Serverless, usando as soluções disponíveis junta a núvem pública AWS.

Esta arquitetura irá viabilizar uma solução com custos de operação menores e capacidade de escalonamento infinita, sem a necessidade de revisão ou readequação. isto significa que, no início do projeto os custos de operação mensais podem ser nulos, enquando da absorcação de novos usuários. Ao mesmo tempo, na medida em que a quantidade de uso crescer (acessos simultâneos), os custos de operação crescerão proporcionalmente sem a necessidade de novos desenvolvimentos.

### Componentes Previstos

#### Sistema de autenticação

Mecanismo de autenticação de usuários que respeito os padrões OAuth e SAML com as seguintes funcionalidades:

1. Armazenamento e tramissão de dados criptografados;
1. Validação de e-mail por mensagem automática;
1. Validação de número de telefone por mensagem SMS;
1. Recuperação de senha por parte do usuário (e-mail/SMS);
1. Integração de identidade a partir de provedores externos (Facebook, Google)

#### Sistema de Data Lake suportando event sourcing

Mecanismo de armazenamento de dados implementado protocolos asíncronos para persistência de eventos, viabilizando recuperação de dados por meio de replay. A estrutura de armazenamento do data lake deverá armazenar os dados de forma criptografada e usar ciclos de vida para alterar as classes de armazenamento, viabilizando diminuição de custos.

#### Sistema de Distribuição de Conteúdo

Os conteúdos estáticos (Páginas, Scripts, Imagens e Documentos) deverão ser disponibilizados por meio de mecanismso de CDN (Content Delivery Network) viabilizando melhoria de desempenho na entrega destes recursos;

#### Sistema de Gerenciamento de API's

Os endpoints de operações e consultas a informações de negócio devem ser controlados por meio de um gateway central de API's para orquestração de serviços, segurança, monitoramento. O Sistema de Gerenciamento de API's deve permitir instrumentação para visualização de desempenho de maneira asincrona ou por meio de instrumentação de código.

#### Serviços de Negócio

As funcionalidades relacionadas as operações de frontend deverão ser implementadas no backend por meio de micro-serviços individuais que deverão ser responsáveis, cada um, pelo processamento lógico das informações, armazenamento em data store isolado e publicação de eventos de negócio. Cada serviço deverá ser construído, implementado e operado de maneira autômoma, sendo dependências permitidas apenas em situações especiais.

#### Domínio de Busca

As informações gerais e sujeitas a consistência eventual deverão ser replicadas em um domínio de busca que viabilize consultas individuais e com restrição de domínio com base nas permissões dos usuários.

#### Sistema de Monitoraramento

Os detalhes de operação do sistema relacionados a erros, sucessos e desempenho deverão ser armazenados em ambiente disponível para consulta permitindo diagnósticos e acompanhamento das ocorrências.

#### Detalhes de Implementação

Para implementação das soluções de Backend, foram eleitos os seguintes serviços AWS:

| Componente  | Tecnologia |
| --- | --- |
| **Sistema de Autenticação** |  AWS Cognito |
| **Sistema de Data Lake** | AWS S3 / AWS SQS / AWS Lambda |
| **Sistema de Distribuição de Conteúdo** | AWS Cloudfront |
| **Sistema de Gerenciamento de API's** | AWS API Gateway |
| **Serviços de Negócio** | AWS Lambda AWS / AWS Step Functions / AWS SQS / AWS SNS / AWS DynamoDB / AWS Aurora / AWS S3 |
| **Domínio de Busca** | AWS Elastic Search |
| **Sistema de Monitoramento** | AWS CloudWatch / AWS XRay |

### Pipeline

Para construção, teste e implantação deverão ser construídos mecanismos automatizados que viabilizem a disponibilização de novas versões a partir do commit em um repositório pré-determinado.
