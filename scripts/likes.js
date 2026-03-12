document.addEventListener('DOMContentLoaded', () => {
    initLikeButtons();
    initDoubleTap();
    initReactionPicker();
});

function initLikeButtons() {
    const likeButtons = document.querySelectorAll('.like-btn');
    
    likeButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const isLiked = btn.dataset.liked === 'true';
            const countEl = btn.querySelector('.like-count');
            
            if (countEl) {
                let count = parseInt(countEl.textContent.replace(/,/g, ''));
                count = isLiked ? count - 1 : count + 1;
                countEl.textContent = count.toLocaleString();
            }
            
            btn.dataset.liked = (!isLiked).toString();
            
            if (!isLiked) {
                createParticles(btn);
            }
        });
    });
}

function createParticles(element) {
    const rect = element.getBoundingClientRect();
    const particles = 6;
    
    for (let i = 0; i < particles; i++) {
        const particle = document.createElement('div');
        particle.style.cssText = `
            position: fixed;
            width: 8px;
            height: 8px;
            background: #ec4899;
            border-radius: 50%;
            pointer-events: none;
            z-index: 1000;
            left: ${rect.left + rect.width / 2}px;
            top: ${rect.top + rect.height / 2}px;
        `;
        document.body.appendChild(particle);
        
        const angle = (i / particles) * Math.PI * 2;
        const velocity = 50 + Math.random() * 30;
        const tx = Math.cos(angle) * velocity;
        const ty = Math.sin(angle) * velocity;
        
        particle.animate([
            { transform: 'translate(0, 0) scale(1)', opacity: 1 },
            { transform: `translate(${tx}px, ${ty}px) scale(0)`, opacity: 0 }
        ], {
            duration: 600,
            easing: 'cubic-bezier(0, 0.5, 0.5, 1)'
        }).onfinish = () => particle.remove();
    }
}

function initDoubleTap() {
    const tapMedia = document.querySelector('.tap-media');
    if (!tapMedia) return;
    
    let lastTap = 0;
    const tapCard = tapMedia.closest('.tap-card');
    const likeBtn = tapCard.querySelector('.like-btn');
    const floatingHeart = tapMedia.querySelector('.floating-heart');
    
    tapMedia.addEventListener('click', (e) => {
        const now = Date.now();
        const timeDiff = now - lastTap;
        
        if (timeDiff < 300 && timeDiff > 0) {
            if (likeBtn.dataset.liked !== 'true') {
                likeBtn.dataset.liked = 'true';
                const countEl = likeBtn.querySelector('.like-count') || tapCard.querySelector('.like-count');
                if (countEl) {
                    let count = parseInt(countEl.textContent.replace(/,/g, ''));
                    countEl.textContent = (count + 1).toLocaleString();
                }
            }
            
            floatingHeart.classList.remove('animate');
            void floatingHeart.offsetWidth;
            floatingHeart.classList.add('animate');
            
            createParticles(tapMedia);
        }
        
        lastTap = now;
    });
}

function initReactionPicker() {
    const reactionOptions = document.querySelectorAll('.reaction-option');
    const reactionTrigger = document.querySelector('.reaction-trigger');
    
    if (!reactionTrigger) return;
    
    const reactions = {
        'like': { emoji: '👍', label: 'Like', color: '#6366f1' },
        'love': { emoji: '❤️', label: 'Love', color: '#ef4444' },
        'haha': { emoji: '😂', label: 'Haha', color: '#f59e0b' },
        'wow': { emoji: '😮', label: 'Wow', color: '#f59e0b' },
        'sad': { emoji: '😢', label: 'Sad', color: '#f59e0b' },
        'angry': { emoji: '😠', label: 'Angry', color: '#ef4444' }
    };
    
    reactionOptions.forEach(option => {
        option.addEventListener('click', () => {
            const reaction = option.dataset.reaction;
            const reactionData = reactions[reaction];
            
            const currentReaction = reactionTrigger.querySelector('.current-reaction');
            const reactionLabel = reactionTrigger.querySelector('.reaction-label');
            
            currentReaction.innerHTML = `<span style="font-size: 1.25rem;">${reactionData.emoji}</span>`;
            reactionLabel.textContent = reactionData.label;
            reactionTrigger.style.color = reactionData.color;
            reactionTrigger.classList.add('active');
            
            option.animate([
                { transform: 'scale(1.5)' },
                { transform: 'scale(1)' }
            ], {
                duration: 200,
                easing: 'ease-out'
            });
        });
    });
    
    reactionTrigger.addEventListener('click', (e) => {
        if (reactionTrigger.classList.contains('active')) {
            const currentReaction = reactionTrigger.querySelector('.current-reaction');
            const reactionLabel = reactionTrigger.querySelector('.reaction-label');
            
            currentReaction.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path>
                </svg>
            `;
            reactionLabel.textContent = 'Like';
            reactionTrigger.style.color = '';
            reactionTrigger.classList.remove('active');
        }
    });
}
