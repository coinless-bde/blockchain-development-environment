import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'bde-editor-preview',
  template: `
    <p>
      editor-preview works!
    </p>
  `,
  styleUrls: ['./editor-preview.component.css']
})
export class EditorPreviewComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
