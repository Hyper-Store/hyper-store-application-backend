export abstract class BaseValueObject<ValueObjectProps> {
    protected props: ValueObjectProps;

    constructor(props: ValueObjectProps) {
        this.props = props
    }
    
}