import { Component, EventEmitter, OnInit, Input, Output } from '@angular/core';

@Component({
  selector: 'app-filtering',
  templateUrl: './filtering.component.html',
  styleUrls: ['./filtering.component.scss']
})
export class FilteringComponent implements OnInit {

  @Input() fieldName: string = '';
  @Output() changedFilter = new EventEmitter<FilteringComponent>();
  public searchValue: string = '';

  constructor() { }

  ngOnInit(): void {
  }

  setFilter(e: any) {
    this.searchValue = e.target.value;
    this.changedFilter.emit(this);
  }

}
