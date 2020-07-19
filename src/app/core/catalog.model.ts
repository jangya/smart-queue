//TODO move to interface
export class Catalog {
    
    // public constructor(init?: Partial<Catalog>) {
    //     Object.assign(this, init);
    // }
   
    id: string;
    benId: number;
    name: string;
    token: number;
    status: Status;
    treatedBy: string;
    createdBy: string;
    createdAt: Date;
    updatedAt: Date;
}

export enum Status {
    Open = 'OPEN',
    Progress = 'PROGRESS',
    Resolved = 'RESOLVED'
  }
