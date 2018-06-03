import { Component, OnInit, HostBinding } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { AngularFireDatabase, AngularFireList   } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import { Observable } from 'rxjs/Observable';
import * as firebase from 'firebase/app';
import { Router } from '@angular/router'; 
import { moveIn, fallIn } from '../router.animations'; 

@Component({
  selector: 'app-email',
  templateUrl: './email.component.html',
  styleUrls: ['./email.component.css'], 
  animations: [moveIn(), fallIn()],
  host: {'[@moveIn]' : ''}
})
export class EmailComponent implements OnInit {


  state: string = '';
    error: any;

    constructor(public af: AngularFireAuth,private router: Router) {
    this.af.authState.subscribe(auth => { 
      if(auth) {
        //this.router.navigateByUrl('/members');
      }
    });
  }


  onSubmit(formData) {
    if(formData.valid) {
      console.log(formData.value);
      // this.af.authState.({
      //   email: formData.value.email,
      //   password: formData.value.password
      // },
      // {
      //   provider: AuthProviders.Password,
      //   method: AuthMethods.Password,
      // }).then(
      //   (success) => {
      //   console.log(success);
      //   this.router.navigate(['/members']);
      // }).catch(
      //   (err) => {
      //   console.log(err);
      //   this.error = err;
      // })
    }
  }


  ngOnInit() {
  }

}
