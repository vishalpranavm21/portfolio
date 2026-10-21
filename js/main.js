/**
 * ============================================================================
 * MAIN APPLICATION LOGIC - M VISHAL PRANAV PORTFOLIO
 * Implements interactive behaviors, form validation, project modal,
 * navigation scrollspy, and the interactive Course Verification Inspector.
 * ============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // --------------------------------------------------------------------------
  // 1. TYPING TEXT EFFECT (HERO SUBTITLE)
  // --------------------------------------------------------------------------
  const typingElement = document.getElementById('typing-subtitle');
  if (typingElement) {
    const roles = [
      'M.Tech Software Engineering @ RVCE',
      'Cloud-Native & DevOps Engineer',
      'AI Guardrails & GitOps Architect',
      'QA & Automation Testing Specialist',
      'IEEE Published Researcher'
    ];
    let roleIdx = 0;
    let charIdx = 0;
    let isDeleting = false;
    const typeSpeed = 70;
    const deleteSpeed = 35;
    const pauseTime = 1800;

    function typeLoop() {
      const currentRole = roles[roleIdx];
      if (isDeleting) {
        typingElement.textContent = currentRole.substring(0, charIdx - 1);
        charIdx--;
      } else {
        typingElement.textContent = currentRole.substring(0, charIdx + 1);
        charIdx++;
      }

      let timeout = isDeleting ? deleteSpeed : typeSpeed;

      if (!isDeleting && charIdx === currentRole.length) {
        timeout = pauseTime;
        isDeleting = true;
      } else if (isDeleting && charIdx === 0) {
        isDeleting = false;
        roleIdx = (roleIdx + 1) % roles.length;
        timeout = 400;
      }

      setTimeout(typeLoop, timeout);
    }
    typeLoop();
  }

  // --------------------------------------------------------------------------
  // 2. HEADER SCROLL & NAVIGATION SCROLLSPY
  // --------------------------------------------------------------------------
  const header = document.querySelector('.site-header');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    // Header shadow on scroll
    if (window.scrollY > 40) {
      header?.classList.add('scrolled');
    } else {
      header?.classList.remove('scrolled');
    }

    // Scrollspy section tracking
    let currentId = '';
    const scrollPosition = window.scrollY + 200;

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      if (scrollPosition >= top && scrollPosition < top + height) {
        currentId = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentId}`) {
        link.classList.add('active');
      }
    });
  }, { passive: true });

  // --------------------------------------------------------------------------
  // 3. MOBILE MENU TOGGLE
  // --------------------------------------------------------------------------
  const navToggleBtn = document.querySelector('.nav-toggle-btn');
  const siteNav = document.querySelector('.site-nav');

  if (navToggleBtn && siteNav) {
    navToggleBtn.addEventListener('click', () => {
      const isOpen = siteNav.classList.toggle('nav-open');
      navToggleBtn.setAttribute('aria-expanded', isOpen);
    });

    // Close when clicking nav link on mobile
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        siteNav.classList.remove('nav-open');
        navToggleBtn.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // --------------------------------------------------------------------------
  // 4. CHECKPOINT 1: FUNCTIONAL USER COMMUNICATION FORM (<form>)
  // Validates email constraints, handles user feedback, and simulates submit
  // --------------------------------------------------------------------------
  const contactForm = document.getElementById('contact-form');
  const formFeedback = document.getElementById('form-feedback');
  const submitBtn = document.getElementById('submit-btn');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const nameInput = document.getElementById('name');
      const emailInput = document.getElementById('email');
      const subjectInput = document.getElementById('subject');
      const messageInput = document.getElementById('message');

      // Basic input verification
      if (!nameInput.value.trim() || !emailInput.value.trim() || !messageInput.value.trim()) {
        showFeedback('Please fill out all required fields.', 'error');
        return;
      }

      // Email RFC constraint regex
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(emailInput.value.trim())) {
        showFeedback('Please provide a valid email address (e.g., user@domain.com).', 'error');
        emailInput.focus();
        return;
      }

      // Submission UI state
      const originalBtnHTML = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = `
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="spin">
          <circle cx="12" cy="12" r="10" stroke-dasharray="32" stroke-linecap="round"></circle>
        </svg>
        Sending Dispatch...
      `;

      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnHTML;
        showFeedback(`Thank you ${nameInput.value.trim()}! Your communication has been dispatched to Vishal Pranav.`, 'success');
        contactForm.reset();
      }, 1200);
    });
  }

  function showFeedback(message, type) {
    if (!formFeedback) return;
    formFeedback.textContent = message;
    formFeedback.className = `form-feedback ${type}`;
    formFeedback.style.display = 'flex';

    setTimeout(() => {
      if (type === 'success') {
        formFeedback.style.display = 'none';
      }
    }, 6000);
  }

  // --------------------------------------------------------------------------
  // 5. PROJECT DETAILS MODAL DIALOG
  // Comprehensive architectural deep-dives from Vishal's resume
  // --------------------------------------------------------------------------
  const projectDetails = {
    'driftguard': {
      title: 'DriftGuard: AI-Guardrailed Autonomous GitOps Platform',
      category: 'Cloud Infrastructure & DevOps Automation',
      meta: 'AWS EKS | Terraform | Atlantis | FluxCD | Claude API | OPA / Kyverno | Falco',
      body: `
        <p><strong>Architecture Overview:</strong> A resilient, self-healing GitOps platform deployed on AWS Elastic Kubernetes Service (EKS) designed to auto-detect and reconcile infrastructure drift seamlessly.</p>
        <ul style="margin: 1rem 0 1rem 1.25rem; line-height: 1.7; color: var(--text-secondary);">
          <li><strong>Autonomous Drift Detection:</strong> Leverages Terraform, Atlantis PR automation, and FluxCD GitOps operators to ensure runtime state continually mirrors declaratively stored git configuration.</li>
          <li><strong>AI Guardrail Admission Engine:</strong> Integrated Anthropic Claude API to evaluate pull-request infrastructure changes and risk scores, feeding dynamic admission decisions directly into Open Policy Agent (OPA) and Kyverno admission webhooks.</li>
          <li><strong>Zero-Static-Secret Pipeline:</strong> Engineered IRSA (IAM Roles for Service Accounts) with Jenkins and AWS Secrets Manager, eliminating all long-lived static credentials from CI/CD runners.</li>
          <li><strong>Runtime Threat Defense:</strong> Deployed Falco runtime security daemon to flag kernel-level anomalies and unauthorized access events in real time.</li>
        </ul>
        <div style="margin-top: 1.5rem; display: flex; gap: 0.5rem; flex-wrap: wrap;">
          <span class="tech-tag">AWS EKS</span>
          <span class="tech-tag">Terraform</span>
          <span class="tech-tag">Atlantis</span>
          <span class="tech-tag">FluxCD</span>
          <span class="tech-tag">Claude API</span>
          <span class="tech-tag">OPA</span>
          <span class="tech-tag">Falco</span>
        </div>
      `
    },
    'iot-usv': {
      title: 'IoT-Enabled USV for Aid Deployment Using YOLOv6-N & LoRa',
      category: 'Robotics, Computer Vision & Edge IoT',
      meta: 'IEEE Published (DOI: 10.1109/IITCEE64140.2025.10915282) | KSCST Funded',
      body: `
        <p><strong>Research & Engineering Synopsis:</strong> An autonomous Unmanned Surface Vehicle (USV) engineered for maritime and flood rescue operations, funded by the Karnataka State Council for Science and Technology (KSCST) and published in IEEE.</p>
        <ul style="margin: 1rem 0 1rem 1.25rem; line-height: 1.7; color: var(--text-secondary);">
          <li><strong>Real-Time Computer Vision:</strong> Embedded YOLOv6-Nano with OpenCV on an edge compute board to execute real-time human distress detection under turbulent water conditions.</li>
          <li><strong>Long-Range Telemetry:</strong> Architected LoRa RF (SX1278 transceiver) communication pipeline achieving ~1 km operational telemetry in GPS-denied or degraded marine zones.</li>
          <li><strong>Autonomous Aid Dispenser:</strong> Designed a buoyant catamaran/lifebuoy hull equipped with an onboard robotic manipulator mechanism to safely release life-saving flotation gear.</li>
          <li><strong>Cloud Telemetry:</strong> Synced GPS tracking and vehicle battery telemetry to Blynk IoT dashboard for emergency response team coordination.</li>
        </ul>
      `
    },
    'offline-qa': {
      title: 'Offline AI-Based Q&A Generator',
      category: 'Local LLMs, Embeddings & Orchestration',
      meta: 'Python | PyMuPDF | Tesseract OCR | MiniLM / BGE | Minikube | Ansible',
      body: `
        <p><strong>System Engineering Synopsis:</strong> A completely air-gapped, zero-cloud educational question generator parsing complex PDF notes into contextual assessment questions.</p>
        <ul style="margin: 1rem 0 1rem 1.25rem; line-height: 1.7; color: var(--text-secondary);">
          <li><strong>Document Parsing Engine:</strong> Leveraged PyMuPDF for structural document extraction and Tesseract OCR for digitized scanned diagrams and formulas.</li>
          <li><strong>Local Embedding & Retrieval:</strong> Utilized lightweight quantized offline sentence transformers (MiniLM, BGE, E5) running locally without outbound API calls to generate semantic chunks.</li>
          <li><strong>Containerized Infrastructure:</strong> Encapsulated all dependencies into production Docker containers orchestrated locally using Minikube.</li>
          <li><strong>Infrastructure Automation:</strong> Built Ansible playbooks to provision and configure multi-node test environments identically across development workstations.</li>
        </ul>
      `
    },
    'project-pilot': {
      title: 'Project Pilot: Academic Guidance Management System - QA & Testing',
      category: 'Quality Assurance, V-Model & Automated E2E',
      meta: 'Selenium | pytest | Jest | Postman | Browser DevTools | V-Model',
      body: `
        <p><strong>Testing & Verification Framework:</strong> Rigorous end-to-end quality assurance program for a comprehensive student-mentor coordination web application.</p>
        <ul style="margin: 1rem 0 1rem 1.25rem; line-height: 1.7; color: var(--text-secondary);">
          <li><strong>V-Model Methodology:</strong> Structured the verification lifecycle spanning requirement analysis, unit testing, integration verification, and user acceptance criteria.</li>
          <li><strong>Automated E2E Testing:</strong> Authored automated test suites with Selenium WebDriver for cross-browser regression testing across Chromium and Gecko engines.</li>
          <li><strong>Frontend & Backend Unit Testing:</strong> Implemented Jest unit suites for frontend UI components and pytest fixtures for backend REST API endpoints.</li>
          <li><strong>Traceability & Reporting:</strong> Maintained comprehensive Test Plans, Traceability Matrices, and Problem Reports documenting reproduction steps and resolution audits.</li>
        </ul>
      `
    }
  };

  const modalBackdrop = document.getElementById('project-modal');
  const modalContent = document.getElementById('modal-dynamic-content');
  const modalCloseBtn = document.getElementById('modal-close-btn');

  document.querySelectorAll('.open-modal-btn').forEach(button => {
    button.addEventListener('click', () => {
      const projectId = button.getAttribute('data-project');
      const data = projectDetails[projectId];
      if (data && modalContent && modalBackdrop) {
        modalContent.innerHTML = `
          <div style="margin-bottom: 0.5rem; display: inline-block;" class="section-tag">${data.category}</div>
          <h2 style="font-size: 1.5rem; font-weight: 800; margin-bottom: 0.5rem; color: #fff;">${data.title}</h2>
          <div style="font-family: var(--font-mono); font-size: 0.8rem; color: var(--cyan-400); margin-bottom: 1.5rem; padding-bottom: 0.75rem; border-bottom: 1px solid var(--border-subtle);">${data.meta}</div>
          <div>${data.body}</div>
        `;
        modalBackdrop.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  function closeModal() {
    if (modalBackdrop) {
      modalBackdrop.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  modalCloseBtn?.addEventListener('click', closeModal);
  modalBackdrop?.addEventListener('click', (e) => {
    if (e.target === modalBackdrop) closeModal();
  });
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });

  // --------------------------------------------------------------------------
  // 6. COURSE VERIFICATION INSPECTOR TOGGLE
  // Toggles visual checkpoints reinforcing HTML5, CSS3, Flexbox & Grid concepts
  // --------------------------------------------------------------------------
  const verifyToggleBtn = document.getElementById('verify-toggle-btn');
  if (verifyToggleBtn) {
    verifyToggleBtn.addEventListener('click', () => {
      const isVerified = document.body.classList.toggle('verification-mode');
      verifyToggleBtn.classList.toggle('active', isVerified);
      verifyToggleBtn.setAttribute('aria-pressed', isVerified);
      
      const banner = document.getElementById('verification-banner');
      if (banner) {
        banner.style.display = isVerified ? 'flex' : 'none';
      }
    });
  }

  // --------------------------------------------------------------------------
  // 7. 3D TILT MICRO-INTERACTIONS
  // Interactive 3D tilt effect on project cards
  // --------------------------------------------------------------------------
  const tiltCards = document.querySelectorAll('.project-card, .profile-avatar-frame');
  tiltCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -6;
      const rotateY = ((x - centerX) / centerX) * 6;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
});
