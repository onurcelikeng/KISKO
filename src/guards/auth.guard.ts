import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { Router } from '@angular/router';

@Injectable()
export class AuthGuard implements CanActivate {

   constructor(private router: Router) { }

   canActivate() {
    if (sessionStorage.getItem("token") != null) {
        return true;
    } else {
        this.router.navigateByUrl('login');
        return false;
    }
    }
}
