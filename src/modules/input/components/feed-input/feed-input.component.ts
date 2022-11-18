import { Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import type { EmojiEvent } from '@ctrl/ngx-emoji-mart/ngx-emoji';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzPopoverDirective } from 'ng-zorro-antd/popover';
import { UserService } from 'src/modules/user/services/user.service';
import { User } from 'src/modules/user/user.model';
import { MessageSentEventPayload } from '../../input.model';

declare const webkitSpeechRecognition: any
@Component({
  selector: 'app-feed-input',
  templateUrl: './feed-input.component.html',
  styleUrls: ['./feed-input.component.less']
})
export class FeedInputComponent {
  @Output()
  messageSent: EventEmitter<MessageSentEventPayload> = new EventEmitter();

  @ViewChild(NzPopoverDirective)
  inputPopover: NzPopoverDirective;

  @ViewChild('inputMessage') private inputMessageRef: ElementRef<HTMLInputElement>;


  /**
   * Hold the input message
   */
  message: string = "";

  isRecording: boolean = false;
  isTranscript: boolean = false;
  recognition = 'webkitSpeechRecognition' in Window ? new webkitSpeechRecognition() : null

  /**
   * Record audio message
   */
  mediaRecorder: MediaRecorder | null = null
  isRecord: boolean = false
  isPause: boolean = false
  streamAudio: MediaStream
  chunks: Blob[] = [];
  audioUrl: SafeResourceUrl
  alreadyMentionMatches: string[] = []
  users: User[] = [];

  /**
   * Staging file to upload
   */
  file: File | null = null;

  currentMention?: RegExpMatchArray;

  supportedTypes = "image/png,image/jpeg,image/gif,image/bmp,image/bmp,video/mpeg,video/mp4,application/pdf,audio/mpeg,audio/x-wav,image/webp";

  constructor(
    private userService: UserService,
    private nzMessageService: NzMessageService,
    private sanitizer: DomSanitizer
  ) { }

  async ngOnInit() {
    this.recognition = this.isSpeechRecognitionSupported() ? new webkitSpeechRecognition() : null
    if('mediaDevices' in navigator){

      const constraints = { audio: true };
  
      this.streamAudio = await navigator.mediaDevices.getUserMedia(constraints);
      this.mediaRecorder = new MediaRecorder(this.streamAudio);
      this.mediaRecorder.addEventListener('start', this.onStartRecord);
      this.mediaRecorder.addEventListener('stop', this.onStopRecord);
      this.mediaRecorder.addEventListener('dataavailable', this.onDataRecord);
      this.mediaRecorder.addEventListener('pause', this.onPauseRecord);
      this.mediaRecorder.addEventListener('resume', this.onResumeRecord);
      this.mediaRecorder.addEventListener('error', this.onErrorRecord);
    }
  }

  ngOnDestroy() {
    this.mediaRecorder?.removeEventListener('start', this.onStartRecord);
    this.mediaRecorder?.removeEventListener('stop', this.onStopRecord);
    this.mediaRecorder?.removeEventListener('dataavailable', this.onDataRecord);
    this.mediaRecorder?.removeEventListener('pause', this.onPauseRecord);
    this.mediaRecorder?.removeEventListener('resume', this.onResumeRecord);
    this.mediaRecorder?.removeEventListener('error', this.onErrorRecord);
  }

  /**
   * Triggered when the user is selecting a mention in the list.
   * @param user The mentioned user
   */
  chooseMention(user: User) {
    if (this.currentMention) {
      this.message = this.message.substr(0, this.currentMention.index! + 1) + user.username + this.message.substr(this.currentMention.index! + this.currentMention[0].length + 1) + " "; 
      this.alreadyMentionMatches.push(`@${user.username}`);
    }
    this.hideMentionList();
  }


  /**
   * Display the mention list
   * @param mentionMatch The mention regexp match
   */
  showMentionList(mentionMatch: RegExpMatchArray) {
    this.currentMention = mentionMatch;
    this.inputPopover.show();
  }

  /**
   * Hide the mention list
   */
  hideMentionList() {
    this.inputPopover.hide();
    this.currentMention = undefined;
  }


  /**
   * Message change evetn handler
   * @param message
   */
  onMessageChanged(message: string) {
    this.message = message;
  }

  /**
   * Close tag event handler. Trigger when the user wants to remove a file.
   */
  onCloseTag() {
    this.setFile(null);
    this.audioUrl = '';
  }

  /**
  * Event handler
  * @param file the file privded by the user
  */
  onFileUpload = (file: File) => {
    this.setFile(file);
    return false;
  }

  /**
   * InputKeyDown event handler. Used to watch "Enter" key press
   * @param e
   */
  onInputKeyDown(e: KeyboardEvent) {
    // True if "Enter" is pressed without th shift or CTRL key pressed
    if (e.key.toLowerCase() === "enter" && !e.shiftKey && !e.ctrlKey) {
      e.stopImmediatePropagation();
      e.preventDefault();
      e.stopPropagation();

      this.send();
    }
  }

  /**
   * InputKeyUp event handler. Use to watch arrows key press to know when to show mention list
   * @param e
   */
  onInputKeyUp(e: KeyboardEvent) {
    const mentionMatch = this.message.match(/@[A-Za-z0-9_-]*/i)!;
    if(mentionMatch?.[0]){
      if(this.alreadyMentionMatches.includes(mentionMatch[0])) return
      this.searchMentionedUsers(mentionMatch[0]?.replace('@', '').toLowerCase())
      this.showMentionList(mentionMatch);
    }
  }

  async searchMentionedUsers(search: string) {
    if (!search) {
      this.users = [];
    } else {
      this.users = await this.userService.search(search);
    }
  }

  /**
   * Send the input message
   */
  send() {
    if (!this.message && !this.file) {
      return;
    }

    const messagePayload: MessageSentEventPayload = {
      date: new Date(),
      message: this.message,
      file: this.file || undefined
    }
    
    this.fireMessageSent(messagePayload)
    this.clear()
    // TODO émettre  l'évènement "messageSent" via la méthode fireMessageSent
    // TODO vider la zone de saise avec la méthode clear
  }

  /**
   * Set an allowed file to send with the input message
   * @param file The file to send with the message
   */
  setFile(file: File | null) {
    this.file = file;
  }

  /**
   * Emit the "messageSent" event
   */
  fireMessageSent(payload: MessageSentEventPayload) {
    this.messageSent.emit(payload)
    // TODO émettre l'évènement "messageSent"
  }

  /**
   * Clear the message to reset the input
   */
  clear() {
    this.message = "";
    this.setFile(null);
    if(this.audioUrl) this.audioUrl = '';
    this.inputPopover?.hide();
  }

  /**
   * Check if the browser support Speech Recognition API
   */
  isSpeechRecognitionSupported(): boolean {
    return window.hasOwnProperty('webkitSpeechRecognition')
  }

  /**
   * Listen and transcript voice speech
   */
  speech() {
    if(this.recognition === null){
      return
    }
    if(this.isRecording) {
      this.isRecording = false;
      dispatchEvent(new Event('result'));
      return;
    }
    this.isRecording = true;
    this.recognition.lang = 'fr-FR';
    this.recognition.continuous = false;
    this.recognition.interimResults = false;
    this.recognition.start();
    this.recognition.onresult = (e: any) => {
      this.isTranscript = true;
      const result = e.results.item(e.resultIndex)
      if(result.isFinal) {
        const transcript = result.item(0).transcript;
        this.message += " " + transcript;
      }
    };
    this.recognition.onend = (_e: any) => {
      this.isTranscript = false;
      this.isRecording = false;
      this.recognition.stop();
    }
  }

  /**
   * add selected emoji nearby the position cursor in input message
   */
  addEmoji(e: EmojiEvent) {
    const indexCursor = this.inputMessageRef.nativeElement.selectionStart;
    if(!indexCursor) {
      this.message += e.emoji.native;
      return
    }
    
    this.message = `${this.message.slice(0, indexCursor)}${e.emoji.native}${this.message.slice(indexCursor, this.message.length)}`
  }

  /**
   * Check is the browser supports MediaDevices API
   */
  isRecordMediaSupport(): boolean {
    return !!this.mediaRecorder;
  }

  record() {
    if(this.isRecord)
      this.stopRecord()
    else this.startRecord()
  }

  /**
   * Start record audio message
   */
  startRecord() {
    this.mediaRecorder?.start();
  }

   /**
   * Stop record audio message
   */
  stopRecord() {
    this.mediaRecorder?.stop();
  }

  pauseRecord() {
    this.mediaRecorder?.pause()
  }

  resumeRecord() {
    this.mediaRecorder?.resume()
  }

  onErrorRecord = (_e: MediaRecorderErrorEvent) => {
    this.nzMessageService.error('Nous avons rencontré un problème lors de l\'enregistrement de votre message vocal. Veuillez réessayer SVP.');
  }

  onPauseRecord = (_e: Event) => {
    //Switch button to pause |>
    this.isPause = true;
    this.nzMessageService.info("L'enregistrement est en pause.");
  }

  onResumeRecord = (_e: Event) => {
    //Switch button to play ||
    this.isPause = false;
    this.nzMessageService.info("L'enregistrement a repris.");
  }

  onDataRecord = (e: BlobEvent) => {
    this.chunks.push(e.data);
  }

  onStopRecord = (_e: Event) => {
    this.isRecord = false;
    
    const file = new File(this.chunks, 'audio_message.ogg', {
      type: 'audio/ogg'
    });
    this.setFile(file);
    const blob = new Blob(this.chunks, { type: "audio/ogg; codecs=opus"});
    this.audioUrl = this.sanitizer.bypassSecurityTrustResourceUrl(URL.createObjectURL(blob));
    this.streamAudio?.getAudioTracks().forEach(track => track.enabled = false);
  }

  onStartRecord = (_e: Event) => {
    this.isRecord = true;
    this.nzMessageService.info("Vous êtes entrain d'être enregistré. Cliquer sur le micro une fois terminé.");
  }
}
