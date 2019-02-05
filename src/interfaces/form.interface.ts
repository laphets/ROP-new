export interface IChoice {
    tag?: number;
    text?: string;
    next?: number;
}

export interface INode {
    tag?: number;
    text?: string;
    type?: string; // TODO
    spec?: string; // TODO
    re?: string;
    required?: boolean;
    next?: number;
    available_cnt?: number;
    default_jump?: boolean;
    choices?: IChoice[];
}

export interface IForm {
    name: string;
    data: INode[];
}

export interface RawForm {
    ID?: number;
    name: string;
    data: string;
    CreatedAt?: string;
    UpdatedAt?: string;
    DeletedAt?: string;
    root_tag?: number;
    editable?: boolean;
}
