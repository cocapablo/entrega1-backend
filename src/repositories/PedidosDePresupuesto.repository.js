
class PedidosDePresupuestoManagerRepository {
    #pedidosDePresupuestoManagerManagerDAO;
    
    constructor(pedidosDePresupuestoManagerManagerDAO) {
        this.#pedidosDePresupuestoManagerManagerDAO = pedidosDePresupuestoManagerManagerDAO;

        this.getPedidosDePresupuestoAsync = this.getPedidosDePresupuestoAsync.bind(this);
        this.addPedidoDePresupuestoAsync = this.addPedidoDePresupuestoAsync.bind(this);
    }

    async getPedidosDePresupuestoAsync() {
        return await this.#pedidosDePresupuestoManagerManagerDAO.getPedidosDePresupuestoAsync();
    }

    async addPedidoDePresupuestoAsync(pedido) {
        return await this.#pedidosDePresupuestoManagerManagerDAO.addPedidoDePresupuestoAsync(pedido);

    }

    
}

export default PedidosDePresupuestoManagerRepository;