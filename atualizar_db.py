import sqlite3

def adicionar_tabelas_autenticacao():
    conn = sqlite3.connect('app_reservas.db')
    cursor = conn.cursor()

    # Cria a tabela de Utilizadores
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS utilizadores (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL
        )
    ''')

    # Cria a tabela de Reservas 
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS reservas (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            restaurante_id INTEGER NOT NULL,
            data TEXT NOT NULL,
            hora TEXT NOT NULL,
            num_pessoas INTEGER NOT NULL,
            status TEXT DEFAULT 'Confirmada',
            FOREIGN KEY (user_id) REFERENCES utilizadores (id),
            FOREIGN KEY (restaurante_id) REFERENCES restaurantes (id)
        )
    ''')

    conn.commit()
    conn.close()
    print("Tabelas de autenticação e reservas verificadas/criadas com sucesso!")

def atualizar_tabela_restaurantes():
    conn = sqlite3.connect('app_reservas.db')
    cursor = conn.cursor()

    # Novas colunas em Português de Portugal para validação de regras de negócio
    novas_colunas = [
        ("tem_almoco", "INTEGER DEFAULT 0"),
        ("tem_servico_continuo", "INTEGER DEFAULT 0"),
        ("fecha_tarde", "INTEGER DEFAULT 0"),
        ("aberto_domingo", "INTEGER DEFAULT 0")
    ]

    for coluna, tipo in novas_colunas:
        try:
            # Tenta adicionar a coluna à tabela existente
            cursor.execute(f"ALTER TABLE restaurantes ADD COLUMN {coluna} {tipo}")
            print(f"Coluna '{coluna}' adicionada com sucesso à tabela 'restaurantes'.")
        except sqlite3.OperationalError:
            # O SQLite lança esta exceção se a coluna já existir, o que permite ignorar o erro com segurança
            print(f"A coluna '{coluna}' já existe na tabela 'restaurantes'.")

    conn.commit()
    conn.close()
    print("Migração da tabela de restaurantes concluída!")

if __name__ == "__main__":
    adicionar_tabelas_autenticacao()
    atualizar_tabela_restaurantes()