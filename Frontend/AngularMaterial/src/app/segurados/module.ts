import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { FlexLayoutModule } from '@angular/flex-layout';
import { MaterialModule } from '../material.module';

import { SharedModule } from '../shared/shared.module';
import { CanDeactivateGuard } from '../shared';

// import { SeguradosRoutingModule } from './routing';
import { SeguradosComponent } from './segurados/segurados.component';
import { SeguradoComponent } from './segurado/segurado.component';

const routes: Routes = [
    { path: '', component: SeguradosComponent },
    { path: 'segurado/:id', component: SeguradoComponent, canDeactivate: [CanDeactivateGuard] }
  ];

const moduleDeclarations = [SeguradosComponent, SeguradoComponent];
const moduleImports = [CommonModule, FlexLayoutModule, MaterialModule, FormsModule, ReactiveFormsModule, RouterModule.forChild(routes), SharedModule];
const moduleExports = [RouterModule];

@NgModule({declarations: moduleDeclarations, imports: moduleImports, exports: moduleExports })
export class SeguradosModule { }
