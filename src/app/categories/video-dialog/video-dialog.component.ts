import {AfterContentChecked, Component, ElementRef, Inject, OnInit, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA} from "@angular/material/dialog";
import {DomSanitizer, SafeUrl} from "@angular/platform-browser";

@Component({
  selector: 'video-dialog',
  templateUrl: './video-dialog.component.html',
  styleUrls: ['./video-dialog.component.scss']
})
export class VideoDialogComponent implements OnInit, AfterContentChecked{
  @ViewChild('videoFrame') videoEl: ElementRef;
  videoUrl: SafeUrl = '';
  constructor(@Inject(MAT_DIALOG_DATA) public data: {videoUrl: string}, @Inject(DomSanitizer) private sanitizer: DomSanitizer) {}
  ngOnInit() {
    let preparedUrl = this.prepareUrl(this.data.videoUrl);
    this.videoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(preparedUrl);
    console.log(this.videoUrl)
  }

  ngAfterContentChecked() {
    if(!this.videoEl) return;
  }

  private prepareUrl(url: string) {
    let preparedUrl = url.replace('shorts', 'embed');
    let urlArray = preparedUrl.split('/');
    let id = urlArray[(urlArray.length-1)]
    return preparedUrl += `?playlist=${id}&loop=1&controls=0&autoplay=1?rel=0`
  }
}
