import sqlite3
import requests
import time

def geocodificar_restaurantes():
    # 1. Ligar à base de dados
    conexao = sqlite3.connect('app_reservas.db')
    cursor = conexao.cursor()

    # 2. Selecionar apenas os restaurantes que ainda não têm coordenadas
    cursor.execute("SELECT id, nome, morada, cidade FROM restaurantes WHERE latitude IS NULL OR longitude IS NULL")
    restaurantes = cursor.fetchall()

    if not restaurantes:
        print("Todos os restaurantes já têm coordenadas!")
        return

    print(f"A analisar {len(restaurantes)} restaurantes...")

    # 3. Percorrer a lista e pedir as coordenadas à API
    for rest_id, nome, morada, cidade in restaurantes:
        # A API funciona melhor se o endereço for muito claro
        endereco_completo = f"{morada}, {cidade}, Portugal"
        
        url = "https://nominatim.openstreetmap.org/search"
        parametros = {
            'q': endereco_completo,
            'format': 'json',
            'limit': 1
        }
        # O OpenStreetMap exige a identificação da aplicação no cabeçalho
        headers = {
            'User-Agent': 'ProjetoIntegradorReservas/1.0 (projeto_academico)'
        }

        try:
            resposta = requests.get(url, params=parametros, headers=headers)
            dados = resposta.json()

            if dados: # Se a API encontrou o endereço
                lat = float(dados[0]['lat'])
                lon = float(dados[0]['lon'])
                
                # 4. Gravar na base de dados
                cursor.execute(
                    "UPDATE restaurantes SET latitude = ?, longitude = ? WHERE id = ?",
                    (lat, lon, rest_id)
                )
                conexao.commit()
                print(f"[SUCESSO] {nome} -> Lat: {lat}, Lon: {lon}")
            else:
                print(f"[FALHA] {nome} -> Morada não localizada no mapa.")

        except Exception as erro:
            print(f"[ERRO] Falha com o restaurante {nome}: {erro}")

        # ATENÇÃO: Pausa obrigatória de 1 segundo. A API bloqueia quem faz pedidos rápidos demais!
        time.sleep(1.2)

    conexao.close()
    print("Processo de geocodificação concluído!")

if __name__ == "__main__":
    geocodificar_restaurantes()