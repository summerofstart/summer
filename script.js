document.addEventListener('DOMContentLoaded', function() {
    const titleElement = document.getElementById('typing-title');
    const titleText = "Welcome to Summer's Magical Realm";
    let index = 0;
    function typeTitle() {
        if (index < titleText.length) {
            titleElement.innerHTML += titleText.charAt(index);
            index++;
            setTimeout(typeTitle, 100);
        }
    }
    typeTitle();

    function createFireflies() {
        const hero = document.querySelector('.hero');
        const fireflyCount = 50;
        for (let i = 0; i < fireflyCount; i++) {
            const firefly = document.createElement('div');
            firefly.classList.add('firefly');
            firefly.style.left = `${Math.random() * 100}%`;
            firefly.style.top = `${Math.random() * 100}%`;
            firefly.style.animationDelay = `${Math.random() * 5}s`;
            hero.appendChild(firefly);
        }
    }
    createFireflies();

    const audioPlayer = document.getElementById('audioPlayer');
    const playButton = document.getElementById('playButton');
    playButton.addEventListener('click', function() {
        if (audioPlayer.paused) {
            audioPlayer.play();
            playButton.textContent = '音楽を止める';
        } else {
            audioPlayer.pause();
            playButton.textContent = '音楽を奏でる';
        }
    });

    // Magic orbs animation
    const magicOrbs = document.querySelectorAll('.magic-orb');
    function animateMagicOrbs() {
        magicOrbs.forEach(orb => {
            orb.style.transform = `scale(${Math.random() * 0.5 + 0.75})`;
        });
        requestAnimationFrame(animateMagicOrbs);
    }
    animateMagicOrbs();
});
