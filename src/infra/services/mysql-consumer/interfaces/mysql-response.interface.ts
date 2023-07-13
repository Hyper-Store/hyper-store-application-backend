export type MysqlRecord = {
    after: any
    before: any
}

export type MysqlResponseInterface = {
    type: "INSERT" | "UPDATE" | "DELETE";
    schema: string
    table: string
    affectedRows: MysqlRecord[]
}