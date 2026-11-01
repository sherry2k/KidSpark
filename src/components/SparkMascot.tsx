import React from 'react';

/**
 * Spark, the KidSpark mascot. Light by design: CSS-only animation (transform and
 * opacity only), no JavaScript timers and no framer-motion loops.
 *
 *   mode="hello"  waves three times, then stands still and blinks now and then
 *   mode="cheer"  jumps and waves fast with a big open mouth (use on win screens)
 *   mode="wave"   keeps waving non-stop (use on the splash screen)
 *   mode="talk"   moves his mouth and bobs while he speaks (the tappable Spark)
 *
 * Images live in /public/spark/ (body.webp, arm.webp, mouth.webp).
 * Set the size with className (for example "w-24"). To position him, put the
 * position classes (absolute, right-2 ...) on a wrapper <div>, not on this component.
 */
const W = 1191;
const H = 1138;

const CSS = `
@keyframes sp-wave   { 0%{transform:rotate(-4deg)} 6%{transform:rotate(-17deg)} 14%{transform:rotate(9deg)} 22%{transform:rotate(-17deg)} 30%{transform:rotate(9deg)} 38%{transform:rotate(-17deg)} 46%{transform:rotate(9deg)} 54%,100%{transform:rotate(-4deg)} }
@keyframes sp-cheer-arm { from{transform:rotate(-30deg)} to{transform:rotate(16deg)} }
@keyframes sp-jump   { 0%,100%{transform:translateY(0) scale(1,1)} 12%{transform:translateY(0) scale(1.05,.93)} 45%{transform:translateY(-13%) scale(.97,1.04)} 75%{transform:translateY(0) scale(1.03,.96)} }
@keyframes sp-mouth  { from{transform:scale(1.08,1.05)} to{transform:scale(1.2,1.3)} }
@keyframes sp-flap   { 0%{transform:scale(1,.55)} 18%{transform:scale(1.05,1.2)} 38%{transform:scale(.95,.7)} 58%{transform:scale(1.1,1.3)} 78%{transform:scale(1,.6)} 100%{transform:scale(1.05,1.1)} }
@keyframes sp-bob    { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-4%)} }
@keyframes sp-blink  { 0%,92%,100%{transform:scaleY(0)} 95.5%{transform:scaleY(1)} }
@keyframes sp-line   { 0%,93%,100%{opacity:0} 94.5%,97%{opacity:1} }
.sp-arm{transform-origin:21.33% 53.7%}
.sp-hello .sp-arm{animation:sp-wave 3.6s ease-in-out 0.4s 3 both}
.sp-wave .sp-arm{animation:sp-wave 1.8s ease-in-out infinite}
.sp-talk .sp-arm{animation:sp-wave 1.8s ease-in-out infinite}
.sp-talk .sp-body{animation:sp-bob .5s ease-in-out infinite;transform-origin:50% 100%}
.sp-talk .sp-mouth{animation:sp-flap .55s linear infinite}
.sp-cheer .sp-arm{animation:sp-cheer-arm .42s ease-in-out infinite alternate}
.sp-cheer .sp-body{animation:sp-jump .8s ease-in-out infinite;transform-origin:50% 100%}
.sp-mouth{transform-origin:50% 8%}
.sp-cheer .sp-mouth{animation:sp-mouth .4s ease-in-out infinite alternate}
.sp-lid{fill:#FDDB06;transform-box:fill-box;transform-origin:50% 0%;transform:scaleY(0);animation:sp-blink 5s infinite}
.sp-line{fill:none;stroke:#4A1D7A;stroke-width:9;stroke-linecap:round;opacity:0;animation:sp-line 5s infinite}
@media (prefers-reduced-motion: reduce){ .sp-arm,.sp-body,.sp-mouth,.sp-lid,.sp-line{animation:none!important} }
`;

const SparkMascot: React.FC<{ mode?: 'hello' | 'cheer' | 'wave' | 'talk'; className?: string }> = ({ mode = 'hello', className = '' }) => (
  <div className={className} style={{ aspectRatio: `${W} / ${H}` }} role="img" aria-label="Spark, the KidSpark star">
    <style>{CSS}</style>
    <div className={`sp-${mode}`} style={{ position: 'relative', width: '100%', height: '100%' }}>
      <div className="sp-body" style={{ position: 'absolute', inset: 0 }}>
        <img className="sp-arm" src="/spark/arm.webp" alt="" aria-hidden="true" draggable={false} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} />
        <img src="/spark/body.webp" alt="" aria-hidden="true" draggable={false} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} />
        <svg viewBox={`0 0 ${W} ${H}`} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} aria-hidden="true">
          <ellipse className="sp-lid" cx="496.5" cy="534" rx="82.5" ry="89" />
          <ellipse className="sp-lid" cx="764.5" cy="513" rx="82.5" ry="89" />
          <path className="sp-line" d="M443 566 A54 11 0 0 0 551 566" />
          <path className="sp-line" d="M711 545 A54 11 0 0 0 819 545" />
        </svg>
        <img
          className="sp-mouth"
          src="/spark/mouth.webp"
          alt=""
          aria-hidden="true"
          draggable={false}
          style={{ position: 'absolute', left: `${(543 / W) * 100}%`, top: `${(596 / H) * 100}%`, width: `${(194 / W) * 100}%`, height: `${(157 / H) * 100}%` }}
        />
      </div>
    </div>
  </div>
);

export default SparkMascot;
