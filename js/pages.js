const pages = {
    home: `
        <section class="hero-statement">
            <div class="hero-content">
                <span class="fade-in" style="display: block; font-family: var(--font-body); font-size: 0.85rem; color: var(--color-gold); text-transform: uppercase; letter-spacing: 0.2em; margin-bottom: 2rem;">Tax & Management Consultancy</span>
                <h1 class="display-1 text-gold fade-in delay-1" style="font-size: clamp(3rem, 6vw, 6rem); line-height: 1.25; margin-bottom: 2.5rem; text-shadow: 0 4px 20px rgba(0,0,0,0.5);">Practical Solutions.<br>Lasting Growth.</h1>
                <p class="fade-in delay-2" style="color: var(--color-offwhite); font-size: 1.2rem; margin-bottom: 3.5rem; max-width: 600px; margin-left: auto; margin-right: auto; letter-spacing: 0.15em; font-family: var(--font-body); line-height: 1.8; text-transform: uppercase; text-shadow: 0 2px 10px rgba(0,0,0,0.5);">
                    The Reliable Partner For Every Stage Of Your Financial Journey
                </p>
                <div class="fade-in delay-3">
                    <a href="#services" class="btn-ghost" style="background: rgba(18,18,18,0.4); backdrop-filter: blur(5px);">Explore Expertise</a>
                </div>
            </div>
        </section>
    `,

    about: `
        <!-- Cinematic Header -->
        <section class="hero-about">
            <div class="hero-content">
                <span class="fade-in" style="display: block; font-family: var(--font-body); font-size: 0.85rem; color: var(--color-gold); text-transform: uppercase; letter-spacing: 0.2em; margin-bottom: 1rem;">The Firm</span>
                <h1 class="display-1 text-gold fade-in delay-1" style="font-size: clamp(3rem, 5vw, 5rem); line-height: 1.25; margin-bottom: 1rem; text-shadow: 0 4px 20px rgba(0,0,0,0.5);">About Us</h1>
            </div>
        </section>

        <!-- Band 1: Introduction -->
        <section class="section" style="padding: 10rem 0;">
            <div class="container" style="max-width: 900px; text-align: center;">
                <h2 class="display-2 fade-in delay-1" style="margin-bottom: 2rem; line-height: 1.2;">Professional solutions.<br>Reliable partnerships.</h2>
                <p class="fade-in delay-2" style="font-size: 1.25rem; line-height: 2; color: var(--color-charcoal); margin-bottom: 2rem;">
                    AJ Associates is a trusted management consultancy firm based in Kerala, offering a complete range of professional services for businesses and individuals. Our expertise covers Accounting, Taxation, Corporate Finance, Business Advisory, and Staffing Support.
                </p>
                <p class="fade-in delay-3" style="font-size: 1.25rem; line-height: 2; color: var(--color-charcoal);">
                    We work closely with everyone from local shops to large corporations, delivering results that are practical, fully compliant, and focused on your growth.
                </p>
            </div>
        </section>

        <!-- Band 2: Core Values (Luxury Cards) -->
        <section class="section section-dark" style="padding: 10rem 0;">
            <div class="container">
                <div style="text-align: center; margin-bottom: 6rem;">
                    <h2 class="display-2 fade-in text-gold">Core Values</h2>
                    <p class="fade-in delay-1" style="text-transform: uppercase; letter-spacing: 0.1em; font-size: 1rem; color: rgba(247,247,247,0.6); margin-top: 1rem;">The principles that guide our practice</p>
                </div>
                <div class="grid-minimal">
                    <!-- Value 1 -->
                    <div class="core-value-card fade-in delay-1">
                        <span class="core-value-num">01</span>
                        <h3 style="color: var(--color-gold); font-size: 1.75rem; margin-bottom: 1.5rem; font-family: var(--font-heading);">Excellence</h3>
                        <p style="color: rgba(247,247,247,0.8); line-height: 1.8; font-size: 1.1rem;">Delivering high-quality work with care and accuracy in every single engagement.</p>
                    </div>
                    <!-- Value 2 -->
                    <div class="core-value-card fade-in delay-2">
                        <span class="core-value-num">02</span>
                        <h3 style="color: var(--color-gold); font-size: 1.75rem; margin-bottom: 1.5rem; font-family: var(--font-heading);">Teamwork</h3>
                        <p style="color: rgba(247,247,247,0.8); line-height: 1.8; font-size: 1.1rem;">Working closely together and acting as a true, reliable partner with our clients.</p>
                    </div>
                    <!-- Value 3 -->
                    <div class="core-value-card fade-in delay-3">
                        <span class="core-value-num">03</span>
                        <h3 style="color: var(--color-gold); font-size: 1.75rem; margin-bottom: 1.5rem; font-family: var(--font-heading);">Leadership</h3>
                        <p style="color: rgba(247,247,247,0.8); line-height: 1.8; font-size: 1.1rem;">Guiding businesses forward with honesty, integrity, and proactive strategic thinking.</p>
                    </div>
                </div>
            </div>
        </section>

        <!-- Band 3: Our Mission -->
        <section class="section" style="padding: 10rem 0; background-color: var(--color-offwhite);">
            <div class="container" style="max-width: 800px; text-align: center;">
                <h2 class="display-2 fade-in text-gold" style="margin-bottom: 2rem;">Our Mission</h2>
                <p class="fade-in delay-1" style="font-family: var(--font-heading); font-style: italic; font-size: 1.75rem; line-height: 1.8; color: var(--color-charcoal); margin-bottom: 4rem;">
                    "Our mission is to guide clients through every step of their business journey — from company registration to daily operations, tax compliance, and smart decision-making."
                </p>
                <div class="fade-in delay-2" style="display: flex; flex-direction: column; align-items: center; font-size: 1.15rem; line-height: 1.6; color: var(--color-charcoal); text-transform: uppercase; letter-spacing: 0.1em; font-weight: 500;">
                    <div style="border-bottom: 1px solid rgba(197,160,89,0.3); padding: 2rem 0; width: 100%;">Provide smart & customized solutions</div>
                    <div style="border-bottom: 1px solid rgba(197,160,89,0.3); padding: 2rem 0; width: 100%;">Build strong, long-lasting trust</div>
                    <div style="padding: 2rem 0; width: 100%;">Deliver high-value, professional results</div>
                </div>
            </div>
        </section>
    `,

    services: `
        <!-- Cinematic Header -->
        <section class="hero-services">
            <div class="hero-content">
                <span class="fade-in" style="display: block; font-family: var(--font-body); font-size: 0.85rem; color: var(--color-gold); text-transform: uppercase; letter-spacing: 0.2em; margin-bottom: 1rem;">What We Provide</span>
                <h1 class="display-1 text-gold fade-in delay-1" style="font-size: clamp(3rem, 5vw, 5rem); line-height: 1.25; margin-bottom: 1rem; text-shadow: 0 4px 20px rgba(0,0,0,0.5);">Our Expertise</h1>
            </div>
        </section>

        <!-- Interactive Columns Grid -->
        <section class="section section-dark" style="padding: 10rem 0;">
            <div class="container">
                <div style="text-align: center; margin-bottom: 6rem;">
                    <p class="fade-in delay-1" style="font-size: 1.25rem; line-height: 2; color: rgba(247,247,247,0.8); max-width: 800px; margin: 0 auto;">
                        Explore our comprehensive suite of professional services. Hover over any area of expertise below to reveal how we can support your business growth and compliance.
                    </p>
                </div>
                
                <div class="services-columns">
                    <!-- Column 1 -->
                    <div class="service-column fade-in delay-1">
                        <!-- Top Tile -->
                        <div class="service-tile top">
                            <div>
                                <i class="fas fa-chart-line service-tile-icon"></i>
                                <h3 class="service-tile-title">Accounts, Management & Auditing</h3>
                            </div>
                            <div class="service-tile-plus"><i class="fas fa-plus"></i></div>
                            <div class="service-tile-content">
                                <ul class="service-tile-list">
                                    <li>Day-to-day bookkeeping and ledger maintenance</li>
                                    <li>Preparation of financial statements and MIS reports</li>
                                    <li>Budgeting, fund flow, and cash flow analysis</li>
                                    <li>Internal audits and financial health checks</li>
                                    <li>Financial and operational process audits</li>
                                </ul>
                            </div>
                        </div>
                        <!-- Bottom Tile -->
                        <div class="service-tile bottom">
                            <div>
                                <i class="fas fa-users service-tile-icon"></i>
                                <h3 class="service-tile-title">Outsourced Staffing & Support</h3>
                            </div>
                            <div class="service-tile-plus"><i class="fas fa-plus"></i></div>
                            <div class="service-tile-content">
                                <ul class="service-tile-list">
                                    <li>Recruitment and placement of trained accountants</li>
                                    <li>Payroll processing and structuring</li>
                                    <li>PF, ESI, and Labour Law compliance</li>
                                    <li>Temporary staffing for peak audit/tax seasons</li>
                                    <li>On-the-job training for corporate finance teams</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <!-- Column 2 -->
                    <div class="service-column fade-in delay-2">
                        <!-- Top Tile -->
                        <div class="service-tile top">
                            <div>
                                <i class="fas fa-hand-holding-dollar service-tile-icon"></i>
                                <h3 class="service-tile-title">Loans & Capital Proposals</h3>
                            </div>
                            <div class="service-tile-plus"><i class="fas fa-plus"></i></div>
                            <div class="service-tile-content">
                                <ul class="service-tile-list">
                                    <li>Preparation of Detailed Project Reports (DPR)</li>
                                    <li>Provisional and projected financial statements</li>
                                    <li>Loan syndication and bank finance facilitation</li>
                                    <li>Working capital and term loan advisory</li>
                                    <li>CMA data preparation</li>
                                </ul>
                            </div>
                        </div>
                        <!-- Bottom Tile -->
                        <div class="service-tile bottom">
                            <div>
                                <i class="fas fa-chess service-tile-icon"></i>
                                <h3 class="service-tile-title">Business Strategy & Restructuring</h3>
                            </div>
                            <div class="service-tile-plus"><i class="fas fa-plus"></i></div>
                            <div class="service-tile-content">
                                <ul class="service-tile-list">
                                    <li>Business valuation and due diligence</li>
                                    <li>Mergers, acquisitions, and business restructuring</li>
                                    <li>Cost reduction and efficiency analysis</li>
                                    <li>Standard Operating Procedure (SOP) development</li>
                                    <li>Digital transformation of accounting systems</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <!-- Column 3 -->
                    <div class="service-column fade-in delay-3">
                        <!-- Top Tile -->
                        <div class="service-tile top">
                            <div>
                                <i class="fas fa-scale-balanced service-tile-icon"></i>
                                <h3 class="service-tile-title">Taxation & Regulatory Compliance</h3>
                            </div>
                            <div class="service-tile-plus"><i class="fas fa-plus"></i></div>
                            <div class="service-tile-content">
                                <ul class="service-tile-list">
                                    <li>Income Tax: PAN/TAN processing, return filing, and advisory</li>
                                    <li>GST: Registration, monthly/annual filings, and audits</li>
                                    <li>TDS/TCS compliance and return filing</li>
                                    <li>Tax planning for individuals and corporations</li>
                                    <li>Representation before tax authorities</li>
                                </ul>
                            </div>
                        </div>
                        <!-- Bottom Tile -->
                        <div class="service-tile bottom">
                            <div>
                                <i class="fas fa-building service-tile-icon"></i>
                                <h3 class="service-tile-title">Company Formation & Legal Setup</h3>
                            </div>
                            <div class="service-tile-plus"><i class="fas fa-plus"></i></div>
                            <div class="service-tile-content">
                                <ul class="service-tile-list">
                                    <li>Registration of Pvt Ltd, LLP, Partnership, and Proprietorship</li>
                                    <li>MSME/Udyam and Startup India registrations</li>
                                    <li>FSSAI, Trade License, and local body registrations</li>
                                    <li>Import Export Code (IEC) processing</li>
                                    <li>Digital Signature Certificate (DSC) issuance</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                </div>
            </div>
        </section>

        <section class="cta-section section-light fade-in">
            <div class="container">
                <div class="services-cta">
                    <h3 class="cta-question">Curating excellence requires a direct dialogue. We invite you to reach out for a dedicated consultation.</h3>
                    <div class="cta-buttons">
                        <a href="#contact" class="cta-btn email-btn">
                            <i class="fas fa-envelope"></i>
                            <span>Send an Inquiry</span>
                        </a>
                        <a href="https://wa.me/916282406091?text=Greetings.%20I%20would%20like%20to%20learn%20more%20about%20the%20specialized%20services%20offered%20by%20your%20firm.%20I%20am%20interested%20in%20arranging%20a%20consultation%20to%20discuss%20how%20your%20expertise%20can%20assist%20with%20my%20requirements." target="_blank" class="cta-btn whatsapp-btn">
                            <i class="fab fa-whatsapp"></i>
                            <span>Instant Engagement</span>
                        </a>
                    </div>
                </div>
            </div>
        </section>
    `,

    team: `
        <section class="hero-team">
            <div class="hero-content">
                <span class="fade-in" style="display: block; font-family: var(--font-body); font-size: 0.85rem; color: var(--color-gold); text-transform: uppercase; letter-spacing: 0.2em; margin-bottom: 1rem;">The Architects of Success</span>
                <h1 class="display-1 text-gold fade-in delay-1" style="font-size: clamp(3rem, 5vw, 5rem); line-height: 1.25; margin-bottom: 1rem; text-shadow: 0 4px 20px rgba(0,0,0,0.5);">Our Leadership</h1>
            </div>
        </section>

        <section class="section section-dark">
            <div class="container">
                <div style="margin-bottom: var(--spacing-xl); text-align: center;">
                    <h2 class="display-2 fade-in">Leading with Excellence</h2>
                    <p class="text-gold fade-in delay-1" style="text-transform: uppercase; letter-spacing: 0.1em;">Directing the vision of AJ Associates</p>
                </div>
                
                <div class="team-grid">
                    <!-- Jithu Jenson -->
                    <div class="profile-card fade-in delay-1">
                        <img src="assets/jithu.png" alt="Jithu Jenson">
                        <div class="profile-info">
                            <h3 class="profile-name">Jithu Jenson</h3>
                            <p class="profile-title">Managing Partner</p>
                        </div>
                    </div>
                    
                    <!-- Alan Joshy -->
                    <div class="profile-card fade-in delay-2">
                        <img src="assets/alan.png" alt="Alan Joshy">
                        <div class="profile-info">
                            <h3 class="profile-name">Alan Joshy</h3>
                            <p class="profile-title">Team Head</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <section id="partnership" class="section section-light fade-in">
            <div class="container">
                <div style="margin-bottom: var(--spacing-xl); text-align: center;">
                    <h2 class="display-2" style="color: var(--color-charcoal);">Strategic Partnerships</h2>
                    <p style="color: var(--color-gold); text-transform: uppercase; letter-spacing: 0.1em; font-weight: 600;">Collaborate for Mutual Growth</p>
                </div>

                <div class="partnership-form">
                    <p style="text-align: center; color: #666; margin-bottom: 2.5rem; line-height: 1.6;">
                        Are you a bank, software firm, or service provider looking to integrate with our professional network? 
                        Propose a partnership below and let's explore how we can deliver integrated value to our clients.
                    </p>
                    
                    <form onsubmit="event.preventDefault(); alert('Proposal sent! Our partnership lead will contact you shortly.');">
                        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 2rem;">
                            <div class="form-group">
                                <label>Company Name</label>
                                <input type="text" class="form-control" placeholder="Enter company name" required>
                            </div>
                            <div class="form-group">
                                <label>Contact Person</label>
                                <input type="text" class="form-control" placeholder="Your Name" required>
                            </div>
                        </div>

                        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 2rem;">
                            <div class="form-group">
                                <label>Email Address</label>
                                <input type="email" class="form-control" placeholder="corporate@email.com" required>
                            </div>
                            <div class="form-group">
                                <label>Mobile Number</label>
                                <input type="tel" class="form-control" placeholder="10-digit number" pattern="[0-9]{10}" required>
                            </div>
                        </div>

                        <div class="form-group">
                            <label>Partnership Proposal</label>
                            <textarea class="form-control" rows="4" placeholder="Briefly describe how we can collaborate..." required></textarea>
                        </div>

                        <button type="submit" class="partnership-btn">Submit Proposal</button>
                        
                        <a href="https://wa.me/916282406091?text=Hello.%20We%20are%20interested%20in%20exploring%20a%20formal%20partnership%20to%20align%20our%20services%20with%20AJ%20Associates.%20When%20would%20be%20best%20to%20discuss%20this%20synergy?" target="_blank" class="partnership-whatsapp">
                            <i class="fab fa-whatsapp"></i>
                            Discuss on WhatsApp
                        </a>
                    </form>
                </div>
            </div>
        </section>
    `,

    contact: `
        <section class="hero-contact">
            <div class="hero-content">
                <span class="fade-in" style="display: block; font-family: var(--font-body); font-size: 0.85rem; color: var(--color-gold); text-transform: uppercase; letter-spacing: 0.2em; margin-bottom: 1rem;">Direct Dialogue</span>
                <h1 class="display-1 text-gold fade-in delay-1" style="font-size: clamp(3rem, 5vw, 5rem); line-height: 1.25; margin-bottom: 1rem; text-shadow: 0 4px 20px rgba(0,0,0,0.5);">Contact Us</h1>
            </div>
        </section>

        <section class="section section-dark">
            <div class="container">
                <div style="margin-bottom: var(--spacing-xl); text-align: center;">
                    <h2 class="display-2 fade-in">Let's Discuss Excellence</h2>
                    <p class="text-gold fade-in delay-1" style="text-transform: uppercase; letter-spacing: 0.1em;">Reach out for a dedicated consultation</p>
                </div>
                
                <div class="contact-grid">
                    <!-- Contact Form -->
                    <div class="fade-in delay-1" style="padding: var(--spacing-md); background-color: var(--color-charcoal); border: 1px solid rgba(197, 160, 89, 0.3); border-radius: 40px !important;">
                        <h3 class="display-2" style="font-size: 2rem; margin-bottom: var(--spacing-sm); color: var(--color-offwhite);">Send an Inquiry</h3>
                        <p style="margin-bottom: var(--spacing-lg); color: rgba(247,247,247,0.7); font-family: var(--font-body); font-size: 0.85rem; line-height: 1.6;">Fill out the form below, and our dedicated team will reach out to you within 24 hours.</p>
                        
                        <form onsubmit="return validateAndSubmitContactForm(event)">
                            <div class="form-group">
                                <label class="form-label" for="name">Name</label>
                                <input type="text" id="name" class="form-control" placeholder="Your full name" required>
                            </div>
                            <div class="form-group">
                                <label class="form-label" for="mobile">Mobile Number</label>
                                <input type="tel" id="mobile" class="form-control" placeholder="10-digit number" pattern="[0-9]{10}" title="Please enter a valid 10-digit mobile number" required>
                            </div>
                            <div class="form-group">
                                <label class="form-label" for="email">Email Address</label>
                                <input type="email" id="email" class="form-control" placeholder="Your professional email" required>
                            </div>
                            <div class="form-group custom-dropdown-container">
                                <label class="form-label">Select a Service</label>
                                <div class="custom-select-wrapper" onclick="toggleCustomSelect(this)">
                                    <div class="custom-select-trigger form-control" style="display: flex; justify-content: space-between; align-items: center; cursor: pointer;">
                                        <span class="custom-select-value" style="color: rgba(247, 247, 247, 0.5);">Choose a category...</span>
                                        <i class="fas fa-chevron-down" style="color: var(--color-gold); font-size: 1rem; transition: transform 0.3s ease;"></i>
                                    </div>
                                    <div class="custom-select-options">
                                        <span class="custom-option" data-value="Accounts" onclick="selectCustomOption(this, event)">Accounting & Auditing</span>
                                        <span class="custom-option" data-value="Taxation" onclick="selectCustomOption(this, event)">Taxation & Compliance</span>
                                        <span class="custom-option" data-value="Lending" onclick="selectCustomOption(this, event)">Lending & Capital</span>
                                        <span class="custom-option" data-value="Strategy" onclick="selectCustomOption(this, event)">Strategy & Restructuring</span>
                                        <span class="custom-option" data-value="Others" onclick="selectCustomOption(this, event)">Other Consultations</span>
                                    </div>
                                </div>
                                <input type="hidden" id="service" required>
                            </div>
                            
                            <div class="form-group" id="others-group">
                                <label class="form-label" for="message">Your Requirements</label>
                                <textarea id="message" class="form-control" rows="1" style="resize: vertical; overflow: hidden;" placeholder="Tell us more about your needs..." required></textarea>
                            </div>
                            
                            <div style="text-align: left; margin-top: var(--spacing-md);">
                                <button type="submit" class="btn-solid" style="width: 100%; text-align: center; justify-content: center;">Send Message</button>
                            </div>
                        </form>
                    </div>

                    <!-- Info & Map -->
                    <div style="display: flex; flex-direction: column; gap: var(--spacing-sm);">
                        <div class="contact-info-card fade-in delay-2" style="border-radius: 40px !important;">
                            <h3 style="font-size: 1.5rem; margin-bottom: 1.5rem; color: var(--color-gold);">Contact Details</h3>
                            
                            <div style="display: grid; gap: 2rem;">
                                <div>
                                    <p style="margin-bottom: 0.5rem;"><strong style="font-family: var(--font-heading); font-size: 1.2rem; color: var(--color-gold);">Our Office</strong></p>
                                    <p style="color: rgba(247,247,247,0.7); line-height: 1.8;">
                                        Second Floor, 10/1329 G, Bivera,<br>
                                        Chullickal Road, Near St. Joseph’s Bethlehem Church,<br>
                                        Chullickal, Kochi, Kerala, 682006
                                    </p>
                                </div>
                                
                                <div>
                                    <p style="margin-bottom: 0.5rem;"><strong style="color: var(--color-gold);">Connect Directly</strong></p>
                                    <p style="margin-bottom: 0.25rem;">Phone: <a href="tel:+918136885152">+91 81368 85152</a></p>
                                    <p>Email: <a href="mailto:mail.aj.associate@gmail.com">mail.aj.associate@gmail.com</a></p>
                                </div>

                                <div style="border-top: 1px solid rgba(197, 160, 89, 0.2); padding-top: 2rem;">
                                    <h4 style="font-family: var(--font-heading); font-size: 1.1rem; margin-bottom: 1rem; color: var(--color-gold);">Instant Engagement</h4>
                                    <a href="https://wa.me/916282406091?text=Greetings.%20I%20would%20like%20to%20learn%20more%20about%20the%20specialized%20services%20offered%20by%20your%20firm.%20I%20am%20interested%20in%20arranging%20a%20consultation%20to%20discuss%20how%20your%20expertise%20can%20assist%20with%20my%20requirements." target="_blank" class="whatsapp-btn" style="display: flex; align-items: center; justify-content: center; gap: 1rem; text-decoration: none; background: #075E54; color: white; padding: 1.25rem; border-radius: 100px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; font-size: 0.85rem; border: none;">
                                        <i class="fab fa-whatsapp" style="font-size: 1.5rem;"></i>
                                        Message on WhatsApp
                                    </a>
                                </div>
                            </div>
                        </div>

                        <div class="fade-in delay-3" style="flex: 1; display: flex; flex-direction: column; gap: var(--spacing-sm);">
                            <div style="flex: 1; min-height: 250px; background: #1a1a1a; border-radius: 40px !important; overflow: hidden; border: 1px solid rgba(197, 160, 89, 0.2); position: relative;">
                                <iframe 
                                    class="dark-map"
                                    src="https://maps.google.com/maps?q=A+J+Associates,+Second+Floor,+10/1329+G,+Bivera,+Chullickal+Road,+Kochi,+Kerala&t=&z=15&ie=UTF8&iwloc=&output=embed" 
                                    style="border:0; display: block; position: absolute; top: -140px; left: 0; width: 100%; height: calc(100% + 140px);" 
                                    allowfullscreen="" 
                                    loading="lazy" 
                                    referrerpolicy="no-referrer-when-downgrade">
                                </iframe>
                            </div>
                            <a href="https://maps.app.goo.gl/AC9H632AbZB1FGa38" target="_blank" class="map-link" style="display: inline-flex; align-items: center; gap: 0.5rem; text-decoration: none; color: var(--color-gold); font-family: var(--font-heading); font-size: 1.1rem; letter-spacing: 0.05em; align-self: center; padding-top: 0.5rem;">
                                PLAN YOUR VISIT <i class="fas fa-paper-plane"></i>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <section class="section section-light fade-in" style="padding: 5rem 0;">
            <div class="container" style="text-align: center;">
                <h3 class="display-2" style="font-size: 2.25rem; color: var(--color-charcoal); margin-bottom: 1rem;">Looking for Collaboration?</h3>
                <p style="color: #666; margin-bottom: 2rem; font-family: var(--font-body); font-size: 1.1rem;">Connect with us for strategic partnership opportunities.</p>
                <a href="#team/partnership" class="btn-ghost" style="border-color: var(--color-gold); color: var(--color-gold); text-decoration: none;">Partner with Us</a>
            </div>
        </section>
    `
};

// Expose functions globally for inline handlers
window.toggleAccordion = function (button) {
    const item = button.parentElement;
    const content = item.querySelector('.accordion-content');

    // Toggle active class
    item.classList.toggle('active');

    if (item.classList.contains('active')) {
        content.style.maxHeight = content.scrollHeight + 'px';
    } else {
        content.style.maxHeight = '0';
    }
};

// Removed toggleOthersField as the requirements field is now always active

window.toggleCustomSelect = function (wrapper) {
    // Close other open selects
    document.querySelectorAll('.custom-select-wrapper.open').forEach(el => {
        if (el !== wrapper) el.classList.remove('open');
    });
    wrapper.classList.toggle('open');
};

window.selectCustomOption = function (optionElement, event) {
    event.stopPropagation(); // Prevent trigger click
    const wrapper = optionElement.closest('.custom-select-wrapper');
    const valueElement = wrapper.querySelector('.custom-select-value');
    const hiddenInput = wrapper.parentElement.querySelector('input[type="hidden"]');

    // Update visual value
    valueElement.textContent = optionElement.textContent;
    valueElement.style.color = 'var(--color-offwhite)';

    // Update hidden input value
    hiddenInput.value = optionElement.getAttribute('data-value');

    // Close dropdown
    wrapper.classList.remove('open');
};

// Close dropdowns when clicking outside
document.addEventListener('click', function (event) {
    if (!event.target.closest('.custom-select-wrapper')) {
        document.querySelectorAll('.custom-select-wrapper.open').forEach(el => {
            el.classList.remove('open');
        });
    }
});

// Custom Form Validation and Submission
window.validateAndSubmitContactForm = function (event) {
    event.preventDefault(); // Stop native submission to allow custom validation

    const mobile = document.getElementById('mobile').value.trim();
    const service = document.getElementById('service').value.trim();

    // HTML5 handles standard required/pattern checks for visible inputs before onsubmit fires.
    // However, we must manually validate the custom hidden 'service' dropdown.
    if (!service) {
        alert("Please select a service category.");
        const trigger = document.querySelector('.custom-select-trigger');
        trigger.style.borderBottomColor = '#ff4444'; // Error highlight
        setTimeout(() => trigger.style.borderBottomColor = '', 2500);
        return false;
    }

    // Fallback check for mobile pattern in case of older browsers
    if (!/^[0-9]{10}$/.test(mobile)) {
        alert("Please enter a valid 10-digit mobile number.");
        return false;
    }

    // If all validation passes
    alert('Your inquiry has been submitted successfully. Our team will reach out to you within 24 hours.');

    // Reset form to pristine state
    event.target.reset();
    document.getElementById('service').value = '';
    const customValueDisplay = document.querySelector('.custom-select-value');
    if (customValueDisplay) {
        customValueDisplay.textContent = 'Choose a category...';
        customValueDisplay.style.color = 'rgba(247, 247, 247, 0.5)';
    }

    return true;
};
