import { useState, useEffect, useRef } from 'react';

export const useCountUp = (target, duration = 2000) => {
    const ref = useRef(null);
    const [count, setCount] = useState(0);
    const targetString = String(target);

    useEffect(() => {
        const element = ref.current;
        if (!element) return;

        const observer = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting) {
                let start = 0;
                const end = parseFloat(targetString.replace(/[^0-9.]/g, '')) || 0;
                if (start === end) {
                    setCount(end);
                    return;
                };

                const totalFrames = duration / 16; // approx 60fps
                const increment = end / totalFrames;

                const counter = () => {
                    start += increment;
                    if (start < end) {
                        setCount(start);
                        requestAnimationFrame(counter);
                    } else {
                        setCount(end);
                    }
                };
                requestAnimationFrame(counter);
                observer.unobserve(element);
            }
        }, { threshold: 0.5 });

        observer.observe(element);

        return () => observer.disconnect();
    }, [targetString, duration]);

    const formatCount = () => {
        if (targetString.includes('%')) return `${count.toFixed(1)}%`;
        if (targetString.includes('K+')) return `${Math.floor(count)}K+`;
        if (targetString.includes('+')) return `${Math.floor(count).toLocaleString()}+`;
        return targetString;
    };
    
    return [ref, formatCount()];
};