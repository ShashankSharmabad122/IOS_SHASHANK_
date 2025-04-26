// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize theme
    initTheme();
    
    // Update current time
    updateTime();
    setInterval(updateTime, 60000); // Update every minute
    
    // Set current year in footer
    document.getElementById('currentYear').textContent = new Date().getFullYear();
    
    // Mobile menu functionality
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const closeMenu = document.getElementById('closeMenu');
    const mobileMenu = document.getElementById('mobileMenu');
    
    if (mobileMenuToggle && closeMenu && mobileMenu) {
        mobileMenuToggle.addEventListener('click', function() {
            mobileMenu.classList.add('active');
        });
        
        closeMenu.addEventListener('click', function() {
            mobileMenu.classList.remove('active');
        });
    }
    
    // Navigation active state
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.main-nav a');
    
    window.addEventListener('scroll', function() {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (pageYOffset >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').substring(1) === current) {
                link.classList.add('active');
            }
        });
        
        // Show/hide back to top button
        const backToTop = document.getElementById('backToTop');
        if (backToTop) {
            if (window.scrollY > 500) {
                backToTop.classList.add('visible');
            } else {
                backToTop.classList.remove('visible');
            }
        }
    });
    
    // Back to top functionality
    const backToTop = document.getElementById('backToTop');
    if (backToTop) {
        backToTop.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
    
    // Testimonial slider
    const testimonialPrev = document.querySelector('.testimonial-prev');
    const testimonialNext = document.querySelector('.testimonial-next');
    const testimonialSlider = document.querySelector('.testimonials-slider');
    const testimonialDots = document.querySelectorAll('.dot');
    
    if (testimonialPrev && testimonialNext && testimonialSlider) {
        let currentSlide = 0;
        const slideWidth = 350   32; // Card width   gap
        const maxSlides = document.querySelectorAll('.testimonial-card').length - 1;
        
        testimonialPrev.addEventListener('click', function() {
            if (currentSlide > 0) {
                currentSlide--;
                updateSliderPosition();
            }
        });
        
        testimonialNext.addEventListener('click', function() {
            if (currentSlide < maxSlides) {
                currentSlide  ;
                updateSliderPosition();
            }
        });
        
        testimonialDots.forEach((dot, index) => {
            dot.addEventListener('click', function() {
                currentSlide = index;
                updateSliderPosition();
            });
        });
        
        function updateSliderPosition() {
            testimonialSlider.scrollTo({
                left: currentSlide * slideWidth,
                behavior: 'smooth'
            });
            
            testimonialDots.forEach((dot, index) => {
                dot.classList.toggle('active', index === currentSlide);
            });
        }
    }
    
    // Contact form submission
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;
            
            // Here you would typically send the form data to a server
            // For now, we'll just show an alert
            alert(`Thank you, ${name}! Your message has been received. I'll get back to you soon at ${email}.`);
            
            // Reset form
            contactForm.reset();
        });
    }
});

// Function to toggle theme
function toggleTheme() {
    const body = document.body;
    
    if (body.classList.contains('light-theme')) {
        body.classList.remove('light-theme');
        localStorage.setItem('theme', 'dark');
    } else {
        body.classList.add('light-theme');
        localStorage.setItem('theme', 'light');
    }
}

// Function to initialize theme based on user preference
function initTheme() {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'light') {
        document.body.classList.add('light-theme');
    } else if (savedTheme === 'dark') {
        document.body.classList.remove('light-theme');
    } else if (prefersDark) {
        document.body.classList.remove('light-theme');
    }
}

// Function to update current time
function updateTime() {
    const timeElement = document.getElementById('currentTime');
    if (timeElement) {
        const now = new Date();
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        timeElement.textContent = `${hours}:${minutes}`;
    }
}

// Animate on scroll functionality
window.addEventListener('scroll', function() {
    const animatedElements = document.querySelectorAll('.project-card, .service-card, .feature-card, .skill-item');
    
    animatedElements.forEach(element => {
        const elementPosition = element.getBoundingClientRect().top;
        const screenPosition = window.innerHeight / 1.2;
        
        if (elementPosition < screenPosition) {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }
    });
});
