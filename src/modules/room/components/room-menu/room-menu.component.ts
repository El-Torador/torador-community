import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { FeedStore } from 'src/modules/feed/feed.store';
import { Room } from '../../room.model';
import { RoomStore } from '../../room.store';
import { RoomQueries } from '../../services/room.queries';
import { RoomService } from '../../services/room.service';
import { RoomSocketService } from '../../services/room.socket.service';
import { RoomCreateModalComponent } from '../room-create-modal/room-create-modal.component';
@Component({
  selector: 'app-room-menu',
  templateUrl: './room-menu.component.html',
  styleUrls: ['./room-menu.component.less']
})
export class RoomMenuComponent implements OnInit {
  roomId$: Observable<string | undefined>;
  @ViewChild(RoomCreateModalComponent) roomModal: RoomCreateModalComponent;

  rooms: Room[];

  private readonly LAST_ROOM_VISITED:string = 'LAST_ROOM_VISITED';

  constructor(private feedStore: FeedStore, private queries: RoomQueries, private roomSocketService: RoomSocketService, private router: Router) {
    this.roomId$ = feedStore.roomId$;
    this.rooms = [];
  }

  async ngOnInit() {
    this.rooms = await this.queries.getAll();
    
    const lastRoomIdVisited = this.getLastRoomIdVisited()
    if(lastRoomIdVisited) this.router.navigateByUrl(`app/${lastRoomIdVisited}`)
  }

  async addNewRoom (room: Room) {
    this.rooms.push(room);
  }

  openModal() {
    this.roomModal.open()
  }

  private getLastRoomIdVisited(): string | null {
    return localStorage.getItem(this.LAST_ROOM_VISITED)
  }

  private setLastRoomIdVisited(id: string): void {
    localStorage.setItem(this.LAST_ROOM_VISITED, id)
  }

  goToRoom(room: Room) {
    // TODO naviguer vers app/[id de la room]
    if(!this.feedStore.value.roomId){
      const { id } = this.rooms[0]
      this.router.navigateByUrl(`app/${id}`)
      this.setLastRoomIdVisited(id)
      return
    }
    this.setLastRoomIdVisited(room.id)
    this.router.navigateByUrl(`app/${room.id}`)
  }

  trackRoom(_index: number, room: Room) {
    return room.id;
  }
}
