export class Column  {
    attribut!: string ;
    label!: string;
    visible?: boolean= true;
    link?:string;
    type?: 'text' | 'switch' = 'text';
}

export class SelectColumn extends Column{
    liste?:any[]=[];
    labelAfficher?:string;
    value?:string;
}