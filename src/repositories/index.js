import { UserManager } from "../dao/factory.js";
import { ProductManager } from "../dao/factory.js";
import { CarritoManager } from "../dao/factory.js";
import { TicketManager } from "../dao/factory.js";
import { ChatManager } from "../dao/factory.js"; 

import DAO from "../dao/factory.js";

import { socketServer } from "../app.js";

import UserManagerRepository from "./UserManager.repository.js";
import ProductManagerRepository from "./ProductManager.repository.js";
import CarritoManagerRepository from "./CarritoManager.repository.js";
import TicketManagerRepository from "./TicketManager.repository.js";

const path = "" //Esto debería traerse de algún lado

//DAOS
const productsManagerDAO = new ProductManager(path); 
const carritoManagerDAO = new CarritoManager(path, productsManagerDAO);
const ticketManagerDAO = new TicketManager();
const userManagerDAO = new UserManager(carritoManagerDAO);
//const chatManagerDAO = new ChatManager(socketServer);

//Services
//UserManager
export const userService = new UserManagerRepository(userManagerDAO);

//ProductManager
export const productService = new ProductManagerRepository(productsManagerDAO);

//CarritoManager
export const cartService = new CarritoManagerRepository(carritoManagerDAO);

//TicketManager
export const ticketService = new TicketManagerRepository(ticketManagerDAO);