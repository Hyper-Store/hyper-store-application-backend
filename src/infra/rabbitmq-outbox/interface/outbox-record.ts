export type OutboxRecord = {
    id: string
    eventName: string
    eventSchemaData: string
    topic: string
    retry_count: number
    error_message: string
    payload: any
}