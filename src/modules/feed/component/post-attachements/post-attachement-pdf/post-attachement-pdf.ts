import { Component, Input, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { MessagePDFElement, MessageVideoElement } from '../../../post.model';

@Component({
  selector: 'app-post-attachement-pdf',
  templateUrl: './post-attachement-pdf.component.html',
  styleUrls: ['./post-attachement-pdf.component.less']
})
export class PostAttachementPDFComponent implements OnInit {
  @Input()
  element: MessagePDFElement;

  constructor(
    private sanitizer: DomSanitizer
  ) { }

  async ngOnInit() {
  }
  get url() {
    return this.sanitizer.bypassSecurityTrustResourceUrl(this.element.url);
  }
}
