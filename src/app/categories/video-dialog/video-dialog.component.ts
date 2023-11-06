import {AfterContentChecked, Component, ElementRef, OnInit, ViewChild} from '@angular/core';

@Component({
  selector: 'video-dialog',
  templateUrl: './video-dialog.component.html',
  styleUrls: ['./video-dialog.component.scss']
})
export class VideoDialogComponent implements AfterContentChecked{
  @ViewChild('videoFrame') videoEl: ElementRef;
  videoSrc: string = 'assets/jeans.mp4';
  imgSrc: string = 'assets/jeans.png';
  ngAfterContentChecked() {
    if(!this.videoEl) return;
    console.log(this.videoEl.nativeElement)
  }

}
