import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { StorageService } from '../services/storage.service';

@Component({
  selector: 'app-index',
  templateUrl: './index.page.html',
  styleUrls: ['./index.page.scss'],
})
export class IndexPage implements OnInit {

  constructor(private storage: StorageService, private navCtrl: NavController) { }

  ionViewWillEnter() {
    this.storage.isSeenSlides().then((val) => {
      if (val) {
        this.navCtrl.navigateForward('/login-email');
      }
    });
  }

  ngOnInit() {
    
  }

}
