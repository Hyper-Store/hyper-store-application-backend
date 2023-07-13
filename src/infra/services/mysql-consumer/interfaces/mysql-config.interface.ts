export type MysqlConfigInterface = {
    name: string
    dbUrl: string
    tableName: string
    statement: "INSERT" | "UPDATE" | "DELETE"
}