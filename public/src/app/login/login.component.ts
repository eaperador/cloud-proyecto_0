import { Component, OnInit } from '@angular/core';
import { NgModel } from '@angular/forms';
import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

export class LoginComponent implements OnInit {
  options:RequestOptions;
  usuario: String;
  password: String;
  error: Boolean = false;
  mostrarModal: Boolean = false;
  recordarUsuario: Boolean = false;
  
  registro: any = {
    usuario: "",
    nombre: "",
    password: "",
    confirmar: ""
  }

  constructor(private http: Http ) {
    localStorage.removeItem('usuario');
    let headers: Headers = new Headers();
    headers.append('Content-Type', 'application/json; charset=utf-8');
    headers.append("Cache-Control", "no-cache");
    headers.append("Cache-Control", "no-store");
    this.options = new RequestOptions({ headers: headers });
    let recordarUser:any = localStorage.getItem('recordarUsuario');
    if(recordarUser) {
      recordarUser = JSON.parse(recordarUser);
      this.usuario = recordarUser.usuario;
      this.password = recordarUser.password;
      this.recordarUsuario = true;
    }
  }

  ngOnInit() {
  }

  registrarse() {
    this.callRegistro().subscribe(response => {
      alert("Registro Valido.");
      this.mostrarModal = false;
      this.registro = {
        usuario: "",
        nombre: "",
        password: "",
        confirmar: ""
      };
    });
  }

  validarRegistro() {
    return this.registro.confirmar === this.registro.password &&
      this.registro.nombre && this.registro.usuario; 
  }

  callRegistro() {
    return this.http.post('/api/users', this.registro, this.options).map(response => <String[]>response.json());
  }

  ingresar() {
    this.ingresarService().subscribe(response => {
      if((<any>response).login) {
        this.error = false;
        localStorage.setItem('usuario', JSON.stringify((<any>response).user));
        if(this.recordarUsuario) {
	  localStorage.setItem('recordarUsuario', JSON.stringify({usuario:this.usuario, password: this.password}));
	} else {
	  localStorage.removeItem('recordarUsuario');
	}
        window.location.href = '#/home';
      } else {
        this.error = true;
      }
    }, error => {
      alert("ocurrio un error");
      console.log(error);
    });
  }

  ingresarService() {
    let body = {
      usuario: this.usuario,
      password: this.password
    };
    return this.http.post('/api/login', JSON.stringify(body), this.options).map(response => <String[]> response.json());
  }

}
