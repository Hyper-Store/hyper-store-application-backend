
import { Injectable, Scope } from '@nestjs/common';
import { Socket  } from 'socket.io';

export interface UserSocket extends Socket {
    userId: string
}


@Injectable({ scope: Scope.DEFAULT })
export class WebsocketConnectionsService {

    private clients = new Map<string, Map<string, UserSocket> >();

    
    addClient(client: UserSocket) {
        if(!this.clients.has(client.userId)) {
            this.clients.set(client.userId, new Map())
        }
        this.clients.get(client.userId).set(client.id, client)
    }

    removeClient(client: UserSocket) {
        if(!this.clients.has(client.userId)) return
        this.clients.get(client.userId).delete(client.id)
        if(this.clients.get(client.userId).size === 0) this.clients.delete(client.userId)
    }

    removeAllClients(userId: string) {
        if(!this.clients.has(userId)) return
        for(const client of this.clients.get(userId).values()) {
            client.disconnect()
        }
        this.clients.delete(userId)
    }

    getClients(userId: string): UserSocket[] {
        if(!this.clients.has(userId)) return []
        return Array.from(this.clients.get(userId).values())
    }

    getClient(userId: string, clientId: string): UserSocket | null {
        if(!this.clients.has(userId)) return null
        return this.clients.get(userId).get(clientId) ?? null
    }

    getPeopleConnectedCount(): number {
        return Array.from(this.clients.values()).reduce((acc, clients) => acc + clients.size, 0)
    }
}

