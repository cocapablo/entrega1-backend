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
- Notas de la Entrega Nro 13
    - Implementación del Mock de Productos
        - Se implementa la función generateProduct en test/utils.js que genera un producto ficticio
        - En el controller products.controller se implementa el método getMockingProducts que genera una respuesta con un array de 100 productos ficticios respetando el formato de consultas de productas
        - En el router products.router.js se implementa el endpoint GET "/api/mockingproducts", que devuelve los productos ficticios creados
    - Implementación de CustomErrors
        - Se implementa el Middleware de control de errores en el archivo errorMiddleware.js (se exporta el middleware por default)
        - Se implementa la clase CustomError, y el enum EErrors 
        - En el archivo services/errors/info.js se implementan las funciones generateProductErrorInfo (para errores de parametros de productos), generateCartErrorInfo (para errores de parametros de carritos) y generateDatabaseErrorInfo (para errores de Bases de datos)
        - Se lanzan CustomErrors (en lugar de errores comunes) en el DAO ProductManagerMongo y en el productController para el manejo de productos
        - Se lanzan CustomErrors (en lugar de errores comunes) en el DAO CarritoManagerMongo y en el cartController para el manejo de carritos
- Notas de la Entrega Nro 12
    - Implementación de generación de Ticket de Compra
        - Se implementó el ticket model de Mongoose
        - Se implementó el DAO para Mongo en la clase TicketManager (archivo TicketManagerMongo)
        - Se implementó el controlador de arquitecua MVC en la clase TicketController. Este controlador tiene un método llamado createTicket que es el que implementa la lógica del negocio de la operación de generar el ticket
        - Se creó (según pedía la consigna) la ruta "/api/carts/:cid/purchase" como un método post dentro del router de cart
        - createTicket devolverá un objeto con la siguiente estructura:
            - status: puede ser "error", "success" o (atento con esto) "partial-success"
            - "error" se generará con cualquier error en la operaión y también cuando ninguno de los productos del cart tenga stock suficiente (por lo cual, no hay venta posible)
            - "success" devolverá cuando la operación se genere correctamente y TODOS los productos del cart tengan stock
            - "partial-success" se devolverá cuando al menos uno de los productos del cart NO TENGA stock y al menos uno de los productos del cart TENGA stock
            - campo "ticket": Tendra un objeto con los detalles de la venta pedidos en la consigna
            - campo "rejected-products": es un array con los productos cuyo stock era insuficiente y no entraron en la compra
            - campo "products": es un array con los productos que SI entraron en la compra
        - Al ejecutarse createTicket se actualizarán los stocks de los productos que entraron en la compra y se los retirará del cart. En el cart quedarán los productos que por falta de stock NO ENTRARON en la compra
        - BONUS TRACK: Implementé la compra completa en el front end (en la view "cart")
    - Implementación de la capa de Servicios
        - Se implementaró el patrón Factory para seleccionar que persistencia a utilizar
        - La persistencia se establece en primera instancia por el parmametro -persistence de la línea de comandos y en segunda instancia (de no indicarse en la línea de comandos) a través del campo PERSISTENCE configurado en los archivos .env
        - Por el momento el único modelo de persistencia implementado es MONGO
        - Se implementaron los repositorios en las clases UserManagerRepository, ProductManagarRepository, CarritoManagerRepository y TicketManagerRepository
        - Se crearon instancias de dichos repositorios en el archivo index.js
        - Todos los controllers reemplazaron el acceso directo a las DAOs por los services exportados en index.js
    - Implementación de Middlewares de control de acceso
        - Se implementararon los middlewares usuarioEsAdministrador y usuarioEsUsuario que permiten acceder a un endpoint solo si los usuarios tienen los roles de "admin" y "usuario" respectivamente
        - Los controles sobre CRUD de productos y CRUD de carrito se efectúan solo en los endpoints (no en las vistas). Lo hice así (por ahora) para que puedas ver que cada vez que un usuario intenta realizar alguna operación para la que no tiene privilegios suficientes da un mensaje de error
        - Los controles de acceso al chat tienen un enfoque diferente, dado que chat está implementado con websockets. Aquí los controles se realizan en el momento de renderizar las vistas, mostrando o no el botón de "chatear" en base a los resultados de una función helper que sumé a handlebars llamada "igual". Esta función chequea el rol del usuario y en base a eso muestra el botón de chatear o no
    - Implementación de DTO de Usuario
        - Se creó la clase UserDTO que elimina el password del usuario
        - Se utiliza dicho DTO en los endpoints "api/sessions/current" (dentro del UserController) y en la view "/profile"

- Notas de la Entrega Nro 11
    - Se implementaron los controladores CartController, ProductController y UserController
    - Dichos controladores por el momento tienen una variable interna que apunta a sus respectivos DAOs (hasta implementar las sigientes capas).
    - Las rutas acceden a los DAOS a través de los controladores. Se reemplazaron en todas las rutas del proyecto cualquier referencia directa a los DAOs SALVO EN EL CASO DE LAS VISTAS DE HANDLEBARS. 
    - Con respecto a las vistas de handlebars no implementé ningún "controlador de vistas" porque según lo que interpreté del MVC las vistas SI PUEDEN acceder a los datos (a los  Models del MVC mas precisamente, que por el momento son los DAOs) SOLO PARA LECTURA
    - Cree dos archivos .env llamados .env.cloud y .env.local. En dichos archivos lo único que cambia por ahora es el parámetro MONGO_URL (que apunta a Atlas o a la base de datos local respectivamente).
    - Los archivos .env por ahora tienen cuatro variables: PORT, MONGO_URL, ADMIN_EMAIL y ADMIN_PASSWORD
    - Subo al repositorio un archivo llamado .env.example sin valores para las variables. Te paso los valores por el chat de Coder
    - Se puede configurar que modo (Local o Atlas) se utiliza al ejecutar la app en la línea de comandos a través del argumento -mongobd (cuyos valores pueden ser LOCAL o CLOUD). Si no se especifica este argumento se toma el valor por defecto que es CLOUD
    


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






