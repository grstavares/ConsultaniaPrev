import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SeguradosComponent } from './segurados/segurados.component';
import { SeguradoComponent } from './segurado/segurado.component';

const routes: Routes = [
    { path: '', component: SeguradosComponent },
    { path: 'segurado/:id', component: SeguradoComponent }
  ];

@NgModule({ imports: [RouterModule.forChild(routes)], exports: [RouterModule] })
export class SeguradosRoutingModule { }
