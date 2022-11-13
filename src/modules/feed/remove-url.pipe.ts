import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { MessageElement } from 'src/modules/feed/post.model';

@Pipe({
  name: 'removeUrl'
})
export class RemoveUrlPipe implements PipeTransform {

  constructor(private sanitizer: DomSanitizer) {

  }

  transform(value: string, attachements: MessageElement[]): string | SafeHtml {
    let safeValue: SafeHtml = ''
    attachements.forEach(attachement => {
      switch (attachement.type) {
        case 'audio':
          value = value.replaceAll(attachement.url, '')
          break;
        case 'image':
          value = value.replaceAll(attachement.url, '');
          break;
        case 'video':
          value = value.replaceAll(attachement.url, '');
          break;
        case 'youtube':
          value = value.replaceAll(/(http[s]?:\/\/)?(www\.)?(?:youtube\.com\/\S*(?:(?:\/e(?:mbed))?\/|watch\/?\?(?:\S*?&?v\=))|youtu\.be\/)([a-zA-Z0-9_-]{6,11})/gmi, '');
        case 'pdf':
          value = value.replaceAll(/http[s]?:\/\/.+\.(pdf)/gmi, '');
          break;
        case 'link':
          value = value.replaceAll(attachement.url, '');
          break;
        case 'mention':
          attachement.value.forEach(val => {
            value = value.replaceAll(val, `<span style="color: green;">${val}</span>`)
          })
          
          safeValue = this.sanitizer.bypassSecurityTrustHtml(value)
          break;
        default:
          break;
      }
    })
    
    return safeValue || value;
  }

}
