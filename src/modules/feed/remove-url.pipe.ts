import { Pipe, PipeTransform } from '@angular/core';
import { MessageElement } from 'src/modules/feed/post.model';

@Pipe({
  name: 'removeUrl'
})
export class RemoveUrlPipe implements PipeTransform {

  transform(value: string, attachements: MessageElement[]): string {
    attachements.forEach(attachement => {
      switch (attachement.type) {
        case 'audio':
          value = value.replace(attachement.url, '')
          break;
        case 'image':
          value = value.replace(attachement.url, '');
          break;
        case 'video':
          value = value.replace(attachement.url, '');
          break;
        case 'youtube':
          value = value.replace(/(http[s]?:\/\/)?www\.(?:youtube\.com\/\S*(?:(?:\/e(?:mbed))?\/|watch\/?\?(?:\S*?&?v\=))|youtu\.be\/)([a-zA-Z0-9_-]{6,11})/gmi, '');
        case 'pdf':
          value = value.replace(/http[s]?:\/\/.+\.(pdf)/gmi, '');
        default:
          break;
      }
    })
    
    return value;
  }

}
