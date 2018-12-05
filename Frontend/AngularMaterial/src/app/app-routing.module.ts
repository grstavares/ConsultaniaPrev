import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProcedimentosComponent } from './procedimentos/procedimentos.component';
import { DocumentosComponent } from './documentos/documentos.component';
import { OuvidoriaComponent } from './ouvidoria/ouvidoria.component';
import { MensagensComponent } from './mensagens/mensagens.component';

const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'segurados', loadChildren: './segurados/module#SeguradosModule' },
  { path: 'mensagens', component: MensagensComponent },
  { path: 'procedimentos', component: ProcedimentosComponent },
  { path: 'documentos', component: DocumentosComponent },
  { path: 'ouvidoria', component: OuvidoriaComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
