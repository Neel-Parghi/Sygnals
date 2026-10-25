import { Component, HostListener, computed } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationPopupComponent } from '../confirmation-popup/confirmation-popup.component';
import { ThemeId, ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [ConfirmationPopupComponent],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {

  showConfirm: boolean = false;
  showThemeMenu: boolean = false;

  readonly currentTheme = computed(() =>
    this.themeService.themes.find(t => t.id === this.themeService.theme()) ?? this.themeService.themes[0]);

  constructor(private router: Router, readonly themeService: ThemeService) { }

  navigateToHome() {
    if (['/'].includes(this.router.url)) {
      this.showConfirm = false;
      this.router.navigateByUrl('/guest');
    } else {
      this.showConfirm = true;
    }
  }

  handleConfirm(result: boolean) {
    this.showConfirm = false;
    if (result) this.router.navigateByUrl('/');
  }

  toggleThemeMenu(event: Event) {
    event.stopPropagation();
    this.showThemeMenu = !this.showThemeMenu;
  }

  selectTheme(id: ThemeId) {
    this.themeService.set(id);
    this.showThemeMenu = false;
  }

  @HostListener('document:click', ['$event'])
  closeThemeMenuOnOutsideClick(event: Event) {
    if (this.showThemeMenu && !(event.target as HTMLElement).closest('.theme-picker')) {
      this.showThemeMenu = false;
    }
  }

  @HostListener('document:keydown.escape')
  closeThemeMenu() {
    this.showThemeMenu = false;
  }

}
