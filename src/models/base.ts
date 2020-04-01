export abstract class Base {
  attrs: any = { id: null }
  isDeleted: boolean = false

  constructor() {

  }


  public get id(): number {
    return this.attrs.id
  }

}
