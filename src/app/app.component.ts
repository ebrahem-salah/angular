import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AccordionModule } from 'primeng/accordion';
import {
  trigger,
  state,
  style,
  animate,
  transition,
  // ...
} from '@angular/animations';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, AccordionModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  // providers:[{provide:HTTP_INTERCEPTORS,useClass:jwtInterceptor , multiple: true}],
  animations: [trigger, state, style, animate, transition],
})
export class AppComponent {
  title = 'angular';
}
