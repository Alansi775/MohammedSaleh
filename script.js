// =====================================================
// GLOBAL CHAT FUNCTIONS (Outside DOMContentLoaded)
// =====================================================

// Toggle expand chat - must be in global scope
function toggleExpandChat() {
    const container = document.querySelector('.chatbot-modal');
    const overlay = document.querySelector('.chat-overlay');
    
    if (!container || !overlay) return;
    
    container.classList.toggle('expanded');
    overlay.classList.toggle('active');
}

// Setup overlay listener for expanded chat
function setupOverlayListener() {
    const overlay = document.querySelector('.chat-overlay');
    if (overlay) {
        overlay.addEventListener('click', () => {
            const container = document.querySelector('.chatbot-modal');
            if (container && container.classList.contains('expanded')) {
                container.classList.remove('expanded');
                overlay.classList.remove('active');
            }
        });
    }
}

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
            
            // Special handling for all input and textarea elements to ensure placeholders are updated
            if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                const placeholder = element.getAttribute(`data-${lang}-placeholder`);
                if (placeholder) {
                    element.setAttribute('placeholder', placeholder);
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

        // Update success message language
        const successMessage = document.getElementById('form-success-msg');
        if (successMessage) {
            const successPara = successMessage.querySelector('p');
            if (successPara) {
                const successText = successPara.getAttribute(`data-${lang}`);
                if (successText) {
                    successPara.textContent = successText;
                }
            }
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
        return (hour >= 6 && hour < 18) ? 'light' : 'dark';
    }

    const applyTheme = (theme, animate = false) => {
        // Remove preload classes
        document.documentElement.classList.remove('light-mode-preload', 'dark-mode-preload');
        
        if (animate) {
            // Add fade animation
            body.style.animation = 'themeFade 0.5s ease-in-out';
            
            // Wait for animation to complete before changing theme
            setTimeout(() => {
                // Remove all theme classes
                body.classList.remove('light-mode', 'dark-mode');
                
                // Apply new theme
                if (theme === 'light') {
                    body.classList.add('light-mode');
                } else {
                    body.classList.add('dark-mode');
                }
                
                localStorage.setItem('theme', theme);
                
                // Remove animation class
                body.style.animation = '';
                
                // Force Safari to repaint (Safari bug fix)
                if (/Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent)) {
                    const el = document.documentElement;
                    el.style.display = 'none';
                    el.offsetHeight; // Trigger reflow
                    el.style.display = '';
                }
            }, 250); // Half of animation duration
        } else {
            // Remove all theme classes
            body.classList.remove('light-mode', 'dark-mode');
            
            // Apply new theme
            if (theme === 'light') {
                body.classList.add('light-mode');
            } else {
                body.classList.add('dark-mode');
            }
            
            localStorage.setItem('theme', theme);
            
            // Force Safari to repaint (Safari bug fix)
            if (/Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent)) {
                const el = document.documentElement;
                el.style.display = 'none';
                el.offsetHeight; // Trigger reflow
                el.style.display = '';
            }
        }
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
        // Default: always use time-based theme (safest option)
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
        const currentThemeMode = localStorage.getItem('themeMode');
        const autoTheme = getThemeByTime();
        const currentTheme = body.classList.contains('light-mode') ? 'light' : 'dark';
        
        // If currently in manual mode and clicking same/different theme
        if (currentThemeMode === 'manual') {
            // Toggle back to auto mode
            localStorage.setItem('themeMode', 'auto');
            applyTheme(autoTheme, true); // Apply auto theme with animation
        } else {
            // Switch to opposite theme (manual mode)
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            applyTheme(newTheme, true);
            localStorage.setItem('themeMode', 'manual'); // Mark as manually set
        }
        
        // Force immediate visual update
        setTimeout(() => {
            // Dispatch custom event for any listeners
            const theme = body.classList.contains('light-mode') ? 'light' : 'dark';
            window.dispatchEvent(new CustomEvent('themeChanged', { detail: { theme: theme } }));
        }, 50);
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

    // ═══════════════════════════════════════════════════════════════
    // HERO THEATER — Canvas Neural Network + Drone Animation Engine
    // ═══════════════════════════════════════════════════════════════
    (function initHeroTheater() {
        const theater    = document.getElementById('hero-theater');
        const canvas     = document.getElementById('hero-canvas');
        const heroContent = document.querySelector('.hero-content');
        const heroScrollInd = document.querySelector('.hero-scroll-indicator');
        if (!theater || !canvas) return;

        const ctx = canvas.getContext('2d');
        let W, H;
        let nnNodes = [], nnEdges = [];
        let animTime = 0;
        let lastTs   = performance.now();

        // ── Helpers ──────────────────────────────────────────────
        function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }
        function lerp(a, b, t)    { return a + (b - a) * clamp(t, 0, 1); }
        function easeOut(t)       { t = clamp(t,0,1); return 1 - (1-t)*(1-t)*(1-t); }
        function subP(p, s, e)    { return clamp((p - s) / (e - s), 0, 1); }

        // ── Canvas resize ─────────────────────────────────────────
        function resize() {
            W = canvas.width  = window.innerWidth;
            H = canvas.height = window.visualViewport?.height ?? window.innerHeight;
            buildNN();
        }

        // ── Neural network layout ─────────────────────────────────
        function buildNN() {
            nnNodes = [];
            nnEdges = [];
            const mobile = W < 680;
            const defs = mobile ? [
                { n:2, xr:0.07 }, { n:4, xr:0.36 },
                { n:4, xr:0.64 }, { n:2, xr:0.93 },
            ] : [
                { n:3, xr:0.08 }, { n:5, xr:0.22 }, { n:7, xr:0.38 },
                { n:7, xr:0.54 }, { n:5, xr:0.70 }, { n:3, xr:0.86 },
            ];
            const yTop  = mobile ? 0.20 : 0.16;
            const ySpan = mobile ? 0.60 : 0.68;
            const layers = defs.map(d => {
                const nodes = [];
                for (let i = 0; i < d.n; i++) {
                    const node = {
                        x: d.xr * W,
                        y: H * (yTop + ySpan * (d.n === 1 ? 0.5 : i / (d.n - 1))),
                        phase: Math.random() * Math.PI * 2,
                        flash: 0,   // 0 = none, 1 = full flash
                    };
                    nodes.push(node);
                    nnNodes.push(node);
                }
                return nodes;
            });
            for (let li = 0; li < layers.length - 1; li++) {
                layers[li].forEach(from => {
                    layers[li+1].forEach(to => {
                        nnEdges.push({ from, to, phase: Math.random() * Math.PI * 2 });
                    });
                });
            }
        }

        // ── Scroll progress through theater ───────────────────────
        function getProgress() {
            const scrolled = window.scrollY - theater.offsetTop;
            const maxScroll = theater.offsetHeight - window.innerHeight;
            return clamp(scrolled / maxScroll, 0, 1);
        }

        // ── Draw neural network on canvas ─────────────────────────
        function drawNN(p, t, dt) {
            ctx.clearRect(0, 0, W, H);

            const edgeReveal = subP(p, 0.07, 0.55);
            const nodeReveal = subP(p, 0.03, 0.42);
            const dataFlow   = subP(p, 0.30, 0.78);
            const exitFade   = subP(p, 0.82, 0.98);

            // Decay all node flash values each frame
            nnNodes.forEach(n => { n.flash = Math.max(0, n.flash - dt * 1.2); });

            // ── Edges ──
            nnEdges.forEach((edge, i) => {
                const eT = clamp(edgeReveal * nnEdges.length / (nnEdges.length * 0.72) - i / nnEdges.length, 0, 1);
                if (eT < 0.01) return;
                const alpha = eT * (1 - exitFade);

                ctx.beginPath();
                ctx.moveTo(edge.from.x, edge.from.y);
                ctx.lineTo(edge.to.x,   edge.to.y);
                ctx.strokeStyle = `rgba(76,134,175,${alpha * 0.22})`;
                ctx.lineWidth   = 0.9;
                ctx.stroke();

                // Data packet + flash trigger on arrival
                if (dataFlow > 0.05 && eT > 0.45) {
                    const flow = ((t * 0.18 + edge.phase) % 1);
                    const px   = lerp(edge.from.x, edge.to.x, flow);
                    const py   = lerp(edge.from.y, edge.to.y, flow);
                    const intensity = dataFlow * eT * (1 - exitFade);

                    // When packet reaches the destination node, trigger flash
                    if (flow > 0.93) { edge.to.flash = Math.min(1, edge.to.flash + 0.4); }

                    // Glow halo
                    const g = ctx.createRadialGradient(px, py, 0, px, py, 10);
                    g.addColorStop(0, `rgba(76,170,255,${intensity * 0.35})`);
                    g.addColorStop(1, 'rgba(76,134,175,0)');
                    ctx.beginPath(); ctx.arc(px, py, 10, 0, Math.PI*2);
                    ctx.fillStyle = g; ctx.fill();

                    // Core dot
                    ctx.beginPath(); ctx.arc(px, py, 2.8, 0, Math.PI*2);
                    ctx.fillStyle = `rgba(140,215,255,${intensity * 0.95})`; ctx.fill();
                }
            });

            // ── Nodes ──
            nnNodes.forEach((node, i) => {
                const nT = clamp(nodeReveal * nnNodes.length / (nnNodes.length * 0.78) - i / nnNodes.length, 0, 1);
                if (nT < 0.01) return;

                const pulse = (Math.sin(t * 0.9 + node.phase) * 0.5 + 0.5);
                const r     = 4.5 + pulse * 2.5 * dataFlow;
                const alpha = nT * (1 - exitFade);
                const fl    = node.flash;

                // Flash burst — white-blue explosion when data arrives
                if (fl > 0.01) {
                    const fg = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, r * 9 * fl);
                    fg.addColorStop(0,   `rgba(220,245,255,${fl * 0.95})`);
                    fg.addColorStop(0.2, `rgba(76,200,255,${fl * 0.55})`);
                    fg.addColorStop(1,   'rgba(76,134,175,0)');
                    ctx.beginPath(); ctx.arc(node.x, node.y, r * 9 * fl, 0, Math.PI*2);
                    ctx.fillStyle = fg; ctx.fill();

                    // Inner white core
                    ctx.beginPath(); ctx.arc(node.x, node.y, r * (1 + fl * 1.2), 0, Math.PI*2);
                    ctx.fillStyle = `rgba(255,255,255,${fl * 0.85})`; ctx.fill();
                }

                // Outer glow
                const g = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, r * 5);
                g.addColorStop(0, `rgba(76,134,175,${alpha * (0.45 + fl * 0.4)})`);
                g.addColorStop(1, 'rgba(76,134,175,0)');
                ctx.beginPath(); ctx.arc(node.x, node.y, r * 5, 0, Math.PI*2);
                ctx.fillStyle = g; ctx.fill();

                // Core
                ctx.beginPath(); ctx.arc(node.x, node.y, r, 0, Math.PI*2);
                ctx.fillStyle   = `rgba(76,134,175,${alpha})`;  ctx.fill();
                ctx.strokeStyle = `rgba(160,225,255,${alpha + fl * 0.4})`;
                ctx.lineWidth   = 1.5; ctx.stroke();
            });
        }

        // ── Hero content visibility ───────────────────────────────
        function updateContent(p) {
            if (!heroContent) return;
            const fadeIn  = subP(p, 0, 0.06);
            const fadeOut = subP(p, 0.76, 0.94);
            const lift    = -fadeOut * 85;
            heroContent.style.opacity   = Math.min(fadeIn * 10, 1) * (1 - fadeOut);
            heroContent.style.transform = `translateY(${lift}px)`;

            if (heroScrollInd) {
                heroScrollInd.style.opacity = Math.max(0, 1 - p * 10).toFixed(2);
            }
        }

        // ── Main animation loop ───────────────────────────────────
        function loop(ts) {
            const dt = (ts - lastTs) * 0.001;
            lastTs   = ts;
            animTime += dt;

            const p = getProgress();
            drawNN(p, animTime, dt);
            updateContent(p);

            requestAnimationFrame(loop);
        }

        window.addEventListener('resize', resize);
        if (window.visualViewport) {
            window.visualViewport.addEventListener('resize', resize);
        }
        resize();
        requestAnimationFrame(loop);
    })();

    // ===================================================
    // Hamburger menu (mobile nav drawer)
    // ===================================================
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const mobileDrawer = document.getElementById('mobile-nav-drawer');

    if (hamburgerBtn && mobileDrawer) {
        hamburgerBtn.addEventListener('click', () => {
            const open = hamburgerBtn.classList.toggle('open');
            mobileDrawer.classList.toggle('open', open);
        });

        // Close drawer when any link is clicked
        mobileDrawer.querySelectorAll('a').forEach(a => {
            a.addEventListener('click', () => {
                hamburgerBtn.classList.remove('open');
                mobileDrawer.classList.remove('open');
            });
        });

        // Close drawer when clicking outside
        document.addEventListener('click', e => {
            if (!hamburgerBtn.contains(e.target) && !mobileDrawer.contains(e.target)) {
                hamburgerBtn.classList.remove('open');
                mobileDrawer.classList.remove('open');
            }
        });
    }

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
            // Also remove expanded mode if it was expanded
            chatbotModal.classList.remove('expanded');
            const overlay = document.querySelector('.chat-overlay');
            if (overlay) {
                overlay.classList.remove('active');
            }
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

    // Markdown → HTML renderer for AI responses
    function parseMarkdown(text) {
        const extractedLinks = [];

        // Extract markdown links [label](url) before HTML escaping
        let safe = text.replace(/\[([^\]]+)\]\(((?:https?|mailto)[^)]+)\)/g, (_, label, url) => {
            const i = extractedLinks.length;
            const isMailto = url.startsWith('mailto:');
            extractedLinks.push(
                `<a href="${url}"${isMailto ? '' : ' target="_blank" rel="noopener noreferrer"'} class="chat-link">${label}</a>`
            );
            return `\x00L${i}\x00`;
        });

        // Escape HTML
        safe = safe.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

        // Bold **text**
        safe = safe.replace(/\*\*([^*\n]+)\*\*/g, '<strong>$1</strong>');

        // Bare URLs
        safe = safe.replace(/(https?:\/\/[^\s<&"'.,;!?)[\]]+)/g,
            '<a href="$1" target="_blank" rel="noopener noreferrer" class="chat-link">$1</a>');

        // Bare email addresses
        safe = safe.replace(/([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g,
            '<a href="mailto:$1" class="chat-link">$1</a>');

        // Restore extracted markdown links
        extractedLinks.forEach((link, i) => { safe = safe.split(`\x00L${i}\x00`).join(link); });

        // Line-by-line: headings, bullets, standalone links, paragraphs
        const lines = safe.split('\n');
        const out = [];
        let inList = false;

        for (const line of lines) {
            const trimmed = line.trim();

            // Heading: ### or ##
            if (/^#{1,3} /.test(trimmed)) {
                if (inList) { out.push('</ul>'); inList = false; }
                out.push(`<p class="chat-heading">${trimmed.replace(/^#{1,3} /, '')}</p>`);
                continue;
            }

            // Bullet: *, •, -
            const bullet = trimmed.match(/^[•\-\*] (.+)/);
            if (bullet) {
                if (!inList) { out.push('<ul class="chat-list">'); inList = true; }
                out.push(`<li>${bullet[1]}</li>`);
                continue;
            }

            if (inList) { out.push('</ul>'); inList = false; }

            // Empty line
            if (trimmed === '') {
                out.push('<div class="chat-gap"></div>');
                continue;
            }

            // Standalone link line: the entire line is just a link (no surrounding text)
            const standaloneLink = /^(<a [^>]*class="chat-link"[^>]*>[^<]*<\/a>)\.?$/.test(trimmed);
            if (standaloneLink) {
                out.push(`<div class="chat-link-line">${trimmed.replace(/\.$/, '')}</div>`);
                continue;
            }

            // Regular paragraph
            out.push(`<p class="chat-para">${trimmed}</p>`);
        }

        if (inList) out.push('</ul>');
        return out.join('');
    }

    // Typing effect — renders live HTML as each character is typed
    async function typeMessage(element, text, speed = 20) {
        let buffer = '';
        let index = 0;
        let isUserScrolling = false;
        const messagesContainer = element.parentElement;

        const scrollListener = () => { isUserScrolling = true; };
        messagesContainer.addEventListener('scroll', scrollListener);

        while (index < text.length) {
            buffer += text[index];
            index++;
            element.innerHTML = parseMarkdown(buffer);

            if (!isUserScrolling) {
                messagesContainer.scrollTop = messagesContainer.scrollHeight;
            }

            await new Promise(r => setTimeout(r, speed));
        }

        messagesContainer.removeEventListener('scroll', scrollListener);
    }

    // Get current language

    // Thinking messages that rotate
    const thinkingMessages = {
        en: ['Thinking', 'Analyzing', 'Processing', 'Considering', 'Reasoning'],
        ar: ['جاري التفكير', 'جاري التحليل', 'جاري المعالجة', 'جاري الفحص', 'جاري التقييم'],
        tr: ['Düşünüyor', 'Analiz ediyor', 'İşliyor', 'Değerlendiriyor', 'Akıl yürütüyor']
    };

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

        // Show thinking indicator
        const thinkingIndicator = document.createElement('div');
        thinkingIndicator.classList.add('message', 'ai-message', 'thinking-indicator');
        thinkingIndicator.innerHTML = `
            <div class="thinking-icon">
                <div class="thinking-spinner"></div>
            </div>
            <div class="thinking-text-wrapper">
                <span class="thinking-text" id="thinking-text">Thinking</span>
                <div class="thinking-dots">
                    <span class="thinking-dot"></span>
                    <span class="thinking-dot"></span>
                    <span class="thinking-dot"></span>
                </div>
            </div>
        `;
        chatbotMessages.appendChild(thinkingIndicator);
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;

        const currentLang = getCurrentLanguage();
        let messageIndex = 0;
        const messages = thinkingMessages[currentLang] || thinkingMessages.en;
        
        // Rotate thinking messages every 1.5 seconds
        const messageRotationInterval = setInterval(() => {
            messageIndex = (messageIndex + 1) % messages.length;
            const thinkingText = document.getElementById('thinking-text');
            if (thinkingText) {
                thinkingText.textContent = messages[messageIndex];
            }
        }, 1500);

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

            // Remove thinking indicator and clear interval
            clearInterval(messageRotationInterval);
            if (thinkingIndicator.parentNode) {
                thinkingIndicator.remove();
            }

            if (response.ok) {
                const data = await response.json();
                
                const aiResponse = document.createElement('div');
                aiResponse.classList.add('message', 'ai-message');
                aiResponse.textContent = '';
                chatbotMessages.appendChild(aiResponse);
                
                // Convert HTML to plain text (remove <br> tags) and preserve line breaks
                const plainText = data.response.replace(/<br>/g, '\n');
                
                // Type the message in here 
                await typeMessage(aiResponse, plainText, 15);
            } else {
                throw new Error('Server responded with error');
            }
        } catch (error) {
            console.error('Chatbot error:', error);
            
            // Remove thinking indicator and clear interval
            clearInterval(messageRotationInterval);
            if (thinkingIndicator.parentNode) {
                thinkingIndicator.remove();
            }

            // Show error message with contact info
            const errorDiv = document.createElement('div');
            errorDiv.classList.add('message', 'ai-message');
            errorDiv.innerHTML = errorMessages[currentLang] || errorMessages.en;
            chatbotMessages.appendChild(errorDiv);
        }

        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    }

    // Setup overlay listener for expanded chat from global scope function
    setupOverlayListener();

    // ===================================================
    // 6. Image Modal implementation in project section inside DOMContentLoaded to ensure it runs after the DOM is fully loaded 
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

    // Keyboard navigation for modal - works globally but only acts if modal is active
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

    // Observe direction changes to update modal arrows accordingly
    const dirObserver = new MutationObserver(() => createModal());
    dirObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['dir'] });

    // ===================================================
    // 7. Contact Form Validation & Multilingual Success Message
    // ===================================================
    const contactForm = document.getElementById('contact-form');
    const nameInput = document.querySelector('input[name="name"]');
    const emailInput = document.querySelector('input[name="email"]');
    const messageInput = document.querySelector('textarea[name="message"]');
    const successMessage = document.getElementById('form-success-msg');
    const errorMessage = document.getElementById('form-error-msg');

    // Translations for validation messages
    const validationMessages = {
        en: {
            nameRequired: 'Please enter your name',
            emailRequired: 'Please enter your email',
            emailInvalid: 'Please enter a valid email',
            messageRequired: 'Please enter your message'
        },
        ar: {
            nameRequired: 'يرجى إدخال اسمك',
            emailRequired: 'يرجى إدخال بريدك الإلكتروني',
            emailInvalid: 'يرجى إدخال بريد إلكتروني صحيح',
            messageRequired: 'يرجى إدخال رسالتك'
        },
        tr: {
            nameRequired: 'Lütfen adınızı girin',
            emailRequired: 'Lütfen e-postanızı girin',
            emailInvalid: 'Lütfen geçerli bir e-posta girin',
            messageRequired: 'Lütfen mesajınızı girin'
        }
    };

    // Function to show validation error
    const showValidationError = (messageKey) => {
        const currentLang = localStorage.getItem('selectedLang') || 'en';
        const message = validationMessages[currentLang][messageKey];
        
        errorMessage.textContent = message;
        errorMessage.style.display = 'block';
        successMessage.style.display = 'none';
        
        // Hide error after 4 seconds
        setTimeout(() => {
            errorMessage.style.display = 'none';
        }, 4000);
    };

    // Function to show success message in current language in here to ensure it always shows in the correct language even if user changes language while message is visible
    const showSuccessMessage = () => {
        const currentLang = localStorage.getItem('selectedLang') || 'en';
        const successPara = successMessage.querySelector('p');
        const successText = successPara.getAttribute(`data-${currentLang}`);
        
        if (successText) {
            successPara.textContent = successText;
        }
        
        successMessage.style.display = 'block';
        errorMessage.style.display = 'none';
        
        // Clear form
        contactForm.reset();
        
        // Hide success message after 5 seconds
        setTimeout(() => {
            successMessage.style.display = 'none';
        }, 5000);
    };

    // Add validation to form submission - STRICT
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const name = nameInput.value.trim();
        const email = emailInput.value.trim();
        const message = messageInput.value.trim();

        if (!name) {
            showValidationError('nameRequired');
            nameInput.focus();
            return;
        }
        if (!email) {
            showValidationError('emailRequired');
            emailInput.focus();
            return;
        }
        if (!email.includes('@') || !email.includes('.')) {
            showValidationError('emailInvalid');
            emailInput.focus();
            return;
        }
        if (!message) {
            showValidationError('messageRequired');
            messageInput.focus();
            return;
        }

        const submitBtn = contactForm.querySelector('[type="submit"]');
        submitBtn.disabled = true;

        try {
            const response = await fetch('https://formspree.io/f/xykbdevr', {
                method: 'POST',
                headers: { 'Accept': 'application/json' },
                body: new FormData(contactForm)
            });

            if (response.ok) {
                showSuccessMessage();
            } else {
                const currentLang = localStorage.getItem('selectedLang') || 'en';
                const errMsgs = { en: 'Something went wrong. Please try again.', ar: 'حدث خطأ. يرجى المحاولة مرة أخرى.', tr: 'Bir hata oluştu. Lütfen tekrar deneyin.' };
                errorMessage.textContent = errMsgs[currentLang] || errMsgs.en;
                errorMessage.style.display = 'block';
                setTimeout(() => { errorMessage.style.display = 'none'; }, 4000);
            }
        } catch {
            const currentLang = localStorage.getItem('selectedLang') || 'en';
            const errMsgs = { en: 'Network error. Please try again.', ar: 'خطأ في الشبكة. يرجى المحاولة مرة أخرى.', tr: 'Ağ hatası. Lütfen tekrar deneyin.' };
            errorMessage.textContent = errMsgs[currentLang] || errMsgs.en;
            errorMessage.style.display = 'block';
            setTimeout(() => { errorMessage.style.display = 'none'; }, 4000);
        } finally {
            submitBtn.disabled = false;
        }
    });

});