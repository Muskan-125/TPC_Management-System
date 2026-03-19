import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaGraduationCap, FaBuilding, FaCogs, FaUsers, FaBriefcase, FaHandshake, FaArrowRight, FaStar } from 'react-icons/fa';

const Home = () => {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { type: 'spring', stiffness: 100 }
    }
  };

  const statsVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { type: 'spring', stiffness: 100, delay: 0.5 }
    }
  };

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero position-relative overflow-hidden">
        {/* Floating Shapes */}
        <div className="hero-shape hero-shape-1"></div>
        <div className="hero-shape hero-shape-2"></div>
        <div className="hero-shape hero-shape-3"></div>
        
        <div className="container position-relative">
          <div className="row align-items-center min-vh-75">
            <div className="col-lg-7">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              >
                <span className="badge bg-white bg-opacity-25 text-white px-4 py-2 mb-4 fw-semibold" style={{ fontSize: '0.9rem' }}>
                  <FaStar className="me-2" /> #1 Placement Platform
                </span>
                <h1 className="display-3 fw-bold mb-4" style={{ lineHeight: 1.2 }}>
                  Training & <br />
                  <span className="text-white">Placement Cell</span>
                </h1>
                <p className="lead mb-4 fs-5" style={{ opacity: 0.9, maxWidth: '500px' }}>
                  Connecting exceptional talent with leading organizations. 
                  Your journey to a successful career starts here.
                </p>
                <div className="d-flex gap-3 flex-wrap">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Link to="/jobs" className="btn btn-light btn-lg px-5 py-3 fw-semibold">
                      <FaBriefcase className="me-2" />
                      Browse Jobs
                      <FaArrowRight className="ms-2" />
                    </Link>
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Link to="/register" className="btn btn-outline-light btn-lg px-5 py-3 fw-semibold">
                      Get Started
                    </Link>
                  </motion.div>
                </div>
              </motion.div>
            </div>
            <div className="col-lg-5 d-none d-lg-block">
              <motion.div
                initial={{ opacity: 0, scale: 0.8, rotate: 5 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="position-relative"
              >
                {/* Floating Cards */}
                <motion.div
                  animate={{ y: [0, -20, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="position-absolute"
                  style={{ top: '10%', right: '10%', zIndex: 1 }}
                >
                  <div className="card border-0 shadow-lg p-4" style={{ width: '200px', background: 'rgba(255,255,255,0.95)', borderRadius: '20px' }}>
                    <div className="d-flex align-items-center gap-3">
                      <div className="rounded-circle bg-success bg-opacity-25 p-3">
                        <FaGraduationCap className="text-success fs-4" />
                      </div>
                      <div>
                        <div className="fw-bold">500+</div>
                        <div className="text-muted small">Students Placed</div>
                      </div>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  animate={{ y: [0, 15, 0] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                  className="position-absolute"
                  style={{ bottom: '20%', left: '0', zIndex: 2 }}
                >
                  <div className="card border-0 shadow-lg p-4" style={{ width: '220px', background: 'rgba(255,255,255,0.95)', borderRadius: '20px' }}>
                    <div className="d-flex align-items-center gap-3">
                      <div className="rounded-circle bg-primary bg-opacity-25 p-3">
                        <FaBuilding className="text-primary fs-4" />
                      </div>
                      <div>
                        <div className="fw-bold">100+</div>
                        <div className="text-muted small">Top Companies</div>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Main Image Placeholder */}
                <div className="position-relative" style={{ marginLeft: '2rem' }}>
                  <div className="bg-white bg-opacity-10 rounded-4 p-5 text-center" style={{ backdropFilter: 'blur(10px)' }}>
                    <FaHandshake className="text-white" style={{ fontSize: '5rem', opacity: 0.8 }} />
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
        
        {/* Wave Divider */}
        <div className="position-absolute bottom-0 w-100" style={{ transform: 'translateY(1px)' }}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" preserveAspectRatio="none">
            <path fill="#f8fafc" fillOpacity="1" d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,112C672,96,768,96,864,112C960,128,1056,160,1152,160C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
          </svg>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-5">
        <div className="container">
          <motion.div 
            className="text-center mb-5"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="badge bg-primary bg-opacity-10 text-primary px-4 py-2 mb-3 fw-semibold">
              Why Choose Us
            </span>
            <h2 className="fw-bold display-5 mb-3">Everything You Need</h2>
            <p className="text-muted fs-5 mx-auto" style={{ maxWidth: '600px' }}>
              We provide end-to-end placement solutions for students, companies, and institutions.
            </p>
          </motion.div>

          <motion.div 
            className="row g-4"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <div className="col-md-4">
              <motion.div variants={itemVariants} className="feature-card h-100">
                <div className="feature-icon">
                  <FaGraduationCap />
                </div>
                <h4 className="fw-bold mb-3">For Students</h4>
                <p className="text-muted mb-4">
                  Access hundreds of job opportunities, track your applications, and get placed in top companies.
                </p>
                <Link to="/register" className="btn btn-outline-primary rounded-pill px-4">
                  Register Now <FaArrowRight className="ms-2" />
                </Link>
              </motion.div>
            </div>

            <div className="col-md-4">
              <motion.div variants={itemVariants} className="feature-card h-100">
                <div className="feature-icon">
                  <FaBuilding />
                </div>
                <h4 className="fw-bold mb-3">For Companies</h4>
                <p className="text-muted mb-4">
                  Post jobs, browse talented candidates, and streamline your recruitment process.
                </p>
                <Link to="/register" className="btn btn-outline-success rounded-pill px-4">
                  Register Now <FaArrowRight className="ms-2" />
                </Link>
              </motion.div>
            </div>

            <div className="col-md-4">
              <motion.div variants={itemVariants} className="feature-card h-100">
                <div className="feature-icon">
                  <FaCogs />
                </div>
                <h4 className="fw-bold mb-3">For Administrators</h4>
                <p className="text-muted mb-4">
                  Manage students, companies, and placements with powerful admin tools.
                </p>
                <Link to="/login" className="btn btn-outline-warning rounded-pill px-4">
                  Admin Login <FaArrowRight className="ms-2" />
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section py-5">
        <div className="container">
          <motion.div 
            className="row g-4 text-center"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <div className="col-6 col-md-3">
              <motion.div variants={statsVariants}>
                <div className="stats-card">
                  <div className="stats-number">
                    <motion.span
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                    >500+</motion.span>
                  </div>
                  <div className="stats-label">
                    <FaUsers className="me-2" />
                    Students
                  </div>
                </div>
              </motion.div>
            </div>
            <div className="col-6 col-md-3">
              <motion.div variants={statsVariants}>
                <div className="stats-card">
                  <div className="stats-number">100+</div>
                  <div className="stats-label">
                    <FaBuilding className="me-2" />
                    Companies
                  </div>
                </div>
              </motion.div>
            </div>
            <div className="col-6 col-md-3">
              <motion.div variants={statsVariants}>
                <div className="stats-card">
                  <div className="stats-number">200+</div>
                  <div className="stats-label">
                    <FaBriefcase className="me-2" />
                    Jobs Posted
                  </div>
                </div>
              </motion.div>
            </div>
            <div className="col-6 col-md-3">
              <motion.div variants={statsVariants}>
                <div className="stats-card">
                  <div className="stats-number">150+</div>
                  <div className="stats-label">
                    <FaHandshake className="me-2" />
                    Placements
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-5 bg-light">
        <div className="container">
          <motion.div 
            className="text-center mb-5"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="badge bg-primary bg-opacity-10 text-primary px-4 py-2 mb-3 fw-semibold">
              How It Works
            </span>
            <h2 className="fw-bold display-5 mb-3">Simple Process</h2>
            <p className="text-muted fs-5 mx-auto" style={{ maxWidth: '600px' }}>
              Get started in just three easy steps
            </p>
          </motion.div>

          <div className="row g-4">
            {[
              { icon: FaUserPlus, title: 'Create Account', desc: 'Register as a student or company', color: 'primary' },
              { icon: FaBriefcase, title: 'Post/Browse Jobs', desc: 'Companies post jobs, students browse', color: 'success' },
              { icon: FaHandshake, title: 'Get Placed', desc: 'Apply, interview, and get hired', color: 'warning' }
            ].map((step, index) => (
              <div className="col-md-4" key={index}>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2 }}
                  className="text-center"
                >
                  <div 
                    className="d-inline-flex align-items-center justify-content-center rounded-circle mb-4 position-relative"
                    style={{ 
                      width: '80px', 
                      height: '80px',
                      background: `var(--bs-${step.color})`,
                      color: 'white',
                      fontSize: '1.75rem'
                    }}
                  >
                    <step.icon />
                    <span 
                      className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-dark"
                      style={{ fontSize: '0.8rem' }}
                    >
                      {index + 1}
                    </span>
                  </div>
                  <h4 className="fw-bold mb-2">{step.title}</h4>
                  <p className="text-muted">{step.desc}</p>
                </motion.div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-5">
        <div className="container">
          <motion.div 
            className="card border-0 overflow-hidden"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            style={{ background: 'linear-gradient(135deg, #1e293b 0%, #2563eb 100%)' }}
          >
            <div className="card-body p-5 text-center text-white">
              <h2 className="fw-bold display-5 mb-3">Ready to Kickstart Your Career?</h2>
              <p className="fs-5 mb-4" style={{ opacity: 0.9 }}>
                Join thousands of students who found their dream jobs through our platform.
              </p>
              <div className="d-flex gap-3 justify-content-center flex-wrap">
                <Link to="/register" className="btn btn-light btn-lg px-5 py-3 fw-semibold">
                  Get Started Now
                </Link>
                <Link to="/jobs" className="btn btn-outline-light btn-lg px-5 py-3 fw-semibold">
                  View All Jobs
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="row g-4">
            <div className="col-lg-4">
              <h5 className="fw-bold mb-3">
                <span className="gradient-text">TPC Management</span>
              </h5>
              <p style={{ opacity: 0.8 }}>
                Training and Placement Cell Management System - Connecting talent with opportunity.
              </p>
            </div>
            <div className="col-lg-4">
              <h5 className="fw-bold mb-3">Quick Links</h5>
              <ul className="list-unstyled">
                <li className="mb-2"><Link to="/jobs" className="text-white text-decoration-none">Browse Jobs</Link></li>
                <li className="mb-2"><Link to="/register" className="text-white text-decoration-none">Register</Link></li>
                <li className="mb-2"><Link to="/login" className="text-white text-decoration-none">Login</Link></li>
              </ul>
            </div>
            <div className="col-lg-4">
              <h5 className="fw-bold mb-3">Contact</h5>
              <p style={{ opacity: 0.8 }} className="mb-1">
                <i className="bi bi-envelope me-2"></i>
                tpc@institution.edu
              </p>
              <p style={{ opacity: 0.8 }}>
                <i className="bi bi-phone me-2"></i>
                +91 1234567890
              </p>
            </div>
          </div>
          <hr style={{ opacity: 0.2 }} />
          <div className="text-center" style={{ opacity: 0.6 }}>
            <small>© 2024 TPC Management System. All rights reserved.</small>
          </div>
        </div>
      </footer>
    </div>
  );
};

// Helper component for icons that need to be created
const FaUserPlus = () => (
  <svg width="1em" height="1em" viewBox="0 0 24 24" fill="currentColor">
    <path d="M15 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm-9-2V7H4v3H1v2h3v3h2v-3h3v-2H6zm9 4c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
  </svg>
);

export default Home;

