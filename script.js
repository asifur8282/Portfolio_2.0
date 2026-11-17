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
        lightbox.classList.add('active');
        lightbox.setAttribute('aria-hidden', 'false');
        document.body.classList.add('lightbox-open');
    }

    function closeLightbox() {
        if (!lightbox) return;
        lightbox.classList.remove('active');
        lightbox.setAttribute('aria-hidden', 'true');
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
});
