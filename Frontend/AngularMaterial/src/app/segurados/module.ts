import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { MaterialModule } from '../material.module';

// import { SeguradosRoutingModule } from './routing';
import { SeguradosComponent } from './segurados/segurados.component';
import { SeguradoComponent } from './segurado/segurado.component';

const routes: Routes = [
    { path: '', component: SeguradosComponent },
    { path: 'segurado/:id', component: SeguradoComponent }
  ];

const moduleDeclarations = [SeguradosComponent, SeguradoComponent];
const moduleImports = [CommonModule, MaterialModule, RouterModule.forChild(routes)];
const moduleExports = [RouterModule];

@NgModule({declarations: moduleDeclarations, imports: moduleImports, exports: moduleExports })
export class SeguradosModule { }
