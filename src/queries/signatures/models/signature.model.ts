
export interface SignatureModel  {
    id: string
    userId: string
    serviceId: string
    expirationDate: Date
    quantityPerDay: number
    service: {
        id: string
        name: string
    }
}