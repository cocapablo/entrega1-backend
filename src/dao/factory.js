import { chatManager } from "../app.js";
import config from "../config/config.js";
import logger from "../services/logs/logger.js";

export let UserManager;
export let ProductManager;
export let CarritoManager;
export let TicketManager;
export let ChatManager;

//console.log("Estoy acá");

switch (config.persistence) {
    case "MONGO":
        //DAOs de Mongo
        //UserManager
        const {default: UserManagerMongo} = await import("../dao/mongo/UserManagerMongo.js");
        UserManager = UserManagerMongo;

        //ProductManager
        const {default: ProductManagerMongo} = await import("../dao/mongo/ProductManagerMongo.js");
        ProductManager = ProductManagerMongo;

        //CarritoManager
        const {default: CarritoManagerMongo} = await import("../dao/mongo/CarritoManagerMongo.js");
        CarritoManager = CarritoManagerMongo;
        //console.log("CarritoManager: ", CarritoManager);

        //TicketManager
        const {default: TicketManagerMongo} = await import("../dao/mongo/TicketManagerMongo.js");
        TicketManager = TicketManagerMongo;
        

        //chatManager
        const {default: ChatManagerMongo} = await import("../dao/mongo/ChatManagerMongo.js");
        ChatManager = ChatManagerMongo;

        break;
    default:
        //DAOs de Mongo
        //UserManager
        const {default: UserManagerMongo2} = await import("../dao/mongo/UserManagerMongo.js");
        UserManager = UserManagerMongo2;

        //ProductManager
        const {default: ProductManagerMongo2} = await import("../dao/mongo/ProductManagerMongo.js");
        ProductManager = ProductManagerMongo2;
        

        //CarritoManager
        const {default: CarritoManagerMongo2} = await import("../dao/mongo/CarritoManagerMongo.js");
        CarritoManager = CarritoManagerMongo2;
        

        //TicketManager
        const {default: TicketManagerMongo2} = await import("../dao/mongo/TicketManagerMongo.js");
        TicketManager = TicketManagerMongo2;
        

        //chatManager
        const {default: ChatManagerMongo2} = await import("../dao/mongo/ChatManagerMongo.js");
        ChatManager = ChatManagerMongo2;
        break;
    
}

const DAO = {
    userManager : UserManager,
    productManager : ProductManager,
    cartManager : CarritoManager,
    ticketManager : TicketManager,
    chatManager : ChatManager
};

//console.log("DAO", DAO);
//logger.debug("DAO: "  + JSON.stringify(DAO));

export default DAO;

//NOTA: Falta implementar la persistencia en FILE. Mo lo hice todavía porque tendría que crear métodos adicionales en las clases corrrspondientes