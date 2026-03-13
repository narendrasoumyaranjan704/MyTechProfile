import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, of } from 'rxjs';
import { Portfolio, Project, Skill, ContactForm } from '../models/portfolio.model';

@Injectable({ providedIn: 'root' })
export class PortfolioService {
  private http = inject(HttpClient);
  private baseUrl = 'http://localhost:5000/api';

  // ── Portfolio ────────────────────────────────────────────────────────
  getPortfolio(): Observable<Portfolio> {
    return this.http.get<Portfolio>(`${this.baseUrl}/portfolio`).pipe(
      catchError(() => of(this.getFallbackPortfolio()))
    );
  }

  updatePortfolio(data: Partial<Portfolio>): Observable<Portfolio> {
    return this.http.put<Portfolio>(`${this.baseUrl}/portfolio`, data);
  }

  // ── Projects ─────────────────────────────────────────────────────────
  getProjects(filters?: { category?: string; featured?: boolean }): Observable<Project[]> {
    let url = `${this.baseUrl}/projects`;
    const params: string[] = [];
    if (filters?.category) params.push(`category=${filters.category}`);
    if (filters?.featured !== undefined) params.push(`featured=${filters.featured}`);
    if (params.length) url += `?${params.join('&')}`;
    return this.http.get<Project[]>(url).pipe(
      catchError(() => of(this.getFallbackProjects()))
    );
  }

  createProject(project: Partial<Project>): Observable<Project> {
    return this.http.post<Project>(`${this.baseUrl}/projects`, project);
  }

  // ── Skills ───────────────────────────────────────────────────────────
  getSkills(): Observable<Skill[]> {
    return this.http.get<Skill[]>(`${this.baseUrl}/skills`).pipe(
      catchError(() => of(this.getFallbackSkills()))
    );
  }

  // ── Contact ──────────────────────────────────────────────────────────
  submitContact(form: ContactForm): Observable<any> {
    return this.http.post(`${this.baseUrl}/contact`, form);
  }

  // ── Fallback data (if API unavailable) ───────────────────────────────
  private getFallbackPortfolio(): Portfolio {
    return {
      name: 'Soumyaranjan Narendra',
      title: 'Senior Angular Developer',
      tagline: 'Crafting scalable web applications with 6.5+ years of Angular expertise',
      email: 'soumyaranjan@example.com',
      phone: '+91 98765 43210',
      location: 'Bhubaneswar, Odisha, India',
      github: 'https://github.com/soumyaranjan',
      linkedin: 'https://linkedin.com/in/soumyaranjan',
      twitter: 'https://twitter.com/soumyaranjan',
      bio: 'Passionate Senior Angular Developer with 6.5 years of hands-on experience building enterprise-grade web applications.',
      experience: [
        {
          company: 'TechCorp Solutions',
          role: 'Senior Angular Developer',
          duration: '2022 – Present',
          description: 'Leading frontend architecture for enterprise SaaS platform. Migrated legacy AngularJS app to Angular 17, improving performance by 60%.',
          technologies: ['Angular 17', 'NgRx', 'RxJS', 'TypeScript']
        },
        {
          company: 'Infosys Ltd',
          role: 'Angular Developer',
          duration: '2020 – 2022',
          description: 'Developed modular Angular components for banking portal serving 2M+ users.',
          technologies: ['Angular 12', 'Angular Material', 'RxJS', 'Jest']
        },
        {
          company: 'Wipro Digital',
          role: 'Frontend Developer',
          duration: '2018 – 2020',
          description: 'Built responsive dashboards and data visualization tools for telecom clients.',
          technologies: ['Angular 8', 'D3.js', 'SCSS', 'REST APIs']
        }
      ]
    };
  }

  private getFallbackProjects(): Project[] {
    return [
      {
        title: 'Enterprise Banking Portal',
        description: 'Full-scale banking platform serving 2M+ users with real-time transactions and analytics.',
        technologies: ['Angular 17', 'NgRx', 'Node.js', 'MongoDB'],
        category: 'Enterprise',
        github: '#',
        live: '#',
        featured: true,
        image: 'banking'
      },
      {
        title: 'E-Commerce Platform',
        description: 'Modern e-commerce solution with cart management, payment integration, and admin dashboard.',
        technologies: ['Angular 16', 'RxJS', 'Express.js', 'MongoDB'],
        category: 'E-Commerce',
        github: '#',
        live: '#',
        featured: true,
        image: 'ecommerce'
      },
      {
        title: 'Real-Time Analytics Dashboard',
        description: 'Interactive data visualization with real-time WebSocket updates and custom charts.',
        technologies: ['Angular 15', 'D3.js', 'Socket.io', 'Node.js'],
        category: 'Dashboard',
        github: '#',
        featured: true,
        image: 'dashboard'
      }
    ];
  }

  private getFallbackSkills(): Skill[] {
    return [
      { name: 'Angular', category: 'Frontend', level: 98, icon: 'angular' },
      { name: 'TypeScript', category: 'Language', level: 95, icon: 'typescript' },
      { name: 'RxJS', category: 'Frontend', level: 92, icon: 'rxjs' },
      { name: 'NgRx', category: 'State Mgmt', level: 90, icon: 'ngrx' },
      { name: 'JavaScript', category: 'Language', level: 93, icon: 'javascript' },
      { name: 'SCSS/Sass', category: 'Styling', level: 90, icon: 'sass' },
      { name: 'Node.js', category: 'Backend', level: 78, icon: 'nodejs' },
      { name: 'MongoDB', category: 'Database', level: 72, icon: 'mongodb' }
    ];
  }
}
