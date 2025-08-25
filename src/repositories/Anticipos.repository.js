class AnticiposManagerRepository {
    #anticiposManagerDAO;
    
    constructor(anticiposManagerDAO) {
        this.#anticiposManagerDAO = anticiposManagerDAO;

        this.getAnticiposAsync = this.getAnticiposAsync.bind(this);
        this.addAnticipoAsync = this.addAnticipoAsync.bind(this);
        this.updateAnticipoAsync = this.updateAnticipoAsync.bind(this);
        this.deleteAnticipoAsync = this.deleteAnticipoAsync.bind(this);
        this.getAnticipoByIdAsync = this.getAnticipoByIdAsync.bind(this);
        
    }

    async getAnticiposAsync() {
        return await this.#anticiposManagerDAO.getAnticiposAsync();
    }

    async addAnticipoAsync(anticipo) {
        return await this.#anticiposManagerDAO.addAnticipoAsync(anticipo);

    }

    async updateAnticipoAsync(anticipoActualizado) {
        return await this.#anticiposManagerDAO.updateAnticipoAsync(anticipoActualizado);
    }

    async deleteAnticipoAsync(idAnticipo) {
        return await this.#anticiposManagerDAO.deleteAnticipoAsync(idAnticipo);
    }

    async getAnticipoByIdAsync(idAnticipo) {
        return await this.#anticiposManagerDAO.getAnticipoByIdAsync(idAnticipo);
    }

    
}

export default AnticiposManagerRepository;