const path = require('path');
const fs = require('fs');

class Ticket {
    constructor(numero, escritorio) {
        this.numero = numero;
        this.escritorio = escritorio;
    }
}

class TicketControl {
    constructor() {
        this.ultimo = 0;
        this.hoy = new Date().getDay();
        this.tickets = [];
        this.utlimos4 = [];

        this.init();
    }
    
    init() {
        const { hoy, tickets, ultimo, utlimos4 } = require('../db/data.json')
        if (hoy === this.hoy) {
            this.tickets = tickets;
            this.ultimo = ultimo;
            this.utlimos4 = utlimos4;
        } else {
            this.guardarDB();
        }
    }

    get toJson() {
        return {
            ultimo: this.ultimo,
            hoy: this.hoy,
            tickets: this.tickets,
            utlimos4: this.utlimos4
        }
    }

    guardarDB() {
        const dbPath = path.join(__dirname, '../db/data.json')
        fs.writeFileSync(dbPath, JSON.stringify(this.toJson))
    }

    siguiente() {
        this.ultimo += 1;
        const ticket = new Ticket(this.ultimo, null);
        this.tickets.push(ticket);
        this.guardarDB();
        return 'Ticket ' + ticket.numero;
    }

    atenderTicket(escritorio) {

        if (this.tickets.length === 0) return null;

        const ticket = this.tickets.shift();
        
        ticket.escritorio = escritorio;
        
        this.utlimos4.unshift(ticket)
        
        if (this.utlimos4.length > 4) {
            this.utlimos4.splice(-1, 1);
        }

        this.guardarDB();
        return ticket;
    }
}

module.exports = TicketControl;