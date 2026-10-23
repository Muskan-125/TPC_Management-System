import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaGraduationCap, FaBuilding, FaCogs, FaUsers, FaBriefcase, FaHandshake, FaArrowRight, FaStar } from 'react-icons/fa';

const Home = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.3 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } }
  };

  const statsVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { type: 'spring', stiffness: 100, delay: 0.5 } }
  };

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section id="home-hero" className="hero position-relative overflow-hidden">
        <div className="hero-shape hero-shape-1"></div>
        <div className="hero-shape hero-shape-2"></div>
        <div className="hero-shape hero-shape-3"></div>

        <div className="hero-content">
          <div className="hero-layout">
            <motion.div
              className="hero-inner"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            >
              <span className="hero-badge">
                <FaStar className="me-2" /> #1 Placement Platform
              </span>

              <p className="hero-institute">
                Bundelkhand Institute of Engineering &amp; Technology
              </p>

              <h1 className="hero-title">
                Training &amp; <span>Placement Cell</span>
              </h1>

              <div className="hero-divider"></div>

              <p className="hero-subtitle">
                Connecting exceptional talent with leading organizations.
                Your journey to a successful career starts here.
              </p>

              <div className="hero-actions">
                <Link to="/register" className="btn btn-light btn-lg px-5 fw-semibold">
                  Get Started
                </Link>
                <Link to="/jobs" className="btn btn-outline-light btn-lg px-5 fw-semibold">
                  Browse Jobs
                </Link>
              </div>
            </motion.div>

            <motion.aside
              className="updates-panel"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
            >
              <div className="updates-header">Important Updates</div>
              <ul className="updates-list">
                <li>
                  <span className="updates-dot"></span>
                  <div>
                    <strong>Infosys</strong>
                    <p>Shortlisted students have been released for the interview round.</p>
                  </div>
                </li>
                <li>
                  <span className="updates-dot"></span>
                  <div>
                    <strong>TCS</strong>
                    <p>Application form for the next recruitment drive is now live.</p>
                  </div>
                </li>
                <li>
                  <span className="updates-dot"></span>
                  <div>
                    <strong>Capgemini</strong>
                    <p>Final shortlisted students list has been announced for the company process.</p>
                  </div>
                </li>
              </ul>
            </motion.aside>
          </div>
        </div>

        {/* Wave Divider */}
        <div className="position-absolute bottom-0 w-100" style={{ transform: 'translateY(1px)', height: '220px' }}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 420" preserveAspectRatio="none" style={{ width: '100%', height: '100%' }}>
            <path fill="#f8fafc" fillOpacity="1" d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,112C672,96,768,96,864,112C960,128,1056,160,1152,160C1248,160,1344,128,1392,112L1440,96L1440,420L0,420Z"></path>
          </svg>
        </div>
      </section>

      {/* Features Section */}
      <section id="why-choose-us" className="py-5">
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
                <div className="feature-icon"><FaGraduationCap /></div>
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
                <div className="feature-icon"><FaBuilding /></div>
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
                <div className="feature-icon"><FaCogs /></div>
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
            {[
              { num: '500+', label: 'Students', Icon: FaUsers },
              { num: '100+', label: 'Companies', Icon: FaBuilding },
              { num: '200+', label: 'Jobs Posted', Icon: FaBriefcase },
              { num: '150+', label: 'Placements', Icon: FaHandshake }
            ].map((s, i) => (
              <div className="col-6 col-md-3" key={i}>
                <motion.div variants={statsVariants}>
                  <div className="stats-card">
                    <div className="stats-number">{s.num}</div>
                    <div className="stats-label">
                      <s.Icon className="me-2" />
                      {s.label}
                    </div>
                  </div>
                </motion.div>
              </div>
            ))}
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
            style={{ background: 'linear-gradient(135deg, #1e293b 0%, #dc2626 100%)' }}
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
      <footer id="footer" className="footer">
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
              <h5 className="fw-bold mb-3">
                <a href="mailto:tpc@institution.edu" className="text-white text-decoration-none">Contact Us</a>
              </h5>
              <p style={{ opacity: 0.8 }} className="mb-1">
                <i className="bi bi-envelope me-2"></i>
                <a href="mailto:tpc@institution.edu" className="text-white text-decoration-none">tpc@institution.edu</a>
              </p>
              <p style={{ opacity: 0.8 }}>
                <i className="bi bi-phone me-2"></i>
                <a href="tel:+911234567890" className="text-white text-decoration-none">+91 1234567890</a>
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

// Helper icon
const FaUserPlus = () => (
  <svg width="1em" height="1em" viewBox="0 0 24 24" fill="currentColor">
    <path d="M15 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm-9-2V7H4v3H1v2h3v3h2v-3h3v-2H6zm9 4c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
  </svg>
);

export default Home;