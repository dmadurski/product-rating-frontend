import { Directive, EventEmitter, HostBinding, HostListener, Output } from '@angular/core';

@Directive({
  selector: '[appDragDrop]'
})
export class DragDropDirective {

  @HostBinding('class.file-over') fileOver?: boolean;
  @Output() fileDropped = new EventEmitter<any>();

  constructor() { }

  // Dragover listener
  @HostListener('dragover', ['$event']) onDragOver(e: DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    this.fileOver = true;
  }

  // Dragleave listener
  @HostListener('dragleave', ['$event']) public onDragLeave(e: DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    this.fileOver = false;
  }

  // Drop listener
  @HostListener('drop', ['$event']) public ondrop(e: DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    this.fileOver = false;
    if(e.dataTransfer){
      let files = e.dataTransfer.files;
      if (files.length > 0) {
        this.fileDropped.emit(files);
      }
    }
  }

}
