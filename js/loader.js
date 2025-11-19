document.addEventListener('DOMContentLoaded', async () => {
    const pageId = document.body.getAttribute('data-page');

    // Load Common Data (Nav, Footer)
    await loadCommonData();

    // Load Page Specific Data
    if (pageId) {
        await loadPageData(pageId);
    }

    // Mobile Menu Toggle Logic
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('open');
        });
    }
});

async function loadCommonData() {
    try {
        const response = await fetch('_data/common.json');
        const data = await response.json();

        // Render Nav
        const navContainer = document.getElementById('main-nav');
        if (navContainer) {
            navContainer.innerHTML = '';

            const logoLink = document.createElement('a');
            logoLink.href = 'index.html';
            logoLink.className = 'logo';
            logoLink.innerHTML = '<img src="assets/logo.png" alt="CI Passione Assoluta" class="logo-img">';

            const ul = document.createElement('ul');
            ul.className = 'nav-links';

            data.nav.forEach(item => {
                const li = document.createElement('li');
                const a = document.createElement('a');
                a.href = item.href;
                a.textContent = item.text;
                if (document.body.getAttribute('data-page') === item.href.replace('.html', '') ||
                    (document.body.getAttribute('data-page') === 'home' && item.href === 'index.html')) {
                    a.classList.add('active');
                }
                li.appendChild(a);
                ul.appendChild(li);
            });

            const toggle = document.createElement('div');
            toggle.className = 'menu-toggle';
            toggle.innerHTML = '&#9776;';

            navContainer.appendChild(logoLink);
            navContainer.appendChild(ul);
            navContainer.appendChild(toggle);
        }

        // Render Footer
        const footerContainer = document.getElementById('main-footer');
        if (footerContainer) {
            footerContainer.innerHTML = `
                <div class="container">
                    <div class="footer-content">
                        <div class="footer-col">
                            <h4>${data.siteName}</h4>
                            <p>Eccellenza e passione nel cuore della natura.</p>
                        </div>
                        <div class="footer-col">
                            <h4>Contatti</h4>
                            <p>Email: <a href="mailto:passioneassoluta@hotmail.com">passioneassoluta@hotmail.com</a></p>
                            <p>Tel: <a href="tel:+393486980406">+39 348 6980406</a></p>
                        </div>
                    </div>
                    <div class="text-center" style="margin-top: 2rem; font-size: 0.8rem; opacity: 0.7;">
                        ${data.footerText}
                    </div>
                </div>
            `;
        }

    } catch (error) {
        console.error('Error loading common data:', error);
    }
}

async function loadPageData(pageId) {
    try {
        const response = await fetch(`_data/${pageId}.json`);
        const data = await response.json();

        // Helper to set text/html
        const setContent = (id, content, isMarkdown = false) => {
            const el = document.getElementById(id);
            if (el) {
                if (isMarkdown && window.marked) {
                    el.innerHTML = marked.parse(content);
                } else {
                    el.innerHTML = content; // Use innerHTML to allow simple tags if needed, or textContent for safety
                }
            }
        };

        const setAttr = (id, attr, value) => {
            const el = document.getElementById(id);
            if (el) el.setAttribute(attr, value);
        };

        // Page Specific Logic
        switch (pageId) {
            case 'home':
                setContent('hero-title', data.hero.title);
                setContent('hero-subtitle', data.hero.subtitle);
                setContent('hero-cta', data.hero.cta);
                setAttr('hero-cta', 'href', data.hero.ctaLink);

                setContent('mission-title', data.mission.title);
                setContent('mission-body', data.mission.body, true);

                const servicesContainer = document.getElementById('services-list');
                if (servicesContainer && data.services) {
                    servicesContainer.innerHTML = data.services.map(s => `
                        <div class="card text-center">
                            <h3>${s.title}</h3>
                            <p>${s.desc}</p>
                            <br>
                            <a href="${s.link}" style="color: var(--color-primary); font-weight: bold;">Scopri di più &rarr;</a>
                        </div>
                    `).join('');
                }
                break;

            case 'chi-siamo':
                setContent('page-title', data.title);
                setContent('story-body', data.story, true);
                setContent('assoc-title', data.association.title);

                const assocList = document.getElementById('assoc-list');
                if (assocList && data.association.items) {
                    assocList.innerHTML = data.association.items.map(item => `<li>${item}</li>`).join('');
                }
                break;

            case 'istruttori':
                setContent('page-title', data.title);
                const teamList = document.getElementById('team-list');
                if (teamList && data.list) {
                    teamList.innerHTML = data.list.map(i => `
                        <div class="card">
                            <h3>${i.name}</h3>
                            <h4 style="font-size: 1rem; color: #666; margin-bottom: 1rem;">${i.role}</h4>
                            <p class="justify">${i.desc}</p>
                        </div>
                    `).join('');
                }
                break;

            case 'scuola-dressage':
                setContent('base-title', data.base.title);
                setContent('base-body', data.base.body, true);
                setContent('dressage-title', data.dressage.title);
                setContent('dressage-body', data.dressage.body, true);
                setContent('pony-title', data.pony.title);
                setContent('pony-body', data.pony.body, true);
                break;

            case 'servizi':
                setContent('pensione-title', data.pensione.title);
                setContent('pensione-body', data.pensione.body, true);
                const featuresList = document.getElementById('pensione-features');
                if (featuresList && data.pensione.features) {
                    featuresList.innerHTML = data.pensione.features.map(f => `<li style="background: #fff; padding: 1rem; border-radius: 4px; list-style: none; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">✓ ${f}</li>`).join('');
                }
                setContent('commerciale-title', data.commerciale.title);
                setContent('commerciale-body', data.commerciale.body, true);
                break;

            case 'eventi':
                setContent('grest-title', data.grest.title);
                setContent('grest-body', data.grest.body, true);
                setContent('party-title', data.party.title);
                setContent('party-body', data.party.body, true);
                setContent('gita-title', data.gita.title);
                setContent('gita-body', data.gita.body, true);
                break;

            case 'contatti':
                setContent('contact-address', data.info.address);
                setContent('contact-phone', data.info.phoneDisplay || data.info.phone); // Fallback
                setAttr('contact-phone-link', 'href', data.info.phone);
                setContent('contact-email', data.info.email);
                setAttr('contact-email-link', 'href', `mailto:${data.info.email}`);
                break;
        }

    } catch (error) {
        console.error(`Error loading data for ${pageId}:`, error);
    }
}
