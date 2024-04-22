
class ProductManagerRepository {
    #productManagerDAO;
    
    constructor(productManagerDAO) {
        this.#productManagerDAO = productManagerDAO;

        this.getProductsAsync = this.getProductsAsync.bind(this);
        this.getProductsByLimitAsync = this.getProductsByLimitAsync.bind(this);
        this.addProductAsync = this.addProductAsync.bind(this);
        this.updateProductAsync = this.updateProductAsync.bind(this);
        this.getProductByIdAsync = this.getProductByIdAsync.bind(this);
        this.deleteProductAsync = this.deleteProductAsync.bind(this);
        this.getProductsWithPaginationAsync = this.getProductsWithPaginationAsync.bind(this);
    }

    async getProductsAsync() {
        return await this.#productManagerDAO.getProductsAsync();
    }

    async getProductsByLimitAsync(limite) {
       return await this.#productManagerDAO.getProductsByLimitAsync(limite); 
    }

    async addProductAsync(product) {
        return await this.#productManagerDAO.addProductAsync(product);

    }

    async updateProductAsync(productoModificado) {
        return await this.#productManagerDAO.updateProductAsync(productoModificado);
    }

    async getProductByIdAsync(idProduct) {
        return await this.#productManagerDAO.getProductByIdAsync(idProduct);

    }

    async deleteProductAsync(idProduct) {
        return await this.#productManagerDAO.deleteProductAsync(idProduct);
     
    }

    async getProductsWithPaginationAsync(limit = 10, page = 1, query = {}, sort = "") {
        return await this.#productManagerDAO.getProductsWithPaginationAsync(limit, page, query, sort);
    }
}

export default ProductManagerRepository;