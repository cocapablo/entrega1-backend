export class ImproConcertPedidoDePresupuestoDTO {
    constructor({nombre = "", mail ="", telefono ="", evento ="-", localidad = "-", invitados = 0, fecha_evento = "-", comentario = "-"}) {
        this.nombre = nombre;
        this.email = mail;
        this.telefono = telefono;
        this.tipodeevento = evento;
        this.localidad = localidad;
        this.pais = pais;
        this.cantidaddeinvitados = invitados;
        this.fecha = fecha_evento;
        this.comentario = comentario;  
    }    
}

