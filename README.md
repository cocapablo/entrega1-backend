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
- Notas de la Entrega Nro 10
    - El modelo usersModel fué actualizado incoporando el campor cart (que contiene un id de un carrito). 
    - Decidí utilizar el modelo de sesión session (en lugar de jwt).
    - Al realizar el login de un usuario, en el método login de la clase UserManager se creará un carrito nuevo, que será seteado en el campo cart del usuario que se está logueando. Si en el campo cart ya existía un id de carrito configurado, se elimirá dicho carrito previamente a la creación de uno nuevo. Realizo esto para mantener un carrito por logueo de usuario (al iniciar una nuevo login, se elimina el carrito del login anterior de ese usuario y se crea uno nuevo)
    - Se implementa la API get "/api/sessions/current" que devuelve los datos del usuario logueado en la sesión actual (o un mensaje indicando que no hay logueado ningún usuario, si ese fuera el caso de la sesión actual)
    - BONUS TRACK: esto no lo pedía la consigna pero me tenté e hice funcionar el carrito desde las views /products y /cart (ya se pueden cargar y eliminar productos al carrito)
    
- La Api "get("/api/products") puede recibir por query params los siguientes parámetros:
    - limit 
    - page
    - sort : puede tener dos valos ASC (ascendente) y DES (descendente) . El ordenamiento se realiza siempre por el campo price
    - query: recibe cualquier consulta que pueda interpretar Mongoose. IMPORTANTE: este parámetro debe ser enviado en formato JSON. Por ejemplo si quiero los productos de categoría "Frutas" el parametro quedaría así: query={"category":"Frutas"}
- La vista "/cart" recibe como parametro un id de carrito y muestra sus productos






