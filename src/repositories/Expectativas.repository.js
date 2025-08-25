
class ExpectativasManagerRepository {
    #expectativasManagerDAO;
    
    constructor(expectativasManagerDAO) {
        this.#expectativasManagerDAO = expectativasManagerDAO;

        this.getExpectativasAsync = this.getExpectativasAsync.bind(this);
        this.addExpectativaAsync = this.addExpectativaAsync.bind(this);
        this.updateExpectativaAsync = this.updateExpectativaAsync.bind(this);
        this.deleteExpectativaAsync = this.deleteExpectativaAsync.bind(this);
        this.getExpectativaByIdAsync = this.getExpectativaByIdAsync.bind(this);
        
    }

    async getExpectativasAsync() {
        return await this.#expectativasManagerDAO.getExpectativasAsync();
    }

    async addExpectativaAsync(expectativa) {
        return await this.#expectativasManagerDAO.addExpectativaAsync(expectativa);

    }

    async updateExpectativaAsync(expectativaActualizada) {
        return await this.#expectativasManagerDAO.updateExpectativaAsync(expectativaActualizada);
    }

    async deleteExpectativaAsync(idExpectativa) {
        return await this.#expectativasManagerDAO.deleteExpectativaAsync(idExpectativa);
    }

    async getExpectativaByIdAsync(idExpectativa) {
        return await this.#expectativasManagerDAO.getExpectativaByIdAsync(idExpectativa);
    }

    
}

export default ExpectativasManagerRepository;