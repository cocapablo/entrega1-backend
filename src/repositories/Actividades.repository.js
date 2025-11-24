class ActividadesManagerRepository {
    #actividadesManagerDAO;
    
    constructor(actividadesManagerDAO) {
        this.#actividadesManagerDAO = actividadesManagerDAO;

        this.getActividadesAsync = this.getActividadesAsync.bind(this);
        this.addActividadAsync = this.addActividadAsync.bind(this);
        this.updateActividadAsync = this.updateActividadAsync.bind(this);
        this.deleteActividadAsync = this.deleteActividadAsync.bind(this);
        this.getActividadByIdAsync = this.getActividadByIdAsync.bind(this);
        
    }

    async getActividadesAsync() {
        return await this.#actividadesManagerDAO.getActividadesAsync();
    }

    async addActividadAsync(actividad) {
        return await this.#actividadesManagerDAO.addActividadAsync(actividad);

    }

    async updateActividadAsync(actividadActualizada) {
        return await this.#actividadesManagerDAO.updateActividadAsync(actividadActualizada);
    }

    async deleteActividadAsync(idActividad) {
        return await this.#actividadesManagerDAO.deleteActividadAsync(idActividad);
    }

    async getActividadByIdAsync(idActividad) {
        return await this.#actividadesManagerDAO.getActividadByIdAsync(idActividad);
    }

    
}

export default ActividadesManagerRepository;