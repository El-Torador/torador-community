import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { User } from '../../user.model';
import { NzMessageService } from 'ng-zorro-antd/message';

export class UserProfileForm {
  id: string;
  username: string;
  photoUrl?: string;
  _file?: File;
  user: User;

  constructor(user: User) {
    this.id = user.id;
    this.username = user.username;
    this.photoUrl = user.photoUrl;
    this.user = user;
  }

  get file() {
    return this._file;
  }

  set file(file: File | undefined) {
    this._file = file;
    if (file) {
      this.toBase64(file).then(s => {
        this.photoUrl = s;
      })
    }
  }

  toBase64(file: File) {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  }

  hasChanged(): boolean {
    return !!this.file || this.username !== this.user.username
  }
}

@Component({
  selector: 'app-user-profile-modal',
  templateUrl: './user-profile-modal.component.html',
  styleUrls: ['./user-profile-modal.component.less']
})
export class UserProfileModalComponent implements OnInit {
  @Input()
  user: User;

  @ViewChild("f")
  form: NgForm;
  supportedTypes = "";
  isVisible: boolean = false;
  model: UserProfileForm;

  constructor(private userService: UserService, private sanitizer: DomSanitizer, private nzMessageService: NzMessageService) {

  }

  ngOnInit(): void {
    this.model = new UserProfileForm(this.user);
  }

  get photoUrl(): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(this.model.photoUrl || "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bc/Unknown_person.jpg/434px-Unknown_person.jpg");
  }

  async onOk() {
    // TODO vérifier si le formulaire est valide
    if(this.form.form.invalid) {
      if(!this.model.username) return this.nzMessageService.warning("Veuillez fournir un nom d'utilisateur.");
    }

    if (this.model.hasChanged()) {
      // TODO mettre à jour l'utilisateur via le service
      const idLoading = this.nzMessageService.loading('Mise à jour en cours...')
      try {
        await this.userService.update({id: this.model.id, username: this.model.username, photo: this.model.file});
        this.nzMessageService.success('Mise à jour réussie !');
      } catch (error) {
        console.error(error);
        this.nzMessageService.error('Nous avons rencontré un problème lors de la mise à jour de vos informations. Veuillez réessayer SVP !');
      } finally {
        this.nzMessageService.remove(idLoading.messageId);
      }
    }

    this.close();
  }

  onFileUpload = (file: File) => {
    this.model.file = file;
    return false;
  }

  onCancel() {
    this.close();
  }

  open() {
    this.model = new UserProfileForm(this.user);
    this.isVisible = true;

    setTimeout(() => {
      this.form.resetForm(this.model);
    })
  }

  close() {
    this.isVisible = false;
  }
}
