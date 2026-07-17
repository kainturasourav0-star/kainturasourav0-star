document.addEventListener('DOMContentLoaded', () => {
  const terminalInput = document.getElementById('terminal-input');
  const terminalOutput = document.getElementById('terminal-output-log');
  const terminalScreen = document.getElementById('terminal-screen');
  const heroBtn = document.getElementById('hero-toggle-btn');
  const partyBtn = document.getElementById('party-toggle-btn');
  const heroCard = document.getElementById('hero-title-card');
  const characterMarkGroup = document.getElementById('character-mark-group');
  const hologramCatGroup = document.getElementById('hologram-cat-group');
  const body = document.body;

  // Keep terminal input focused
  terminalScreen.addEventListener('click', () => {
    terminalInput.focus();
  });

  // Matrix Rain Background Logic
  const canvas = document.getElementById('matrix-canvas');
  const ctx = canvas.getContext('2d');

  function resizeCanvas() {
    canvas.width = canvas.parentElement.offsetWidth;
    canvas.height = canvas.parentElement.offsetHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  const katakana = 'アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズヅブプエェケセテネヘメレヱゲゼデベペオォコソトノホモヨョロヲゴゾドボポヴッン0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const alphabet = katakana.split('');
  const fontSize = 14;
  let columns = canvas.width / fontSize;
  let rainDrops = [];

  function initRain() {
    columns = Math.floor(canvas.width / fontSize) + 1;
    rainDrops = [];
    for(let x = 0; x < columns; x++) {
      rainDrops[x] = Math.floor(Math.random() * -30); // Randomized start heights
    }
  }

  let matrixInterval = null;
  let matrixTheme = 'green';
  let hueOffset = 0;

  function drawMatrix() {
    ctx.fillStyle = 'rgba(3, 7, 18, 0.08)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (matrixTheme === 'rainbow') {
      hueOffset = (hueOffset + 1) % 360;
    }

    ctx.font = fontSize + 'px monospace';

    for(let i = 0; i < rainDrops.length; i++) {
      const text = alphabet[Math.floor(Math.random() * alphabet.length)];
      
      if (matrixTheme === 'rainbow') {
        const columnHue = (i * 12 + hueOffset) % 360;
        ctx.fillStyle = `hsla(${columnHue}, 85%, 65%, 0.75)`;
      } else {
        ctx.fillStyle = matrixTheme === 'red' ? 'rgba(244, 63, 94, 0.7)' : 'rgba(16, 185, 129, 0.7)';
      }

      ctx.fillText(text, i * fontSize, rainDrops[i] * fontSize);

      if(rainDrops[i] * fontSize > canvas.height && Math.random() > 0.975) {
        rainDrops[i] = 0;
      }
      rainDrops[i]++;
    }
  }

  function startMatrixRain(theme = 'green', opacity = 0.12) {
    matrixTheme = theme;
    canvas.style.opacity = opacity;
    if (matrixInterval) clearInterval(matrixInterval);
    resizeCanvas();
    initRain();
    matrixInterval = setInterval(drawMatrix, 33);
  }

  function stopMatrixRain() {
    canvas.style.opacity = '0';
    if (matrixInterval) {
      clearInterval(matrixInterval);
      matrixInterval = null;
    }
    setTimeout(() => {
      if (!matrixInterval) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }, 500);
  }

  // CLI Data Configurations
  const portfolioData = {
    about: `Sourav Kaintura
------------------
Role: Aspiring Software Engineer & CSE Learner
Location: Delhi, India
Course: BCA (Bachelor of Computer Applications)
Mission: Building intelligent applications and exploring cybersecurity pipelines.`,
    
    skills: `{
  "core_concepts": [
    "Data Structures & Algorithms (DSA)",
    "Object-Oriented Programming (OOP)",
    "Database Management Systems (DBMS)"
  ],
  "programming_languages": ["Python", "JavaScript", "HTML5", "CSS3"],
  "devops_and_systems": ["Linux Administration", "Bash Scripting", "Git/GitHub"]
}`,

    projects: [
      { name: "GHOST QA", desc: "Generative AI-powered intelligent context-aware Q&A system.", link: "https://github.com/kainturasourav0-star/GHOST-QA-GENERATIVE" },
      { name: "Project Architect", desc: "Automated security pipeline turning flowcharts into active exploits.", link: "https://github.com/kainturasourav0-star/Project-Architect" },
      { name: "Terminal Lens", desc: "AI-powered terminal monitoring dashboard with real-time analytics.", link: "https://github.com/kainturasourav0-star/terminal-lens" },
      { name: "BiasWatch", desc: "Real-time AI bias detection and mitigation auditing platform.", link: "https://github.com/kainturasourav0-star/biaswatch" },
      { name: "AgeVerify", desc: "Privacy-first zero-knowledge proof age verification system.", link: "https://github.com/kainturasourav0-star/ageverify" }
    ],

    goals: `[1] Contrib to Open Source Security & AI frameworks (In progress)
[2] Deepen knowledge in Linux shell configurations & vulnerability scanning
[3] Build high-performance scalable fullstack applications (HTML/CSS/JS/Node)
[4] Land a Software Engineering Internship in a cutting-edge team`
  };

  // Process Command Input
  terminalInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const commandText = terminalInput.value.trim();
      const tokens = commandText.toLowerCase().split(' ');
      const cmd = tokens[0];

      // Add typed command to output log
      writeToTerminal(`guest@sourav:~$ ${commandText}`, 'command-echo');

      // Command routing
      if (cmd === '') {
        // Do nothing
      } else if (cmd === 'help') {
        runHelp();
      } else if (cmd === 'about') {
        writeToTerminal(portfolioData.about);
      } else if (cmd === 'skills') {
        writeToTerminal(portfolioData.skills, 'highlight-cyan');
      } else if (cmd === 'projects') {
        runProjects();
      } else if (cmd === 'goals') {
        writeToTerminal(portfolioData.goals, 'highlight-yellow');
      } else if (cmd === 'hack') {
        runHackAnimation();
      } else if (cmd === 'clear') {
        terminalOutput.innerHTML = '';
      } else {
        writeToTerminal(`Command not found: "${cmd}". Type 'help' for a list of available actions.`, 'highlight-red');
      }

      // Clear input and auto scroll to bottom
      terminalInput.value = '';
      terminalOutput.scrollTop = terminalOutput.scrollHeight;
    }
  });

  // Helper function to print lines to terminal
  function writeToTerminal(text, className = '') {
    const div = document.createElement('div');
    div.className = `line ${className}`;
    div.innerText = text;
    terminalOutput.appendChild(div);
  }

  // Help command output
  function runHelp() {
    const helpText = `Available Commands:
  about    - Learn more about Sourav and his background.
  skills   - View core technical skills and tools.
  projects - Display details and links for key repositories.
  goals    - Read upcoming milestones and goals.
  hack     - Run a mock hacking script.
  clear    - Clear console display.
  help     - Show this guide.`;
    writeToTerminal(helpText, 'highlight-green');
  }

  // Projects command output
  function runProjects() {
    writeToTerminal("Displaying featured repositories (Click to visit):", "highlight-cyan");
    portfolioData.projects.forEach((proj, idx) => {
      const container = document.createElement('div');
      container.className = 'line';
      
      const link = document.createElement('a');
      link.href = proj.link;
      link.target = '_blank';
      link.className = 'highlight-yellow';
      link.style.textDecoration = 'underline';
      link.style.cursor = 'pointer';
      link.innerText = `[${idx + 1}] ${proj.name}`;
      
      const descText = document.createTextNode(`: ${proj.desc}`);
      
      container.appendChild(link);
      container.appendChild(descText);
      terminalOutput.appendChild(container);
    });
  }

  // Hack simulation animation
  let isHacking = false;
  function runHackAnimation() {
    if (isHacking) return;
    isHacking = true;
    terminalInput.disabled = true;

    // Start red hacking matrix rain
    startMatrixRain('red', 0.25);

    const hackCodes = [
      "INITIALIZING SCAN FOR SECURITY EXPLOITS...",
      "TARGET IP: 192.168.1.104 (LOCAL CHASSIS)",
      "BYPASSING SECURITY FIREWALL (ATTEMPT 1/3) -> SUCCESS",
      "DECRYPTING VIRTUAL SHELL CONSOLE...",
      "LOAD PATH: resilient-rutherford/developer-character.svg",
      "INJECTING INVINCIBLE CODE INSTRUCTIONS...",
      "OVERRIDING CODER AVATAR CLASSIFIED DATA...",
      "TRANSFORMATION VECTOR DETECTED [MARK GRAYSON MODE]",
      "HACK COMPLETE. SYSTEM COMPROMISED SUCCESSFULLY."
    ];

    let currentLine = 0;
    const interval = setInterval(() => {
      if (currentLine < hackCodes.length) {
        writeToTerminal(hackCodes[currentLine], currentLine % 2 === 0 ? 'highlight-red' : 'highlight-green');
        terminalOutput.scrollTop = terminalOutput.scrollHeight;
        currentLine++;
      } else {
        clearInterval(interval);
        terminalInput.disabled = false;
        terminalInput.focus();
        isHacking = false;
        // Keep matrix rain but fade to green "compromised" mode
        startMatrixRain('green', 0.12);
        
        // Trigger Hero mode automatically as a bonus!
        if (!body.classList.contains('hero-active')) {
          triggerHeroTransition();
        }
      }
    }, 450);
  }

  // Hero Mode Transition Trigger
  heroBtn.addEventListener('click', () => {
    // If Party Mode is active, disable it first
    if (body.classList.contains('party-active')) {
      body.classList.remove('party-active');
      partyBtn.classList.remove('party-active-btn');
      const partyBtnText = partyBtn.querySelector('.btn-text');
      partyBtnText.innerText = "ACTIVATE PARTY MODE";
      hologramCatGroup.style.display = 'none';
      characterMarkGroup.style.display = 'block';
    }

    if (body.classList.contains('hero-active')) {
      // Deactivate Hero Mode
      body.classList.remove('hero-active');
      const btnText = heroBtn.querySelector('.btn-text');
      btnText.innerText = "ACTIVATE HERO MODE";
      writeToTerminal("\n*** SYSTEM NOTICE: HERO MODE TERMINATED. RETURNING TO STANDARD CODER ENVIRONMENT. ***", "highlight-cyan");
      terminalOutput.scrollTop = terminalOutput.scrollHeight;
      
      // Stop the matrix rain when exiting hero mode
      stopMatrixRain();
    } else {
      // Activate Hero Mode
      triggerHeroTransition();
    }
  });

  // Party Mode Transition Trigger
  partyBtn.addEventListener('click', () => {
    // If Hero Mode is active, disable it first
    if (body.classList.contains('hero-active')) {
      body.classList.remove('hero-active');
      const heroBtnText = heroBtn.querySelector('.btn-text');
      heroBtnText.innerText = "ACTIVATE HERO MODE";
    }

    if (body.classList.contains('party-active')) {
      // Deactivate Party Mode
      body.classList.remove('party-active');
      partyBtn.classList.remove('party-active-btn');
      const btnText = partyBtn.querySelector('.btn-text');
      btnText.innerText = "ACTIVATE PARTY MODE";
      
      // Hide Hologram Cat, Show standard Coder character
      hologramCatGroup.style.display = 'none';
      characterMarkGroup.style.display = 'block';

      writeToTerminal("\n*** SYSTEM NOTICE: PARTY MODE DEACTIVATED. RETURNING TO STANDARD CODER ENVIRONMENT. ***", "highlight-cyan");
      terminalOutput.scrollTop = terminalOutput.scrollHeight;

      // Stop the matrix rain
      stopMatrixRain();
    } else {
      // Activate Party Mode
      body.classList.add('party-active');
      partyBtn.classList.add('party-active-btn');
      const btnText = partyBtn.querySelector('.btn-text');
      btnText.innerText = "DEACTIVATE PARTY MODE";

      // Show Hologram Cat, Hide standard Coder character
      hologramCatGroup.style.display = 'block';
      characterMarkGroup.style.display = 'none';

      writeToTerminal("\n*** SYSTEM NOTICE: PARTY MODE ACTIVATED! DANCING CAT HOLOGRAM PROJECTED. ***", "highlight-purple");
      writeToTerminal("Playing: Komm Tanzen - Ich Will Nicht (Remix)", "highlight-yellow");
      writeToTerminal("Aura: Holographic Purple [Happy Cat dancing].", "highlight-cyan");
      writeToTerminal("Strobe Lights: ONLINE. Rainbow rain background ACTIVE.", "highlight-green");
      terminalOutput.scrollTop = terminalOutput.scrollHeight;

      // Start rainbow matrix rain!
      startMatrixRain('rainbow', 0.18);
    }
  });

  function triggerHeroTransition() {
    // Show Full screen title card overlay
    heroCard.classList.remove('hidden');
    heroCard.style.opacity = '1';
    
    // Disable inputs during transition
    terminalInput.disabled = true;

    // After title card completes screen animation
    setTimeout(() => {
      // Add class to body
      body.classList.add('hero-active');
      
      // Update Button text
      const btnText = heroBtn.querySelector('.btn-text');
      btnText.innerText = "DEACTIVATE HERO MODE";
      
      // Ensure character is displayed and hologram is hidden
      characterMarkGroup.style.display = 'block';
      hologramCatGroup.style.display = 'none';

      // Turn on green matrix rain background
      startMatrixRain('green', 0.12);

      // Output system update logs in console
      writeToTerminal("\n*** SYSTEM NOTICE: HERO MODE OVERRIDE INITIATED. ***", "highlight-yellow");
      writeToTerminal("Executing: transform --hero=invincible --target=mark_grayson", "highlight-cyan");
      writeToTerminal("Status: Coder character flight module ONLINE.", "highlight-green");
      writeToTerminal("Aura: Pulsing Yellow [V-Emblem glowing].", "highlight-yellow");
      writeToTerminal("Visor: Glowing Cyan [Active combat HUD].", "highlight-cyan");
      writeToTerminal("Terminal Status: Invincible. Keep building! 🦸‍♂️", "highlight-yellow");
      
      terminalOutput.scrollTop = terminalOutput.scrollHeight;
    }, 2200);

    // Fade out and hide overlay
    setTimeout(() => {
      heroCard.style.opacity = '0';
      setTimeout(() => {
        heroCard.classList.add('hidden');
        terminalInput.disabled = false;
        terminalInput.focus();
      }, 800);
    }, 2800);
  }

  // ==========================================================================
  // SCROLLING STICKMAN LOGIC (Alan Becker Style)
  // ==========================================================================
  const stickman = document.getElementById('scroll-stickman');
  const panels = [
    { el: document.querySelector('.character-panel'), name: 'character' },
    { el: document.querySelector('.terminal-panel'), name: 'terminal' },
    { el: document.querySelector('.roadmap-panel'), name: 'roadmap' }
  ];

  let currentPanel = null;
  let scrollTimeout = null;

  function updateStickmanPosition() {
    if (!stickman) return;
    
    // Find which panel is closest to the middle of the viewport
    let activePanel = null;
    let minDistance = Infinity;
    const viewportHeight = window.innerHeight;

    panels.forEach(panel => {
      if (!panel.el) return;
      const rect = panel.el.getBoundingClientRect();
      const panelCenter = rect.top + rect.height / 2;
      const distance = Math.abs(viewportHeight / 2 - panelCenter);
      
      if (distance < minDistance) {
        minDistance = distance;
        activePanel = panel;
      }
    });

    if (activePanel && activePanel !== currentPanel) {
      const rect = activePanel.el.getBoundingClientRect();
      
      // Calculate target coordinates relative to the screen (fixed position)
      let targetLeft = 0;
      let targetTop = 0;
      let scaleX = 1;

      if (activePanel.name === 'character') {
        targetLeft = rect.left - 35; // hang slightly off left
        targetTop = rect.top + 50;
        scaleX = 1; // face right
      } else if (activePanel.name === 'terminal') {
        targetLeft = rect.right - 15; // hang slightly off right
        targetTop = rect.top + 50;
        scaleX = -1; // face left
      } else {
        // roadmap (horizontal bar)
        targetLeft = rect.left + 50; // sit inside left
        targetTop = rect.top - 50; // sit on top of the bar
        scaleX = 1; // face right
      }

      // Constrain position within screen bounds
      targetLeft = Math.max(10, Math.min(window.innerWidth - 60, targetLeft));
      targetTop = Math.max(10, Math.min(window.innerHeight - 70, targetTop));

      // Make stickman run or jump to the next option
      stickman.className = 'jumping';
      stickman.style.opacity = '1';
      stickman.style.left = `${targetLeft}px`;
      stickman.style.top = `${targetTop}px`;
      stickman.style.transform = `scaleX(${scaleX})`;

      currentPanel = activePanel;

      // Clear running state and transition to idle once it arrives
      if (scrollTimeout) clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        stickman.className = 'idle';
      }, 700); // matches the 0.7s transition in CSS
    }
  }

  // Monitor scroll and resize events
  window.addEventListener('scroll', updateStickmanPosition);
  window.addEventListener('resize', updateStickmanPosition);
  
  // Initialize position on load
  setTimeout(updateStickmanPosition, 500);
});
