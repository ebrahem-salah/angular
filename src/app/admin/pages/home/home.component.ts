import { Component } from '@angular/core';
import { AdminMenubarComponent } from '../../shared/menubar/menubar.component';
import { SidebarComponent } from '../../shared/sidebar/sidebar.component';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'admin-home',
  standalone: true,
  imports: [AdminMenubarComponent, SidebarComponent, RouterOutlet],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class AdminHomeComponent {}
