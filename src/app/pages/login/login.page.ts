import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoadingController, ToastController } from '@ionic/angular';
import { AuthService } from '../../services/auth.service';
import { SocketService } from '../../services/socket.service';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  loginForm: FormGroup;
  isLoading = false;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private socketService: SocketService,
    private router: Router,
    private loadingController: LoadingController,
    private toastController: ToastController
  ) {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit() {
    // If already authenticated, redirect to dashboard
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/dashboard']);
    }
  }

  async login() {
    if (this.loginForm.invalid) {
      return;
    }

    const loading = await this.loadingController.create({
      message: 'Logging in...'
    });
    await loading.present();

    this.isLoading = true;

    this.authService.login(
      this.loginForm.value.email,
      this.loginForm.value.password
    ).subscribe({
      next: (response) => {
        loading.dismiss();
        this.isLoading = false;
        if (response.success) {
          this.socketService.connect();
          this.router.navigate(['/dashboard'], { replaceUrl: true });
        } else {
          this.showToast(response.message || 'Login failed', 'danger');
        }
      },
      error: (error) => {
        loading.dismiss();
        this.isLoading = false;
        const message = error.error?.message || 'Login failed. Please try again.';
        this.showToast(message, 'danger');
      }
    });
  }

  async showToast(message: string, color: string = 'primary') {
    const toast = await this.toastController.create({
      message,
      duration: 3000,
      color,
      position: 'top'
    });
    await toast.present();
  }
}
