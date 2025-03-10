import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { FeedStore } from '../../feed.store';
import { Post } from '../../post.model';
import { PostService } from '../../services/post.service';
import { FeedSocketService } from '../../services/feed.socket.service';
import { AuthenticationStore } from 'src/modules/authentication/authentication.store';
@Component({
  selector: 'app-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.less']
})
export class FeedComponent implements OnInit {
  @ViewChild('feed') private bottomRef: ElementRef;

  roomId$: Observable<string | undefined>;

  posts$: Observable<Post[]>;

  constructor(
    private postService: PostService, private store: FeedStore, private socketService: FeedSocketService, private authenticatedStore: AuthenticationStore
    ) {
      this.posts$ = this.store.get(s => s.posts);
      this.roomId$ = this.store.roomId$;
    }
    
    async ngOnInit() {
    this.store.onRoomIdChange(async roomId => {
      if (roomId) {
        this.socketService.onNewPost(roomId, post => {
          if(post.createdBy.id !== this.authenticatedStore.userId) this.store.appendPost(post);
        })
        await this.postService.fetch(roomId, {
          page: 0,
          perPage: 10000
        });
      }
    })
  }

  trackPost(_index: number, post: Post) {
    return post.id;
  }
}
