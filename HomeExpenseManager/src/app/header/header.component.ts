import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit{

  @Output() sideNavToggled = new EventEmitter<boolean>();

  menuButtonStatus: boolean = true;

  constructor(){};

  ngOnInit(): void {
    
  }

  toggleSideNav(){
    this.menuButtonStatus = !this.menuButtonStatus;
    this.sideNavToggled.emit(this.menuButtonStatus);
  }

}
