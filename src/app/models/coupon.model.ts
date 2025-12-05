export interface ICouponData {
  idProduct: number;
  img: string;
  name: string;
  category: string;
  discount: number;
  active?: boolean;
}

export class Coupon {
  private _idProduct!: number;
  private _img!: string;
  private _name!: string;
  private _category!: string;
  private _discount!: number;
  private _active!: boolean;

  constructor(data: ICouponData) {
    Object.assign(this, data);
  }

  // Getters
  public get idProduct(): number {
    return this._idProduct;
  }

  public get img(): string {
    return this._img;
  }

  public get name(): string {
    return this._name;
  }

  public get category(): string {
    return this._category;
  }

  public get discount(): number {
    return this._discount;
  }

  public get active(): boolean {
    return this._active;
  }

  // Setters
  public set idProduct(value: number) {
    this._idProduct = value;
  }

  public set img(value: string) {
    this._img = value;
  }

  public set name(value: string) {
    this._name = value;
  }

  public set category(value: string) {
    this._category = value;
  }

  public set discount(value: number) {
    this._discount = value;
  }

  public set active(value: boolean) {
    this._active = value;
  }

  // Métodos de clase
  isEqual(coupon: Coupon): boolean {
    return this._idProduct === coupon._idProduct;
  }

  isValid(): boolean {
    return !!(this._idProduct && this._name && this._discount && this._category);
  }

  toCouponData(): ICouponData {
    return {
      idProduct: this._idProduct,
      img: this._img,
      name: this._name,
      category: this._category,
      discount: this._discount,
      active: this._active
    } as ICouponData;
  }
}
