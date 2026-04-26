document.addEventListener('mousemove', (e) => {
            const pupils = document.querySelectorAll('.pupil');
            pupils.forEach(pupil => {
                const rect = pupil.getBoundingClientRect();
                const pupilCenterX = rect.left + rect.width / 2;
                const pupilCenterY = rect.top + rect.height / 2;
                
                const deltaX = e.clientX - pupilCenterX;
                const deltaY = e.clientY - pupilCenterY;
                const angle = Math.atan2(deltaY, deltaX);
                const distance = Math.min(Math.sqrt(deltaX ** 2 + deltaY ** 2) / 10, 15);
                
                const moveX = Math.cos(angle) * distance;
                const moveY = Math.sin(angle) * distance;
                
                pupil.style.transform = `translate(${moveX}px, ${moveY}px)`;
            });
        });