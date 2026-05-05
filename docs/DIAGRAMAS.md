# Diagramas da Arquitetura do Sistema

### 1. Diagrama de Casos de Uso

Este diagrama ilustra de forma macro o que o sistema faz e quem interage com ele.

```mermaid
flowchart LR
    Utilizador([Utilizador])
    DB([Base de Dados SQLite])
    LLM([Inteligência Artificial - LLM])

    subgraph n8n [O Sistema: Agente n8n]
        UC1(Compreender Intenção do Chat)
        UC2(Consultar Restaurantes)
        UC3(Simular Reserva Segura)
        UC4(Gerar Resposta Natural)
    end

    %% O utilizador interage com as funcionalidades principais
    Utilizador --> UC1
    Utilizador --> UC2
    Utilizador --> UC3

    %% O sistema depende das ferramentas externas para funcionar
    UC1 -. "<< usa >>" .-> LLM
    UC4 -. "<< usa >>" .-> LLM

    UC2 -. "<< acede >>" .-> DB
```

---

### 2. Diagrama de Sequência (Sequence Diagram)

Este é o diagrama mais importante para o n8n. Ele mapeia o passo a passo da comunicação entre o Utilizador, o n8n, a Base de Dados e o Modelo de Linguagem (LLM).

```mermaid
sequenceDiagram
    autonumber
    actor Utilizador
    participant Chat as Interface de Chat
    participant n8n as Workflow n8n
    participant LLM as Modelo de Linguagem
    participant DB as SQLite (app_reservas.db)

    Utilizador->>Chat: "Quero um italiano no Porto"
    Chat->>n8n: Envia mensagem (Webhook)
    n8n->>LLM: Pede para extrair intenção, cidade e cozinha
    LLM-->>n8n: Retorna JSON {cidade: "Porto", cozinha: "Italian"}

    n8n->>DB: Executa Query SQL (SELECT * WHERE cidade='Porto' AND cozinhas LIKE '%Italian%')
    DB-->>n8n: Retorna lista de 3 restaurantes

    n8n->>LLM: Pede para redigir resposta natural com os dados
    LLM-->>n8n: Retorna texto formatado com justificação

    n8n-->>Chat: Envia resposta final
    Chat-->>Utilizador: Exibe as recomendações e pergunta se quer reservar
```

---

### 3. Modelo Lógico de Dados (ERD)

Estrutura da base de dados.

```mermaid
erDiagram
    UTILIZADORES ||--o{ RESERVAS : "faz"
    RESTAURANTES ||--o{ RESERVAS : "recebe"

    UTILIZADORES {
        INTEGER id PK
        TEXT nome
        TEXT email
        TEXT password
    }

    RESTAURANTES {
        INTEGER id PK
        TEXT nome
        TEXT morada
        TEXT cidade
        TEXT preco
        TEXT avaliacao
        TEXT cozinhas
        TEXT imagem_url
    }

    RESERVAS {
        INTEGER id PK
        INTEGER user_id FK
        INTEGER restaurante_id FK
        TEXT data
        TEXT hora
        INTEGER num_pessoas
        TEXT status
    }
```
