import { randomUUID } from "crypto";

export abstract class BaseEntity<EntityProps> {
    private _id: string
    private _createdAt: Date
    private _updatedAt?: Date;
    protected props: EntityProps;

    constructor(props: EntityProps, id?: string, createdAt?: Date, updatedAt?: Date) {
        this._id = id || randomUUID()
        this.props = props
        this._createdAt = createdAt || new Date()
        this._updatedAt = updatedAt
    }

    get id(): string {
        return this._id
    }

    get createdAt(): Date {
        return this._createdAt
    }

    get updatedAt(): Date | undefined {
        return this._updatedAt;
    }

    abstract toJSON(): Record<string, unknown>

}