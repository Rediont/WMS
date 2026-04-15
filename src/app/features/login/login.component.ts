import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AppStateService } from '../../core/state.service/state.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { MatCard, MatCardContent, MatCardHeader, MatCardTitle } from '@angular/material/card'; // Додано Header та Title
import { MatInput } from '@angular/material/input';
import { MatButton } from '@angular/material/button';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-login',
  imports: [
    ReactiveFormsModule,
    MatFormField,
    MatLabel,
    MatError,
    MatCard,
    MatCardHeader,       
    MatCardTitle,        
    MatCardContent, 
    MatInput, 
    MatButton
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private http = inject(HttpClient);
  private router = inject(Router);
  private appState = inject(AppStateService);
  private apiUrl = `${environment.apiUrl}`;

  // Ініціалізація форми з простою валідацією
  loginForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  });

  onSubmit() {
    if (this.loginForm.invalid) return;

    const payload = this.loginForm.value;
    console.log('Дані для відправки:', payload);

    this.http.post<any>(`${this.apiUrl}/Auth/login`, payload).subscribe({
      next: (response) => {
        // Зберігаємо токен
        localStorage.setItem('token', response.token);
        
        // Тепер, коли ми залогінені, стягуємо лукапи (словники)
        this.appState.loadGlobalLookups().subscribe({
          next: () => {
            console.log('Словники завантажено, переходимо в систему!');
            this.router.navigate(['']);
          },
          error: (err) => console.error('Помилка завантаження лукапів', err)
        });
      },
      error: (err) => {
        console.error('Помилка логіну', err);
      }
    });
    
  }
}
