class TicketManagerRepository {
    #ticketManagerDAO;

    constructor(ticketManagarDAO) {
        this.#ticketManagerDAO = ticketManagarDAO;

        this.addTicketAsync = this.addTicketAsync.bind(this);
    }

    //Metodos
    async addTicketAsync(datosTicket) {
        return await this.#ticketManagerDAO.addTicketAsync(datosTicket);
    }   
    

    
}

export default TicketManagerRepository;