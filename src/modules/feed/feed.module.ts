import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzIconModule } from 'ng-zorro-antd/icon';

import { FeedComponent } from './component/feed/feed.component';
import { PostComponent } from './component/post/post.component';
import { PostMapper } from './services/post.mapper';
import { PostService } from './services/post.service';
import { PostCommands } from './services/post.commands';
import { LocalPostCommands } from './services/plateform/local/post.commands.local';
import { PostQueries } from './services/post.queries';
import { LocalPostQueries } from './services/plateform/local/post.queries.local';
import { PostAttachementImageComponent } from './component/post-attachements/post-attachement-image/post-attachement-image.component';
import { PostAttachementVideoComponent } from './component/post-attachements/post-attachement-video/post-attachement-video.component';
import { PostAttachementAudioComponent } from './component/post-attachements/post-attachement-audio/post-attachement-audio.component';
import { PostAttachementYoutubeComponent } from './component/post-attachements/post-attachement-youtube/post-attachement-youtube.component';
import { FeedStore } from './feed.store';
import { UserModule } from '../user/user.module';
import { HttpPostCommands } from './services/plateform/http/post.commands.http';
import { HttpPostQueries } from './services/plateform/http/post.queries.http';
import { FeedSocketService } from './services/feed.socket.service';
import { RemoveUrlPipe } from './remove-url.pipe';
import { LisibleDatePipe } from './lisible-date.pipe';
import { PostAttachementPDFComponent } from './component/post-attachements/post-attachement-pdf/post-attachement-pdf';
import { PostAttachementLinkComponent } from './component/post-attachements/post-attachement-link/post-attachement-link';

@NgModule({
  declarations: [FeedComponent, PostComponent, PostAttachementImageComponent, PostAttachementVideoComponent, PostAttachementAudioComponent, PostAttachementYoutubeComponent, PostAttachementPDFComponent, PostAttachementLinkComponent, RemoveUrlPipe, LisibleDatePipe],
  exports: [FeedComponent, PostComponent],
  providers: [PostMapper, PostService, FeedStore,FeedSocketService, {
    provide: PostCommands,
    useClass: HttpPostCommands
  }, {
      provide: PostQueries,
      useClass: HttpPostQueries
    }],
  imports: [
    CommonModule,
    UserModule,
    NzIconModule
  ]
})
export class FeedModule { }
