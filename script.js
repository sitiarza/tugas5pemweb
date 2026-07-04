/* ==========================================================================
   WARISAN MELAYU BENGKALIS — INTERACTIVE SCRIPTS
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize Lucide Icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // 2. Initialize Smooth Scroll with Lenis
    let lenis;
    if (typeof Lenis !== 'undefined') {
        lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            direction: 'vertical',
            gestureDirection: 'vertical',
            smooth: true,
            mouseMultiplier: 1,
            smoothTouch: false,
            touchMultiplier: 2,
            infinite: false,
        });

        function raf(time) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);

        // Connect GSAP ScrollTrigger to Lenis if both are available
        if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
            lenis.on('scroll', ScrollTrigger.update);
            gsap.ticker.add((time) => {
                lenis.raf(time * 1000);
            });
            gsap.ticker.lagSmoothing(0);
        }
    }

    // 3. Premium Custom Mouse Cursor Logic
    const cursor = document.getElementById('cursor');
    const follower = document.getElementById('cursor-follower');

    if (cursor && follower) {
        let mouseX = 0, mouseY = 0;
        let posX = 0, posY = 0;

        window.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;

            cursor.style.left = mouseX + 'px';
            cursor.style.top = mouseY + 'px';
        });

        // Smooth follower frame updates
        function updateFollower() {
            posX += (mouseX - posX) * 0.1;
            posY += (mouseY - posY) * 0.1;

            follower.style.left = posX + 'px';
            follower.style.top = posY + 'px';

            requestAnimationFrame(updateFollower);
        }
        updateFollower();

        // Cursor scale on hoverable elements
        const updateHoverListeners = () => {
            document.querySelectorAll('a, button, [onclick], input, select, .map-pin, .culture-card-btn').forEach(elem => {
                // Remove existing to prevent duplication
                elem.removeEventListener('mouseenter', onMouseEnter);
                elem.removeEventListener('mouseleave', onMouseLeave);

                elem.addEventListener('mouseenter', onMouseEnter);
                elem.addEventListener('mouseleave', onMouseLeave);
            });
        };

        function onMouseEnter() {
            follower.style.transform = 'translate(-50%, -50%) scale(1.5)';
            follower.style.borderColor = 'var(--melayu-red)';
            cursor.style.backgroundColor = 'var(--melayu-red)';
        }

        function onMouseLeave() {
            follower.style.transform = 'translate(-50%, -50%) scale(1)';
            follower.style.borderColor = 'rgba(212, 175, 55, 0.5)';
            cursor.style.backgroundColor = 'var(--gold)';
        }

        updateHoverListeners();

        // Expose to window so we can refresh them if needed
        window.refreshCursorHovers = updateHoverListeners;
    }

    // 4. Screen Loading Transition
    const loader = document.getElementById('loading-screen');
    if (loader) {
        window.addEventListener('load', () => {
            setTimeout(() => {
                loader.classList.add('fade-out');
                setTimeout(() => {
                    loader.style.display = 'none';
                    // Trigger hero content animation
                    if (typeof gsap !== 'undefined') {
                        gsap.to('#hero-container', {
                            opacity: 1,
                            y: 0,
                            duration: 1.5,
                            ease: 'power4.out'
                        });
                    }
                }, 1000);
            }, 1000);
        });
    }

    // 5. GSAP Scroll Reveals & Count Animations
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);

        // Fade Up reveals
        document.querySelectorAll('.reveal-fade-up').forEach((el) => {
            gsap.fromTo(el, {
                opacity: 0,
                y: 50
            }, {
                opacity: 1,
                y: 0,
                duration: 1.2,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: el,
                    start: 'top 85%',
                    toggleActions: 'play none none none'
                }
            });
        });

        // Numeric counter stats animation
        document.querySelectorAll('[data-val]').forEach((counter) => {
            const targetVal = parseInt(counter.getAttribute('data-val'));
            gsap.fromTo(counter, {
                innerText: 0
            }, {
                innerText: targetVal,
                duration: 2.5,
                snap: { innerText: 1 },
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: counter,
                    start: 'top 90%'
                }
            });
        });
    }

    // 6. Navbar Scrolling & Back-to-Top Button Effects
    const nav = document.getElementById('navbar');
    const btt = document.getElementById('back-to-top');

    window.addEventListener('scroll', () => {
        if (nav) {
            if (window.scrollY > 100) {
                nav.classList.add('scrolled', 'glass-premium');
            } else {
                nav.classList.remove('scrolled', 'glass-premium');
            }
        }

        if (btt) {
            if (window.scrollY > 500) {
                btt.classList.add('active');
            } else {
                btt.classList.remove('active');
            }
        }
    });

    if (btt && lenis) {
        btt.addEventListener('click', () => {
            lenis.scrollTo(0);
        });
    }

    // 7. Theme Management (Dark / Light Mode)
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        // Load initial theme preference
        const storedTheme = localStorage.getItem('theme');
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

        if (storedTheme === 'dark' || (!storedTheme && systemPrefersDark)) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }

        // Toggle theme on click
        themeToggle.addEventListener('click', () => {
            if (document.documentElement.classList.contains('dark')) {
                document.documentElement.classList.remove('dark');
                localStorage.setItem('theme', 'light');
            } else {
                document.documentElement.classList.add('dark');
                localStorage.setItem('theme', 'dark');
            }
        });
    }

    // 8. Mobile Drawer Menu Interactivity
    const drawer = document.getElementById('mobile-drawer');
    const openDrawerBtn = document.getElementById('mobile-menu-btn');
    const closeDrawerBtn = document.getElementById('close-drawer-btn');

    if (openDrawerBtn && drawer) {
        openDrawerBtn.addEventListener('click', () => {
            drawer.classList.add('active');
        });
    }

    if (closeDrawerBtn && drawer) {
        closeDrawerBtn.addEventListener('click', () => {
            drawer.classList.remove('active');
        });
    }

    document.querySelectorAll('.mobile-link').forEach(link => {
        link.addEventListener('click', () => {
            if (drawer) drawer.classList.remove('active');
        });
    });

    // 9. Map Hotspot Interactivity
    const mapPins = document.querySelectorAll('.map-pin');
    mapPins.forEach(pin => {
        pin.addEventListener('click', () => {
            const region = pin.getAttribute('data-region');
            showMapDetail(region);
        });
    });

    function showMapDetail(region) {
        const box = document.getElementById('map-detail-box');
        const title = document.getElementById('map-detail-title');
        const desc = document.getElementById('map-detail-desc');
        const instructions = document.getElementById('map-instructions');

        const info = {
            'bengkalis-island': {
                title: "Pulau Bengkalis — Pusat Tamadun & Pemerintahan",
                desc: "Pusat dari tradisi Lampu Colok pada malam 27 likur Ramadan dan arsitektur panggung bernuansa melayu klasik yang murni."
            },
            'bukit-batu': {
                title: "Bukit Batu — Wilayah Daratan Penuh Hikayat",
                desc: "Terkenal dengan cagar budaya rumah luhur Melayu dan wilayah penghasil tenun songket berbenang emas terbaik."
            },
            'mandau': {
                title: "Mandau & Pinggir — Harmonisasi Suku Asli",
                desc: "Titik temu kekayaan suku asli Melayu pedalaman dengan ragam budaya modern di kawasan industri minyak bumi Riau."
            }
        };

        if (box && title && desc && info[region]) {
            title.textContent = info[region].title;
            desc.textContent = info[region].desc;
            box.classList.remove('hidden');
            if (instructions) instructions.classList.add('hidden');

            // GSAP pop animation
            if (typeof gsap !== 'undefined') {
                gsap.fromTo(box, { opacity: 0, scale: 0.95 }, { opacity: 1, scale: 1, duration: 0.5 });
            }
        }
    }

    // 10. Culture Grid Filtering & Searching
    const searchInput = document.getElementById('culture-search');
    const categoryBtns = document.querySelectorAll('.category-btn');

    if (searchInput) {
        searchInput.addEventListener('input', executeSearchAndFilter);
    }

    categoryBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            categoryBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            executeSearchAndFilter();
        });
    });

    function executeSearchAndFilter() {
        const query = searchInput ? searchInput.value.toLowerCase() : '';
        const activeCategoryBtn = document.querySelector('.category-btn.active');
        const activeCategory = activeCategoryBtn ? activeCategoryBtn.getAttribute('data-filter') : 'all';

        document.querySelectorAll('.culture-card').forEach(card => {
            const cardCat = card.getAttribute('data-cat').toLowerCase();
            const titleElement = card.querySelector('h3');
            const title = titleElement ? titleElement.textContent.toLowerCase() : '';

            const matchesCategory = (activeCategory === 'all' || cardCat === activeCategory);
            const matchesSearch = title.includes(query);

            if (matchesCategory && matchesSearch) {
                card.style.display = 'block';
                if (typeof gsap !== 'undefined') {
                    gsap.to(card, { opacity: 1, scale: 1, duration: 0.3 });
                } else {
                    card.style.opacity = '1';
                }
            } else {
                card.style.display = 'none';
                card.style.opacity = '0';
            }
        });
    }

    // 11. Interactive Seni Budaya Carousel
    const carouselData = [
        {
            tag: "Musik Tradisional",
            title: "Kompang Bengkalis",
            desc: "Seni alat musik pukul rebana tradisional berbahan kayu nangka dengan membran kulit kambing pilihan. Kompang dimainkan secara masal dalam irama rancak menyambut tamu kehormatan upacara adat.",
            pantun: "\"Kompang berbunyi menyambut raja, Tepung tawar menyucikan raga.\"",
            img: "https://images.unsplash.com/photo-1507838153414-b4b713384a76?auto=format&fit=crop&q=80&w=800"
        },
        {
            tag: "Tari Tradisional",
            title: "Tari Zapin",
            desc: "Seni tari rumpun Melayu berakar dari khazanah tarian Arab. Memiliki filosofi persatuan dan kemuliaan adab peradaban melayu yang dipentaskan diiringi petikan dawai gambus.",
            pantun: "\"Zapin melangkah penuh berperi, Adat dijaga pusaka negeri.\"",
            img: "images/tari_zapin.png"
        },
        {
            tag: "Bela Diri Tradisi",
            title: "Silat Melayu",
            desc: "Gerakan bela diri luhur yang mengutamakan seni kuncian dan elakan lembut pertahanan diri. Seringkali dipadukan dengan busana tradisional lengkap tanjak dan kain samping songket.",
            pantun: "\"Sopan bersila berpasrah diri, Silat melayu menjaga negeri.\"",
            img: "https://images.unsplash.com/photo-1555597673-b21d5c935865?auto=format&fit=crop&q=80&w=600"
        }
    ];

    let currentSlide = 0;
    const prevSlideBtn = document.getElementById('carousel-prev');
    const nextSlideBtn = document.getElementById('carousel-next');

    if (prevSlideBtn && nextSlideBtn) {
        prevSlideBtn.addEventListener('click', prevSlide);
        nextSlideBtn.addEventListener('click', nextSlide);
    }

    function updateCarousel() {
        const data = carouselData[currentSlide];

        // GSAP Fade Out Transition
        if (typeof gsap !== 'undefined') {
            gsap.to(['#carousel-img', '#carousel-tag', '#carousel-title', '#carousel-desc', '#carousel-pantun'], {
                opacity: 0,
                duration: 0.3,
                onComplete: () => {
                    applyCarouselData(data);
                    // Fade back in
                    gsap.to(['#carousel-img', '#carousel-tag', '#carousel-title', '#carousel-desc', '#carousel-pantun'], {
                        opacity: 1,
                        duration: 0.3
                    });
                }
            });
        } else {
            applyCarouselData(data);
        }
    }

    function applyCarouselData(data) {
        const tag = document.getElementById('carousel-tag');
        const title = document.getElementById('carousel-title');
        const desc = document.getElementById('carousel-desc');
        const pantun = document.getElementById('carousel-pantun');
        const img = document.getElementById('carousel-img');
        const counter = document.getElementById('carousel-counter');

        if (tag) tag.textContent = data.tag;
        if (title) title.textContent = data.title;
        if (desc) desc.textContent = data.desc;
        if (pantun) pantun.textContent = data.pantun;
        if (img) img.src = data.img;
        if (counter) counter.textContent = `${currentSlide + 1} / ${carouselData.length}`;
    }

    function nextSlide() {
        currentSlide = (currentSlide + 1) % carouselData.length;
        updateCarousel();
    }

    function prevSlide() {
        currentSlide = (currentSlide - 1 + carouselData.length) % carouselData.length;
        updateCarousel();
    }

    // 12. Quote Rotator
    const quotes = [
        { text: "\"Takkan Melayu Hilang di Bumi, Selagi Adat Bersandi Syarak.\"", author: "— Hang Tuah" },
        { text: "\"Bila Adat tidak berjalan, Negeri pun hancur peradaban hilang.\"", author: "— Gurindam Dua Belas" },
        { text: "\"Bahasa menunjukkan Bangsa, Adat menunjukkan Kebesaran Jiwa.\"", author: "— Seloka Melayu Pesisir" }
    ];
    let currentQuote = 0;
    const quoteEl = document.getElementById('quote-element');
    const authorEl = document.getElementById('quote-author');

    if (quoteEl && authorEl) {
        setInterval(() => {
            currentQuote = (currentQuote + 1) % quotes.length;
            if (typeof gsap !== 'undefined') {
                gsap.to([quoteEl, authorEl], {
                    opacity: 0,
                    duration: 0.5,
                    onComplete: () => {
                        quoteEl.textContent = quotes[currentQuote].text;
                        authorEl.textContent = quotes[currentQuote].author;
                        gsap.to([quoteEl, authorEl], { opacity: 1, duration: 0.5 });
                    }
                });
            } else {
                quoteEl.textContent = quotes[currentQuote].text;
                authorEl.textContent = quotes[currentQuote].author;
            }
        }, 8000);
    }

    // 13. Culture Modal System
    const cultureDataDetails = {
        'kemojo': {
            tag: "Kuliner Manis",
            title: "Bolu Kemojo",
            img: "images/bolu_kemojo.png",
            desc: "Kue tradisional legendaris bermotif bunga kamboja yang bertekstur basah nan lembut. Rasanya manis harum kelapa dan pandan alami, sering disajikan pada upacara hantaran adat bengkalis.",
            philosophy: "Kelembutan budi pekeri dan kerekatan silaturahmi antarkeluarga."
        },
        'cekak-musang': {
            tag: "Pakaian Adat",
            title: "Baju Cekak Musang",
            img: "images/cekak_musang.png",
            desc: "Busana terhormat bermakna tinggi bagi kaum pria. Kancing yang dipasang menyiratkan kepatuhan moral kepada tatanan syarak agama Islam di tanah Melayu.",
            philosophy: "Keteguhan prinsip hidup, keimanan kokoh, dan tatanan sopan santun lahiriah."
        },
        'zapin': {
            tag: "Seni Tari",
            title: "Tari Zapin Pesisir",
            img: "images/tari_zapin.png",
            desc: "Mempresentasikan perpaduan akulturasi rumpun Melayu dengan pengaruh Arab Timur Tengah. Menggunakan petikan instrumen gambus untuk menandai ritme ketukan kaki yang sigap tangkas.",
            philosophy: "Sinergi persaudaraan antar warga masyarakat dan ketegasan dalam kebenaran."
        },
        'rumah-adat': {
            tag: "Arsitektur Vernakular",
            title: "Rumah Belah Bubung",
            img: "images/belah_bubung.png",
            desc: "Arsitektur rumah panggung kayu khas pesisir yang dirancang presisi demi menghalau pasang surut air laut Selat Malaka. Dilengkapi kisi-kisi angin berukiran tradisional bermotif awan larat.",
            philosophy: "Keterbukaan terhadap musafir luar, kelapangan jiwa, dan kerukunan sekeluarga."
        }
    };

    const modal = document.getElementById('culture-modal');
    const modalCloseBtn = document.getElementById('modal-close');

    // Bind open events on buttons having data-modal-target
    document.querySelectorAll('[data-modal-target]').forEach(btn => {
        btn.addEventListener('click', () => {
            const key = btn.getAttribute('data-modal-target');
            openModal(key);
        });
    });

    if (modalCloseBtn) {
        modalCloseBtn.addEventListener('click', closeModal);
    }

    // Close modal if clicked outside card
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal();
            }
        });
    }

    function openModal(key) {
        const detail = cultureDataDetails[key];
        if (detail && modal) {
            const tag = document.getElementById('modal-tag');
            const title = document.getElementById('modal-title');
            const img = document.getElementById('modal-image');
            const desc = document.getElementById('modal-description');
            const philosophy = document.getElementById('modal-philosophy');

            if (tag) tag.textContent = detail.tag;
            if (title) title.textContent = detail.title;
            if (img) img.src = detail.img;
            if (desc) desc.textContent = detail.desc;
            if (philosophy) philosophy.textContent = detail.philosophy;

            modal.classList.add('active');

            if (typeof gsap !== 'undefined') {
                gsap.fromTo("#culture-modal .modal-card",
                    { scale: 0.9, opacity: 0 },
                    { scale: 1, opacity: 1, duration: 0.4, ease: "power3.out" }
                );
            }
        }
    }

    function closeModal() {
        if (!modal) return;

        if (typeof gsap !== 'undefined') {
            gsap.to("#culture-modal .modal-card", {
                scale: 0.9,
                opacity: 0,
                duration: 0.3,
                onComplete: () => {
                    modal.classList.remove('active');
                }
            });
        } else {
            modal.classList.remove('active');
        }
    }
});
