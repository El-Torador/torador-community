import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NotificationSocketService } from 'src/modules/notification/services/notification.socket.service';
import { Room, RoomType } from '../../room.model';
import { RoomService } from '../../services/room.service';

export class CreateRoomFormModel {
  name: string = "";
  type: RoomType = RoomType.Text;
}

@Component({
  selector: 'app-room-create-modal',
  templateUrl: './room-create-modal.component.html',
  styleUrls: ['./room-create-modal.component.less']
})
export class RoomCreateModalComponent implements OnInit {
  @ViewChild("f")
  form: NgForm;
  isVisible: boolean = false;
  model = new CreateRoomFormModel();

  constructor(private roomService: RoomService, private nzMessageService: NzMessageService, private notificationSocketService: NotificationSocketService) {

  }

  ngOnInit(): void {
  }

  async onOk() {
    if (this.form.form.valid) {
      // TODO invoquer la méthode create du RoomService
      await this.roomService.create(this.model.name, this.model.type);
      
      this.close();
    }else{
      this.nzMessageService.error('Les champs sont invalid.')
    }
  }

  onCancel() {
    this.close();
  }

  open() {
    this.isVisible = true;
    setTimeout(() => this.form.resetForm(new CreateRoomFormModel()))
  }

  close() {
    this.isVisible = false;
  }
}
