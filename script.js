document.addEventListener('DOMContentLoaded', function() {
    const titleElement = document.getElementById('typing-title');
    const titleText = "Welcome to Summer's Cyber Realm";
    let index = 0;

    function typeTitle() {
        if (index < titleText.length) {
            titleElement.innerHTML += titleText.charAt(index);
            index++;
            setTimeout(typeTitle, 100);
        }
    }
    typeTitle();

    function createStars() {
        const hero = document.querySelector('.hero');
        const starCount = 100;
        for (let i = 0; i < starCount; i++) {
            const star = document.createElement('div');
            star.classList.add('star');
            star.style.left = `${Math.random() * 100}%`;
            star.style.top = `${Math.random() * 100}%`;
            star.style.animationDelay = `${Math.random() * 10}s`;
            hero.appendChild(star);
        }
    }
    createStars();

    const audioPlayer = document.getElementById('audioPlayer');
    const playButton = document.getElementById('playButton');
    playButton.addEventListener('click', function() {
        if (audioPlayer.paused) {
            audioPlayer.play();
            playButton.textContent = '停止';
        } else {
            audioPlayer.pause();
            playButton.textContent = '再生';
        }
    });

    const volumeBars = document.querySelectorAll('.volume-bar');
    volumeBars.forEach((bar, index) => {
        bar.style.animation = `sound ${Math.random() * 1000 + 500}ms -${Math.random() * 1000}ms linear infinite alternate`;
    });
});
