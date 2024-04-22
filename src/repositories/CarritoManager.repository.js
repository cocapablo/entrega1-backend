class CarritoManagerRepository {
    #cartManagerDAO;

    constructor(cartManagarDAO) {
        this.#cartManagerDAO = cartManagarDAO;

        this.getCarritosAsync = this.getCarritosAsync.bind(this);
        this.getProductsDeCarritoByIdAsync = this.getProductsDeCarritoByIdAsync.bind(this);
        this.getCarritoByIdAsync = this.getCarritoByIdAsync.bind(this);
        this.getProductDeCarritoAsync = this.getProductDeCarritoAsync.bind(this);
        this.addCarritoAsync = this.addCarritoAsync.bind(this);
        this.addProductToCarritoAsync = this.addProductToCarritoAsync.bind(this);
        this.setProductsToCarritoAsync = this.setProductsToCarritoAsync.bind(this);
        this.deleteProductDeCarrito = this.deleteProductDeCarrito.bind(this);
        this.setProductToCarritoAsync = this.setProductToCarritoAsync.bind(this);
        this.getCarritoWithProductsByIdAsync = this.getCarritoWithProductsByIdAsync.bind(this);
        this.getCarritosWithProductsByIdAsync = this.getCarritosWithProductsByIdAsync.bind(this);
        this.deleteCarritoAsync = this.deleteCarritoAsync.bind(this);
    }

    //Metodos
       
    async getCarritosAsync() {

        return await this.#cartManagerDAO.getCarritosAsync();
    }

    async getProductsDeCarritoByIdAsync(idCarrito) {
        return await this.#cartManagerDAO.getProductsDeCarritoByIdAsync(idCarrito);

    }

    async getCarritoByIdAsync(idCarrito) {
        return await this.#cartManagerDAO.getCarritoByIdAsync(idCarrito);

    }

    async getProductDeCarritoAsync(idCarrito, idProducto) {
        return await this.#cartManagerDAO.getProductDeCarritoAsync(idCarrito, idProducto);

    }

    async addCarritoAsync() {
        return await this.#cartManagerDAO.addCarritoAsync();

    }

    async addProductToCarritoAsync(idCarrito, idProducto, cantidad = 1) {
        return await this.#cartManagerDAO.addProductToCarritoAsync(idCarrito, idProducto, cantidad);

    }

    async setProductsToCarritoAsync(idCarrito, productos = []) {
        return await this.#cartManagerDAO.setProductsToCarritoAsync(idCarrito, productos);  
    }

    async deleteProductDeCarrito(idCarrito, idProducto) {
        return await this.#cartManagerDAO.deleteProductDeCarrito(idCarrito, idProducto);
        
    }

    async setProductToCarritoAsync(idCarrito, idProducto, cantidad = 1) {
        return await this.#cartManagerDAO.setProductToCarritoAsync(idCarrito, idProducto, cantidad);

    }

    async getCarritoWithProductsByIdAsync(idCarrito) {
        return await this.#cartManagerDAO.getCarritoWithProductsByIdAsync(idCarrito);
    
    }

    async getCarritosWithProductsByIdAsync() {
        
        return await this.#cartManagerDAO.getCarritosWithProductsByIdAsync();
    }

    async deleteCarritoAsync(idCarrito) {
        return await this.#cartManagerDAO.deleteCarritoAsync(idCarrito);
    }
}

export default CarritoManagerRepository;