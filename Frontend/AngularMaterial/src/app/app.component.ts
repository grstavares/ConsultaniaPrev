import { Component, OnInit } from '@angular/core';
import { InstitutoService } from './shared/instituto.service';

interface MenuItem {
  title: string;
  path: string;
  icon: string;
}

@Component({selector: 'app-root', templateUrl: './app.component.html', styleUrls: ['./app.component.scss'] })
export class AppComponent implements OnInit {

  isLoading = true;
  title = 'AngularMaterial';
  sideMenu: MenuItem[] = [
    {title: 'Início', path: 'dashboard', icon: 'dashboard'},
    {title: 'Segurados', path: 'segurados', icon: 'people'},
    {title: 'Mensagens', path: 'mensagens', icon: 'email'},
    {title: 'Procedimentos', path: 'procedimentos', icon: 'assignment_turned_in'},
    {title: 'Ouvidoria', path: 'ouvidoria', icon: 'offline_bolt'},
    {title: 'Documentos', path: 'documentos', icon: 'description'}
  ];

  constructor(private institutoService: InstitutoService) { }

  ngOnInit(): void {

    this.institutoService.instituto.subscribe(value => this.title = value.name);

  }

}

