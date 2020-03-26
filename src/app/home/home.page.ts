import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { DataService } from '../services/data.service';
import { AuthFirebaseService } from '../Firebase-Services/firebase.Auth';
import { DatabaseServices } from '../Firebase-Services/firebase.Database';



@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  hasRegistered = true;

  registeredUsers;

  constructor(private navCtrl: NavController, private dataService: DataService,
    private authFirebaseService: AuthFirebaseService, private databaseFirebaseService: DatabaseServices) {
  }

  ionViewWillEnter() {

    this.loadPersons();
  }

  ngOnInit() {
  }

  loadPersons() {
    this.databaseFirebaseService
      .readItemByKey('/users/' + this.authFirebaseService.getCurrentUserId() + '/contacts', '').then((res) => {

        this.hasRegistered = Boolean(res && res.val());

        if (this.hasRegistered) {
          this.registeredUsers = res.val();
        }
        this.checkColorAndMessage();
      });
  }

  checkColorAndMessage() {
    for (var key in this.registeredUsers) {
      var contactValue = this.registeredUsers[key];
      if (contactValue.challenges) {
        const missionsToday = this.getMissionsToday(contactValue.challenges);
        if (missionsToday === 0) {
          const daysAgoMissions = this.getLastUpdateChallenge(contactValue.challenges);
          if (daysAgoMissions < 3) {
            contactValue.mission = "Você fez " + missionsToday.toString() + " missões hoje.";
            contactValue.mission_label_color = "dark";
            contactValue.mission_color = "dark";
          }
          else {
            contactValue.mission = daysAgoMissions.toString() + "Dias sem missão.";
            contactValue.mission_label_color = "red";
            contactValue.mission_color = "red";
          }
        }
        else {
          contactValue.mission = "Você fez " + missionsToday.toString() + " missões hoje.";
          contactValue.mission_label_color = "dark";
          contactValue.mission_color = "dark";
        }
      }
      else {
        contactValue.mission = "Realize sua primeira missão";
        contactValue.mission_label_color = "dark";
        contactValue.mission_color = "dark";
      }
    }

  }
  getLastUpdateChallenge(challenges) {
    var mostRecentChallenge = challenges.sort((challenge1, challenge2) => {
      if (!challenge1.lastChange) {
        return -1;
      }
      else {
        const chaDate1 = new Date(challenge1.lastChange);
        const chaDate2 = new Date(challenge2.lastChange);
        return chaDate1.getTime() - chaDate2.getTime();
      }
    })[challenges.length - 1];
    var daysInMiliseconds = new Date().getTime() - new Date(mostRecentChallenge.lastChange).getTime();
    var days = Math.floor(daysInMiliseconds / (1000 * 3600 * 24));
    return days;

  }
  getMissionsToday(challenges) {
    const date = new Date();
    return challenges.filter(challenge => challenge.lastChange &&
      (new Date(challenge.lastChange).getDate() === date.getDate() &&
        new Date(challenge.lastChange).getMonth() === date.getMonth() &&
        new Date(challenge.lastChange).getFullYear() === date.getFullYear())).length;
  }

  openDetail(id) {
    console.log("Opening ... " + id)
    this.dataService.setData(id, id);
    let str = 'details/' + id;
    this.navCtrl.setDirection('forward');
    this.navCtrl.navigateForward(str);
  }

  addPerson() {
    this.navCtrl.setDirection('forward');
    this.navCtrl.navigateForward('/home/register');
  }

  logout() {
    this.authFirebaseService.doSignOutEmail();
  }

}
