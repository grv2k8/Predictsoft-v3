import { Component, OnInit, HostBinding } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { AngularFireDatabase, AngularFireList, AngularFireObject } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import { Observable } from 'rxjs/Observable';
import * as firebase from 'firebase/app';
import { Router } from '@angular/router'; 
import { moveIn } from '../router.animations'; 
import { AuthService } from '../shared/auth/auth.service';
import { FormGroup, FormBuilder } from '@angular/forms';

import { routes } from '../app.routes';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  animations: [moveIn()],
  host: {'[@moveIn]' : ''}
})
export class LoginComponent implements OnInit {

 
  state: string = ''; 
  error: any; 
  name: string = ''; 
  email: string = ''; 
  uid: string = ''; 

  constructor(private afAuth: AngularFireAuth, 
    private authService: AuthService, 
    public router: Router
    ){
    
    this.afAuth.authState.subscribe(auth => {
      if(auth){
        console.log("from component"); 
        this.router.navigateByUrl('/login'); 
      }
    })
    
    
  }

  loginwithGoogle()
  {
    this.afAuth.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider())
    .then(
      (success) => {
        console.log(success); 
        this.router.navigate(['/login'])
      }
    ).catch(
      (err) => {
        console.log(err.message); 
        this.error = err.message; 
      }
    )

  }

  ngOnInit() {
  }

}
