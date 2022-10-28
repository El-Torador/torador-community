import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { NzMessageService } from "ng-zorro-antd/message";
import { AuthenticationService } from '../../services/authentication.service';

class LoginFormModel {
  username = "";
  password = "";
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.less']
})
export class LoginComponent implements OnInit {
  @ViewChild(NgForm, { static: false })
  ngForm: NgForm;

  model = new LoginFormModel();
  loading = false;

  constructor(
    private router: Router,
    private authService: AuthenticationService,
    private nzMessageService: NzMessageService
  ) { }

  ngOnInit(): void {
  }

  goToRegistration() {
    this.router.navigateByUrl('splash/register');
  }

  submit() {
    this.login();
  }
  

  async login() {
    if (this.ngForm.form.invalid) {
      if(!this.model.username) return this.nzMessageService.warning("Veuillez fournir un nom d'utilisateur.");
      if(!this.model.password) return this.nzMessageService.warning('Veuillez fournir un mot de passe.');
      return
    }

    try {
      this.loading = true;
      // TODO vérifier le résultat de l'authentification. Rediriger sur "/" en cas de succès ou afficher une erreur en cas d'échec
      const status = await this.authService.authenticate(this.model.username, this.model.password);
      this.loading = false;
      
      if(!status.success) return this.nzMessageService.error('Vos identifiants sont incorrects.');
      this.router.navigateByUrl('/');
    } catch (e) {
      this.nzMessageService.error("Une erreur est survenue. Veuillez réessayer plus tard");
    }
  }
}
