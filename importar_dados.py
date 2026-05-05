import json
from bs4 import BeautifulSoup
import sqlite3

# 1. Lista com os nomes dos ficheiros gravados na pasta
ficheiros_cidades = [
    'dados_lisboa.html', 
    'dados_porto.html', 
    'dados_setubal.html', 
    'dados_faro.html'
]

conexao = sqlite3.connect('app_reservas.db')
cursor = conexao.cursor()

# Adicionada a coluna imagem_url à estrutura inicial
cursor.execute('''
    CREATE TABLE IF NOT EXISTS restaurantes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT UNIQUE, 
        morada TEXT,
        cidade TEXT,
        preco TEXT,
        avaliacao TEXT,
        cozinhas TEXT,
        imagem_url TEXT
    )
''')

# Tenta adicionar a coluna caso a tabela já tenha sido criada em execuções anteriores
try:
    cursor.execute("ALTER TABLE restaurantes ADD COLUMN imagem_url TEXT")
except sqlite3.OperationalError:
    pass # Se der erro, significa que a coluna já existe. O script continua normalmente.

# 2. O Python percorre cada ficheiro da lista
for nome_ficheiro in ficheiros_cidades:
    print(f"\nA iniciar a leitura do ficheiro: {nome_ficheiro}...")
    
    try:
        with open(nome_ficheiro, 'r', encoding='utf-8') as ficheiro:
            html = ficheiro.read()
            
        soup = BeautifulSoup(html, 'html.parser')
        script_jsonld = soup.find('script', id='restaurant_jsonld')
        
        if script_jsonld:
            dados_json = json.loads(script_jsonld.string)
            lista_restaurantes = dados_json.get("itemListElement", [])
            
            print(f"Sucesso! A processar {len(lista_restaurantes)} restaurantes...")
            
            for elemento in lista_restaurantes:
                try:
                    restaurante = elemento["item"]
                    nome = restaurante.get("name", "Nome indisponível")
                    morada = restaurante["address"].get("streetAddress", "Morada indisponível")
                    cidade = restaurante["address"].get("addressLocality", "")
                    preco = restaurante.get("priceRange", "Preço indisponível")
                    
                    nota = "Sem avaliação"
                    if "aggregateRating" in restaurante:
                        nota = restaurante["aggregateRating"].get("ratingValue", "Sem avaliação")
                    
                    cozinhas = "Não especificado"
                    if "servesCuisine" in restaurante:
                        if isinstance(restaurante["servesCuisine"], list):
                            cozinhas = ", ".join(restaurante["servesCuisine"])
                        else:
                            cozinhas = restaurante["servesCuisine"]

                    # Nova lógica corrigida: Extração da Imagem com suporte a dicionários
                    imagem_bruta = restaurante.get("image")
                    imagem_url = "Sem imagem"
                    
                    if isinstance(imagem_bruta, str):
                        imagem_url = imagem_bruta
                    elif isinstance(imagem_bruta, dict):
                        # Se for um objeto, tenta ir buscar a chave "url"
                        imagem_url = imagem_bruta.get("url", "Sem imagem")
                    elif isinstance(imagem_bruta, list) and len(imagem_bruta) > 0:
                        primeiro_item = imagem_bruta[0]
                        if isinstance(primeiro_item, str):
                            imagem_url = primeiro_item
                        elif isinstance(primeiro_item, dict):
                            # Se for uma lista de objetos, tenta ir buscar a chave "url" do primeiro objeto
                            imagem_url = primeiro_item.get("url", "Sem imagem")

                    # UPSERT: Insere o restaurante ou atualiza os dados (incluindo a imagem) se o nome já existir
                    cursor.execute('''
                        INSERT INTO restaurantes (nome, morada, cidade, preco, avaliacao, cozinhas, imagem_url)
                        VALUES (?, ?, ?, ?, ?, ?, ?)
                        ON CONFLICT(nome) DO UPDATE SET
                            morada=excluded.morada,
                            cidade=excluded.cidade,
                            preco=excluded.preco,
                            avaliacao=excluded.avaliacao,
                            cozinhas=excluded.cozinhas,
                            imagem_url=excluded.imagem_url
                    ''', (nome, morada, cidade, preco, nota, cozinhas, imagem_url))
                    
                except KeyError:
                    pass
        else:
            print("Aviso: Bloco JSON-LD não existe neste ficheiro.")
            
    except FileNotFoundError:
        print(f"Aviso: O ficheiro '{nome_ficheiro}' ainda não foi criado na pasta. A avançar para o próximo.")

conexao.commit()
conexao.close()
print("\nProcesso concluído! A base de dados tem restaurantes atualizados com as respetivas imagens.")