import {
  Component, OnInit, signal, inject, ViewEncapsulation, ChangeDetectionStrategy
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { PortfolioService } from './services/portfolio.service';
import { Portfolio, Project, Skill } from './models/portfolio.model';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  private portfolioService = inject(PortfolioService);
  private fb = inject(FormBuilder);

  portfolio = signal<Portfolio | null>(null);
  projects  = signal<Project[]>([]);
  skills    = signal<Skill[]>([]);
  loading   = signal(true);
  activeSection  = signal('home');
  menuOpen       = signal(false);
  activeFilter   = signal('All');
  contactSuccess = signal(false);
  contactError   = signal('');
  contactLoading = signal(false);
  currentYear    = new Date().getFullYear();
  activeSkillTab = signal('All');

  projectCategories = ['All', 'Enterprise', 'E-Commerce', 'Dashboard', 'PWA', 'Open Source'];

  contactForm = this.fb.group({
    name:    ['', [Validators.required, Validators.minLength(2)]],
    email:   ['', [Validators.required, Validators.email]],
    subject: ['', [Validators.required, Validators.minLength(5)]],
    message: ['', [Validators.required, Validators.minLength(20)]]
  });

  navLinks = ['home', 'about', 'skills', 'experience', 'projects', 'contact'];

  ngOnInit() {
    this.portfolioService.getPortfolio().subscribe(data => {
      this.portfolio.set(data);
      this.loading.set(false);
    });
    this.portfolioService.getProjects().subscribe(data => this.projects.set(data));
    this.portfolioService.getSkills().subscribe(data => this.skills.set(data));
  }

  get filteredProjects(): Project[] {
    const f = this.activeFilter();
    const all = this.projects();
    return f === 'All' ? all : all.filter(p => p.category === f);
  }

  get filteredSkills(): Skill[] {
    const t = this.activeSkillTab();
    const all = this.skills();
    return t === 'All' ? all : all.filter(s => s.category === t);
  }

  scrollTo(section: string): void {
    this.menuOpen.set(false);
    document.getElementById(section)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  toggleMenu() { this.menuOpen.update(v => !v); }
  setFilter(f: string) { this.activeFilter.set(f); }
  setSkillTab(t: string) { this.activeSkillTab.set(t); }

  getLevelLabel(level: number): string {
    if (level >= 90) return 'Expert';
    if (level >= 75) return 'Advanced';
    if (level >= 60) return 'Intermediate';
    return 'Beginner';
  }

  getSkillBarColor(level: number): string {
    if (level >= 90) return '#00d4ff';
    if (level >= 75) return '#7c3aed';
    if (level >= 60) return '#f59e0b';
    return '#10b981';
  }

  submitContact() {
    if (this.contactForm.invalid) { this.contactForm.markAllAsTouched(); return; }
    this.contactLoading.set(true);
    this.contactError.set('');
    this.portfolioService.submitContact(this.contactForm.value as any).subscribe({
      next: () => {
        this.contactSuccess.set(true);
        this.contactLoading.set(false);
        this.contactForm.reset();
        setTimeout(() => this.contactSuccess.set(false), 5000);
      },
      error: (err) => {
        this.contactError.set(err?.error?.error || 'Failed to send. Please try again.');
        this.contactLoading.set(false);
      }
    });
  }

  isFieldInvalid(field: string): boolean {
    const c = this.contactForm.get(field);
    return !!(c?.invalid && c?.touched);
  }

  trackByIndex(i: number): number { return i; }

  getProjectGradient(image: string): string {
    const g: Record<string, string> = {
      banking:   'linear-gradient(135deg,#1e3a5f,#0d7377)',
      ecommerce: 'linear-gradient(135deg,#4a1942,#c94b4b)',
      dashboard: 'linear-gradient(135deg,#1a1a2e,#0f3460)',
      tasks:     'linear-gradient(135deg,#134e5e,#71b280)',
      hrms:      'linear-gradient(135deg,#2d3436,#636e72)',
      library:   'linear-gradient(135deg,#6d0101,#ef8d32)'
    };
    return g[image] || 'linear-gradient(135deg,#1a1a2e,#16213e)';
  }

  getProjectIcon(image: string): string {
    const icons: Record<string, string> = {
      banking:'🏦', ecommerce:'🛒', dashboard:'📊', tasks:'✅', hrms:'👥', library:'📦'
    };
    return icons[image] || '💻';
  }
}