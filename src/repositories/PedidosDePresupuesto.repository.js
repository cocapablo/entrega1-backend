
class PedidosDePresupuestoManagerRepository {
    #pedidosDePresupuestoManagerDAO;
    
    constructor(pedidosDePresupuestoManagerDAO) {
        this.#pedidosDePresupuestoManagerDAO = pedidosDePresupuestoManagerDAO;

        this.getPedidosDePresupuestoAsync = this.getPedidosDePresupuestoAsync.bind(this);
        this.addPedidoDePresupuestoAsync = this.addPedidoDePresupuestoAsync.bind(this);
    }

    async getPedidosDePresupuestoAsync() {
        return await this.#pedidosDePresupuestoManagerDAO.getPedidosDePresupuestoAsync();
    }

    async addPedidoDePresupuestoAsync(pedido) {
        return await this.#pedidosDePresupuestoManagerDAO.addPedidoDePresupuestoAsync(pedido);

    }

    
}

export default PedidosDePresupuestoManagerRepository;