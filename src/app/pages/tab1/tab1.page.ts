import { Component, inject } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonSegment, IonSegmentButton, IonLabel, IonSegmentView, IonSegmentContent, IonGrid, IonRow, IonCol, IonCard, IonCardHeader, IonCardSubtitle, IonCardTitle, IonImg, IonButtons, IonButton, IonIcon } from '@ionic/angular/standalone';
import { CouponService } from '../../services/coupon';
import { Coupon, ICouponData } from '../../models/coupon.model';
import { FilterCouponCategoryPipe } from '../../pipes/filter-coupon-category-pipe';
import { NgTemplateOutlet } from '@angular/common';
import { addIcons } from 'ionicons';
import { camera } from 'ionicons/icons';
import { CapacitorBarcodeScanner } from '@capacitor/barcode-scanner';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonSegment, IonSegmentButton, IonLabel, IonSegmentView, IonSegmentContent, IonGrid, IonRow, IonCol, IonCard, IonCardHeader, IonCardSubtitle, IonCardTitle, IonImg, IonButtons, IonButton, IonIcon, FilterCouponCategoryPipe, NgTemplateOutlet],
})
export class Tab1Page {
  private couponService: CouponService = inject(CouponService);
  private toastService: ToastService = inject(ToastService);

  coupons: Coupon[] = [];

  constructor() {
    addIcons({ camera });
  }

  async ionViewWillEnter() {
    this.coupons = await this.couponService.getCoupons();
  }

  changeActive(coupon: Coupon) {
    coupon.active = !coupon.active;
    this.couponService.saveCoupons(this.coupons);
  }

  async startCamera() {
    try {
      // Iniciar el escaneo de código de barras/QR
      const resultBarCode = await CapacitorBarcodeScanner.scanBarcode({
        hint: 1, // 1 = QR_CODE
      });
      
      // Validar que la lectura tenga un ScanResult
      if (!resultBarCode.ScanResult) {
        await this.toastService.showToast('No se obtuvo resultado del escaneo', 3000);
        return;
      }

      // Deserializar la lectura obtenida
      let couponData: ICouponData;
      try {
        couponData = JSON.parse(resultBarCode.ScanResult) as ICouponData;
      } catch (parseError) {
        await this.toastService.showToast('El código escaneado no es un cupón válido', 3000);
        return;
      }

      // Crear una instancia de Coupon
      const newCoupon = new Coupon(couponData);

      // Validar que el cupón tenga los campos correctos
      if (!newCoupon.isValid()) {
        await this.toastService.showToast('El cupón no tiene los campos correctos', 3000);
        return;
      }

      // Validar que el cupón no exista previamente
      const existeCoupon = this.coupons.find(coupon => coupon.isEqual(newCoupon));
      if (existeCoupon) {
        await this.toastService.showToast('El cupón ya existe en la lista', 3000);
        return;
      }

      // Actualizar la vista de cupones (concepto de objetos inmutables)
      this.coupons = [...this.coupons, newCoupon];
      
      // Guardar los cupones actualizados
      await this.couponService.saveCoupons(this.coupons);
      
      await this.toastService.showToast('Cupón agregado exitosamente', 2000);
    } catch (error) {
      await this.toastService.showToast('Error al escanear', 3000);
    }
  }
}
