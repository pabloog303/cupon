import { Component, inject } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonGrid, IonRow, IonCol, IonText } from '@ionic/angular/standalone';
import { Platform } from '@ionic/angular/standalone';
import { QRCodeComponent } from 'angularx-qrcode';
import { CouponService } from '../../services/coupon';
import { Coupon } from '../../models/coupon.model';
import { ScreenBrightness, GetBrightnessReturnValue } from '@capacitor-community/screen-brightness';
import { App } from '@capacitor/app';
import type { PluginListenerHandle } from '@capacitor/core';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonGrid, IonRow, IonCol, IonText, QRCodeComponent]
})
export class Tab2Page {
  private couponService: CouponService = inject(CouponService);
  private platform: Platform = inject(Platform);

  QRCode!: string;
  currentBrightness: number = 0;
  appStateChangeListener!: PluginListenerHandle;

  constructor() {}

  async ionViewWillEnter() {
    const coupons: Coupon[] = await this.couponService.getCoupons();

    const couponsActive: Coupon[] = coupons.filter((coupon: Coupon) => coupon.active);

    this.QRCode = couponsActive.length > 0 ? JSON.stringify(couponsActive) : '';

    if (!this.platform.is('desktop')) {
      const brightness: GetBrightnessReturnValue = await ScreenBrightness.getBrightness();
      this.currentBrightness = brightness.brightness;
      await this.setMaxBrightness();

      // Configurar listener para cambios de estado de la app
      this.appStateChangeListener = await App.addListener('appStateChange', async (state) => {
        if (state.isActive) {
          // App vuelve a primer plano
          await this.setMaxBrightness();
        } else {
          // App pasa a segundo plano
          await this.restoreBrightness();
        }
      });
    }
  }

  async ionViewDidLeave() {
    if (!this.platform.is('desktop')) {
      await this.restoreBrightness();
      
      // Eliminar el listener cuando se sale de la vista
      if (this.appStateChangeListener) {
        await this.appStateChangeListener.remove();
      }
    }
  }

  async setMaxBrightness() {
    await ScreenBrightness.setBrightness({ brightness: 1 });
  }

  async restoreBrightness() {
    await ScreenBrightness.setBrightness({ brightness: this.currentBrightness });
  }

}
