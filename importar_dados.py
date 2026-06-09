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

# Adicionadas as colunas de horário lógico em Português à estrutura inicial
cursor.execute('''
    CREATE TABLE IF NOT EXISTS restaurantes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT UNIQUE, 
        morada TEXT,
        cidade TEXT,
        preco TEXT,
        avaliacao TEXT,
        cozinhas TEXT,
        imagem_url TEXT,
        tem_almoco INTEGER DEFAULT 0,
        tem_servico_continuo INTEGER DEFAULT 0,
        fecha_tarde INTEGER DEFAULT 0,
        aberto_domingo INTEGER DEFAULT 0
    )
''')

# Tenta adicionar as colunas caso a tabela já tenha sido criada em execuções anteriores
novas_colunas = [
    ("imagem_url", "TEXT"),
    ("tem_almoco", "INTEGER DEFAULT 0"),
    ("tem_servico_continuo", "INTEGER DEFAULT 0"),
    ("fecha_tarde", "INTEGER DEFAULT 0"),
    ("aberto_domingo", "INTEGER DEFAULT 0")
]

for coluna, tipo in novas_colunas:
    try:
        cursor.execute(f"ALTER TABLE restaurantes ADD COLUMN {coluna} {tipo}")
    except sqlite3.OperationalError:
        pass # Se a coluna já existe, o script continua normalmente sem falhar

# 2. O Python percorre cada ficheiro da lista
for nome_ficheiro in ficheiros_cidades:
    print(f"\nInício da leitura do ficheiro: {nome_ficheiro}...")
    
    try:
        with open(nome_ficheiro, 'r', encoding='utf-8') as ficheiro:
            html = ficheiro.read()
            
        soup = BeautifulSoup(html, 'html.parser')
        script_jsonld = soup.find('script', id='restaurant_jsonld')
        
        if script_jsonld:
            dados_json = json.loads(script_jsonld.string)
            lista_restaurantes = dados_json.get("itemListElement", [])
            
            print(f"Sucesso! Processamento de {len(lista_restaurantes)} restaurantes...")
            
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

                    # Extração da Imagem com suporte a dicionários
                    imagem_bruta = restaurante.get("image")
                    imagem_url = "Sem imagem"
                    
                    if isinstance(imagem_bruta, str):
                        imagem_url = imagem_bruta
                    elif isinstance(imagem_bruta, dict):
                        imagem_url = imagem_bruta.get("url", "Sem imagem")
                    elif isinstance(imagem_bruta, list) and len(imagem_bruta) > 0:
                        primeiro_item = imagem_bruta[0]
                        if isinstance(primeiro_item, str):
                            imagem_url = primeiro_item
                        elif isinstance(primeiro_item, dict):
                            imagem_url = primeiro_item.get("url", "Sem imagem")

                    # --- EXTRAÇÃO DAS CARACTERÍSTICAS DE HORÁRIO (amenityFeature) ---
                    amenities = restaurante.get("amenityFeature", [])
                    
                    tem_almoco = 0
                    tem_servico_continuo = 0
                    fecha_tarde = 0
                    aberto_domingo = 0
                    
                    if isinstance(amenities, list):
                        for amenity in amenities:
                            nome_caracteristica = amenity.get("name", "")
                            valor_caracteristica = amenity.get("value", False)
                            
                            if valor_caracteristica is True:
                                if nome_caracteristica == "Lunch":
                                    tem_almoco = 1
                                elif nome_caracteristica == "Continuous service":
                                    tem_servico_continuo = 1
                                elif nome_caracteristica == "Open late":
                                    fecha_tarde = 1
                                elif nome_caracteristica == "Open sunday":
                                    aberto_domingo = 1

                    # UPSERT: Insere ou atualiza (incluindo as novas colunas de controlo horário)
                    cursor.execute('''
                        INSERT INTO restaurantes (
                            nome, morada, cidade, preco, avaliacao, cozinhas, imagem_url,
                            tem_almoco, tem_servico_continuo, fecha_tarde, aberto_domingo
                        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                        ON CONFLICT(nome) DO UPDATE SET
                            morada=excluded.morada,
                            cidade=excluded.cidade,
                            preco=excluded.preco,
                            avaliacao=excluded.avaliacao,
                            cozinhas=excluded.cozinhas,
                            imagem_url=excluded.imagem_url,
                            tem_almoco=excluded.tem_almoco,
                            tem_servico_continuo=excluded.tem_servico_continuo,
                            fecha_tarde=excluded.fecha_tarde,
                            aberto_domingo=excluded.aberto_domingo
                    ''', (nome, morada, cidade, preco, nota, cozinhas, imagem_url, 
                          tem_almoco, tem_servico_continuo, fecha_tarde, aberto_domingo))
                    
                except KeyError:
                    pass
        else:
            print("Aviso: Bloco JSON-LD não existe neste ficheiro.")
            
    except FileNotFoundError:
        print(f"Aviso: O ficheiro '{nome_ficheiro}' ainda não foi criado na pasta. Avanço para o próximo.")

conexao.commit()
conexao.close()
print("\nProcesso concluído! A base de dados tem restaurantes atualizados com imagens e horários lógicos.")