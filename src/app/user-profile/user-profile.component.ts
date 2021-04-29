import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";
import {UserService} from "../services/user.service";

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router,private userService: UserService) {}
  get form() { return this.editForm.controls; }

  public editForm =  this.fb.group({
    username: ['', Validators.required],
    email: ['', [Validators.email, Validators.required]],
    phone: ['', [Validators.required, Validators.pattern('^[0-9]{8}$')]],
    address: ['', Validators.required],
    password: ['', [Validators.required, Validators.pattern('^.{5,}$')]],
    passwordConfirmation : ['', Validators.required]
  });
  error: any;
  user: any;



  ngOnInit(): void {
    this.user = this.userService.getConnectedUser();
    this.editForm.patchValue({
      username: this.user.username,
      email: this.user.email,
      phone: this.user.phoneNumber,
      address: this.user.address,
    });
  }
  submit(): void{
    const data = {
      username: this.editForm.value.username,
      email: this.editForm.value.email,
      address: this.editForm.value.address,
      phone: this.editForm.value.phone,
      password: this.editForm.value.password,
      _id: this.user._id
    };
    this.http.put('http://localhost:5000/user/update', data).toPromise().then((msg: any) => {
      this.error = msg.error;
      console.log(msg);
      if ( !this.error){
        this.userService.setConnectedUser(msg);
        this.router.navigateByUrl('/coworkingspaces').then(r => {}); }
      }) ;
  }
}
