import { chatManager } from "../app.js";
import config from "../config/config.js";
import logger from "../services/logs/logger.js";

export let UserManager;
export let ProductManager;
export let CarritoManager;
export let TicketManager;
export let ChatManager;

export let PedidosDePresupuestoManager;
export let ExpectativasManager;
export let AnticiposManager;

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

        //PedidosDePresupuestoManager
        const {default: PedidosDePresupuestoManagerMongo} = await import("../dao/mongo/PedidosDePresupuestoManagerMongo.js");
        PedidosDePresupuestoManager = PedidosDePresupuestoManagerMongo;

        //ExpectativasManager
        const {default: ExpectativasManagerMongo} = await import("../dao/mongo/ExpectativasManagerMongo.js");
        ExpectativasManager = ExpectativasManagerMongo;

        //AnticiposManager
        const {default: AnticiposManagerMongo} = await import("../dao/mongo/AnticiposManagerMongo.js");
        AnticiposManager = AnticiposManagerMongo;

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

        //PedidosDePresupuestoManager
        const {default: PedidosDePresupuestoManagerMongo2} = await import("../dao/mongo/PedidosDePresupuestoManagerMongo.js");
        PedidosDePresupuestoManager = PedidosDePresupuestoManagerMongo2;

        //ExpectativasManager
        const {default: ExpectativasManagerMongo2} = await import("../dao/mongo/ExpectativasManagerMongo.js");
        ExpectativasManager = ExpectativasManagerMongo2;
        
        //AnticiposManager
        const {default: AnticiposManagerMongo2} = await import("../dao/mongo/AnticiposManagerMongo.js");
        AnticiposManager = AnticiposManagerMongo2;
        break;


    
}

const DAO = {
    userManager : UserManager,
    productManager : ProductManager,
    cartManager : CarritoManager,
    ticketManager : TicketManager,
    chatManager : ChatManager,
    pedidosDePresupuestoManager : PedidosDePresupuestoManager,
    expectativasManager : ExpectativasManager,
    anticiposManager : AnticiposManager
    
};

//console.log("DAO", DAO);
//logger.debug("DAO: "  + JSON.stringify(DAO));

export default DAO;

//NOTA: Falta implementar la persistencia en FILE. Mo lo hice todavía porque tendría que crear métodos adicionales en las clases corrrspondientes