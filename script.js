document.addEventListener("DOMContentLoaded", () => {
    const animElements = document.querySelectorAll(".slide-in");
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if(entry.isIntersecting) {
                entry.target.classList.add("active");
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    animElements.forEach(el => observer.observe(el));
    const darkToggle = document.getElementById('darkModeToggle');
    const darkIcon = document.getElementById('darkModeIcon');
    const darkText = document.getElementById('darkModeText');
    function setDarkMode(isDark) {
        document.body.classList.toggle('dark-mode', isDark);
        if (isDark) {
            darkIcon.textContent = '☀️';
            darkText.textContent = 'Light Mode';
        } else {
            darkIcon.textContent = '🌙';
            darkText.textContent = 'Dark Mode';
        }
    }
    const storedPref = localStorage.getItem('dark-mode');
    const darkPref = storedPref === null ? true : storedPref === 'true';
    setDarkMode(darkPref);
    darkToggle.addEventListener('click', () => {
        const isDark = !document.body.classList.contains('dark-mode');
        setDarkMode(isDark);
        localStorage.setItem('dark-mode', isDark);
    });
    const contactIconsContainer = document.querySelector('.contact-icons'); 
    const locationIconWrapper = document.getElementById('locationIconWrapper');
    let hoverEnterTimeout; 
    let hoverLeaveTimeout; 
    function applyHoverAnimations() {
        contactIconsContainer.classList.add('animate-wrap'); 
        locationIconWrapper.classList.add('animate-hover'); 
    }
    function resetAnimations() {
        contactIconsContainer.classList.remove('animate-wrap'); 
        locationIconWrapper.classList.remove('animate-hover'); 
    }
    if (locationIconWrapper) {
        locationIconWrapper.addEventListener('mouseenter', () => {
            clearTimeout(hoverLeaveTimeout); 
            clearTimeout(hoverEnterTimeout); 
            hoverEnterTimeout = setTimeout(() => {
                applyHoverAnimations();
            }, 1000); 
        });
        locationIconWrapper.addEventListener('mouseleave', () => {
            clearTimeout(hoverEnterTimeout); 
            hoverLeaveTimeout = setTimeout(() => {
                resetAnimations();
            }, 3500); 
        });
    }

    const form = document.getElementById('form');
    const submitBtn = form ? form.querySelector('button[type="submit"]') : null;

    if (form && submitBtn) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const formData = new FormData(form);
            formData.append("access_key", "ab36b73b-83e4-4aba-8e0b-6f9c22c0b462");

            const originalText = submitBtn.textContent;

            submitBtn.textContent = "Sending...";
            submitBtn.disabled = true;

            try {
                const response = await fetch("https://api.web3forms.com/submit", {
                    method: "POST",
                    body: formData
                });

                const data = await response.json();

                if (response.ok) {
                    alert("Success! Your message has been sent.");
                    form.reset();
                } else {
                    alert("Error: " + data.message);
                }

            } catch (error) {
                alert("Something went wrong. Please try again.");
            } finally {
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }
        });
    }

    // Image Lightbox / Modal for Zooming Images
    const lightbox = document.getElementById('imageLightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxCaption = document.getElementById('lightboxCaption');
    const lightboxClose = lightbox ? lightbox.querySelector('.lightbox-close') : null;
    const lightboxBackdrop = lightbox ? lightbox.querySelector('.lightbox-backdrop') : null;

    function openLightbox(src, alt) {
        if (!lightbox || !lightboxImg) return;
        lightboxImg.src = src;
        lightboxImg.alt = alt || 'Preview';
        if (lightboxCaption) {
            lightboxCaption.textContent = alt || '';
        }
        lightbox.removeAttribute('inert');
        lightbox.classList.add('active');
        document.body.classList.add('lightbox-open');
    }

    function closeLightbox() {
        if (!lightbox) return;
        lightbox.setAttribute('inert', '');
        lightbox.classList.remove('active');
        document.body.classList.remove('lightbox-open');
        setTimeout(() => {
            if (!lightbox.classList.contains('active') && lightboxImg) {
                lightboxImg.src = '';
            }
        }, 300);
    }

    if (lightbox) {
        if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
        if (lightboxBackdrop) lightboxBackdrop.addEventListener('click', closeLightbox);

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && lightbox.classList.contains('active')) {
                closeLightbox();
            }
        });
    }

    // Attach zoom badge and click handler to zoomable images
    const zoomableWrappers = document.querySelectorAll('.vibecoded-img-wrapper, .achievement-img-wrapper, .photo-frame');
    zoomableWrappers.forEach(wrapper => {
        const img = wrapper.querySelector('img');
        if (!img) return; // Skip wrappers with only SVG placeholders

        wrapper.classList.add('zoomable-wrapper');

        // Create hover badge
        const badge = document.createElement('div');
        badge.className = 'zoom-badge';
        badge.innerHTML = `
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                <line x1="11" y1="8" x2="11" y2="14"></line>
                <line x1="8" y1="11" x2="14" y2="11"></line>
            </svg>
            <span>Click to enlarge</span>
        `;
        wrapper.appendChild(badge);

        wrapper.addEventListener('click', (e) => {
            if (e.target.closest('a')) return;
            openLightbox(img.currentSrc || img.src, img.alt);
        });
    });

    // =========================================================================
    // Mini Game: Beat the Mini-AI (Tic-Tac-Toe)
    // =========================================================================
    const gameSection = document.getElementById('mini-game');
    if (gameSection) {
        const boardEl = document.getElementById('gameBoard');
        const cells = Array.from(boardEl.querySelectorAll('.game-cell'));
        const statusEl = document.getElementById('gameStatusBar');
        const restartBtn = document.getElementById('gameRestartBtn');
        const diffBtns = Array.from(gameSection.querySelectorAll('.game-diff-btn'));
        const scoreValX = document.getElementById('scoreValX');
        const scoreValO = document.getElementById('scoreValO');
        const scoreValTie = document.getElementById('scoreValTie');
        const scoreNameX = document.getElementById('scoreNameX');
        const scoreNameO = document.getElementById('scoreNameO');

        const WIN_COMBOS = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8],
            [0, 3, 6], [1, 4, 7], [2, 5, 8],
            [0, 4, 8], [2, 4, 6]
        ];

        const CELL_NAMES = [
            'Square 1 (Top Left)',
            'Square 2 (Top Center)',
            'Square 3 (Top Right)',
            'Square 4 (Middle Left)',
            'Square 5 (Center)',
            'Square 6 (Middle Right)',
            'Square 7 (Bottom Left)',
            'Square 8 (Bottom Center)',
            'Square 9 (Bottom Right)'
        ];

        let boardState = ['', '', '', '', '', '', '', '', ''];
        let currentPlayer = 'X';
        let isGameActive = true;
        let isAiThinking = false;
        let gameMode = 'smart'; // 'smart' | 'casual' | 'pvp'
        let scores = { X: 0, O: 0, tie: 0 };

        function checkWinner(board) {
            for (let i = 0; i < WIN_COMBOS.length; i++) {
                const [a, b, c] = WIN_COMBOS[i];
                if (board[a] && board[a] === board[b] && board[a] === board[c]) {
                    return { winner: board[a], combo: [a, b, c] };
                }
            }
            if (board.every(cell => cell !== '')) {
                return { winner: 'tie', combo: null };
            }
            return null;
        }

        function updateScoreboard() {
            if (scoreValX) scoreValX.textContent = scores.X;
            if (scoreValO) scoreValO.textContent = scores.O;
            if (scoreValTie) scoreValTie.textContent = scores.tie;
        }

        function highlightWinner(combo) {
            if (!combo) return;
            combo.forEach(idx => {
                if (cells[idx]) cells[idx].classList.add('winning-cell');
            });
        }

        function handleEndGame(result) {
            isGameActive = false;
            boardEl.classList.remove('ai-thinking');

            if (result.winner === 'tie') {
                scores.tie++;
                statusEl.textContent = "🤝 It's a draw!";
            } else if (result.winner === 'X') {
                scores.X++;
                highlightWinner(result.combo);
                statusEl.textContent = (gameMode === 'pvp') ? '🎉 Player 1 (X) Wins!' : '🎉 You Won!';
            } else if (result.winner === 'O') {
                scores.O++;
                highlightWinner(result.combo);
                statusEl.textContent = (gameMode === 'pvp') ? '🎉 Player 2 (O) Wins!' : '🤖 AI Wins this round!';
            }
            updateScoreboard();
        }

        function makeMove(index, player) {
            boardState[index] = player;
            const cell = cells[index];
            cell.textContent = player === 'X' ? '✕' : '◯';
            cell.classList.add(player === 'X' ? 'cell-x' : 'cell-o');
            cell.disabled = true;
            cell.setAttribute('aria-label', `${CELL_NAMES[index]}: ${player}`);
            if (navigator.vibrate) {
                try { navigator.vibrate(15); } catch (e) {}
            }
        }

        function minimax(board, isMaximizing, depth) {
            const res = checkWinner(board);
            if (res) {
                if (res.winner === 'O') return 10 - depth;
                if (res.winner === 'X') return depth - 10;
                if (res.winner === 'tie') return 0;
            }
            if (depth >= 6) return 0;

            const available = [];
            for (let i = 0; i < 9; i++) {
                if (board[i] === '') available.push(i);
            }

            if (isMaximizing) {
                let maxEval = -Infinity;
                for (let i = 0; i < available.length; i++) {
                    const idx = available[i];
                    board[idx] = 'O';
                    const evaluation = minimax(board, false, depth + 1);
                    board[idx] = '';
                    if (evaluation > maxEval) maxEval = evaluation;
                }
                return maxEval;
            } else {
                let minEval = Infinity;
                for (let i = 0; i < available.length; i++) {
                    const idx = available[i];
                    board[idx] = 'X';
                    const evaluation = minimax(board, true, depth + 1);
                    board[idx] = '';
                    if (evaluation < minEval) minEval = evaluation;
                }
                return minEval;
            }
        }

        function getBestMove(board) {
            const available = [];
            for (let i = 0; i < 9; i++) {
                if (board[i] === '') available.push(i);
            }
            if (available.length === 8 && board[4] === '') {
                return 4;
            }
            let bestScore = -Infinity;
            let bestMove = available[0];
            for (let i = 0; i < available.length; i++) {
                const idx = available[i];
                board[idx] = 'O';
                const score = minimax(board, false, 0);
                board[idx] = '';
                if (score > bestScore) {
                    bestScore = score;
                    bestMove = idx;
                }
            }
            return bestMove;
        }

        function getCasualMove(board) {
            const available = [];
            for (let i = 0; i < 9; i++) {
                if (board[i] === '') available.push(i);
            }

            // 1. Can AI win in one move?
            for (let i = 0; i < available.length; i++) {
                const idx = available[i];
                board[idx] = 'O';
                const win = checkWinner(board);
                board[idx] = '';
                if (win && win.winner === 'O') return idx;
            }

            // 2. Can player win? 60% chance to block
            if (Math.random() < 0.6) {
                for (let i = 0; i < available.length; i++) {
                    const idx = available[i];
                    board[idx] = 'X';
                    const win = checkWinner(board);
                    board[idx] = '';
                    if (win && win.winner === 'X') return idx;
                }
            }

            // 3. Random move
            return available[Math.floor(Math.random() * available.length)];
        }

        function aiTurn() {
            if (!isGameActive) return;
            isAiThinking = true;
            boardEl.classList.add('ai-thinking');
            statusEl.textContent = '🤖 AI is thinking...';

            setTimeout(() => {
                if (!isGameActive) {
                    isAiThinking = false;
                    boardEl.classList.remove('ai-thinking');
                    return;
                }
                const moveIdx = (gameMode === 'smart') ? getBestMove(boardState) : getCasualMove(boardState);
                if (moveIdx !== undefined && moveIdx !== null) {
                    makeMove(moveIdx, 'O');
                }
                isAiThinking = false;
                boardEl.classList.remove('ai-thinking');

                const result = checkWinner(boardState);
                if (result) {
                    handleEndGame(result);
                } else {
                    currentPlayer = 'X';
                    statusEl.textContent = 'Your turn (X)';
                }
            }, 260);
        }

        function onCellClick(e) {
            const cell = e.currentTarget;
            const index = parseInt(cell.getAttribute('data-cell'), 10);

            if (!isGameActive || isAiThinking || boardState[index] !== '') {
                return;
            }

            makeMove(index, currentPlayer);

            const result = checkWinner(boardState);
            if (result) {
                handleEndGame(result);
                return;
            }

            if (gameMode === 'pvp') {
                currentPlayer = (currentPlayer === 'X') ? 'O' : 'X';
                statusEl.textContent = (currentPlayer === 'X') ? "Player 1 (X)'s turn" : "Player 2 (O)'s turn";
            } else {
                currentPlayer = 'O';
                aiTurn();
            }
        }

        function resetRound() {
            boardState = ['', '', '', '', '', '', '', '', ''];
            currentPlayer = 'X';
            isGameActive = true;
            isAiThinking = false;
            boardEl.classList.remove('ai-thinking');

            cells.forEach((cell, idx) => {
                cell.textContent = '';
                cell.className = 'game-cell';
                cell.disabled = false;
                cell.setAttribute('aria-label', CELL_NAMES[idx]);
            });

            if (gameMode === 'pvp') {
                statusEl.textContent = "Player 1 (X)'s turn";
            } else {
                statusEl.textContent = 'Your turn (X)';
            }
        }

        cells.forEach(cell => cell.addEventListener('click', onCellClick));
        if (restartBtn) restartBtn.addEventListener('click', resetRound);

        diffBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const mode = btn.dataset.mode;
                if (mode === gameMode) return;

                diffBtns.forEach(b => {
                    b.classList.remove('active');
                    b.setAttribute('aria-checked', 'false');
                });
                btn.classList.add('active');
                btn.setAttribute('aria-checked', 'true');
                gameMode = mode;

                if (gameMode === 'pvp') {
                    if (scoreNameX) scoreNameX.textContent = 'Player 1 (X)';
                    if (scoreNameO) scoreNameO.textContent = 'Player 2 (O)';
                } else {
                    if (scoreNameX) scoreNameX.textContent = 'You (X)';
                    if (scoreNameO) scoreNameO.textContent = 'AI (O)';
                }
                resetRound();
            });
        });
    }

    // =========================================================================
    // GazeBot: Interactive Mascot (Cursor Tracker)
    // =========================================================================
    const gazebotWidget = document.getElementById('gazebotWidget');
    if (gazebotWidget) {
        const gazeHead = document.getElementById('gazebotHead');
        const gazeBubble = document.getElementById('gazebotBubble');
        const gazeText = document.getElementById('gazebotText');
        const gazeClose = document.getElementById('gazebotBubbleClose');
        const pupilL = document.getElementById('gazePupilL');
        const pupilR = document.getElementById('gazePupilR');
        const eyes = gazebotWidget.querySelectorAll('.gazebot-eye');

        const GAZEBOT_QUOTES = [
            "Beep boop! 🤖 I'm GazeBot — inspired by Asifur's Vision-Guided GazeBot!",
            "Eyes on you! Tracking your cursor with OpenCV & MediaPipe vibes. 👀",
            "Classroom Compass check: 100% focused attention detected! 🎯",
            "Did you check out VidiHere and JiffBoltP2P in the vibecoded section? ⚡",
            "Want a quick challenge? Beat the Mini-AI in Tic-Tac-Toe above the footer! 🎮",
            "Looking for an AI, Computer Vision, or Robotics engineer? Send Asifur a message! 🚀",
            "Neural weights loaded. Latency: 0.1ms. Ready to build cool things! 🧠"
        ];

        let quoteIndex = 0;
        let bubbleTimeout = null;
        let blinkTimeout = null;
        let rapidClickCount = 0;
        let lastClickTime = 0;
        let isDizzyOrCollapsed = false;

        function showBubble(text, duration = 5000) {
            if (!gazeBubble || !gazeText) return;
            gazeText.textContent = text;
            gazeBubble.classList.add('active');

            if (bubbleTimeout) clearTimeout(bubbleTimeout);
            if (duration > 0) {
                bubbleTimeout = setTimeout(() => {
                    gazeBubble.classList.remove('active');
                }, duration);
            }
        }

        function hideBubble() {
            if (gazeBubble) gazeBubble.classList.remove('active');
            if (bubbleTimeout) clearTimeout(bubbleTimeout);
        }

        if (gazeClose) {
            gazeClose.addEventListener('click', (e) => {
                e.stopPropagation();
                hideBubble();
            });
        }

        // Mascot Dizzy & Collapse Sequence
        function triggerDizzyCollapse() {
            isDizzyOrCollapsed = true;
            rapidClickCount = 0;

            // Phase 1: Getting Dizzy (1.6s) - head wobbles furiously, eye pupils spin in spirals
            gazeHead.classList.remove('wiggling', 'rebooting');
            gazeHead.classList.add('dizzy');
            if (pupilL) pupilL.style.transform = '';
            if (pupilR) pupilR.style.transform = '';
            eyes.forEach(eye => {
                eye.classList.remove('happy', 'blinking');
                eye.classList.add('dizzy');
            });
            showBubble("Whoa... system overload! 🌀 Too many boops!", 2200);

            if (navigator.vibrate) {
                try { navigator.vibrate([40, 50, 40, 50, 80]); } catch (err) {}
            }

            // Phase 2: Collapse (2.6s) - head droops sideways, eyes dim to lines
            setTimeout(() => {
                gazeHead.classList.remove('dizzy');
                gazeHead.classList.add('collapsed');
                if (pupilL) pupilL.style.transform = '';
                if (pupilR) pupilR.style.transform = '';
                eyes.forEach(eye => {
                    eye.classList.remove('dizzy');
                    eye.classList.add('collapsed');
                });
                showBubble("⚠️ GazeOS Kernel Panic! Collapsed... 💤", 1800);

                // Show reboot countdown
                setTimeout(() => {
                    if (isDizzyOrCollapsed) {
                        showBubble("Rebooting in 3... 2... 1... ⚡", 1800);
                    }
                }, 1100);

                // Phase 3: Reboot & Recovery - springs and bounces back to life!
                setTimeout(() => {
                    gazeHead.classList.remove('collapsed');
                    gazeHead.classList.add('rebooting');
                    if (pupilL) pupilL.style.transform = '';
                    if (pupilR) pupilR.style.transform = '';
                    eyes.forEach(eye => {
                        eye.classList.remove('collapsed');
                        eye.classList.add('happy');
                    });

                    showBubble("✨ Reboot complete! 🔋 I'm back, but please be gentle! 😂", 7000);

                    if (navigator.vibrate) {
                        try { navigator.vibrate([60, 50, 100]); } catch (err) {}
                    }

                    // Reset to normal operational state after reboot bounce (850ms)
                    setTimeout(() => {
                        gazeHead.classList.remove('rebooting');
                        eyes.forEach(eye => eye.classList.remove('happy'));
                        if (pupilL) pupilL.style.transform = '';
                        if (pupilR) pupilR.style.transform = '';
                        isDizzyOrCollapsed = false;
                        rapidClickCount = 0;
                    }, 850);
                }, 2600);
            }, 1600);
        }

        // Mascot Click Interaction
        if (gazeHead) {
            gazeHead.addEventListener('click', () => {
                gazeHead.blur(); // Remove mobile focus ring
                if (isDizzyOrCollapsed) return; // Ignore clicks during collapse/reboot

                const now = Date.now();
                if (now - lastClickTime < 900) {
                    rapidClickCount++;
                } else {
                    rapidClickCount = 1;
                }
                lastClickTime = now;

                // Clicking 5 times rapidly triggers dizziness & collapse!
                if (rapidClickCount >= 5) {
                    triggerDizzyCollapse();
                    return;
                }

                // Escalating speech bubbles on clicks 3 and 4
                if (rapidClickCount === 3) {
                    showBubble("Hey, that's fast! 😵‍💫", 2200);
                } else if (rapidClickCount === 4) {
                    showBubble("Wait, I'm getting dizzy...! 🌀", 2200);
                }

                // Normal click wiggle
                gazeHead.classList.remove('wiggling');
                void gazeHead.offsetWidth; // trigger reflow
                gazeHead.classList.add('wiggling');

                // Happy eyes for 1.2s
                eyes.forEach(eye => eye.classList.add('happy'));
                setTimeout(() => {
                    if (!isDizzyOrCollapsed) {
                        eyes.forEach(eye => eye.classList.remove('happy'));
                    }
                }, 1200);

                // Show next quote on normal clicks
                if (rapidClickCount < 3) {
                    quoteIndex = (quoteIndex + 1) % GAZEBOT_QUOTES.length;
                    showBubble(GAZEBOT_QUOTES[quoteIndex], 9000);
                }

                if (navigator.vibrate) {
                    try { navigator.vibrate(18); } catch (err) {}
                }
            });
        }

        // Eye Gaze Tracking
        function updateGaze(targetX, targetY) {
            if (isDizzyOrCollapsed) return;
            if (!pupilL || !pupilR) return;

            [pupilL, pupilR].forEach(pupil => {
                const rect = pupil.getBoundingClientRect();
                const eyeCenterX = rect.left + rect.width / 2;
                const eyeCenterY = rect.top + rect.height / 2;

                const dx = targetX - eyeCenterX;
                const dy = targetY - eyeCenterY;
                const dist = Math.hypot(dx, dy);
                const angle = Math.atan2(dy, dx);

                // Max travel distance within visor socket (3.5px)
                const maxRadius = 3.5;
                const radius = Math.min(maxRadius, dist / 35);

                const moveX = Math.cos(angle) * radius;
                const moveY = Math.sin(angle) * radius;

                pupil.style.transform = `translate(${moveX.toFixed(1)}px, ${moveY.toFixed(1)}px)`;
            });
        }

        // Mouse tracking with requestAnimationFrame throttling
        let mouseX = 0, mouseY = 0;
        let isGazeTicking = false;

        window.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            if (!isGazeTicking) {
                window.requestAnimationFrame(() => {
                    updateGaze(mouseX, mouseY);
                    isGazeTicking = false;
                });
                isGazeTicking = true;
            }
        }, { passive: true });

        // Touch tracking on mobile
        window.addEventListener('touchmove', (e) => {
            if (e.touches && e.touches.length > 0) {
                updateGaze(e.touches[0].clientX, e.touches[0].clientY);
            }
        }, { passive: true });

        // Random Blinking
        function scheduleBlink() {
            if (isDizzyOrCollapsed) {
                blinkTimeout = setTimeout(scheduleBlink, 2000);
                return;
            }
            eyes.forEach(eye => eye.classList.add('blinking'));
            setTimeout(() => {
                eyes.forEach(eye => eye.classList.remove('blinking'));
            }, 180);

            blinkTimeout = setTimeout(scheduleBlink, 3500 + Math.random() * 4000);
        }
        blinkTimeout = setTimeout(scheduleBlink, 3000);

        // Friendly greeting on initial load (after 2 seconds)
        setTimeout(() => {
            if (!gazeBubble.classList.contains('active')) {
                showBubble("Hi! I'm GazeBot 🤖 Move your mouse — I'm watching!", 4500);
            }
        }, 2000);
    }

    // =========================================================================
    // Command Palette (Ctrl + K / ⌘K) & Terminal Easter Eggs
    // =========================================================================
    const cmdModal = document.getElementById('cmdPaletteModal');
    const cmdInput = document.getElementById('cmdPaletteInput');
    const cmdResults = document.getElementById('cmdPaletteResults');
    const cmdTrigger = document.getElementById('cmdPaletteBtn');
    const cmdBackdrop = document.getElementById('cmdPaletteBackdrop');
    const cmdCloseBtn = document.getElementById('cmdPaletteClose');
    const cmdBadge = document.getElementById('cmdKeyBadge');

    if (cmdModal && cmdInput && cmdResults) {
        // Detect MacOS for badge label
        const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
        if (cmdBadge) {
            cmdBadge.textContent = isMac ? '⌘ K' : 'Ctrl K';
        }

        let selectedIndex = 0;
        let currentFiltered = [];

        function scrollToSec(selector) {
            const el = document.querySelector(selector);
            if (el) {
                closePalette();
                setTimeout(() => {
                    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }, 100);
            }
        }

        // Easter Egg: Matrix Rain
        function triggerMatrixRain() {
            closePalette();
            const existing = document.getElementById('matrixRainWrap');
            if (existing) existing.remove();

            // Container overlay
            const matrixWrap = document.createElement('div');
            matrixWrap.id = 'matrixRainWrap';
            matrixWrap.style.cssText = 'position:fixed;top:0;left:0;width:100vw;height:100vh;z-index:99998;background:rgba(5,10,15,0.88);cursor:pointer;transition:opacity 0.4s ease;';

            // Exit button pill
            const exitBtn = document.createElement('button');
            exitBtn.type = 'button';
            exitBtn.className = 'glass-btn';
            exitBtn.style.cssText = 'position:fixed;top:20px;left:50%;transform:translateX(-50%);z-index:99999;font-size:0.85rem;padding:8px 20px;border-radius:30px;color:#00ff73;border:1px solid rgba(0,255,115,0.4);background:rgba(10,25,15,0.8);box-shadow:0 0 20px rgba(0,255,115,0.3);cursor:pointer;font-family:inherit;font-weight:600;outline:none;-webkit-tap-highlight-color:transparent;';
            exitBtn.textContent = '✕ Exit Matrix (Click anywhere or ESC)';

            const canvas = document.createElement('canvas');
            canvas.style.cssText = 'width:100%;height:100%;display:block;';

            matrixWrap.appendChild(canvas);
            matrixWrap.appendChild(exitBtn);
            document.body.appendChild(matrixWrap);

            const ctx = canvas.getContext('2d');
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;

            const chars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲンASIFURAI';
            const fontSize = 14;
            const columns = Math.floor(canvas.width / fontSize);
            const drops = Array(columns).fill(1);

            let matrixRaf;
            let isClosed = false;

            function drawMatrix() {
                if (isClosed) return;
                ctx.fillStyle = 'rgba(5, 10, 15, 0.08)';
                ctx.fillRect(0, 0, canvas.width, canvas.height);

                ctx.fillStyle = '#00ff73';
                ctx.font = `${fontSize}px monospace`;

                for (let i = 0; i < drops.length; i++) {
                    const text = chars.charAt(Math.floor(Math.random() * chars.length));
                    ctx.fillText(text, i * fontSize, drops[i] * fontSize);

                    if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                        drops[i] = 0;
                    }
                    drops[i]++;
                }
                matrixRaf = requestAnimationFrame(drawMatrix);
            }
            matrixRaf = requestAnimationFrame(drawMatrix);

            function closeMatrix() {
                if (isClosed) return;
                isClosed = true;
                window.removeEventListener('keydown', onMatrixKey);
                matrixWrap.style.opacity = '0';
                setTimeout(() => {
                    cancelAnimationFrame(matrixRaf);
                    matrixWrap.remove();
                }, 400);
            }

            function onMatrixKey(e) {
                if (e.key === 'Escape') {
                    e.preventDefault();
                    closeMatrix();
                }
            }

            matrixWrap.addEventListener('click', closeMatrix);
            exitBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                closeMatrix();
            });

            // Delay attaching ESC listener to avoid catching the Enter key from command palette
            setTimeout(() => {
                if (!isClosed) {
                    window.addEventListener('keydown', onMatrixKey);
                }
            }, 200);

            // Auto-close after 12 seconds if not dismissed
            setTimeout(() => {
                closeMatrix();
            }, 12000);
        }

        // Easter Egg: Sudo Hire Confetti
        function triggerSudoHire() {
            closePalette();
            const canvas = document.createElement('canvas');
            canvas.id = 'confettiCanvas';
            canvas.style.cssText = 'position:fixed;top:0;left:0;width:100vw;height:100vh;z-index:99998;pointer-events:none;';
            document.body.appendChild(canvas);

            const ctx = canvas.getContext('2d');
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;

            const colors = ['#40cfff', '#ff59b3', '#ffe600', '#22c55e', '#a855f7', '#ffffff'];
            const particles = Array.from({ length: 80 }, () => ({
                x: canvas.width / 2 + (Math.random() - 0.5) * 100,
                y: canvas.height * 0.7,
                vx: (Math.random() - 0.5) * 16,
                vy: -(Math.random() * 14 + 10),
                size: Math.random() * 8 + 4,
                color: colors[Math.floor(Math.random() * colors.length)],
                rotation: Math.random() * 360,
                vRot: (Math.random() - 0.5) * 10
            }));

            let confettiRaf;
            function drawConfetti() {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                particles.forEach(p => {
                    p.x += p.vx;
                    p.y += p.vy;
                    p.vy += 0.35; // gravity
                    p.vx *= 0.98; // drag
                    p.rotation += p.vRot;

                    ctx.save();
                    ctx.translate(p.x, p.y);
                    ctx.rotate((p.rotation * Math.PI) / 180);
                    ctx.fillStyle = p.color;
                    ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
                    ctx.restore();
                });
                confettiRaf = requestAnimationFrame(drawConfetti);
            }
            confettiRaf = requestAnimationFrame(drawConfetti);

            setTimeout(() => {
                cancelAnimationFrame(confettiRaf);
                canvas.remove();
            }, 3500);

            // Pop GazeBot message and scroll to contact
            const gazeText = document.getElementById('gazebotText');
            const gazeBubble = document.getElementById('gazebotBubble');
            if (gazeText && gazeBubble) {
                gazeText.textContent = "🎉 Access granted! Opening direct contact form for you 🚀";
                gazeBubble.classList.add('active');
            }
            scrollToSec('#contact');
        }

        // Easter Egg: Dev Joke
        const DEV_JOKES = [
            "Why do neural networks love coffee? Because it helps them avoid local minima! ☕",
            "There are 10 types of people: those who understand binary, and those who don't. 💻",
            "Why was the robot tired? Too many bytes to process! 🤖",
            "A developer's favorite place to relax? The localhost. 🏡",
            "My model didn't converge, so I told it to take a deep breath and backpropagate! 🧠",
            "Why did the computer squeak? Someone stepped on its mouse! 🐭",
            "Hardware: The part of a computer you can kick. Software: The part you can only curse at. 😂"
        ];
        function triggerDevJoke() {
            closePalette();
            const joke = DEV_JOKES[Math.floor(Math.random() * DEV_JOKES.length)];
            const gazeText = document.getElementById('gazebotText');
            const gazeBubble = document.getElementById('gazebotBubble');
            const gazeHead = document.getElementById('gazebotHead');
            const eyes = document.querySelectorAll('.gazebot-eye');

            // Mascot happy reaction when delivering joke
            if (gazeHead) {
                gazeHead.classList.remove('wiggling');
                void gazeHead.offsetWidth;
                gazeHead.classList.add('wiggling');
            }
            eyes.forEach(eye => eye.classList.add('happy'));
            setTimeout(() => {
                eyes.forEach(eye => eye.classList.remove('happy'));
            }, 1500);

            if (gazeText && gazeBubble) {
                gazeText.textContent = joke;
                gazeBubble.classList.add('active');

                // Let the joke stay for 16 seconds so visitors have plenty of time to read and laugh!
                if (window.gazeJokeTimeout) clearTimeout(window.gazeJokeTimeout);
                window.gazeJokeTimeout = setTimeout(() => {
                    gazeBubble.classList.remove('active');
                }, 16000);
            } else {
                alert(joke);
            }
        }

        // Easter Egg: GazeBot Spin
        function triggerGazeBotSpin() {
            closePalette();
            const gazeHead = document.getElementById('gazebotHead');
            if (gazeHead) {
                gazeHead.click();
            }
        }

        const COMMAND_LIST = [
            // Navigation
            { id: 'about', title: 'About Asifur', desc: 'Jump to bio & background', category: 'Navigation', icon: '👤', tag: 'Jump', action: () => scrollToSec('#about') },
            { id: 'projects', title: 'Key Projects', desc: 'Classroom Compass, Vision-Guided GazeBot', category: 'Navigation', icon: '🚀', tag: 'Jump', action: () => scrollToSec('#projects') },
            { id: 'vibecoded', title: 'Things I vibecoded for Fun', desc: 'VidiHere, JiffBoltP2P, Master Patterns', category: 'Navigation', icon: '⚡', tag: 'Jump', action: () => scrollToSec('#vibecoded') },
            { id: 'skills', title: 'Technical Skills', desc: 'Python, ML, Computer Vision, Robotics', category: 'Navigation', icon: '🛠️', tag: 'Jump', action: () => scrollToSec('#skills') },
            { id: 'experience', title: 'Professional Experience', desc: 'Google Student Ambassador, Kshitij IIT KGP', category: 'Navigation', icon: '💼', tag: 'Jump', action: () => scrollToSec('#experience') },
            { id: 'education', title: 'Education', desc: 'Techno International New Town (B.Tech CSE)', category: 'Navigation', icon: '🎓', tag: 'Jump', action: () => scrollToSec('#education') },
            { id: 'achievements', title: 'Achievements & Awards', desc: 'Hackathons, quizzes, robot showcases', category: 'Navigation', icon: '🏆', tag: 'Jump', action: () => scrollToSec('#achievements') },
            { id: 'certifications', title: 'Certifications', desc: 'IBM, Google, NPTEL, Duke University', category: 'Navigation', icon: '📜', tag: 'Jump', action: () => scrollToSec('#certifications') },
            { id: 'contact', title: 'Contact Me', desc: 'Send a message or collaboration request', category: 'Navigation', icon: '✉️', tag: 'Jump', action: () => scrollToSec('#contact') },
            { id: 'minigame', title: 'Beat the Mini-AI', desc: 'Play Tic-Tac-Toe vs Minimax AI', category: 'Navigation', icon: '🎮', tag: 'Play', action: () => scrollToSec('#mini-game') },

            // Links
            { id: 'resume', title: 'View Resume (Google Drive)', desc: 'Open latest updated PDF resume', category: 'Links', icon: '📄', tag: 'Link', action: () => window.open('https://drive.google.com/file/d/15oWowPVIAo07UF3ZkDwc-2dcF7dG3gUZ/view?usp=sharing', '_blank') },
            { id: 'github', title: 'GitHub Profile', desc: 'github.com/asifur8282', category: 'Links', icon: '🐙', tag: 'Link', action: () => window.open('https://github.com/asifur8282', '_blank') },
            { id: 'linkedin', title: 'LinkedIn Profile', desc: 'linkedin.com/in/asifur06rahaman', category: 'Links', icon: '🔗', tag: 'Link', action: () => window.open('https://linkedin.com/in/asifur06rahaman', '_blank') },

            // Actions
            { id: 'theme', title: 'Toggle Theme', desc: 'Switch between Dark Mode and Light Mode', category: 'Actions', icon: '🌓', tag: 'Action', action: () => document.getElementById('darkModeToggle')?.click() },

            // Easter Eggs
            { id: 'matrix', title: 'matrix', desc: 'Enter the Matrix (Green falling digital rain)', category: 'Easter Eggs', icon: '🟢', tag: 'Fun', action: triggerMatrixRain },
            { id: 'hire', title: 'sudo hire', desc: 'Confetti burst & fast-track collaboration', category: 'Easter Eggs', icon: '🎉', tag: 'Fun', action: triggerSudoHire },
            { id: 'joke', title: 'joke', desc: 'Tell a random AI / ML developer joke', category: 'Easter Eggs', icon: '🤖', tag: 'Fun', action: triggerDevJoke },
            { id: 'gazebot', title: 'gazebot', desc: 'Make GazeBot do an excited victory spin', category: 'Easter Eggs', icon: '👁️', tag: 'Fun', action: triggerGazeBotSpin }
        ];

        function executeCommand(cmd) {
            if (!cmd) return;
            closePalette();
            setTimeout(() => {
                try {
                    cmd.action();
                } catch (err) {
                    console.error('Command palette execution error:', err);
                }
            }, 60);
        }

        function renderResults(filtered) {
            currentFiltered = filtered;
            cmdResults.innerHTML = '';

            if (filtered.length === 0) {
                cmdResults.innerHTML = '<div class="cmd-empty">No matching commands found. Try "projects", "matrix", or "hire"!</div>';
                return;
            }

            let currentCategory = '';
            filtered.forEach((cmd, idx) => {
                if (cmd.category !== currentCategory) {
                    currentCategory = cmd.category;
                    const groupTitle = document.createElement('div');
                    groupTitle.className = 'cmd-group-title';
                    groupTitle.textContent = currentCategory;
                    cmdResults.appendChild(groupTitle);
                }

                const item = document.createElement('div');
                item.className = 'cmd-item' + (idx === selectedIndex ? ' selected' : '');
                item.innerHTML = `
                    <div class="cmd-item-left">
                        <span class="cmd-item-icon">${cmd.icon}</span>
                        <div class="cmd-item-info">
                            <span class="cmd-item-title">${cmd.title}</span>
                            <span class="cmd-item-desc">${cmd.desc}</span>
                        </div>
                    </div>
                    <span class="cmd-item-tag">${cmd.tag}</span>
                `;

                item.addEventListener('click', (e) => {
                    e.stopPropagation();
                    executeCommand(cmd);
                });

                item.addEventListener('mouseenter', () => {
                    selectedIndex = idx;
                    updateSelection();
                });

                cmdResults.appendChild(item);
            });
        }

        function updateSelection() {
            const items = cmdResults.querySelectorAll('.cmd-item');
            items.forEach((it, idx) => {
                it.classList.toggle('selected', idx === selectedIndex);
            });
            const sel = items[selectedIndex];
            if (sel) {
                sel.scrollIntoView({ block: 'nearest' });
            }
        }

        function filterCommands(query) {
            const q = query.toLowerCase().trim();
            if (!q) return COMMAND_LIST;
            return COMMAND_LIST.filter(c =>
                c.id.toLowerCase().includes(q) ||
                c.title.toLowerCase().includes(q) ||
                c.desc.toLowerCase().includes(q) ||
                c.category.toLowerCase().includes(q) ||
                (c.tag && c.tag.toLowerCase().includes(q))
            );
        }

        function openPalette() {
            cmdModal.removeAttribute('inert');
            cmdModal.classList.add('active');
            document.body.classList.add('cmd-open');
            cmdInput.value = '';
            selectedIndex = 0;
            renderResults(COMMAND_LIST);
            setTimeout(() => cmdInput.focus(), 50);
        }

        function closePalette() {
            cmdModal.setAttribute('inert', '');
            cmdModal.classList.remove('active');
            document.body.classList.remove('cmd-open');
            cmdInput.blur();
        }

        cmdInput.addEventListener('input', (e) => {
            selectedIndex = 0;
            renderResults(filterCommands(e.target.value));
        });

        cmdInput.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                if (currentFiltered.length > 0) {
                    selectedIndex = (selectedIndex + 1) % currentFiltered.length;
                    updateSelection();
                }
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                if (currentFiltered.length > 0) {
                    selectedIndex = (selectedIndex - 1 + currentFiltered.length) % currentFiltered.length;
                    updateSelection();
                }
            } else if (e.key === 'Enter') {
                e.preventDefault();
                e.stopPropagation();
                if (currentFiltered.length > 0) {
                    const targetIdx = (selectedIndex >= 0 && selectedIndex < currentFiltered.length) ? selectedIndex : 0;
                    if (currentFiltered[targetIdx]) {
                        executeCommand(currentFiltered[targetIdx]);
                    }
                }
            } else if (e.key === 'Escape') {
                closePalette();
            }
        });

        if (cmdTrigger) cmdTrigger.addEventListener('click', openPalette);
        if (cmdBackdrop) cmdBackdrop.addEventListener('click', closePalette);
        if (cmdCloseBtn) cmdCloseBtn.addEventListener('click', closePalette);

        // Global Keyboard Shortcut: Ctrl + K, Cmd + K, or "/"
        window.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && (e.key === 'k' || e.key === 'K')) {
                e.preventDefault();
                if (cmdModal.classList.contains('active')) {
                    closePalette();
                } else {
                    openPalette();
                }
            } else if (e.key === '/' && !cmdModal.classList.contains('active')) {
                const tag = document.activeElement ? document.activeElement.tagName.toLowerCase() : '';
                if (tag !== 'input' && tag !== 'textarea') {
                    e.preventDefault();
                    openPalette();
                }
            } else if (e.key === 'Escape' && cmdModal.classList.contains('active')) {
                closePalette();
            }
        });
    }
});
