import React from 'react';
import TweenOne from 'rc-tween-one';
import SvgDrawPlugin from 'rc-tween-one/lib/plugin/SvgDrawPlugin';

TweenOne.plugins.push(SvgDrawPlugin);

let delay = 0;
function setAddDelay() {
  delay += 100;
  return delay;
}

const duration = 400;

const animate = {
  scale: {
    scale: 0,
    opacity: 0,
    type: 'from',
    ease: 'easeOutQuad',
    duration,
  },
  alpha: {
    opacity: 0,
    type: 'from',
    ease: 'easeOutQuad',
    duration,
  },
  y: {
    y: -30,
    opacity: 0,
    type: 'from',
    ease: 'easeOutQuad',
    duration,
  },
  yBig: {
    y: -120,
    opacity: 0,
    type: 'from',
    ease: 'easeOutQuad',
    duration,
  },
  draw: {
    style: { SVGDraw: 0 },
    type: 'from',
    ease: 'easeOutQuad',
  },
  loop: {
    yoyo: true,
    repeat: -1,
    duration: 2500,
  },
};

export default function BannerImage() {
  return (
    <svg viewBox="0 0 790 542" width="100%" height="100%">
      <defs>
        <linearGradient x1="90.6674592%" y1="40.4771205%" x2="17.4068727%" y2="55.2232143%" id="linearGradient-1">
          <stop stopColor="#FCD63C" offset="0%" />
          <stop stopColor="#F8E71C" offset="100%" />
        </linearGradient>
        <linearGradient x1="80.2517361%" y1="55.2232146%" x2="22.7213542%" y2="31.2026515%" id="linearGradient-2">
          <stop stopColor="#FCD63C" offset="0%" />
          <stop stopColor="#F8E71C" offset="100%" />
        </linearGradient>
        <polygon id="path-3" points="91.8584281 0 112 9.07599488 22.0196744 64 0 53.929429" />
        <linearGradient x1="91.6305611%" y1="50%" x2="19.6942478%" y2="44.9378714%" id="linearGradient-4">
          <stop stopColor="#42C8FF" offset="0%" />
          <stop stopColor="#5DBEFF" offset="100%" />
        </linearGradient>
        <polygon id="path-5" points="0 54.0722421 126.438497 114 222 58.6430199 94.5116771 0" />
        <rect id="path-7" x="167" y="16" width="22" height="15" />
        <linearGradient x1="77.1642736%" y1="100%" x2="77.1642745%" y2="12.1688179%" id="linearGradient-8">
          <stop stopColor="#FDF157" offset="0%" />
          <stop stopColor="#FADF2C" offset="100%" />
        </linearGradient>
        <polygon id="path-9" points="57.209613 0 0 32.4794101 79.15497 69 136 37.501598" />
        <polygon id="path-11" points="91.0578673 0 0 51.7787697 125.987266 110 216.464844 59.7851562" />
        <linearGradient x1="69.1189236%" y1="9.1796875%" x2="31.1352927%" y2="75.0473485%" id="linearGradient-13">
          <stop stopColor="#FF6953" offset="0%" />
          <stop stopColor="#FF6852" offset="19.8620855%" />
          <stop stopColor="#FF543B" offset="100%" />
        </linearGradient>
      </defs>
      <g id="视觉稿" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
        <g id="首页" transform="translate(-68.000000, -88.000000)">
          <g id="Illustrator" transform="translate(68.000000, 88.000000)">
            <g id="i5" transform="translate(511.000000, 79.000000)">
              <TweenOne animation={[{ ...animate.alpha, delay: 200 }, { ...animate.loop, scale: 0.95 }]} style={{ transformOrigin: '50%' }} component="g">
                <polygon id="Path-14" fillOpacity="0.5" fill="#EDEFF4" points="0 103.723184 140.844089 170 279 91.4987247 136.718049 25" />
              </TweenOne>
              <TweenOne component="g" animation={{ ...animate.loop, y: -5, delay: duration + 200 }}>
                <TweenOne component="g" animation={{ ...animate.yBig }}>
                  <polygon id="Path-14" fill="#FFFFFF" points="0 78.7231843 140.844089 145 279 66.4987247 136.718049 0" />
                  <polygon id="Path-32" fill="#E0E1E8" points="0 79 0 83.955908 141 150 141 145.042031" />
                  <polygon id="Path-32" fill="#F0F1F6" points="278.903503 66.7319336 278.903503 71.7208252 140.811768 150.478271 140.811768 145.487305" />
                </TweenOne>
                <TweenOne component="g" animation={{ delay: setAddDelay() + 200, ...animate.alpha }}>
                  <polygon id="Path-27" fill="#F0F1F6" points="70.8965305 52.02283 121.978691 44 121.978691 60.3224153 177.222169 54.3844756 177.222169 76.2973489 236 70.4824116 197.045922 92.135411 164.907253 110 56 61.0358291" />
                </TweenOne>
                <TweenOne component="g" animation={{ delay, ...animate.y }} id="Group-25" transform="translate(56.000000, 29.000000)">
                  <polygon id="Path-27" fill="#DEC923" points="14.8965305 18.02283 65.9786914 10 65.9786914 26.3224153 121.222169 20.3844756 121.222169 42.2973489 180 36.4824116 108.907253 76 0 27.0358291" />
                  <polygon id="Path-27" fill="url(#linearGradient-1)" points="14.8965305 13.02283 65.9786914 5 65.9786914 21.3224153 121.222169 15.3844756 121.222169 37.2973489 180 31.4824116 108.907253 71 0 22.0358291" />
                  <polyline id="Path-27" points="19 7.94896696 70.1627859 0 70.1627859 16.1721413 125.493456 10.2888698 125.493456 32 182 26.2385985" />
                  <polygon id="Path-18" fill="#DDC71E" points="0.0529785156 22.0512695 0.0529785156 27.0438751 108.928711 75.9763184 108.928711 70.9331055" />
                  <polygon id="Path-18" fill="#EEC239" points="179.95105 31.4976807 179.95105 36.4902863 108.928711 75.9763184 108.928711 70.9331055" />
                  <polygon id="Path-27" fill="url(#linearGradient-2)" points="14.8965305 13.02283 65.9786914 5 65.9786914 21.3224153 121.222169 15.3844756 121.222169 37.2973489 180 31.4824116 108.907253 71 0 22.0358291" />
                </TweenOne>
                <TweenOne component="g" animation={{ delay: delay + 300, ...animate.alpha }}>
                  <polygon id="Path-37" fill="#F0F1F6" points="44.1532869 67 41 69.0783298 147.984639 118 151 116.10171" />
                </TweenOne>
                <TweenOne component="g" animation={{ delay: delay + 100, ...animate.y }} transform="translate(41.000000, 51.000000)">
                  <polygon id="Path-18" fill="#E6B92C" points="-7.10542736e-15 8 -7.10542736e-15 13.0245223 107 62 107 56.9245469" />
                  <polygon id="Path-18" fill="#EEC239" points="110 55 110 60.0869932 107 62 107 56.8596393" />
                  <polygon id="Path-37" fill="#FADF2D" points="3.15328687 6 0 8.07832981 106.984639 57 110 55.1017101" />
                </TweenOne>
              </TweenOne>
            </g>
            <g id="i4" transform="translate(337.000000, 0.000000)">
              <TweenOne component="g" animation={[{ delay: setAddDelay() + 200, ...animate.alpha }, { ...animate.loop, scale: 1.05 }]} style={{ transformOrigin: '50%' }}>
                <polygon id="Path-22" fillOpacity="0.5" fill="#EDEFF4" points="136.943579 25 0 104.057863 136.943579 168 279 92.3627973" />
              </TweenOne>
              <TweenOne component="g" animation={{ ...animate.loop, y: 5, delay: delay + duration + 200 }}>
                <TweenOne component="g" animation={{ delay, ...animate.yBig }} id="Group-36" transform="translate(6.000000, 0.000000)">
                  <polygon id="Path-22" fill="#FFFFFF" points="136.943579 0 0 79.057863 136.943579 143 279 67.3627973" />
                  <polygon id="Path-28" fill="#E0E1E8" points="0 79 0 83.3435449 136.927093 148 137 142.898501" />
                  <polygon id="Path-29" fill="#F0F1F6" points="278.94043 66.9602051 278.94043 72.1335449 137.096191 147.667969 137.173096 142.567932" />
                </TweenOne>
                <g id="Group-7" transform="translate(46.000000, 18.000000)">
                  <TweenOne component="g" animation={{ delay: delay + 300, ...animate.y }}>
                    <polygon id="Path-23" fill="#F0F1F6" points="49.8130579 23 70 32.0671396 22.0692752 62 0 51.9392547" />
                    <g id="Group-34" transform="translate(0.000000, 12.000000)">
                      <polygon id="Path-23" stroke="#FFC5BC" strokeWidth="0.25" fill="#FF543B" points="49.8130579 0 70 9.06713957 22.0692752 39 0 28.9392547" />
                      <polygon id="Path-31" fill="#F04B32" points="22 38.9295726 22 44 70 14.0365205 70 9" />
                      <polygon id="Path-30" fill="#DA4435" points="0 29 0 33.9660046 22 44 22 38.9447747" />
                    </g>
                  </TweenOne>
                  <TweenOne component="g" animation={{ delay: delay + 400, ...animate.y }}>
                    <polygon id="Path-23" fill="#F0F1F6" points="121.858428 11 142 20.0759949 52.0196744 75 30 64.929429" />
                    <g id="Group-33" transform="translate(30.000000, 0.000000)">
                      <g id="Path-23">
                        <use fill="#FF543B" fillRule="evenodd" xlinkHref="#path-3" />
                        <path stroke="#FF9C9C" strokeWidth="0.25" d="M91.8659889,0.140511459 L0.270387554,53.9156367 L22.0112507,63.858695 L111.732753,9.09267537 L91.8659889,0.140511459 Z" />
                      </g>
                      <polygon id="Path-31" fill="#F04B32" points="22 63.9244875 22 69 112 14.0415715 112 9" />
                      <polygon id="Path-30" fill="#DA4435" points="0 54 0 59.0783832 22 69 22 64.0640399" />
                    </g>
                  </TweenOne>
                  <TweenOne component="g" animation={{ delay: delay + 500, ...animate.y }}>
                    <polygon id="Path-23" fill="#F0F1F6" points="109.813058 50 130 59.0671396 82.0692752 89 60 78.9392547" />
                    <g id="Group-30" transform="translate(60.000000, 39.000000)">
                      <polygon id="Path-23" stroke="#FFC5BC" strokeWidth="0.25" fill="#FF543B" points="49.8130579 0 70 9.06713957 22.0692752 39 0 28.9392547" />
                      <polygon id="Path-31" fill="#F04B32" points="22 38.9290247 22 44 70 14.0370647 70 9" />
                      <polygon id="Path-30" fill="#DA4435" points="0 29 0 34.0936125 22 44 22 39.0492377" />
                    </g>
                  </TweenOne>
                  <TweenOne component="g" animation={{ delay: delay + 600, ...animate.y }}>
                    <polygon id="Path-24" fill="#F0F1F6" points="166 68.8416953 109.035994 102 90 93.4231661 148.446572 60" />
                    <g id="Group-2" transform="translate(90.000000, 49.000000)">
                      <polygon id="Path-24" stroke="#FFCBB9" strokeWidth="0.25" fill="#FF543B" points="76 8.84169526 19.0359941 42 0 33.4231661 58.4465721 0" />
                      <polygon id="Path-31" fill="#F04B32" points="19 41.9682164 19 47 76 13.9981351 76 9" />
                      <polygon id="Path-30" fill="#DA4435" points="0 33 0 38.2474325 19 47 19 41.8997316" />
                    </g>
                  </TweenOne>
                </g>
              </TweenOne>
            </g>
            <g id="i3" transform="translate(0.000000, 45.000000)">
              <TweenOne component="g" animation={[{ delay: setAddDelay() + 200, ...animate.alpha }, { ...animate.loop, scale: 0.95 }]} style={{ transformOrigin: '50%' }}>
                <polygon id="Path-16" fillOpacity="0.5" fill="#EDEFF4" points="0 153.669111 249.651516 268 455 148.765203 203.257796 35" />
              </TweenOne>
              <TweenOne component="g" animation={{ ...animate.loop, y: -10, delay: delay + duration + 200 }}>
                <TweenOne component="g" animation={{ delay, ...animate.yBig }}>
                  <polygon id="Path-28" fill="#E0E1E8" points="0 119 0 123.956143 249 238 249 232.950015" />
                  <polygon id="Path-28" fill="#EAEBF1" points="454.692627 113.929932 454.692627 118.900635 249.470703 238.23584 249.470703 233.171018" />
                  <polygon id="Path-16" fill="#FFFFFF" points="0 118.669111 249.651516 233 455 113.765203 203.257796 0" />
                </TweenOne>
                <TweenOne component="g" animation={{ delay: delay + 400, ...animate.alpha }} id="Group-18" opacity="0.5" transform="translate(69.000000, 72.000000)">
                  <path d="M46.5,33.5 L103.5,0.5" id="Line-4" stroke="#E2E3F2" strokeLinecap="round" />
                  <path d="M54.5,36.5 L111.5,3.5" id="Line-4" stroke="#E2E3F2" strokeLinecap="round" />
                  <path d="M62,40 L119,7" id="Line-4" stroke="#E2E3F2" strokeLinecap="round" />
                  <ellipse id="Oval-3" fill="#D4D5E2" cx="20" cy="42.5" rx="20" ry="10.5" />
                  <path d="M37,27 L81,1" id="Line-4" stroke="#F1F1F9" strokeWidth="3" strokeLinecap="round" />
                </TweenOne>
                <TweenOne component="g" animation={{ delay: delay + 500, ...animate.alpha }} id="Group-38" opacity="0.5" transform="translate(119.000000, 92.000000)">
                  <path d="M37,27 L81,1" id="Line-4" stroke="#F1F1F9" strokeWidth="3" strokeLinecap="round" />
                  <path d="M46.5,33.5 L103.5,0.5" id="Line-4" stroke="#E2E3F2" strokeLinecap="round" />
                  <path d="M54.5,36.5 L111.5,3.5" id="Line-4" stroke="#E2E3F2" strokeLinecap="round" />
                  <path d="M62,40 L119,7" id="Line-4" stroke="#E2E3F2" strokeLinecap="round" />
                  <ellipse id="Oval-3" fill="#D8D9E0" cx="20" cy="42.5" rx="20" ry="10.5" />
                </TweenOne>
                <TweenOne component="g" animation={{ delay: delay + 500, ...animate.alpha }} id="Group-18" opacity="0.5" transform="translate(174.000000, 27.000000)">
                  <path d="M51.5,50.5 L95.5,24.5" id="Line-4" stroke="#E2E3F2" strokeWidth="3" strokeLinecap="round" />
                  <path d="M61.5,57.5 L118.5,24.5" id="Line-4" stroke="#E2E3F2" strokeLinecap="round" />
                  <path d="M69.5,60.5 L126.5,27.5" id="Line-4" stroke="#E2E3F2" strokeLinecap="round" />
                  <path d="M77,64 L134,31" id="Line-4" stroke="#E2E3F2" strokeLinecap="round" />
                  <g id="Group-39">
                    <polygon id="Path-26" fill="#DFDFDF" opacity="0.5" points="0 25.6995056 37.3061196 43 85 16.488809 46.3036387 0" />
                    <polygon id="Path-2" fill="#FFFFFF" points="27 20.8157119 43.756617 28 46 16" />
                  </g>
                </TweenOne>
                <TweenOne component="g" animation={{ delay: delay + 600, ...animate.alpha }}>
                  <polygon id="Path-17" fill="#F0F1F6" opacity="0.5" points="175 137.072073 301.438497 197 397 141.642863 268.510726 82" />
                </TweenOne>
                <TweenOne component="g" animation={{ delay: delay + 200, ...animate.y }} id="Group-37" transform="translate(177.000000, 68.000000)">
                  <polygon id="Path-36" fill="#56B9E9" points="222 58.5712891 222 63.9607392 126 119 126 114.059163" />
                  <polygon id="Path-36" fill="#4E99E2" points="0 54 0 58.9917038 127 119 127 114.020161" />
                  <g id="Group-32">
                    <mask id="mask-6" fill="white">
                      <use xlinkHref="#path-5" />
                    </mask>
                    <use id="Mask" fill="url(#linearGradient-4)" xlinkHref="#path-5" />
                    <g opacity="0.5" mask="url(#mask-6)">
                      <g transform="translate(-1.000000, -5.000000)">
                        <TweenOne component="g" animation={{ delay: delay + 900, ...animate.alpha }} id="Group-28">
                          <polygon id="Path-51" fill="#63AFF9" points="61.4814453 72.4892578 48.1523438 82.2763672 96.5068359 105.611328 102.546875 97.7265625 90.6376953 67.8359375" />
                          <polygon id="Path-52" fill="#63AFF9" points="93.9658203 67.5273438 127.579102 62.6025391 127.579102 102.199219 103.652344 97.6621094 89.9794922 67.5273438" />
                          <polygon id="Path-53" fill="#63AFF9" points="128.986328 62.2207031 161.228516 57.7226562 164.310547 113.430664 128.837891 105.356445" />
                          <polygon id="Path-49" fill="#63AFF9" points="83.8164062 30.5146484 44.0722656 43.9277344 61.0048828 72.0830078 102.643555 66.7998047" />
                          <polygon id="Path-54" fill="#63AFF9" points="160.619141 58.1230469 163.996094 99.8916016 225.474609 64.2128906 202.646484 51.8007812" />
                          <polygon id="Path-55" fill="#63AFF9" points="42.3789062 45.5957031 61.2958984 72.5957031 44.8369141 85.3925781 13.2382812 70.3076172" />
                          <polygon id="Path-56" fill="#63AFF9" points="37.5292969 37.0078125 41.3349609 44.4707031 75.4482422 33.8779297 80.4423828 9.03222656" />
                          <polygon id="Path-57" fill="#63AFF9" points="0.698242188 59.1328125 16.6074219 66.0722656 40.9335938 45.1464844 34.6982422 34.09375" />
                          <polygon id="Path-58" fill="#63AFF9" points="125.668945 16.7744141 76.0351562 34.2070312 81.5234375 8.16894531 97.7324219 0.0859375" />
                          <polygon id="Path-59" stroke="#979797" fill="#63AFF9" points="101.885742 97.5800781 95.2314453 105.722656 129.585938 122.524414 146.84668 109.826172" />
                          <polygon id="Path-50" fill="#63AFF9" points="83.5800781 30.3320313 101.422852 65.90625 204.644531 52.9160156 125.508789 17.7236328" />
                        </TweenOne>
                        <g id="Group-31" transform="translate(14.000000, 4.000000)">
                          <TweenOne component="path" attr="attr" animation={{ delay: delay + 550, ...animate.draw }} d="M28.5,40.5 L117.5,11.5" id="Line-15" stroke="#7BD4FF" strokeWidth="5" strokeLinecap="square" />
                          <TweenOne component="path" attr="attr" animation={{ delay: delay + 750, ...animate.draw }} d="M22.5,32.5 L47.5,68.5" id="Line-16" stroke="#7BD4FF" strokeWidth="5" strokeLinecap="square" />
                          <TweenOne component="path" attr="attr" animation={{ delay: delay + 700, ...animate.draw }} d="M27.5,41.5 L0.5,64.5" id="Line-17" stroke="#7BD4FF" strokeWidth="5" strokeLinecap="square" />
                          <TweenOne component="path" attr="attr" animation={{ delay: delay + 650, ...animate.draw }} d="M47.5,68.5 L28.5,82.5" id="Line-18" stroke="#7BD4FF" strokeWidth="5" strokeLinecap="square" />
                          <TweenOne component="path" attr="attr" animation={{ delay: delay + 550, ...animate.draw }} d="M48.5,68.5 L190.5,48.5" id="Line-19" stroke="#7BD4FF" strokeWidth="5" strokeLinecap="square" />
                          <TweenOne component="path" attr="attr" animation={{ delay: delay + 600, ...animate.draw }} d="M70.5,28.5 L87.5,60.5" id="Line-20" stroke="#7BD4FF" strokeWidth="5" strokeLinecap="square" />
                          <TweenOne component="path" attr="attr" animation={{ delay: delay + 500, ...animate.draw }} d="M76.5,65.5 L88.5,93.5" id="Line-21" stroke="#7BD4FF" strokeWidth="5" strokeLinecap="square" />
                          <TweenOne component="path" attr="attr" animation={{ delay: delay + 700, ...animate.draw }} d="M88.5,93.5 L78.5,106.5" id="Line-22" stroke="#7BD4FF" strokeWidth="5" strokeLinecap="square" />
                          <TweenOne component="path" attr="attr" animation={{ delay: delay + 650, ...animate.draw }} d="M89.5,93.5 L134.5,105.5" id="Line-23" stroke="#7BD4FF" strokeWidth="5" strokeLinecap="square" />
                          <TweenOne component="path" attr="attr" animation={{ delay: delay + 600, ...animate.draw }} d="M113.5,60.5 L113.5,97.5" id="Line-24" stroke="#7BD4FF" strokeWidth="5" strokeLinecap="square" />
                          <TweenOne component="path" attr="attr" animation={{ delay: delay + 550, ...animate.draw }} d="M147.5,56.5 L150.5,104.5" id="Line-25" stroke="#7BD4FF" strokeWidth="5" strokeLinecap="square" />
                          <TweenOne component="path" attr="attr" animation={{ delay: delay + 500, ...animate.draw }} d="M67.5,0.5 L61.5,27.5" id="Line-14" stroke="#7BD4FF" strokeWidth="5" strokeLinecap="square" />
                        </g>
                      </g>
                    </g>
                  </g>
                </TweenOne>
                <g id="dian" transform="translate(286.000000, 69.000000)">
                  <TweenOne component="g" animation={{ delay: delay + 800, ...animate.alpha }}>
                    <ellipse id="Oval-17" fillOpacity="0.300000012" fill="#4E99E2" cx="17.5" cy="47" rx="10.5" ry="6" />
                  </TweenOne>
                  <TweenOne component="g" animation={{ delay: delay + 600, ...animate.yBig, ease: 'easeOutBounce' }}>
                    <path d="M19.5,46 C7.83333333,34.5577829 2,25.4167573 2,18.5769231 C2,8.31717176 9.83501688,0 19.5,0 C29.1649831,0 37,8.31717176 37,18.5769231 C37,25.4167573 31.1666667,34.5577829 19.5,46 Z M19.5,26 C23.0898509,26 26,22.8659932 26,19 C26,15.1340068 23.0898509,12 19.5,12 C15.9101491,12 13,15.1340068 13,19 C13,22.8659932 15.9101491,26 19.5,26 Z" id="Combined-Shape" fill="#EEC239" />
                    <polygon id="Path-19" fill="#EEC239" points="19.6142578 45.9814453 17.5168457 46.9526367 17.5168457 44.3430176 21.046875 44.3430176" />
                    <path d="M17.5,47 C5.83333333,35.5577829 0,26.4167573 0,19.5769231 C0,9.31717176 7.83501688,1 17.5,1 C27.1649831,1 35,9.31717176 35,19.5769231 C35,26.4167573 29.1666667,35.5577829 17.5,47 Z M17.5,26 C21.0898509,26 24,22.8659932 24,19 C24,15.1340068 21.0898509,12 17.5,12 C13.9101491,12 11,15.1340068 11,19 C11,22.8659932 13.9101491,26 17.5,26 Z" id="Combined-Shape" fill="url(#linearGradient-8)" />
                  </TweenOne>
                </g>
              </TweenOne>
            </g>
            <g id="i2" transform="translate(338.000000, 172.000000)">
              <TweenOne component="g" animation={[{ delay: setAddDelay() + 200, ...animate.alpha }, { ...animate.loop, scale: 1.05 }]} style={{ transformOrigin: '50%' }}>
                <polygon id="Path-25" fillOpacity="0.5" fill="#EDEFF4" points="0 117.842753 150.402663 189 301 103.116396 147.052477 32" />
              </TweenOne>
              <TweenOne component="g" animation={{ ...animate.loop, y: 10, delay: delay + duration + 200 }}>
                <TweenOne component="g" animation={{ delay, ...animate.yBig }}>
                  <polygon id="Path-25" fill="#08C467" points="0 90.8427532 150.402663 162 301 76.1163962 145.052477 6" />
                  <polygon id="Path-25" fill="#0DE07A" points="0 85.8427532 150.402663 157 301 71.1163962 147.052477 0" />
                  <polygon id="Path-4" fill="#10CA6E" points="0.0227050781 85.8400879 0.091796875 90.9919434 150.42627 162.224121 150.42627 157.058594" />
                  <polygon id="Path-4" fill="#15D274" points="301.055298 71.0273438 301.055298 76.2794189 150.42627 162.224121 150.42627 157.058594" />
                </TweenOne>
                <TweenOne component="g" animation={{ delay: delay + 500, ...animate.alpha }} id="Group-20" transform="translate(62.000000, 72.000000)">
                  <polyline id="Line-5" stroke="#11D373" strokeWidth="4" strokeLinecap="square" points="11.9264069 6.94366197 62.0995671 9.3943662 122.570177 21.7085167 178.973214 14.3260893" />
                  <path d="M121.320346,19.1971831 L85.952381,47.7887324" id="Line-7" stroke="#11D373" strokeWidth="4" strokeLinecap="square" />
                  <ellipse id="Oval-10" fill="#11D373" cx="11.9264069" cy="6.94366197" rx="11.9264069" ry="6.94366197" />
                  <ellipse id="Oval-10" fill="#11D373" cx="178.073593" cy="14.2957746" rx="11.9264069" ry="6.94366197" />
                  <ellipse id="Oval-10" fill="#11D373" cx="62.9220779" cy="9.8028169" rx="16.8614719" ry="9.8028169" />
                  <ellipse id="Oval-10" fill="#11D373" cx="86.7748918" cy="48.1971831" rx="16.8614719" ry="9.8028169" />
                  <ellipse id="Oval-10" fill="#11D373" cx="122.554113" cy="21.6478873" rx="20.5627706" ry="11.8450704" />
                </TweenOne>
                <TweenOne component="g" animation={{ delay: delay + 300, ...animate.y }} id="Group" transform="translate(62.000000, 57.000000)">
                  <g id="Group-20" transform="translate(0.000000, 3.000000)">
                    <polyline id="Line-5" stroke="#EEEFF2" strokeWidth="4" strokeLinecap="square" points="11.9264069 6.94366197 62.0995671 9.3943662 122.570177 21.7085167 178.973214 14.3260893" />
                    <path d="M121.320346,19.1971831 L85.952381,47.7887324" id="Line-7" stroke="#EEEFF2" strokeWidth="4" strokeLinecap="square" />
                    <ellipse id="Oval-10" stroke="#FFFFFF" strokeWidth="0.25" fill="#EEEFF2" cx="11.9264069" cy="6.94366197" rx="11.9264069" ry="6.94366197" />
                    <ellipse id="Oval-10" fill="#EEEFF2" cx="178.073593" cy="14.2957746" rx="11.9264069" ry="6.94366197" />
                    <ellipse id="Oval-10" fill="#EEEFF2" cx="62.9220779" cy="9.8028169" rx="16.8614719" ry="9.8028169" />
                    <ellipse id="Oval-10" fill="#EEEFF2" cx="86.7748918" cy="48.1971831" rx="16.8614719" ry="9.8028169" />
                    <ellipse id="Oval-10" fill="#EEEFF2" cx="122.554113" cy="21.6478873" rx="20.5627706" ry="11.8450704" />
                  </g>
                  <g id="Group-20">
                    <polyline id="Line-5" stroke="#FFFFFF" strokeWidth="4" strokeLinecap="square" points="11.9264069 6.94366197 62.0995671 9.3943662 122.570177 21.7085167 178.973214 14.3260893" />
                    <path d="M121.320346,19.1971831 L85.952381,47.7887324" id="Line-7" stroke="#FFFFFF" strokeWidth="4" strokeLinecap="square" />
                    <ellipse id="Oval-10" fill="#FFFFFF" cx="11.9264069" cy="6.94366197" rx="11.9264069" ry="6.94366197" />
                    <ellipse id="Oval-10" fill="#FFFFFF" cx="178.073593" cy="14.2957746" rx="11.9264069" ry="6.94366197" />
                    <ellipse id="Oval-10" fill="#FFFFFF" cx="62.9220779" cy="9.8028169" rx="16.8614719" ry="9.8028169" />
                    <ellipse id="Oval-10" fill="#FFFFFF" cx="86.7748918" cy="48.1971831" rx="16.8614719" ry="9.8028169" />
                    <ellipse id="Oval-10" fill="#FFFFFF" cx="122.554113" cy="21.6478873" rx="20.5627706" ry="11.8450704" />
                  </g>
                </TweenOne>
              </TweenOne>
            </g>
            <g id="i1" transform="translate(42.000000, 248.000000)">
              <TweenOne component="g" animation={[{ delay: setAddDelay() + 200, ...animate.alpha }, { ...animate.loop, scale: 0.95 }]} style={{ transformOrigin: '50%' }}>
                <polygon id="Path-25" fillOpacity="0.5" fill="#EDEFF4" points="0 80.8066772 95.4382346 126 191 71.4536873 92.7352949 29" />
              </TweenOne>
              <TweenOne component="g" animation={{ ...animate.loop, y: 15, delay: delay + duration + 200 }}>
                <TweenOne component="g" animation={{ delay, ...animate.yBig }} id="Group-21" transform="translate(3.000000, 0.000000)">
                  <polygon id="Path-25" fill="#FFFFFF" points="0 51.8066772 95.4382346 97 191 42.4536873 92.7352949 0" />
                  <polygon id="Path-12" fill="#E0E1E8" points="0 52 0 55.4470108 95 101 95 97.5734492" />
                  <polygon id="Path-12" fill="#F0F1F6" points="191 42 190.977174 45.4486653 95 100 95 96.6078162" />
                </TweenOne>
                <TweenOne component="g" animation={{ delay: delay + 500, ...animate.alpha }} id="Path-15" opacity="0.5" transform="translate(18.000000, 20.000000)">
                  <mask id="mask-10" fill="white">
                    <use xlinkHref="#path-9" />
                  </mask>
                  <use id="Mask" fill="#F0F1F6" xlinkHref="#path-9" />
                  <polygon fillOpacity="0.699999988" fill="#DBDEF0" mask="url(#mask-10)" points="-6 28.5229773 57 25 54.2629176 62" />
                  <polygon fillOpacity="0.699999988" fill="#DBDEF0" mask="url(#mask-10)" points="17 40.3799177 95 36 91.6112314 82" />
                </TweenOne>
                <TweenOne component="path" attr="attr" animation={{ delay: delay + 400, ...animate.draw }} d="M96.4384615,10.4354839 L152.561538,36.5645161" id="Line-3" strokeOpacity="0.6" stroke="#DDDEF0" strokeWidth="3" strokeLinecap="round" />
                <TweenOne component="path" attr="attr" animation={{ delay: delay + 350, ...animate.draw }} d="M89.4411765,13.4390244 L163.558824,48.5609756" id="Line-3" strokeOpacity="0.7" stroke="#DDDEF0" strokeLinecap="square" />
                <TweenOne component="path" attr="attr" animation={{ delay: delay + 300, ...animate.draw }} d="M84.4411765,17.4390244 L158.558824,52.5609756" id="Line-3" strokeOpacity="0.7" stroke="#DDDEF0" strokeLinecap="square" />
              </TweenOne>
            </g>
            <g id="i0" transform="translate(50.000000, 276.000000)">
              <TweenOne component="g" animation={[{ delay: setAddDelay() + 200, ...animate.alpha }, { ...animate.loop, scale: 1.05 }]} style={{ transformOrigin: '50%' }}>
                <polygon id="Mask" fillOpacity="0.5" fill="#EDEFF4" points="254.649163 28 0 173.547621 197.249405 266 452 118.848173" />
              </TweenOne>
              <TweenOne component="g" animation={{ ...animate.loop, y: -15, delay: delay + duration + 200 }}>
                <TweenOne component="g" animation={{ delay, ...animate.yBig }} id="Group-16">
                  <polygon id="Mask" fill="#FFFFFF" points="254.649163 0 0 145.547621 197.249405 238 452 90.8481731" />
                  <polygon id="Path-28" fill="#E0E1E8" points="0.122802734 145.555664 0.122802734 150.526367 197.268311 243.09656 197.268311 238.031738" />
                  <polygon id="Path-28" fill="#F0F1F6" points="451.993408 90.8466492 451.993408 95.8173523 197.145508 243.540896 197.145508 238.476074" />
                </TweenOne>
                <TweenOne component="g" animation={{ delay: delay + 300, ...animate.alpha }} id="Path-15" opacity="0.5" transform="translate(167.000000, 20.000000)">
                  <mask id="mask-12" fill="white">
                    <use xlinkHref="#path-11" />
                  </mask>
                  <use id="Mask" fill="#F0F1F6" xlinkHref="#path-11" />
                  <polygon fillOpacity="0.699999988" fill="#DBDEF0" mask="url(#mask-12)" points="-10 45.6177205 91 40 86.6119791 99" />
                  <polygon fillOpacity="0.699999988" fill="#DBDEF0" mask="url(#mask-12)" points="27 63.9507389 152 57 146.569281 130" />
                </TweenOne>
                <g id="Group-14" opacity="0.5" transform="translate(131.000000, 88.000000)">
                  <TweenOne component="path" attr="attr" animation={{ delay: delay + 300, ...animate.draw }} d="M49.5,17.5 L113.5,47.5" id="Line-3" stroke="#DDDEF0" strokeWidth="3" strokeLinecap="round" />
                  <TweenOne component="path" attr="attr" animation={{ delay: delay + 350, ...animate.draw }} d="M41.5,23.5 L125.5,63.5" id="Line-3" stroke="#DDDEF0" strokeLinecap="square" />
                  <TweenOne component="path" attr="attr" animation={{ delay: delay + 400, ...animate.draw }} d="M35.5,27.5 L119.5,67.5" id="Line-3" stroke="#DDDEF0" strokeLinecap="square" />
                  <TweenOne component="path" attr="attr" animation={{ delay: delay + 450, ...animate.draw }} d="M28.5,31.5 L112.5,71.5" id="Line-3" stroke="#DDDEF0" strokeLinecap="square" />
                  <TweenOne component="g" animation={{ delay: delay + 250, ...animate.alpha }}>
                    <ellipse id="Oval-3" fill="#D5D6E2" cx="20" cy="10.5" rx="20" ry="10.5" />
                  </TweenOne>
                </g>
                <g id="Group-35" transform="translate(92.000000, 109.000000)">
                  <TweenOne component="path" attr="attr" animation={{ delay: delay + 400, ...animate.draw }} d="M49.5,17.5 L113.5,47.5" id="Line-3" stroke="#DDDEF0" strokeWidth="3" opacity="0.5" strokeLinecap="round" />
                  <TweenOne component="path" attr="attr" animation={{ delay: delay + 450, ...animate.draw }} d="M41.5,23.5 L125.5,63.5" id="Line-3" stroke="#DDDEF0" strokeLinecap="square" />
                  <TweenOne component="path" attr="attr" animation={{ delay: delay + 500, ...animate.draw }} d="M35.5,27.5 L119.5,67.5" id="Line-3" stroke="#DDDEF0" strokeLinecap="square" />
                  <TweenOne component="path" attr="attr" animation={{ delay: delay + 550, ...animate.draw }} d="M28.5,31.5 L112.5,71.5" id="Line-3" stroke="#DDDEF0" strokeLinecap="square" />
                  <TweenOne component="g" animation={{ delay: delay + 300, ...animate.alpha }}>
                    <ellipse id="Oval-3" fill="#D5D6E2" opacity="0.5" cx="20" cy="10.5" rx="20" ry="10.5" />
                  </TweenOne>
                </g>
              </TweenOne>
            </g>
            <g id="bin" transform="translate(350.000000, 355.000000)">
              <TweenOne component="g" animation={[{ delay: setAddDelay() + 200, ...animate.alpha }, { ...animate.loop, scale: 0.9 }]} style={{ transformOrigin: '50%' }}>
                <path d="M64,137 C29.2060608,137 1,122.225397 1,104 C1,85.7746033 29.2060608,71 64,71 C98.7939392,71 127,85.7746033 127,104 C127,122.225397 98.7939392,137 64,137 Z M64.5,119 C81.8969696,119 96,111.612698 96,102.5 C96,93.3873016 81.8969696,86 64.5,86 C47.1030304,86 33,93.3873016 33,102.5 C33,111.612698 47.1030304,119 64.5,119 Z" id="Combined-Shape" fillOpacity="0.800000012" fill="#F0F1F6" />
              </TweenOne>
              <TweenOne component="g" animation={[{ delay, ...animate.yBig }, { delay: 200, ...animate.loop, y: 20 }]} id="Group-23">
                <path d="M125.979738,38.9931641 C125.979739,38.9954427 125.97974,38.9977213 125.97974,39 C125.97974,57.2253967 97.7782143,72 62.9898698,72 C28.2015253,72 0,57.2253967 0,39 C0,38.6593581 0.00985178088,38.3199217 0.0294142148,37.9817647 L0.0294142148,33.0008545 L0.648899464,34.2455932 C5.0481821,18.272914 31.2832684,6 62.9898698,6 C94.9239937,6 121.307795,18.4496836 125.422167,34.5900152 L126,32.9699707 L126,38.9931641 L125.979738,38.9931641 Z M63.4897894,54 C80.8839616,54 94.9847243,46.6126984 94.9847243,37.5 C94.9847243,28.3873016 80.8839616,21 63.4897894,21 C46.0956172,21 31.9948545,28.3873016 31.9948545,37.5 C31.9948545,46.6126984 46.0956172,54 63.4897894,54 Z" id="Combined-Shape" fill="#C13B2A" />
                <path d="M124.226999,47 C125.372738,44.478525 125.979674,41.845869 125.979674,39.1381224 C125.979674,39.135811 125.979674,39.1334996 125.979673,39.1311882 L126,39.1311882 L126,33.0214471 L125.420301,34.6647701 C123.353196,26.465651 115.683011,19.2054248 104.516383,14 L93.4437125,20.5001471 L91.6580825,17.8363715 L85.0098181,19.4046688 L85.0098181,25.4512159 L85,25.4569796 C85.0032734,25.4586202 85.0065461,25.4602612 85.0098181,25.4619025 L85.0098181,25.4796154 L85.0418143,25.4779747 C91.1044231,28.5276014 94.884565,32.8382443 94.884565,37.6165688 C94.884565,39.4507033 94.3276112,41.2159311 93.2984037,42.8673856 L117.125526,46.0888287 C116.563459,44.9661227 116.296338,44.3602049 116.324165,44.2710752 C116.362449,44.1484478 117.884071,42.4016783 120.88903,39.0307667 L124.226999,40.968494 L124.226999,47 Z" id="Combined-Shape" fill="#4BD4B5" />
                <path d="M63,66 C28.2060608,66 0,51.2253967 0,33 C0,14.7746033 28.2060608,0 63,0 C97.7939392,0 126,14.7746033 126,33 C126,51.2253967 97.7939392,66 63,66 Z M63.5,48 C80.8969696,48 95,40.6126984 95,31.5 C95,22.3873016 80.8969696,15 63.5,15 C46.1030304,15 32,22.3873016 32,31.5 C32,40.6126984 46.1030304,48 63.5,48 Z" id="Combined-Shape" fill="url(#linearGradient-13)" />
                <path d="M104.526063,8 C117.692166,14.1258956 126,23.101517 126,33.1030459 C126,35.8235013 125.385335,38.4680539 124.225427,41 L93.3025197,36.8271054 C94.3322377,35.1779552 94.8894677,33.4151905 94.8894677,31.5836153 C94.8894677,26.8009977 91.0900562,22.4875571 85,19.4409931 L104.526063,8 Z" id="Combined-Shape" fill="#50DFE3" />
              </TweenOne>
            </g>
          </g>
        </g>
      </g>
    </svg>);
}
