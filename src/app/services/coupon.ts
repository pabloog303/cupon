import { Injectable } from '@angular/core';
import { Coupon, ICouponData } from '../models/coupon.model';
import { Preferences } from '@capacitor/preferences';

@Injectable({
  providedIn: 'root',
})
export class CouponService {
  private readonly DDR_KEY: string = "ddr_key_coupons";

  constructor() { }

  async recoverCoupons() {
    const couponsPreferences = await Preferences.get({ key: this.DDR_KEY });
    if (couponsPreferences.value) {
      return JSON.parse(couponsPreferences.value) as ICouponData[];
    }
    return null;
  }

  async getCoupons() {
    const couponsData: ICouponData[] | null = await this.recoverCoupons();

    if (couponsData) {
      return this.processCoupons(couponsData);
    }

    return fetch('./assets/data/coupons.json')
      .then(async (res: Response) => {
        const couponData: ICouponData[] = await res.json();
        const coupons: Coupon[] = this.processCoupons(couponData);
        coupons.forEach(coupon => coupon.active = false);
        return coupons;
      })
      .catch(err => {
        return [];
      });
  }

  processCoupons(couponsData: ICouponData[]): Coupon[] {
    const coupons: Coupon[] = [];

    for (const couponData of couponsData) {
      const coupon = new Coupon(couponData);
      coupons.push(coupon);
    }

    return coupons;
  }

  saveCoupons(coupons: Coupon[]) {
    const couponsData: ICouponData[] = coupons
      .map((coupon: Coupon) => coupon.toCouponData());

    Preferences.set({
      key: this.DDR_KEY,
      value: JSON.stringify(couponsData)
    });
  }
}
