document.addEventListener('DOMContentLoaded', () => {
    // ---------------------------------------------------
    // 1. تحديد العناصر الأساسية
    // ---------------------------------------------------
    const languageSwitcher = document.getElementById('language-switcher');
    const body = document.body;
    const themeToggle = document.getElementById('theme-toggle');
    const chatbotButton = document.getElementById('chatbot-button');
    const chatbotModal = document.getElementById('chatbot-modal');
    const closeChatbotBtn = document.querySelector('.close-chatbot-btn');
    const chatbotMessages = document.querySelector('.chatbot-messages');
    const chatbotInput = document.getElementById('chatbot-input');
    const sendChatbotMessageBtn = document.getElementById('send-chatbot-message');

    // Remove Dr. Esaam Moqbel's biography modal elements as they are not needed for your portfolio
    // const esaamMoqbelCard = document.querySelector('#team .team-member:first-child');
    // const esaamBioModal = document.getElementById('esaam-bio-modal');
    // const closeEsaamBioButton = document.getElementById('close-esaam-bio');

    // ---------------------------------------------------
    // 2. وظائف تبديل اللغة (Language Switching)
    // ---------------------------------------------------
    const translatableElements = document.querySelectorAll('[data-en], [data-ar], [data-tr]');

    const updateLanguage = (lang) => {
        translatableElements.forEach(element => {
            const translation = element.getAttribute(`data-${lang}`);
            if (translation) {
                // Check if the element has a span child, otherwise update its own textContent
                const targetElement = element.querySelector('span');
                if (targetElement) {
                    targetElement.textContent = translation;
                } else if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                    // Handle placeholders separately
                    element.setAttribute('placeholder', element.getAttribute(`data-${lang}-placeholder`));
                } else {
                    element.textContent = translation;
                }
            }
        });

        // Specific updates for various dynamic elements (placeholders moved to general loop above)
        const chatbotTooltip = document.querySelector('.chatbot-tooltip');
        if (chatbotTooltip) {
            chatbotTooltip.textContent = chatbotTooltip.getAttribute(`data-${lang}`);
        }
        const chatbotHeaderTitle = document.querySelector('.chatbot-header h3');
        if (chatbotHeaderTitle) {
            chatbotHeaderTitle.textContent = chatbotHeaderTitle.getAttribute(`data-${lang}`);
        }
        const initialAiMessageElement = document.querySelector('.chatbot-messages .ai-message[data-initial-message]');
        if (initialAiMessageElement) {
             initialAiMessageElement.textContent = initialAiMessageElement.getAttribute(`data-${lang}-initial-message`);
        }
        
        // Update welcoming message header and content (assuming .welcome-message is a card, not a separate modal)
        const welcomeMessageHeader = document.querySelector('.welcome-message h2');
        if (welcomeMessageHeader) {
            welcomeMessageHeader.textContent = welcomeMessageHeader.getAttribute(`data-${lang}`);
        }
        document.querySelectorAll('.welcome-message p, .welcome-message li').forEach(el => {
            if (el.hasAttribute(`data-${lang}`)) {
                el.textContent = el.getAttribute(`data-${lang}`);
            }
        });
        
        if (lang === 'ar') {
            body.classList.add('ar');
            document.documentElement.dir = 'rtl';
        } else {
            body.classList.remove('ar');
            document.documentElement.dir = 'ltr';
        }

        // Store in localStorage for persistence
        localStorage.setItem('selectedLang', lang);
    };

    // Initialize language from localStorage or default to 'en'
    const storedLang = localStorage.getItem('selectedLang') || 'en';
    languageSwitcher.value = storedLang;
    updateLanguage(storedLang);

    languageSwitcher.addEventListener('change', (event) => {
        updateLanguage(event.target.value);
    });

    // ---------------------------------------------------
    // 3. وظائف تبديل الثيم (Theme Toggling)
    // ---------------------------------------------------
    const applyTheme = (theme) => {
        const body = document.body;
        body.classList.remove('light-mode', 'dark-mode');
        
        if (theme === 'light') {
            body.classList.add('light-mode');
            localStorage.setItem('theme', 'light');
        } else {
            body.classList.add('dark-mode');
            localStorage.setItem('theme', 'dark');
        }
        
        // إعادة تحميل المتغيرات CSS بالقوة
        const root = document.documentElement;
        root.style.setProperty('--force-reload', Date.now()); // This is mostly symbolic
    };

    // Initialize theme from localStorage or default to 'dark'
    const storedTheme = localStorage.getItem('theme') || 'dark'; // Corrected default to 'dark'
    applyTheme(storedTheme);

    themeToggle.addEventListener('click', () => {
        const currentTheme = body.classList.contains('light-mode') ? 'dark' : 'light';
        applyTheme(currentTheme);
        
        // إعادة تطبيق التصميم على العناصر الحساسة
        // This part might not be strictly necessary for CSS variables, but doesn't hurt.
        document.querySelectorAll('header, nav, .card').forEach(el => {
            el.style.display = 'none';
            el.offsetHeight; // Trigger reflow
            el.style.display = '';
        });
    });

    // ---------------------------------------------------
    // 4. وظائف الأنيميشن (Staggered Animations)
    // ---------------------------------------------------
    const animateHeroSectionElements = () => {
        const tagBox = document.querySelector('.tag-box');
        const mainTitle = document.getElementById('main-title');
        const description = document.querySelector('.hero-section .description');
        const welcomeMessage = document.querySelector('.welcome-message'); // Select the welcome message
        const buttons = document.querySelector('.hero-section .buttons');

        if (tagBox) {
            tagBox.style.animation = 'fadeIn 0.8s ease-out 0.1s forwards';
        }
        if (mainTitle) {
            mainTitle.style.animation = 'fadeIn 0.8s ease-out 0.3s forwards';
        }
        if (description) {
            description.style.animation = 'fadeIn 0.8s ease-out 0.5s forwards';
        }
        if (welcomeMessage) {
            welcomeMessage.style.animation = 'fadeIn 0.8s ease-out 0.7s forwards';
        }
        if (buttons) {
            buttons.style.animation = 'fadeIn 0.8s ease-out 0.9s forwards'; // Adjust delay if needed
        }
    };

    animateHeroSectionElements(); // Trigger hero section animation on load

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1 // Trigger when 10% of the element is visible
    };

    const animateOnScroll = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                const animationType = element.getAttribute('data-animation');
                const delay = parseFloat(element.getAttribute('data-delay')) || 0;

                if (animationType) {
                    element.style.animation = `${animationType} 1s ease-out ${delay + 0.1}s forwards`;
                }
                observer.unobserve(element); // Stop observing after animation
            }
        });
    };

    const observer = new IntersectionObserver(animateOnScroll, observerOptions);

    // Observe all elements that should animate on scroll, excluding hero-section elements
    document.querySelectorAll(
        'section[data-animation], ' +
        '.section-title[data-animation], ' +
        '.vmv-item[data-animation], .feature-item[data-animation], .value-card[data-animation], ' +
        '.team-member[data-animation], .contact-item[data-animation], .social-media-links[data-animation], ' +
        '.contact-form[data-animation], .resource-item[data-animation], .doc-item[data-animation], .faq-item[data-animation], ' +
        '.animated-element[data-animation], ' +
        '.project-images-grid img[data-animation]' // Added project images
    ).forEach(el => {
        // Exclude elements within hero-section from this general observer,
        // as they are handled by animateHeroSectionElements
        if (!el.closest('.hero-section')) {
            observer.observe(el);
        }
    });

    // ---------------------------------------------------
    // 5. Chatbot Logic (Simplified/Placeholder)
    // ---------------------------------------------------
    chatbotButton.addEventListener('click', () => {
        chatbotModal.classList.toggle('active');
        if (chatbotModal.classList.contains('active')) {
            // Optional: Scroll messages to bottom when opening
            chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
        }
    });

    closeChatbotBtn.addEventListener('click', () => {
        chatbotModal.classList.remove('active');
    });

    sendChatbotMessageBtn.addEventListener('click', () => {
        sendMessage();
    });

    chatbotInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });

    function sendMessage() {
        const messageText = chatbotInput.value.trim();
        if (messageText !== '') {
            // Display user message
            const userMessageDiv = document.createElement('div');
            userMessageDiv.classList.add('message', 'user-message');
            userMessageDiv.textContent = messageText;
            chatbotMessages.appendChild(userMessageDiv);

            chatbotInput.value = ''; // Clear input

            // Scroll to bottom
            chatbotMessages.scrollTop = chatbotMessages.scrollHeight;

            // Simulate AI response (this part would typically involve a call to a backend AI service)
            // For now, it's just a placeholder for the typing indicator
            const typingIndicator = document.createElement('div');
            typingIndicator.classList.add('message', 'ai-message', 'typing-indicator');
            typingIndicator.innerHTML = '<span class="dot"></span><span class="dot"></span><span class="dot"></span>';
            chatbotMessages.appendChild(typingIndicator);
            chatbotMessages.scrollTop = chatbotMessages.scrollHeight;

            setTimeout(() => {
                chatbotMessages.removeChild(typingIndicator); // Remove typing indicator

                const aiResponse = document.createElement('div');
                aiResponse.classList.add('message', 'ai-message');
                aiResponse.textContent = "Thank you for your message! Mohammed will get back to you soon. The server of the AI module is turned off now"; // Placeholder response
                chatbotMessages.appendChild(aiResponse);
                chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
            }, 2000); // Simulate 2 seconds delay for AI response
        }
    }
    
    // Stacked Images Animation Script
document.addEventListener('DOMContentLoaded', function() {
    const imageGrid = document.querySelector('.project-images-grid');
    
    if (imageGrid) {
        // Toggle expansion on click
        imageGrid.addEventListener('click', function(e) {
            // If clicking on an image when expanded, don't collapse
            if (e.target.tagName === 'IMG' && this.classList.contains('expanded')) {
                return;
            }
            
            this.classList.toggle('expanded');
            
            // Add a subtle animation effect
            if (this.classList.contains('expanded')) {
                // Play expansion sound or add vibration if needed
                this.style.transform = 'translateY(-2px)';
                setTimeout(() => {
                    this.style.transform = '';
                }, 300);
            }
        });
        
        // Individual image clicks
        const images = imageGrid.querySelectorAll('img');
        images.forEach((img, index) => {
            img.addEventListener('click', function(e) {
                e.stopPropagation();
                
                // If not expanded, expand first
                if (!imageGrid.classList.contains('expanded')) {
                    imageGrid.classList.add('expanded');
                } else {
                    // Add a click animation
                    this.style.transform += ' scale(1.1)';
                    setTimeout(() => {
                        const currentTransform = this.style.transform;
                        this.style.transform = currentTransform.replace(' scale(1.1)', '');
                    }, 200);
                }
            });
            
            // Add loading animation
            img.addEventListener('load', function() {
                this.style.opacity = '0';
                this.style.opacity = '1';
            });
        });
        
        // Close on outside click
        document.addEventListener('click', function(e) {
            if (!imageGrid.contains(e.target) && imageGrid.classList.contains('expanded')) {
                imageGrid.classList.remove('expanded');
            }
        });
        
        // Keyboard support
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && imageGrid.classList.contains('expanded')) {
                imageGrid.classList.remove('expanded');
            }
        });
    }
});




});


// JavaScript - أضف هذا في نهاية body أو ملف JS

document.addEventListener('DOMContentLoaded', function() {
    let modal = null;
    let images, modalImg, closeBtn, prevBtn, nextBtn, counter;
    let currentIndex = 0;

    // دالة إنشاء المودال
    function createModal() {
        // حذف المودال القديم إذا كان موجود
        if (modal) {
            modal.remove();
        }

        // التحقق من اتجاه الصفحة
        const isRTL = document.dir === 'rtl' || document.documentElement.dir === 'rtl' || 
                      getComputedStyle(document.body).direction === 'rtl';
        
        // تحديد الأسهم حسب الاتجاه
        const prevArrow = isRTL ? '›' : '‹';
        const nextArrow = isRTL ? '‹' : '›';
        
        modal = document.createElement('div');
        modal.className = 'image-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <button class="modal-close">×</button>
                <button class="modal-nav modal-prev">${prevArrow}</button>
                <img class="modal-image" src="" alt="">
                <button class="modal-nav modal-next">${nextArrow}</button>
                <div class="image-counter">1 / 4</div>
            </div>
        `;
        document.body.appendChild(modal);

        // تحديث المراجع
        modalImg = modal.querySelector('.modal-image');
        closeBtn = modal.querySelector('.modal-close');
        prevBtn = modal.querySelector('.modal-prev');
        nextBtn = modal.querySelector('.modal-next');
        counter = modal.querySelector('.image-counter');

        setupEventListeners();
    }

    // دالة إعداد Event Listeners
    function setupEventListeners() {
        images = document.querySelectorAll('.project-images-grid img');

        // فتح المودال
        images.forEach((img, index) => {
            img.addEventListener('click', () => {
                currentIndex = index;
                showImage();
                modal.classList.add('active');
            });
        });

        // إغلاق المودال
        closeBtn.addEventListener('click', () => {
            modal.classList.remove('active');
        });

        // الصورة التالية
        nextBtn.addEventListener('click', () => {
            currentIndex = (currentIndex + 1) % images.length;
            showImage();
        });

        // الصورة السابقة
        prevBtn.addEventListener('click', () => {
            currentIndex = (currentIndex - 1 + images.length) % images.length;
            showImage();
        });

        // إغلاق عند الضغط خارج الصورة
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
            }
        });
    }

    function showImage() {
        modalImg.src = images[currentIndex].src;
        modalImg.alt = images[currentIndex].alt;
        counter.textContent = `${currentIndex + 1} / ${images.length}`;
    }

    // إنشاء المودال لأول مرة
    createModal();

    // مراقبة تغييرات الاتجاه
    const observer = new MutationObserver(() => {
        createModal();
    });

    observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['dir', 'class']
    });

    observer.observe(document.body, {
        attributes: true,
        attributeFilter: ['dir', 'class']
    });

    // أسهم الكيبورد
    document.addEventListener('keydown', (e) => {
        if (!modal || !modal.classList.contains('active')) return;
        
        if (e.key === 'Escape') {
            modal.classList.remove('active');
        } else if (e.key === 'ArrowLeft') {
            currentIndex = (currentIndex - 1 + images.length) % images.length;
            showImage();
        } else if (e.key === 'ArrowRight') {
            currentIndex = (currentIndex + 1) % images.length;
            showImage();
        }
    });
});



