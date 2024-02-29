# Super Store
## Aplicación de eCommerce de Pablo Coca




## Autor
Pablo Coca
- Instagram: https://instagram.com/cocapablo
- YouTube: https://youtube.com/cocapablo
- Facebook: https://facebook.com/cocapablo
- Twitch: https://twitch.tv/cocapablook
- LinkedIn : https://www.linkedin.com/in/cocapablo/

## NOTAS
- La Api "get("/api/products") puede recibir por query params los siguientes parámetros:
    - limit 
    - page
    - sort : puede tener dos valos ASC (ascendente) y DES (descendente) . El ordenamiento se realiza siempre por el campo price
    - query: recibe cualquier consulta que pueda interpretar Mongoose. IMPORTANTE: este parámetro debe ser enviado en formato JSON. Por ejemplo si quiero los productos de categoría "Frutas" el parametro quedaría así: query={"category":"Frutas"}
- La vista "/cart" recibe como parametro un id de carrito y muestra sus productos






