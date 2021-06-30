import { Component, EventEmitter, OnInit, Input, Output } from '@angular/core';

@Component({
  selector: 'app-ordering',
  templateUrl: './ordering.component.html',
  styleUrls: ['./ordering.component.scss']
})
export class OrderingComponent implements OnInit {

  @Input() fieldName: string = '';
  @Input() direction: string = 'asc';
  @Output() changedDirection = new EventEmitter<OrderingComponent>();

  constructor() {}

  ngOnInit(): void {
  }

  setDirection(direction: string) {
    if (this.direction !== direction) {
      this.direction = direction;
      this.changedDirection.emit(this);
    }
  }
}
