import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { MaterialModule } from './material.module';
import { LayoutModule } from '@angular/cdk/layout';

import { SharedModule } from './shared/shared.module';

import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MensagensComponent } from './mensagens/mensagens.component';
import { ProcedimentosComponent } from './procedimentos/procedimentos.component';
import { DocumentosComponent } from './documentos/documentos.component';
import { OuvidoriaComponent } from './ouvidoria/ouvidoria.component';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    MensagensComponent,
    ProcedimentosComponent,
    DocumentosComponent,
    OuvidoriaComponent
  ],
  imports: [
    BrowserModule, BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    LayoutModule,
    AppRoutingModule,
    MaterialModule,
    SharedModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
