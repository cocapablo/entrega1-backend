class OpinionesManagerRepository {
    #opinionesManagerDAO;
    
    constructor(opinionesManagerDAO) {
        this.#opinionesManagerDAO = opinionesManagerDAO;

        this.getOpinionesAsync = this.getOpinionesAsync.bind(this);
        this.addOpinionAsync = this.addOpinionAsync.bind(this);
        this.updateOpinionAsync = this.updateOpinionAsync.bind(this);
        this.deleteOpinionAsync = this.deleteOpinionAsync.bind(this);
        this.getOpinionByIdAsync = this.getOpinionByIdAsync.bind(this);
        
    }

    async getOpinionesAsync() {
        return await this.#opinionesManagerDAO.getOpinionesAsync();
    }

    async addOpinionAsync(opinion) {
        return await this.#opinionesManagerDAO.addOpinionAsync(opinion);

    }

    async updateOpinionAsync(opinionActualizada) {
        return await this.#opinionesManagerDAO.updateOpinionAsync(opinionActualizada);
    }

    async deleteOpinionAsync(idOpinion) {
        return await this.#opinionesManagerDAO.deleteOpinionAsync(idOpinion);
    }

    async getOpinionByIdAsync(idOpinion) {
        return await this.#opinionesManagerDAO.getOpinionByIdAsync(idOpinion);
    }

    
}

export default OpinionesManagerRepository;