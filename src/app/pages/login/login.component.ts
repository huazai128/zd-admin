import { Component, ViewEncapsulation } from "@angular/core";
import { FormBuilder, AbstractControl, Validators, FormGroup } from "@angular/forms";
import { Router } from "@angular/router";
import { EmailValidator } from "@validators";
import { LoginService } from "./login.servire";
import { GlobalSeriver } from '../../global.service';
import { resetFakeAsyncZone } from "@angular/core/testing";

@Component({
  selector: "page-login",
  templateUrl: "./login.html",
  styleUrls: ["./login.scss"],
  encapsulation: ViewEncapsulation.None,
  providers: [LoginService, GlobalSeriver]
})

export class LoginComponent {

  public loginForm: FormGroup;

  constructor(private fb: FormBuilder,
    private _service: LoginService,
    private _state: GlobalSeriver,
    private router: Router) {
  }

  ngOnInit() {
    this.loginForm = this.fb.group({
      email: [null, [Validators.required]],
      password: [null, [Validators.required]],
      remember: [true],
    });
  }

  postLogin() {
    if (this.loginForm.valid) {
      let obj = { type: 2 }
      this._service.login(Object.assign(this.loginForm.value, obj)).subscribe(({ result }) => {
        if (result) {
          this._state.set(result.power);
          localStorage.setItem("power", result.power.join());
          localStorage.setItem("id_token", result.token);
          this.router.navigate(["/"]);
        }
      })
    }
  }
}