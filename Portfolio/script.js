document.addEventListener('DOMContentLoaded', () => {
            if (window.lucide) {
                lucide.createIcons();
            }

            const revealItems = document.querySelectorAll('.reveal');

            if ('IntersectionObserver' in window) {
                const observer = new IntersectionObserver((entries) => {
                    entries.forEach((entry) => {
                        if (entry.isIntersecting) {
                            entry.target.classList.add('active');
                            observer.unobserve(entry.target);
                        }
                    });
                }, { threshold: 0.1 });

                revealItems.forEach((item) => {
                    // Immediately activate elements already in the viewport
                    const rect = item.getBoundingClientRect();
                    if (rect.top < window.innerHeight && rect.bottom > 0) {
                        item.classList.add('active');
                    } else {
                        observer.observe(item);
                    }
                });
            } else {
                revealItems.forEach((item) => item.classList.add('active'));
            }

            const themeToggle = document.getElementById('theme-toggle');

            if (themeToggle) {
                themeToggle.addEventListener('click', () => {
                    document.documentElement.classList.toggle('dark');
                    if (window.lucide) {
                        lucide.createIcons();
                    }
                });
            }

            document.querySelectorAll('a[href="#"]').forEach((link) => {
                link.addEventListener('click', (event) => event.preventDefault());
            });
        });