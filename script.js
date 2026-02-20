document.addEventListener('DOMContentLoaded', () => {
    // ===================================================
    // 1. Element References
    // ===================================================
    const languageSwitcher = document.getElementById('language-switcher');
    const body = document.body;
    const themeToggle = document.getElementById('theme-toggle');
    const chatbotButton = document.getElementById('chatbot-button');
    const chatbotModal = document.getElementById('chatbot-modal');
    const closeChatbotBtn = document.querySelector('.close-chatbot-btn');
    const chatbotMessages = document.querySelector('.chatbot-messages');
    const chatbotInput = document.getElementById('chatbot-input');
    const sendChatbotMessageBtn = document.getElementById('send-chatbot-message');

    // ===================================================
    // 2. Language Switching
    // ===================================================
    const translatableElements = document.querySelectorAll('[data-en], [data-ar], [data-tr]');

    const updateLanguage = (lang) => {
        translatableElements.forEach(element => {
            const translation = element.getAttribute(`data-${lang}`);
            if (translation) {
                const targetElement = element.querySelector('span');
                if (targetElement) {
                    targetElement.textContent = translation;
                } else if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                    const placeholder = element.getAttribute(`data-${lang}-placeholder`);
                    if (placeholder) {
                        element.setAttribute('placeholder', placeholder);
                    }
                } else {
                    element.textContent = translation;
                }
            }
        });

        // Update chatbot elements
        const chatbotTooltip = document.querySelector('.chatbot-tooltip');
        if (chatbotTooltip) {
            chatbotTooltip.textContent = chatbotTooltip.getAttribute(`data-${lang}`) || chatbotTooltip.textContent;
        }
        
        const chatbotHeaderTitle = document.querySelector('.chatbot-header h3');
        if (chatbotHeaderTitle) {
            chatbotHeaderTitle.textContent = chatbotHeaderTitle.getAttribute(`data-${lang}`) || chatbotHeaderTitle.textContent;
        }
        
        const initialAiMessage = document.querySelector('.chatbot-messages .ai-message[data-initial-message]');
        if (initialAiMessage) {
            initialAiMessage.textContent = initialAiMessage.getAttribute(`data-${lang}-initial-message`) || initialAiMessage.textContent;
        }

        // Set direction and class
        if (lang === 'ar') {
            body.classList.add('ar');
            body.classList.remove('tr');
            document.documentElement.dir = 'rtl';
        } else if (lang === 'tr') {
            body.classList.add('tr');
            body.classList.remove('ar');
            document.documentElement.dir = 'ltr';
        } else {
            body.classList.remove('ar', 'tr');
            document.documentElement.dir = 'ltr';
        }

        localStorage.setItem('selectedLang', lang);
    };

    // Initialize language
    const storedLang = localStorage.getItem('selectedLang') || 'en';
    languageSwitcher.value = storedLang;
    updateLanguage(storedLang);

    languageSwitcher.addEventListener('change', (event) => {
        updateLanguage(event.target.value);
    });

    // ===================================================
    // 3. Theme Toggling with Auto Time-Based Switching
    // ===================================================
    
    // Determine theme based on current time
    // Light mode: 06:00-16:59 | Dark mode: 17:00-05:59
    function getThemeByTime() {
        const hour = new Date().getHours();
        return (hour >= 6 && hour < 17) ? 'light' : 'dark';
    }

    const applyTheme = (theme) => {
        body.classList.remove('light-mode', 'dark-mode');
        
        if (theme === 'light') {
            body.classList.add('light-mode');
        } else {
            body.classList.add('dark-mode');
        }
        
        localStorage.setItem('theme', theme);
    };

    // Initialize theme on page load
    function initializeTheme() {
        const themeMode = localStorage.getItem('themeMode'); // 'auto' or 'manual'
        const storedTheme = localStorage.getItem('theme');
        
        let theme;
        
        // If explicitly set to manual mode, use stored theme
        if (themeMode === 'manual' && storedTheme) {
            theme = storedTheme;
        } 
        // If in auto mode, ALWAYS calculate from current time (not from stored theme)
        else if (themeMode === 'auto') {
            theme = getThemeByTime();
        }
        // If storedTheme exists but themeMode isn't set (legacy preference), treat as manual
        else if (!themeMode && storedTheme) {
            theme = storedTheme;
            localStorage.setItem('themeMode', 'manual');
        } 
        // First visit: use time-based automatic theme
        else {
            theme = getThemeByTime();
            localStorage.setItem('themeMode', 'auto');
        }
        
        applyTheme(theme);
    }

    // Auto-update theme every minute if in auto mode
    function startAutoThemeUpdate() {
        setInterval(() => {
            const themeMode = localStorage.getItem('themeMode');
            
            // Only auto-update if in auto mode
            if (themeMode === 'auto') {
                const currentTheme = getThemeByTime();
                const storedTheme = localStorage.getItem('theme');
                
                // Update theme if time-based theme changed
                if (currentTheme !== storedTheme) {
                    applyTheme(currentTheme);
                }
            }
        }, 60000); // Check every minute
    }

    // Initialize theme on page load
    initializeTheme();
    startAutoThemeUpdate();

    // Manual theme toggle button
    themeToggle.addEventListener('click', () => {
        const currentTheme = body.classList.contains('light-mode') ? 'dark' : 'light';
        applyTheme(currentTheme);
        localStorage.setItem('themeMode', 'manual'); // Mark as manually set
    });

    // ===================================================
    // 4. IMPROVED Scroll Animations 
    // ===================================================
    
    // Get all elements with data-animation attribute
    const animatableElements = document.querySelectorAll('[data-animation]');
    
    // Set initial hidden state
    animatableElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
    });

    // Function to check if element is in viewport
    function isInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top <= (window.innerHeight || document.documentElement.clientHeight) * 0.9 &&
            rect.bottom >= 0
        );
    }

    // Function to animate visible elements
    function animateVisibleElements() {
        animatableElements.forEach(element => {
            if (isInViewport(element) && element.style.opacity === '0') {
                const delay = parseFloat(element.getAttribute('data-delay')) || 0;
                
                setTimeout(() => {
                    element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                    element.style.opacity = '1';
                    element.style.transform = 'translateY(0)';
                }, delay * 1000);
            }
        });
    }

    // Run on scroll with throttling for performance
    let ticking = false;
    function onScroll() {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                animateVisibleElements();
                ticking = false;
            });
            ticking = true;
        }
    }

    // Listen for scroll
    window.addEventListener('scroll', onScroll, { passive: true });
    
    // Run once on load
    animateVisibleElements();
    
    // Run again after a small delay to catch everything
    setTimeout(animateVisibleElements, 100);
    setTimeout(animateVisibleElements, 500);

    // ===================================================
    // 5. Chatbot Logic
    // ===================================================
    
    // Backend API URL - Production deployment
    const CHATBOT_API_URL = 'https://mohammedsaleh-chatbot.onrender.com/api/chat';
    
    if (chatbotButton && chatbotModal) {
        chatbotButton.addEventListener('click', () => {
            chatbotModal.classList.toggle('active');
            if (chatbotModal.classList.contains('active')) {
                chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
                chatbotInput.focus();
            }
        });

        closeChatbotBtn.addEventListener('click', () => {
            chatbotModal.classList.remove('active');
        });

        sendChatbotMessageBtn.addEventListener('click', sendMessage);

        chatbotInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });

        // Close chatbot when clicking outside
        document.addEventListener('click', (event) => {
            if (!chatbotModal.contains(event.target) && !chatbotButton.contains(event.target)) {
                chatbotModal.classList.remove('active');
            }
        });
    }

    // Get current language
    function getCurrentLanguage() {
        if (body.classList.contains('ar')) return 'ar';
        if (body.classList.contains('tr')) return 'tr';
        return 'en';
    }

    // Offline/Error messages
    const errorMessages = {
        en: `Sorry, I couldn't connect to the server. Please try again or contact Mohammed directly:
            <br><br>
            Email: <a href="mailto:mohamedalezzi6@gmail.com">mohamedalezzi6@gmail.com</a>
            <br>
            Phone: <a href="tel:+905392554609">+90 539 255 46 09</a>`,
        ar: `عذراً، لم أستطع الاتصال بالخادم. حاول مرة أخرى أو تواصل مع محمد مباشرة:
            <br><br>
            البريد: <a href="mailto:mohamedalezzi6@gmail.com">mohamedalezzi6@gmail.com</a>
            <br>
            الهاتف: <a href="tel:+905392554609">+90 539 255 46 09</a>`,
        tr: `Üzgünüm, sunucuya bağlanamadım. Tekrar deneyin veya Mohammed ile doğrudan iletişime geçin:
            <br><br>
            E-posta: <a href="mailto:mohamedalezzi6@gmail.com">mohamedalezzi6@gmail.com</a>
            <br>
            Telefon: <a href="tel:+905392554609">+90 539 255 46 09</a>`
    };

    async function sendMessage() {
        const messageText = chatbotInput.value.trim();
        if (messageText === '') return;

        // Add user message
        const userMessageDiv = document.createElement('div');
        userMessageDiv.classList.add('message', 'user-message');
        userMessageDiv.textContent = messageText;
        chatbotMessages.appendChild(userMessageDiv);

        chatbotInput.value = '';
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;

        // Show typing indicator
        const typingIndicator = document.createElement('div');
        typingIndicator.classList.add('message', 'ai-message', 'typing-indicator');
        typingIndicator.innerHTML = '<span class="dot"></span><span class="dot"></span><span class="dot"></span>';
        chatbotMessages.appendChild(typingIndicator);
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;

        const currentLang = getCurrentLanguage();

        try {
            // Call the backend API
            const response = await fetch(CHATBOT_API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: messageText,
                    language: currentLang
                })
            });

            // Remove typing indicator
            if (typingIndicator.parentNode) {
                chatbotMessages.removeChild(typingIndicator);
            }

            if (response.ok) {
                const data = await response.json();
                
                const aiResponse = document.createElement('div');
                aiResponse.classList.add('message', 'ai-message');
                aiResponse.innerHTML = data.response.replace(/\n/g, '<br>');
                chatbotMessages.appendChild(aiResponse);
            } else {
                throw new Error('Server responded with error');
            }

        } catch (error) {
            console.error('Chatbot error:', error);
            
            // Remove typing indicator if still there
            if (typingIndicator.parentNode) {
                chatbotMessages.removeChild(typingIndicator);
            }

            // Show error message
            const aiResponse = document.createElement('div');
            aiResponse.classList.add('message', 'ai-message');
            aiResponse.innerHTML = errorMessages[currentLang] || errorMessages.en;
            chatbotMessages.appendChild(aiResponse);
        }

        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    }

    // ===================================================
    // 6. Image Modal
    // ===================================================
    let modal = null;
    let imagesInModal = [];
    let modalImg, closeBtn, prevBtn, nextBtn, counter;
    let currentIndex = 0;

    function createModal() {
        if (modal) modal.remove();

        const isRTL = document.documentElement.dir === 'rtl';
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
                <div class="image-counter">1 / 1</div>
            </div>
        `;
        document.body.appendChild(modal);

        modalImg = modal.querySelector('.modal-image');
        closeBtn = modal.querySelector('.modal-close');
        prevBtn = modal.querySelector('.modal-prev');
        nextBtn = modal.querySelector('.modal-next');
        counter = modal.querySelector('.image-counter');

        setupModalEvents();
    }

    function setupModalEvents() {
        imagesInModal = document.querySelectorAll('.project-images-grid img');

        imagesInModal.forEach((img, index) => {
            img.addEventListener('click', () => {
                currentIndex = index;
                showImageInModal();
                modal.classList.add('active');
            });
        });

        closeBtn.addEventListener('click', () => modal.classList.remove('active'));

        nextBtn.addEventListener('click', () => {
            currentIndex = (currentIndex + 1) % imagesInModal.length;
            showImageInModal();
        });

        prevBtn.addEventListener('click', () => {
            currentIndex = (currentIndex - 1 + imagesInModal.length) % imagesInModal.length;
            showImageInModal();
        });

        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.classList.remove('active');
        });
    }

    function showImageInModal() {
        if (imagesInModal[currentIndex]) {
            modalImg.src = imagesInModal[currentIndex].src;
            modalImg.alt = imagesInModal[currentIndex].alt;
            counter.textContent = `${currentIndex + 1} / ${imagesInModal.length}`;
        }
    }

    createModal();

    // Keyboard navigation for modal
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

    // Observe direction changes
    const dirObserver = new MutationObserver(() => createModal());
    dirObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['dir'] });

});