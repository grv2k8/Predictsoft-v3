import { Component, OnInit, HostBinding } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import { Observable } from 'rxjs/Observable';
import * as firebase from 'firebase/app';
import { Router } from '@angular/router'; 
import { moveIn, fallIn } from '../router.animations'; 


@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'], 
  animations: [moveIn(), fallIn()],
  host: {'[@moveIn]' : ''}
})
export class SignupComponent implements OnInit {

  state: string = ''; 
  error: any; 

  constructor(public afAuth: AngularFireAuth, db: AngularFirestore) {
    
  }

  ngOnInit() {
  }

}
