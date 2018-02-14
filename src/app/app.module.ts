import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA  } from '@angular/core';
import { FormsModule }   from '@angular/forms';
import { HttpModule }   from '@angular/http';
import { RouterModule } from '@angular/router';
import { AngularFireModule } from 'angularfire2';

import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFireDatabaseModule } from 'angularfire2/database';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { EmailComponent } from './email/email.component';
import { SignupComponent } from './signup/signup.component';


import { routes } from './app.routes';
import { AuthService } from './shared/auth/auth.service';


export const firebaseConfig = {
  apiKey: "AIzaSyApkjxV7rQcRm8cQpn35pxA0SRPLyFWBcc",
  authDomain: "loginforpsoft.firebaseapp.com",
  databaseURL: "https://loginforpsoft.firebaseio.com",
  projectId: "loginforpsoft",
  storageBucket: "loginforpsoft.appspot.com",
  messagingSenderId: "583696956085"

}


@NgModule({
  declarations: [
    AppComponent, 
    LoginComponent
  ],
  imports: [
    BrowserModule, 
    HttpModule, 
    FormsModule, 
    AngularFireModule.initializeApp(firebaseConfig),   
    AngularFireAuthModule,
    AngularFireDatabaseModule,
    routes

  ],
  
  providers: [ AuthService],
  bootstrap: [AppComponent]
})
export class AppModule { }
