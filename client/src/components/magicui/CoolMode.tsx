import { useEffect, useRef } from "react";

type CoolModeProps = {
    children: React.ReactNode;
    /** URL de partícula custom (por defecto usa círculos CSS) */
    particle?: string;
    /** tamaño base de partícula (px) */
    size?: number;
    /** cuántas partículas crear por “rafaga” */
    particleCount?: number;
    /** velocidad horizontal */
    speedHorz?: number;
    /** velocidad vertical hacia arriba */
    speedUp?: number;
};

export default function CoolMode({
    children,
    particle,
    size = 20,
    particleCount = 6,
    speedHorz = 0.6,
    speedUp = 1.2,
}: CoolModeProps) {
    const ref = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        const spawn = (x: number, y: number) => {
            for (let i = 0; i < particleCount; i++) {
                const node = particle
                    ? (document.createElement("img") as HTMLImageElement)
                    : document.createElement("div");

                if (particle) {
                    node.setAttribute("src", particle);
                    (node as HTMLImageElement).decoding = "async";
                    node.style.width = `${size}px`;
                    node.style.height = `${size}px`;
                } else {
                    node.className = "rounded-full bg-gradient-to-br from-pink-500 to-purple-500";
                    node.style.width = `${size}px`;
                    node.style.height = `${size}px`;
                }

                node.style.position = "absolute";
                node.style.left = `${x - size / 2}px`;
                node.style.top = `${y - size / 2}px`;
                node.style.pointerEvents = "none";
                node.style.opacity = "1";
                node.style.willChange = "transform, opacity";

                el.appendChild(node);

                const angle = Math.random() * Math.PI * 2;
                const vx = Math.cos(angle) * (speedHorz * (0.5 + Math.random()));
                const vy = -Math.abs(Math.sin(angle)) * (speedUp * (0.8 + Math.random()));
                const life = 900 + Math.random() * 600;

                const start = performance.now();
                const animate = (t: number) => {
                    const dt = t - start;
                    const px = x + vx * dt;
                    const py = y + vy * dt + 0.001 * dt * dt; // gravedad ligera
                    const fade = 1 - dt / life;

                    node.style.transform = `translate(${px - x}px, ${py - y}px)`;
                    node.style.opacity = String(Math.max(0, fade));

                    if (dt < life) requestAnimationFrame(animate);
                    else node.remove();
                };
                requestAnimationFrame(animate);
            }
        };

        const handle = (e: MouseEvent) => {
            const rect = el.getBoundingClientRect();
            spawn(e.clientX - rect.left, e.clientY - rect.top);
        };

        el.addEventListener("click", handle);
        return () => el.removeEventListener("click", handle);
    }, [particle, size, particleCount, speedHorz, speedUp]);

    return (
        <div ref={ref} className="relative overflow-hidden">
            {children}
        </div>
    );
}
