import { Pipe, PipeTransform } from '@angular/core';
import { Coupon } from '../models/coupon.model';

@Pipe({
  name: 'filterCouponCategory'
})
export class FilterCouponCategoryPipe implements PipeTransform {

  // Configuración de parámetros
  transform(coupons: Coupon[], category: string): Coupon[] {
    // Retorna un arreglo filtrado por categoría
    return coupons.filter(coupon => coupon.category === category);
  }

}
