import { Component, Input, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { Post } from '../../post.model';
import { PostService } from '../../services/post.service';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.less'],
})
export class PostComponent implements OnInit, AfterViewInit {
  @Input()
  post: Post;

  @ViewChild("anchor")
  anchor: ElementRef<HTMLDivElement>;

  constructor(
    private postService: PostService
  ) { }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    this.anchor.nativeElement.scrollIntoView();
  }

  async like() {
    // TODO like du post
    this.postService.like(this.post);
  }

  trackElementByIndex(index: number) {
    return index;
  }

  isContainsMentions(): boolean {
    let result = false
    for (const attachement of this.post.message.attachements) {
      if(attachement.type === 'mention') result = true
    }

    return result;
  }
}
