import { NgModule } from '@angular/core';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { MaterialModule } from './material.module';
import { LayoutModule } from '@angular/cdk/layout';

import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SeguradosComponent } from './segurados/segurados.component';
import { MensagensComponent } from './mensagens/mensagens.component';
import { ProcedimentosComponent } from './procedimentos/procedimentos.component';
import { DocumentosComponent } from './documentos/documentos.component';
import { OuvidoriaComponent } from './ouvidoria/ouvidoria.component';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    SeguradosComponent,
    MensagensComponent,
    ProcedimentosComponent,
    DocumentosComponent,
    OuvidoriaComponent
  ],
  imports: [
    BrowserAnimationsModule,
    HttpClientModule,
    AppRoutingModule,
    MaterialModule,
    LayoutModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
