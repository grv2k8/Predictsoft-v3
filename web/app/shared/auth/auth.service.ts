import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { Router } from '@angular/router';

import * as firebase from 'firebase/app';

@Injectable()
export class AuthService {

  state: string = ''; 
  error: any; 
  name: string = ''; 
  email: string = ''; 
  uid: string = ''; 

  constructor(private afAuth: AngularFireAuth, private router : Router) {
    this.afAuth.authState.subscribe(auth => {
      if(auth){        
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
        console.log(err); 
        this.error = err; 
      }
    )

  }

}
