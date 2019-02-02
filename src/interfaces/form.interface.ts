export interface INode {
    tag?: number;
    text?: string;
    type?: string; // TODO
    spec?: string; // TODO
    re?: string;
    required?: boolean;
    next?: number;
}

export interface IForm {
    name?: string;
    data?: INode[];
}
