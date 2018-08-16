import { Component, OnInit } from '@angular/core';
import { NgModel } from '@angular/forms';
import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  options:RequestOptions;
  eventos: any = [];
  error: String = null;
  mostrarModal: Boolean = false;
  usuario: any = null;

  nombreEvento: String = "";
  categoriaEvento: String = "";
  lugarEvento: String = "";
  direccionEvento: String = "";
  fechaInicialEvento: Date = new Date();
  fechaFinalEvento: Date = new Date();
  esPresencialEvento: Boolean = true;
  _id: String = "";
  _actualizar: Boolean = false;
  
  constructor(private http: Http ) {
    let headers: Headers = new Headers();
    headers.append('Content-Type', 'application/json; charset=utf-8');
    headers.append("Cache-Control", "no-cache");
    headers.append("Cache-Control", "no-store");
    this.options = new RequestOptions({ headers: headers });
  }

  traducirFecha(fecha) {
    let dat = new Date(fecha);
    return dat.getFullYear() + '/' + dat.getMonth() + '/' + dat.getDay();
  }

  ngOnInit() {
    this.getEvents();
  }

  getEvents() {
    this.callEvents().subscribe(response => {
      if(response.length) {
        this.eventos = response;
      }
    });
  }

  logout() {
    window.location.href = '#/login';
  }

  sendEvent() {
    this.usuario = this.usuario || JSON.parse(localStorage.getItem('usuario'));
    if(!this.usuario) {
      window.location.href = '#/login';
    }

    let event = {
      nombre: this.nombreEvento,
      categoria: this.categoriaEvento,
      lugar: this.lugarEvento,
      direccion: this.direccionEvento,
      fechaInicio: this.fechaInicialEvento,
      fechaFin: this.fechaFinalEvento,
      presencial: this.esPresencialEvento,
      usuario: this.usuario.usuario
    };

    this.callSendEvent(event).subscribe(response => {
      this.getEvents();
      this.mostrarModal = false;
      this.resetModal();
    });
  }

  borrarEvento(_id) {
    this.callBorrarEvento(_id).subscribe(response => {
      this.getEvents();
    });
  }

  callBorrarEvento(_id) {
    return this.http.delete('/api/eventos/' + _id, this.options).map(response => <String[]> response.json());
  }

  actualizarEvento(_evento) {
    this.nombreEvento = _evento.nombre;
    this.categoriaEvento = _evento.categoria;
    this.lugarEvento = _evento.lugar;
    this.direccionEvento = _evento.direccion;
    this.fechaInicialEvento = _evento.fechaInicio;
    this.fechaFinalEvento = _evento.fechaFin;
    this.esPresencialEvento = _evento.presencial;
    this._id = _evento._id;
    this.mostrarModal = true;
    this._actualizar = true;
  }

  resetModal() {
    this.nombreEvento = "";
    this.categoriaEvento = "";
    this.lugarEvento = "";
    this.direccionEvento = "";
    this.fechaInicialEvento = new Date();
    this.fechaFinalEvento = new Date();
    this.esPresencialEvento = true;
  }

  callSendEvent(event) {
    this.usuario = this.usuario || JSON.parse(localStorage.getItem('usuario'));
    if(!this.usuario) {
      window.location.href = '#/login';
    }
    if(!this._actualizar) {
      return this.http.post('/api/eventos/' + this.usuario.user, event, this.options).map(response => <String[]> response.json());
    } else {
      this._actualizar = false;
      console.log(event);
      console.log("PUTTINGEVENT");
      return this.http.put('/api/eventos/' + this._id, event, this.options).map(response => <String[]> response.json());
    }
  }

  callEvents() {
    this.usuario = this.usuario || JSON.parse(localStorage.getItem('usuario'));
    if(!this.usuario) {
      window.location.href = '#/login';
    }

    return this.http.get('/api/eventos/' + this.usuario.usuario).map(response => <String[]> response.json());
  }

}
