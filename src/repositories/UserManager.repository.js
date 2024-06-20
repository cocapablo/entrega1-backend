
class UserManagerRepository {
    #userManagerDAO;

    constructor(userManagarDAO) {
        this.#userManagerDAO = userManagarDAO;

        this.addUserAsync = this.addUserAsync.bind(this);
        this.loginAsync = this.loginAsync.bind(this);
        this.changePasswordAsync = this.changePasswordAsync.bind(this);
        this.getUserAsync = this.getUserAsync.bind(this);
        this.getUserByIdAsync = this.getUserByIdAsync.bind(this);
        this.getUsuarioDeCarritoAsync = this.getUsuarioDeCarritoAsync.bind(this);
        this.intercambiarPremiumYUsuario = this.intercambiarPremiumYUsuario.bind(this);
        this.deleteUserAsync = this.deleteUserAsync.bind(this);
        this.deleteUserByEmailAsync = this.deleteUserByEmailAsync.bind(this);
        this.setProfileDeUsuarioAsync = this.setProfileDeUsuarioAsync.bind(this);
        this.addDocumentosDeUsuarioAsync = this.addDocumentosDeUsuarioAsync.bind(this);
        this.documentacionCompletaDeUsuario = this.documentacionCompletaDeUsuario.bind(this);
        this.logOutAsync = this.logOutAsync.bind(this);
    }

    //Metodos
    getCartManager() {
        return this.#userManagerDAO.getCartManager();
    }
    
    async addUserAsync(user) {
        return await this.#userManagerDAO.addUserAsync(user);
    }

    async loginAsync(email = "", password = "") {
        return await this.#userManagerDAO.loginAsync(email, password);
    }

    async changePasswordAsync(email = "", nuevoPassword = "") {
        return await this.#userManagerDAO.changePasswordAsync(email, nuevoPassword);    
    }

    
    async getUserAsync(email) {
        return await this.#userManagerDAO.getUserAsync(email);    
    }

    async getUserByIdAsync(idUsuario) {
        return await this.#userManagerDAO.getUserByIdAsync(idUsuario);   
    }

    async getUsuarioDeCarritoAsync(idCarrito) {
        return await this.#userManagerDAO.getUsuarioDeCarritoAsync(idCarrito);   
    }

    async intercambiarPremiumYUsuario(idUsuario) {
        return await this.#userManagerDAO.intercambiarPremiumYUsuario(idUsuario);
    }

    async deleteUserAsync(idUsuario) {
        return await this.#userManagerDAO.deleteUserAsync(idUsuario);
    }

    async deleteUserByEmailAsync(email) {
        return await this.#userManagerDAO.deleteUserByEmailAsync(email);
    }

    async setProfileDeUsuarioAsync(idUsuario, sURLArchivo) {
        return await this.#userManagerDAO.setProfileDeUsuarioAsync(idUsuario, sURLArchivo);
    }

    async addDocumentosDeUsuarioAsync(idUsuario, documentos) {
        return await this.#userManagerDAO.addDocumentosDeUsuarioAsync(idUsuario, documentos);
    }

    async documentacionCompletaDeUsuario(idUsuario) {
        return await this.#userManagerDAO.documentacionCompletaDeUsuario(idUsuario);
    }

    async logOutAsync(idUsuario) {
        return await this.#userManagerDAO.logOutAsync(idUsuario);
    }
}

export default UserManagerRepository;