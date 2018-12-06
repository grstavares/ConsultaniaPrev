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
    {title: 'Início', path: 'dashboard', icon: ''},
    {title: 'Segurados', path: 'segurados', icon: ''},
    {title: 'Mensagens', path: 'mensagens', icon: ''},
    {title: 'Procedimentos', path: 'procedimentos', icon: ''},
    {title: 'Ouvidoria', path: 'ouvidoria', icon: ''},
    {title: 'Documentos', path: 'documentos', icon: ''}
  ];

  constructor(private institutoService: InstitutoService) { }

  ngOnInit(): void {

    this.institutoService.instituto.subscribe(value => this.title = value.name);

  }

}

