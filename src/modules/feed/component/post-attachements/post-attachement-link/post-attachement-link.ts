import { Component, Input, OnInit } from '@angular/core';
import { MessageLinkElement } from '../../../post.model';

@Component({
  selector: 'app-post-attachement-link',
  templateUrl: './post-attachement-link.component.html',
  styleUrls: ['./post-attachement-link.component.less']
})
export class PostAttachementLinkComponent implements OnInit {
  @Input()
  element: MessageLinkElement;

  constructor(
  ) { }

  async ngOnInit() {
  }
}
