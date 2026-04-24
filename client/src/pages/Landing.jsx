import React from 'react';
import { Link } from 'react-router-dom';
import './Landing.css';
import { useAuth } from '../context/AuthContext';
import heroImage from '../assets/hero-car.png';

export default function Landing() {
  const { user } = useAuth();

  return (
    <div className="landing-container">
      <nav className="landing-nav">
        <div className="logo">
          <span className="logo-icon">⚡</span>
          <span className="logo-text">RideNext</span>
        </div>
        <div className="nav-links">
          {!user ? (
            <>
              <Link to="/login" className="btn-secondary">Sign In</Link>
              <Link to="/signup" className="btn-primary">Sign Up</Link>
            </>
          ) : (
            <Link to="/dashboard" className="btn-primary">Go to Dashboard</Link>
          )}
        </div>
      </nav>

      <header className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            The Future of <br />
            <span className="text-accent">Vehicle Rental</span>
          </h1>
          <p className="hero-subtitle">
            Experience seamless mobility with RideNext. Premium vehicles, 
            instant reservations, and smart management all in one place.
          </p>
          <div className="hero-actions">
            <Link to="/vehicles" className="btn-primary btn-lg">Explore Fleet</Link>
            {!user && <Link to="/signup" className="btn-outline btn-lg">Get Started</Link>}
          </div>
        </div>
        <div className="hero-image-container">
          <img src={heroImage} alt="Premium Vehicle" className="hero-image" />
          <div className="hero-glow"></div>
        </div>
      </header>

      <section className="features-section">
        <div className="section-header">
          <h2 className="section-title">Key Features</h2>
          <p className="section-subtitle">Everything you need to manage your rentals efficiently.</p>
        </div>
        
        <div className="features-grid">
          <div className="feature-card card">
            <div className="feature-icon">🚗</div>
            <h3>Vehicle Rental</h3>
            <p>Choose from our wide range of premium vehicles across multiple categories and branches.</p>
          </div>
          
          <div className="feature-card card">
            <div className="feature-icon">📅</div>
            <h3>Easy Reservations</h3>
            <p>Book your ride in seconds with our intuitive reservation system and real-time availability.</p>
          </div>
          
          <div className="feature-card card">
            <div className="feature-icon">💳</div>
            <h3>Secure Payments</h3>
            <p>Seamless and secure payment processing with detailed invoices and transaction history.</p>
          </div>
          
          <div className="feature-card card">
            <h3>Fleet Management</h3>
            <div className="feature-icon">🛠️</div>
            <p>Keep track of maintenance, insurance, and damage reports to ensure maximum reliability.</p>
          </div>
        </div>
      </section>

      <footer className="landing-footer">
        <div className="footer-content">
          <p>&copy; 2026 RideNext. All rights reserved.</p>
          <div className="footer-links">
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
            <span>Contact Us</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
