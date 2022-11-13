import { MessageAudioElement, MessageElement, MessageImageElement, MessageLinkElement, MessageMentionElement, MessagePDFElement, MessageTextElement, MessageVideoElement, MessageYoutubeElement, Post, PostData, PostMessage } from '../post.model';

export class PostMapper {
  map(data: PostData): Post {
    return {
      ...data,
      message: this.parseMessage(`${data.message} ${data.attachementUrl ? data.attachementUrl : ''}`)
    }
  }

  private parseMessage(message: string): PostMessage {
    // TODO rajouter png jpg et gif
    const pictureRegex = /http[s]?:\/\/.+\.(jpeg|jpg|gif|png|bmp|webp)/gmi;

     // TODO mp4,wmv,flv,avi,wav
    const videoRegex = /http[s]?:\/\/.+\.(mp4|wmv|flv|avi|wav)/gmi;

     // TODO mp3,ogg,wav
    const audioRegex = /http[s]?:\/\/.+\.(mp3|ogg|wav)/gmi;

    const youtubeRegex = /(http[s]?:\/\/)?[www\.]?(?:youtube\.com\/\S*(?:(?:\/e(?:mbed))?\/|watch\/?\?(?:\S*?&?v\=))|youtu\.be\/)([a-zA-Z0-9_-]{6,11})/gmi;

    const pdfRegex = /http[s]?:\/\/.+\.(pdf)/gmi;
    
    const linkRegex = /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gmi
    const attachements: MessageElement[] = [];

    const mentionRegex = /\B@[a-z0-9_-]+/gi

    const pictureMatche = pictureRegex.exec(message);
    if (pictureMatche) {
     // TODO ajouter un attachement de type image dans attachements
     const imageAttachment: MessageImageElement = { type: 'image', url: pictureMatche?.[0] };
     attachements.push(imageAttachment);
    }

    const videoMatche = videoRegex.exec(message)
    if (videoMatche) {
     // TODO ajouter un attachement de type video dans attachements
      const videoAttachement: MessageVideoElement = {type: 'video', url: videoMatche?.[0]};
      attachements.push(videoAttachement);
    }

    const audioMatche = audioRegex.exec(message)
    if (audioMatche) {
     // TODO ajouter un attachement de type audio dans attachements
      const audioAttachement: MessageAudioElement = {type: 'audio', url: audioMatche?.[0]};
      attachements.push(audioAttachement);
    }

    const youtubeMatche = youtubeRegex.exec(message)
    if (youtubeMatche) {
     // TODO ajouter un attachement de type youtube dans attachements
    const youtubeAttachement: MessageYoutubeElement = {type: 'youtube', videoId: youtubeMatche?.[2]};
     attachements.push(youtubeAttachement);
    }

    const pdfMatche = pdfRegex.exec(message);
    if(pdfMatche){
      const pdfAttachement: MessagePDFElement = {type: 'pdf', url: pdfMatche?.[0]}
      attachements.push(pdfAttachement);
    }

    const linkMatche = linkRegex.exec(message);
    if(linkMatche) {
      
      const linkAttachement: MessageLinkElement = {type: 'link', url: linkMatche?.[0]};
      attachements.push(linkAttachement);
    }

    const mentionMatche = message.match(mentionRegex);
    message.match(mentionRegex)
    if(mentionMatche) {
      const mentionAttachement: MessageMentionElement = {type: 'mention', value: mentionMatche};
      attachements.push(mentionAttachement);
    }

    return {
      text: {
        type: 'text',
        content: message
      } as MessageTextElement,
      attachements
    };
  }
}
