import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { AuthenticationStore } from 'src/modules/authentication/authentication.store';
import { WebsocketConnection } from 'src/modules/common/WebsocketConnection';
import { AnyNotification } from 'src/modules/notification/notification.model';
import { NotificationState } from 'src/modules/notification/notification.state';
import { NotificationStore } from 'src/modules/notification/notification.store';
import { NotificationService } from 'src/modules/notification/services/notification.service';
import { NotificationSocketService } from 'src/modules/notification/services/notification.socket.service';
import { NzNotificationService as NotifPopup } from 'ng-zorro-antd/notification';

@Component({
  selector: 'app-app-layout',
  templateUrl: './app-layout.component.html',
  styleUrls: ['./app-layout.component.less']
})
export class AppLayoutComponent implements OnInit, OnDestroy {
  sub?: Subscription;
  notifications$: Observable<AnyNotification[]>
  hasUnread$: Observable<boolean>

  showDrawer: boolean = false;
  constructor(private socket: WebsocketConnection, private authStore: AuthenticationStore, private notificationService: NotificationService, private notificationStore: NotificationStore, private notificationSocketService: NotificationSocketService, private notificationPopup: NotifPopup) {
    this.notifications$ = notificationStore.get(s => s.notifications);
    this.hasUnread$ = notificationStore.hasUnread$;
  }

  ngOnInit(): void {
    this.notificationService.fetch()
    this.sub = this.authStore.accessToken$.subscribe(accessToken => {
      if (accessToken) {
        this.socket.connect(accessToken);
      } else {
        this.socket.disconnect();
      }
    });

    this.notificationSocketService.onNewNotification(notif => {
      this.notificationStore.prependNotification(notif)
      this.notificationPopup.blank(this.getTranslation(notif), "")
      document.visibilityState === 'hidden' && this.pushDesktopNotif(notif)
    })
  }

  ngOnDestroy() {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }
  onToggleNotifications() {
    this.showDrawer = !this.showDrawer;
    if(!this.showDrawer) this.notificationService.markAsViewed()
  }

  async getPermission() {
    return Notification.requestPermission()
  }

  getTranslation(notif: AnyNotification) {
    switch (notif.subject){
      case 'new_user':
        return `${notif.payload.user.username} vient d'arriver sur la plateforme.`;
      case 'post_liked':
        return `${notif.payload.user.username} vient d'aimer votre messsage (${notif.payload.preview}).`;
      case 'room_added':
        return `La room ${notif.payload.room.name} vient d'être ajouté !`
    }
  }

async pushDesktopNotif (notif: AnyNotification) {
  const permission = await this.getPermission()
  if(permission === 'granted'){
    new Notification(this.getTranslation(notif), {
          icon: notif.payload.user.photoUrl || "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bc/Unknown_person.jpg/434px-Unknown_person.jpg"
    });
  }
}
}
