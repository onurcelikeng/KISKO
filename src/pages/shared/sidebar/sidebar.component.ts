import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

//services
import { AccountService } from '../../../services/AccountService/account.service';

declare var swal: any;

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
  providers: [AccountService]  
})
export class SidebarComponent implements OnInit {
  currentRole: string;
  userRoles: any = [];


  constructor(private accountService: AccountService, 
    private router: Router) { }


  ngOnInit(): void {
    this.currentRole = sessionStorage.getItem('currentRole');
    this.getUserRoles();
  }

  getUserRoles(): void {
    this.accountService.getMe().subscribe(data => {
      if(data) {
        if(data.returncode == 0) {
          for(let role of data.userinfo[0].roles) {
            if(role.rolenames != "hasta") {
              this.userRoles.push(role);
            }
          }
        }
      }
    });
  }

  changeRole(currentRole): void {
    this.accountService.switchRole(currentRole).subscribe(data => {
      if(data) {
        sessionStorage.setItem('currentRole', currentRole);
        
        if (currentRole == 'admin') {
          sessionStorage.setItem('color', 'skin-red'); 
          sessionStorage.setItem('boxColor', 'box-danger');           
          //this.router.navigate(['main/users']);              
        } if (currentRole == 'doktor') {
          sessionStorage.setItem('color', 'skin-blue'); 
          sessionStorage.setItem('boxColor', 'box-primary');                             
          //this.router.navigate(['main/patients']);              
        } if (currentRole == 'sekreter') {
          sessionStorage.setItem('color', 'skin-green'); 
          sessionStorage.setItem('boxColor', 'box-success');                                               
          //this.router.navigate(['main/patients']);              
        } if (currentRole == 'lab') {
          sessionStorage.setItem('color', 'skin-yellow');
          sessionStorage.setItem('boxColor', 'box-warning');                              
          //this.router.navigate(['main/labrequests']);              
        }
        
        window.location.reload();
      }
    });
  }

  async logout() {
    this.accountService.logout().subscribe(data => {
      if(data) {
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('nameSurname');
        sessionStorage.removeItem('tc');
        sessionStorage.removeItem('email');
        sessionStorage.removeItem('photo');
        sessionStorage.removeItem('currentRole');
        sessionStorage.removeItem('color');      
        sessionStorage.removeItem('boxColor'); 
        sessionStorage.removeItem('currentDoctorTc');      
        sessionStorage.removeItem('currentDoctorInfo'); 

        this.router.navigateByUrl("login");
      }
    });
  }

  async cikis() {
    const result = await swal({
    title: '',
    text: "Çıkış yapmak istediğinize emin misiniz?",
    type: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#DD6B55',
    confirmButtonText: 'Evet',
    cancelButtonText: 'Hayır'
    })

    if(result) {
      try {
        await this.logout();
      } catch (err){
      }
    }

  }
  
}
