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
    const chatbotMessages = document.querySelector('.chatbot-messages'); // This is likely the div that contains all messages
    const chatbotInput = document.getElementById('chatbot-input');
    const sendChatbotMessageBtn = document.getElementById('send-chatbot-message');

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

        localStorage.setItem('selectedLang', lang);
    };

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
        
        const root = document.documentElement;
        root.style.setProperty('--force-reload', Date.now()); 
    };

    const storedTheme = localStorage.getItem('theme') || 'dark';
    applyTheme(storedTheme);

    themeToggle.addEventListener('click', () => {
        const currentTheme = body.classList.contains('light-mode') ? 'dark' : 'light';
        applyTheme(currentTheme);
        
        document.querySelectorAll('header, nav, .card').forEach(el => {
            el.style.display = 'none';
            el.offsetHeight; 
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
        const welcomeMessage = document.querySelector('.welcome-message'); 
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
            buttons.style.animation = 'fadeIn 0.8s ease-out 0.9s forwards';
        }
    };

    animateHeroSectionElements(); 

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1 
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
                observer.unobserve(element); 
            }
        });
    };

    const observer = new IntersectionObserver(animateOnScroll, observerOptions);

    document.querySelectorAll(
        'section[data-animation], ' +
        '.section-title[data-animation], ' +
        '.vmv-item[data-animation], .feature-item[data-animation], .value-card[data-animation], ' +
        '.team-member[data-animation], .contact-item[data-animation], .social-media-links[data-animation], ' +
        '.contact-form[data-animation], .resource-item[data-animation], .doc-item[data-animation], .faq-item[data-animation], ' +
        '.animated-element[data-animation], ' +
        '.project-images-grid img[data-animation]' 
    ).forEach(el => {
        if (!el.closest('.hero-section')) {
            observer.observe(el);
        }
    });

    // ---------------------------------------------------
    // 5. Chatbot Logic
    // ---------------------------------------------------
    chatbotButton.addEventListener('click', () => {
        chatbotModal.classList.toggle('active');
        if (chatbotModal.classList.contains('active')) {
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

    // this is for making the user able to close the chatbot frame once he clicks outside of it 
    document.addEventListener('click', (event) => {
        if (!chatbotModal.contains(event.target) && !chatbotButton.contains(event.target)) {
            chatbotModal.classList.remove('active');
        }
    });



    // Helper function to get the current active language of the website
    function getCurrentLanguage() {
        const body = document.body;
        if (body.classList.contains('ar')) {
            return 'ar';
        } else if (body.classList.contains('tr')) {
            return 'tr';
        } else {
            return 'en'; // Default to English
        }
    }

    // Messages for AI server offline status, translated
    const aiOfflineMessages = {
        en: `Thank you for your message! Mohammed will get back to you soon. The server of the AI module is currently turned off. For immediate inquiries, please contact Mohammed via:
            <br><br>
            Email: <a href="mailto:mohammedalezzi6@gmail.com">mohammedalezzi6@gmail.com</a>
            <br>
            Phone: <a href="tel:+905392554609">+905392554609</a>`, // **REPLACE WITH ACTUAL EMAIL AND PHONE**
        ar: `شكرًا لرسالتك! سيتواصل محمد معك قريبًا. خادم وحدة الذكاء الاصطناعي مطفأ حاليًا. للاستفسارات العاجلة، يرجى التواصل مع محمد عبر:
            <br><br>
            البريد الإلكتروني: <a href="mailto:mohammedalezzi6@gmail.com">mohammedalezzi6@gmail.com</a>
            <br>
            الهاتف: <a href="tel:+905392554609">+905392554609</a>`, // **REPLACE WITH ACTUAL EMAIL AND PHONE**
        tr: `Mesajınız için teşekkür ederiz! Muhammed yakında sizinle iletişime geçecektir. Yapay zeka modülü sunucusu şu anda kapalıdır. Acil sorularınız için lütfen Muhammed ile iletişime geçin:
            <br><br>
            E-posta: <a href="mailto:mohammedalezzi6@gmail.com">mohammedalezzi6@gmail.com</a>
            <br>
            Telefon: <a href="tel:+905392554609">+905392554609</a>`  // **REPLACE WITH ACTUAL EMAIL AND PHONE**
    };

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

            // Simulate AI response with typing indicator
            const typingIndicator = document.createElement('div');
            typingIndicator.classList.add('message', 'ai-message', 'typing-indicator');
            typingIndicator.innerHTML = '<span class="dot"></span><span class="dot"></span><span class="dot"></span>';
            chatbotMessages.appendChild(typingIndicator);
            chatbotMessages.scrollTop = chatbotMessages.scrollHeight;

            setTimeout(() => {
                chatbotMessages.removeChild(typingIndicator); // Remove typing indicator

                // Determine the correct offline message based on current language
                const currentLang = getCurrentLanguage();
                const offlineMessage = aiOfflineMessages[currentLang] || aiOfflineMessages.en; // Fallback to English

                const aiResponse = document.createElement('div');
                aiResponse.classList.add('message', 'ai-message', 'ai-response-message'); // Added 'ai-response-message' for specific styling
                aiResponse.innerHTML = offlineMessage; // Use innerHTML to render links and breaks
                chatbotMessages.appendChild(aiResponse);
                chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
            }, 2000); // Simulate 2 seconds delay for AI response
        }
    }
    
    // ---------------------------------------------------
    // 6. Stacked Images Animation Script
    // ---------------------------------------------------
    const imageGrid = document.querySelector('.project-images-grid');
    
    if (imageGrid) {
        imageGrid.addEventListener('click', function(e) {
            if (e.target.tagName === 'IMG' && this.classList.contains('expanded')) {
                return;
            }
            this.classList.toggle('expanded');
            
            if (this.classList.contains('expanded')) {
                this.style.transform = 'translateY(-2px)';
                setTimeout(() => {
                    this.style.transform = '';
                }, 300);
            }
        });
        
        const images = imageGrid.querySelectorAll('img');
        images.forEach((img, index) => {
            img.addEventListener('click', function(e) {
                e.stopPropagation();
                
                if (!imageGrid.classList.contains('expanded')) {
                    imageGrid.classList.add('expanded');
                } else {
                    this.style.transform += ' scale(1.1)';
                    setTimeout(() => {
                        const currentTransform = this.style.transform;
                        this.style.transform = currentTransform.replace(' scale(1.1)', '');
                    }, 200);
                }
            });
            
            img.addEventListener('load', function() {
                this.style.opacity = '0';
                this.style.opacity = '1';
            });
        });
        
        document.addEventListener('click', function(e) {
            if (!imageGrid.contains(e.target) && imageGrid.classList.contains('expanded')) {
                imageGrid.classList.remove('expanded');
            }
        });
        
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && imageGrid.classList.contains('expanded')) {
                imageGrid.classList.remove('expanded');
            }
        });
    }

    // ---------------------------------------------------
    // 7. Image Modal Logic
    // ---------------------------------------------------
    let modal = null;
    let imagesInModal, modalImg, closeBtn, prevBtn, nextBtn, counter;
    let currentIndex = 0;

    function createModal() {
        if (modal) {
            modal.remove();
        }

        const isRTL = document.dir === 'rtl' || document.documentElement.dir === 'rtl' || 
                      getComputedStyle(document.body).direction === 'rtl';
        
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

        modalImg = modal.querySelector('.modal-image');
        closeBtn = modal.querySelector('.modal-close');
        prevBtn = modal.querySelector('.modal-prev');
        nextBtn = modal.querySelector('.modal-next');
        counter = modal.querySelector('.image-counter');

        setupEventListenersForModal();
    }

    function setupEventListenersForModal() {
        imagesInModal = document.querySelectorAll('.project-images-grid img'); // Changed variable name to avoid conflict

        imagesInModal.forEach((img, index) => {
            img.addEventListener('click', () => {
                currentIndex = index;
                showImageInModal();
                modal.classList.add('active');
            });
        });

        closeBtn.addEventListener('click', () => {
            modal.classList.remove('active');
        });

        nextBtn.addEventListener('click', () => {
            currentIndex = (currentIndex + 1) % imagesInModal.length;
            showImageInModal();
        });

        prevBtn.addEventListener('click', () => {
            currentIndex = (currentIndex - 1 + imagesInModal.length) % imagesInModal.length;
            showImageInModal();
        });

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
            }
        });
    }

    function showImageInModal() {
        modalImg.src = imagesInModal[currentIndex].src;
        modalImg.alt = imagesInModal[currentIndex].alt;
        counter.textContent = `${currentIndex + 1} / ${imagesInModal.length}`;
    }

    createModal();

    const observerModal = new MutationObserver(() => { // Changed variable name to avoid conflict
        createModal();
    });

    observerModal.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['dir', 'class']
    });

    observerModal.observe(document.body, {
        attributes: true,
        attributeFilter: ['dir', 'class']
    });

    document.addEventListener('keydown', (e) => {
        if (!modal || !modal.classList.contains('active')) return;
        
        if (e.key === 'Escape') {
            modal.classList.remove('active');
        } else if (e.key === 'ArrowLeft') {
            currentIndex = (currentIndex - 1 + imagesInModal.length) % imagesInModal.length;
            showImageInModal();
        } else if (e.key === 'ArrowRight') {
            currentIndex = (currentIndex + 1) % imagesInModal.length;
            showImageInModal();
        }
    });

});