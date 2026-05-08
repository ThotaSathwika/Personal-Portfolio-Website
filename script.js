/**
 * Futuristic Portfolio - Main Script
 */

document.addEventListener('DOMContentLoaded', () => {
    // ==========================================================================
    // Custom Cursor Logic
    // ==========================================================================
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorGlow = document.querySelector('.cursor-glow');
    
    // Check if device supports hover (not touch device)
    if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
        let mouseX = 0, mouseY = 0;
        let glowX = 0, glowY = 0;
        
        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            
            // Move dot instantly
            cursorDot.style.left = mouseX + 'px';
            cursorDot.style.top = mouseY + 'px';
        });

        // Use requestAnimationFrame for smooth trailing glow
        const animateCursor = () => {
            // Lerp (Linear Interpolation) for smooth follow
            glowX += (mouseX - glowX) * 0.15;
            glowY += (mouseY - glowY) * 0.15;
            
            cursorGlow.style.left = glowX + 'px';
            cursorGlow.style.top = glowY + 'px';
            
            requestAnimationFrame(animateCursor);
        };
        animateCursor();

        // Add hover effect to interactive elements
        const interactiveElements = document.querySelectorAll('a, button, .skill-card, .project-card, .contact-link');
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                document.body.classList.add('cursor-hover');
            });
            el.addEventListener('mouseleave', () => {
                document.body.classList.remove('cursor-hover');
            });
        });
    }

    // ==========================================================================
    // Typewriter Effect
    // ==========================================================================
    const texts = [
        "CSE Undergraduate",
        "Aspiring Software Developer",
        "Frontend Enthusiast",
        "Creative Problem Solver"
    ];
    let count = 0;
    let index = 0;
    let currentText = '';
    let letter = '';
    let isDeleting = false;
    const typeSpeed = 100;
    const deleteSpeed = 50;
    const delayBetweenTexts = 2000;

    const typewriterText = document.querySelector('.typewriter-text');

    function type() {
        if (count === texts.length) {
            count = 0;
        }
        currentText = texts[count];

        if (isDeleting) {
            letter = currentText.slice(0, --index);
        } else {
            letter = currentText.slice(0, ++index);
        }

        typewriterText.textContent = letter;

        let typeTimeout = isDeleting ? deleteSpeed : typeSpeed;

        if (!isDeleting && letter.length === currentText.length) {
            typeTimeout = delayBetweenTexts;
            isDeleting = true;
        } else if (isDeleting && letter.length === 0) {
            isDeleting = false;
            count++;
            typeTimeout = 500;
        }

        setTimeout(type, typeTimeout);
    }
    
    // Start typewriter
    setTimeout(type, 1000);

    // ==========================================================================
    // GSAP Animations
    // ==========================================================================
    gsap.registerPlugin(ScrollTrigger);

    // Initial load animation
    const tl = gsap.timeline();
    tl.from('.glass-nav', { y: -100, opacity: 0, duration: 1, ease: 'power3.out' })
      .from('.hero-greeting', { y: 20, opacity: 0, duration: 0.8 }, '-=0.5')
      .from('.hero-title', { y: 20, opacity: 0, duration: 0.8 }, '-=0.6')
      .from('.subtitle-container', { y: 20, opacity: 0, duration: 0.8 }, '-=0.6')
      .from('.hero-cta a', { y: 20, opacity: 0, duration: 0.8, stagger: 0.2 }, '-=0.6')
      .from('.floating-element', { scale: 0, opacity: 0, duration: 1, stagger: 0.2 }, '-=0.5');

    // Scroll Animations
    gsap.utils.toArray('.section-title').forEach(title => {
        gsap.from(title, {
            scrollTrigger: {
                trigger: title,
                start: 'top 80%',
                toggleActions: 'play none none reverse'
            },
            y: 50,
            opacity: 0,
            duration: 0.8
        });
    });

    gsap.from('.about-text', {
        scrollTrigger: {
            trigger: '.about-container',
            start: 'top 75%'
        },
        y: 30,
        opacity: 0,
        duration: 1
    });

    gsap.from('.timeline-item', {
        scrollTrigger: {
            trigger: '.timeline',
            start: 'top 75%'
        },
        x: -50,
        opacity: 0,
        duration: 0.8,
        stagger: 0.3
    });

    gsap.from('.skill-card', {
        scrollTrigger: {
            trigger: '.skills-grid',
            start: 'top 80%'
        },
        y: 50,
        opacity: 0,
        duration: 0.6,
        stagger: 0.1
    });

    gsap.from('.contact-container', {
        scrollTrigger: {
            trigger: '.contact-section',
            start: 'top 80%'
        },
        scale: 0.9,
        opacity: 0,
        duration: 0.8
    });

    // ==========================================================================
    // Vanilla Tilt Initialization
    // ==========================================================================
    VanillaTilt.init(document.querySelectorAll(".tilt-card"), {
        max: 15,
        speed: 400,
        glare: true,
        "max-glare": 0.2,
        scale: 1.05
    });

    // ==========================================================================
    // GitHub API Fetcher
    // ==========================================================================
    const githubContainer = document.getElementById('github-projects-container');
    const githubUsername = 'ThotaSathwika';
    
    async function fetchGitHubProjects() {
        try {
            const response = await fetch(`https://api.github.com/users/${githubUsername}/repos?sort=updated&per_page=6`);
            if (!response.ok) throw new Error('Network response was not ok');
            
            const repos = await response.json();
            
            if (repos.length === 0) {
                githubContainer.innerHTML = '<p style="text-align:center; grid-column: 1/-1;">No public repositories found.</p>';
                return;
            }

            githubContainer.innerHTML = ''; // Clear loading

            repos.forEach((repo, index) => {
                // Skip forks if desired, or keep them. We'll keep them for now.
                const projectCard = document.createElement('div');
                projectCard.className = 'project-card glass-card tilt-card';
                projectCard.setAttribute('data-tilt', '');
                
                // Determine icon based on language or repo name (fallback to code)
                let iconClass = 'fas fa-code';
                if (repo.language === 'JavaScript' || repo.language === 'HTML') iconClass = 'fa-brands fa-js';
                if (repo.language === 'Python') iconClass = 'fa-brands fa-python';
                if (repo.language === 'Java') iconClass = 'fa-brands fa-java';

                projectCard.innerHTML = `
                    <div class="project-header">
                        <i class="${iconClass} project-icon"></i>
                        <div class="project-links">
                            <a href="${repo.html_url}" target="_blank" aria-label="GitHub Repository"><i class="fab fa-github"></i></a>
                            ${repo.homepage ? `<a href="${repo.homepage}" target="_blank" style="margin-left: 10px;" aria-label="Live Demo"><i class="fas fa-external-link-alt"></i></a>` : ''}
                        </div>
                    </div>
                    <h3 class="project-title">${repo.name.replace(/-/g, ' ')}</h3>
                    <p class="project-desc">${repo.description ? repo.description : 'A repository by Thota Sathwika.'}</p>
                    <div class="project-tech">
                        ${repo.language ? `<span class="tech-tag">${repo.language}</span>` : '<span class="tech-tag">Code</span>'}
                    </div>
                `;
                
                githubContainer.appendChild(projectCard);
            });

            // Re-initialize tilt for new elements
            VanillaTilt.init(document.querySelectorAll(".project-card"), {
                max: 15,
                speed: 400,
                glare: true,
                "max-glare": 0.1,
                scale: 1.02
            });

            // Animate newly added cards
            gsap.from('.project-card', {
                scrollTrigger: {
                    trigger: '.projects-grid',
                    start: 'top 80%'
                },
                y: 50,
                opacity: 0,
                duration: 0.6,
                stagger: 0.1
            });

        } catch (error) {
            console.error('Error fetching GitHub projects:', error);
            githubContainer.innerHTML = `
                <div style="grid-column: 1/-1; text-align: center;">
                    <p>Failed to load projects. Please visit my <a href="https://github.com/${githubUsername}" target="_blank" style="color:var(--primary-neon)">GitHub profile</a> directly.</p>
                </div>
            `;
        }
    }

    fetchGitHubProjects();

    // ==========================================================================
    // Interactive Particle Background (Antigravity Canvas)
    // ==========================================================================
    const canvas = document.getElementById('particle-canvas');
    const ctx = canvas.getContext('2d');
    let particlesArray = [];
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let mouse = {
        x: null,
        y: null,
        radius: 150 // Radius for mouse interaction
    };

    window.addEventListener('mousemove', (event) => {
        mouse.x = event.x;
        mouse.y = event.y;
    });

    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        initParticles();
    });

    class Particle {
        constructor(x, y, directionX, directionY, size, color) {
            this.x = x;
            this.y = y;
            this.directionX = directionX;
            this.directionY = directionY;
            this.size = size;
            this.color = color;
            this.baseX = this.x;
            this.baseY = this.y;
            this.density = (Math.random() * 30) + 1;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
            ctx.fillStyle = this.color;
            ctx.fill();
        }

        update() {
            // Check window bounds
            if (this.x > canvas.width || this.x < 0) {
                this.directionX = -this.directionX;
            }
            if (this.y > canvas.height || this.y < 0) {
                this.directionY = -this.directionY;
            }

            // Antigravity Mouse Interaction
            let dx = mouse.x - this.x;
            let dy = mouse.y - this.y;
            let distance = Math.sqrt(dx * dx + dy * dy);
            let forceDirectionX = dx / distance;
            let forceDirectionY = dy / distance;
            let maxDistance = mouse.radius;
            let force = (maxDistance - distance) / maxDistance;
            let directionX = forceDirectionX * force * this.density;
            let directionY = forceDirectionY * force * this.density;

            if (distance < mouse.radius) {
                // Push particles away (Antigravity)
                this.x -= directionX;
                this.y -= directionY;
            } else {
                // Slowly return to normal movement
                if (this.x !== this.baseX) {
                    let dx = this.x - this.baseX;
                    this.x -= dx / 50;
                }
                if (this.y !== this.baseY) {
                    let dy = this.y - this.baseY;
                    this.y -= dy / 50;
                }
            }

            // Normal float movement
            this.x += this.directionX;
            this.y += this.directionY;

            this.draw();
        }
    }

    function initParticles() {
        particlesArray = [];
        let numberOfParticles = (canvas.height * canvas.width) / 9000;
        
        for (let i = 0; i < numberOfParticles; i++) {
            let size = (Math.random() * 2) + 1;
            let x = (Math.random() * ((innerWidth - size * 2) - (size * 2)) + size * 2);
            let y = (Math.random() * ((innerHeight - size * 2) - (size * 2)) + size * 2);
            let directionX = (Math.random() * 0.5) - 0.25;
            let directionY = (Math.random() * -1) - 0.5; // Always drift slightly upwards
            // Mix of purple and blue particles
            let color = Math.random() > 0.5 ? 'rgba(139, 92, 246, 0.4)' : 'rgba(59, 130, 246, 0.4)';
            
            particlesArray.push(new Particle(x, y, directionX, directionY, size, color));
        }
    }

    function animateParticles() {
        requestAnimationFrame(animateParticles);
        ctx.clearRect(0, 0, innerWidth, innerHeight);
        
        for (let i = 0; i < particlesArray.length; i++) {
            particlesArray[i].update();
        }
        connectParticles();
    }

    function connectParticles() {
        let opacityValue = 1;
        for (let a = 0; a < particlesArray.length; a++) {
            for (let b = a; b < particlesArray.length; b++) {
                let distance = ((particlesArray[a].x - particlesArray[b].x) * (particlesArray[a].x - particlesArray[b].x))
                             + ((particlesArray[a].y - particlesArray[b].y) * (particlesArray[a].y - particlesArray[b].y));
                if (distance < (canvas.width / 7) * (canvas.height / 7)) {
                    opacityValue = 1 - (distance / 20000);
                    ctx.strokeStyle = `rgba(139, 92, 246, ${opacityValue * 0.2})`;
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                    ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                    ctx.stroke();
                }
            }
        }
    }

    initParticles();
    animateParticles();

    // ==========================================================================
    // Navigation highlighting and scroll offset
    // ==========================================================================
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-links a');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= (sectionTop - sectionHeight / 3)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(a => {
            a.classList.remove('active');
            if (a.getAttribute('href').includes(current)) {
                a.classList.add('active');
            }
        });
    });

    // Mobile menu toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinksContainer = document.querySelector('.nav-links');
    
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', () => {
            navLinksContainer.style.display = navLinksContainer.style.display === 'flex' ? 'none' : 'flex';
            navLinksContainer.style.flexDirection = 'column';
            navLinksContainer.style.position = 'absolute';
            navLinksContainer.style.top = '100%';
            navLinksContainer.style.left = '0';
            navLinksContainer.style.width = '100%';
            navLinksContainer.style.background = 'rgba(5, 5, 5, 0.95)';
            navLinksContainer.style.padding = '2rem';
            navLinksContainer.style.borderBottom = '1px solid var(--glass-border)';
        });
    }
});
