export interface Portfolio {
  _id?: string;
  name: string;
  title: string;
  tagline: string;
  email: string;
  phone: string;
  location: string;
  github: string;
  linkedin: string;
  twitter: string;
  bio: string;
  experience: Experience[];
}

export interface Experience {
  company: string;
  role: string;
  duration: string;
  description: string;
  technologies: string[];
}

export interface Skill {
  _id?: string;
  name: string;
  category: string;
  level: number;
  icon: string;
}

export interface Project {
  _id?: string;
  title: string;
  description: string;
  technologies: string[];
  category: string;
  github: string;
  live?: string;
  featured: boolean;
  image: string;
}

export interface ContactForm {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
  success?: boolean;
}
