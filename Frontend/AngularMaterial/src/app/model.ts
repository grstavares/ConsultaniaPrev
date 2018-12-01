export interface ACLPolicy {
    order: number;
    principal: string;
    resource: string[];
    action: string[];
    effect: string;
}

export interface SeguradoItemList {
    id: string;
    name: string;
    birthDate: string;
}

export interface Instituto {
    id: string;
    name: string;
    segurados: SeguradoItemList[];
    acl: ACLPolicy[];
}
