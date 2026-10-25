import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { OnlineCountService } from '../../../services/online-count.service';

@Component({
  selector: 'app-guest-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './guest-login.component.html',
  styleUrl: './guest-login.component.css'
})
export class GuestLoginComponent implements OnInit, OnDestroy {
  form: FormGroup;

  readonly steps = [
    { title: 'Pick a nickname', text: 'It’s the only thing the other person sees.' },
    { title: 'Get matched', text: 'We pair you with someone who’s online right now.' },
    { title: 'Talk or skip', text: 'Chat as long as you like, or skip to someone new.' }
  ];

  readonly features = [
    { icon: 'fa-solid fa-message', title: 'Text', text: 'Messages with typing indicators.' },
    { icon: 'fa-solid fa-microphone', title: 'Voice notes', text: 'Record and send short clips.' },
    { icon: 'fa-regular fa-image', title: 'Images', text: 'Share a photo, tap to view it full size.' },
    { icon: 'fa-solid fa-phone', title: 'Voice calls', text: 'Switch to a live call in one tap.' }
  ];

  /** Bar heights for the decorative voice-note waveform in the hero preview */
  readonly wave = [40, 75, 55, 95, 60, 80, 35, 70, 50, 85, 45, 65, 30, 55, 40];

  constructor(
    private readonly fb: FormBuilder,
    private readonly router: Router,
    readonly onlineCount: OnlineCountService
  ) {
    this.form = this.fb.group({
      username: [localStorage.getItem('guest_username') ?? '', [Validators.required, Validators.maxLength(15)]]
    });
  }

  ngOnInit(): void {
    void this.onlineCount.start();
  }

  ngOnDestroy(): void {
    void this.onlineCount.stop();
  }

  startChat() {
    if (this.form.valid) {
      const username = this.form.value.username;
      localStorage.setItem('guest_username', username);
      this.router.navigate(['/random-chat'], {
        state: { username: username }
      });
    } else {
      this.form.markAllAsTouched();
    }
  }
}
