import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Trabalho de Ensino Religioso — Jogo Medieval" },
      {
        name: "description",
        content:
          "Jogo de plataforma medieval sobre as Cruzadas: abra o baú, saia da casa, pegue o escudo templário e enfrente os soldados e o general.",
      },
      { property: "og:title", content: "Trabalho de Ensino Religioso — Jogo Medieval" },
      {
        property: "og:description",
        content:
          "Controle uma bola: explore a aldeia medieval, pegue o escudo templário e vença as batalhas até o moinho.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const CREDITS = [
  "Gustavo Mendes Pereira M\u00fcller",
  "Gabriel Nascimento Rodrigues",
  "Jo\u00e3o Victor de Souza Lima",
  "Lucas Yudi da Mata Kabu Barbosa",
  "Jo\u00e3o Ernesto Martins Borges",
];

const DIALOGUES = {
  professor: {
    name: "Professor de Ensino Religioso",
    lines: [
      "Há muito tempo, na Idade Média, houve uma guerra religiosa chamada Cruzadas.",
      "Entre nesta história e boa viagem!",
    ],
  },
  knight: {
    name: "Cavaleiro Cristão",
    lines: [
      "Nossa vila está sendo atacada!",
      "Vá até a casa com a cruz vermelha e pegue o escudo templário.",
      "Com ele você poderá prender o general na parede do moinho!",
    ],
  },
  merchant: {
    name: "Comerciante Árabe",
    lines: [
      "Este lugar está uma baderna!",
      "Soldados por todo lado... cuide-se por aí, forasteiro.",
    ],
  },
  pope: {
    name: "Papa",
    lines: ["Cuidado! Ali está o profeta Maomé!", "Ele não segue a nossa fé... Mate-o!"],
  },
  muhammad: {
    name: "Profeta Maomé",
    lines: [
      "O Papa está cego pela intolerância...",
      "O ódio dele deu vida ao Dragão Preconceito e Discriminação!",
      "Leve esta Luz Brilhante e tragam a paz de volta!",
    ],
  },
} as const;

type DlgNpc = keyof typeof DIALOGUES;
type Dlg = { npc: DlgNpc; idx: number; chars: number };

type Screen = "menu" | "game" | "credits";

const W = 900;
const H = 520;
const GROUND = H - 48;
const VILLAGE_W = 4100;

const CHEST = { x: 380, y: GROUND - 54, w: 90, h: 54 };
const DOOR = { x: 780, y: GROUND - 130, w: 76, h: 130 };

const KNIGHT_X = 760;
const SHIELD_HOUSE_X = 1205; // porta da casa do escudo (na vila)
const SOLDIER1_X = 2050;
const SOLDIER2_X = 2600;
const GENERAL_X = 3050;
const MILL_X = 3380;
const MILL_DOOR = { x: MILL_X + 6, y: GROUND - 130, w: 70, h: 130 };

// soldados muçulmanos da fase 2
const F2_SOLDIER1_X = 1200;
const F2_SOLDIER2_X = 2100;
const F2_SOLDIER3_X = 3000;
const F2_MERCHANT_X = 640; // comerciante árabe (fase 2)
const F2_POTION_HOUSE_X = 1705; // porta da casa da poção (fase 2)
const POPE_X = 3480; // papa, após os 3 soldados (fase 2)
const MUHAMMAD_X = 3580; // profeta Maomé, ao lado do papa (fase 2)
const DRAGON_X = 3900; // dragão Preconceito e Discriminação

function Index() {
  const [screen, setScreen] = useState<Screen>("menu");

  return (
    <main className="min-h-screen w-full bg-[#1a1410] text-[#f0e2c0] flex flex-col items-center justify-center gap-6 p-6 font-serif">
      <h1 className="text-3xl md:text-5xl font-bold tracking-wide text-[#e8c46a] drop-shadow-[0_3px_0_rgba(0,0,0,0.6)] text-center">
        Trabalho de Ensino Religioso
      </h1>

      {screen === "menu" && (
        <nav className="flex flex-col gap-4 w-64">
          <MenuButton onClick={() => setScreen("game")}>Jogar</MenuButton>
          <MenuButton onClick={() => setScreen("credits")}>Créditos</MenuButton>
        </nav>
      )}

      {screen === "credits" && (
        <section className="w-full max-w-xl rounded-lg border-4 border-[#5b432a] bg-[#241b13] p-8 text-center shadow-2xl">
          <h2 className="text-2xl font-bold text-[#e8c46a] mb-6">Créditos</h2>
          <ul className="space-y-3 text-lg">
            {CREDITS.map((n) => (
              <li key={n}>{n}</li>
            ))}
          </ul>
          <div className="mt-8">
            <MenuButton onClick={() => setScreen("menu")}>Voltar</MenuButton>
          </div>
        </section>
      )}

      {screen === "game" && (
        <section className="flex flex-col items-center gap-4">
          <Game onDeath={() => setScreen("menu")} />
          <p className="text-sm text-[#c2ab84] text-center">
            A / D para andar · Espaço para pular e agir · aperte E / W / Q (aura roxa / verde /
            azul) no momento do golpe para desviar ou defender
            <br />
            No celular: deslize para andar · toque com 1 dedo para pular e agir · 2 dedos = Q · 3
            dedos = W · 4 dedos = E
          </p>
          <div className="w-64">
            <MenuButton onClick={() => setScreen("menu")}>Voltar ao menu</MenuButton>
          </div>
        </section>
      )}
    </main>
  );
}

function MenuButton({ children, onClick }: { children: React.ReactNode; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="w-full rounded-md border-2 border-[#8a6a3b] bg-gradient-to-b from-[#4a3720] to-[#2c2015] px-6 py-3 text-lg font-semibold text-[#f0e2c0] shadow-[0_4px_0_#150f0a] transition-all hover:from-[#5d4629] hover:text-[#ffd97a] active:translate-y-[2px] active:shadow-[0_2px_0_#150f0a]"
    >
      {children}
    </button>
  );
}

type Ball = { x: number; y: number; vx: number; vy: number; r: number; onGround: boolean };

type Attack = { key: string; color: string; glow: string; label: string };
const ATTACKS: Attack[] = [
  { key: "e", color: "#a855f7", glow: "rgba(168,85,247,", label: "E" },
  { key: "w", color: "#22c55e", glow: "rgba(34,197,94,", label: "W" },
  { key: "q", color: "#3b82f6", glow: "rgba(59,130,246,", label: "Q" },
];

type EnemyState = "idle" | "charging" | "vulnerable" | "dizzy" | "pinned" | "gone";
type EnemyKind = "soldier" | "general" | "dragon";
type Enemy = {
  kind: EnemyKind;
  x: number;
  name: string;
  state: EnemyState;
  timer: number;
  atk: Attack;
  hits: number; // golpes já dados no ciclo
  resolved: boolean; // jogador já apertou a tecla neste golpe
  dodged: boolean;
  bucket: number;
  shieldThrow: number;
  heads: number; // cabeças restantes (apenas o dragão)
};

const DRAGON_HEAD_NAMES = ["Discriminação", "Preconceito"];

function dragonHeadName(e: Enemy): string {
  return e.heads > 0 && e.heads <= DRAGON_HEAD_NAMES.length
    ? DRAGON_HEAD_NAMES[e.heads - 1]!
    : e.name;
}

function makeEnemy(kind: EnemyKind, x: number): Enemy {
  return {
    kind,
    x,
    name:
      kind === "soldier"
        ? "Soldado Muçulmano"
        : kind === "general"
          ? "General Muçulmano"
          : "Dragão Preconceito e Discriminação",
    state: "idle",
    timer: 0,
    atk: ATTACKS[0]!,
    hits: 0,
    resolved: false,
    dodged: false,
    bucket: 0,
    shieldThrow: 0,
    heads: kind === "dragon" ? 2 : 0,
  };
}

function Game({ onDeath }: { onDeath: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const keys: Record<string, boolean> = {};
    let justPressed: Record<string, boolean> = {};
    const ball: Ball = { x: 120, y: GROUND - 18, vx: 0, vy: 0, r: 18, onGround: true };

    let phase:
      | "classroom"
      | "intro"
      | "inside"
      | "village"
      | "shieldhouse"
      | "millinside"
      | "fase2"
      | "potionhouse" = "classroom";
    let introT = 0;
    let chestOpen = 0;
    let camX = 0;
    let fade = 0;

    let hearts = 5;
    let hasShield = false;
    let hasPotion = false;
    let hasLight = false;
    let hitFlash = 0;
    let dodgeFlash = 0;
    let dead = false;
    let banner = "";
    let bannerT = 0;
    let millT = 0;
    let millStars = 5;
    let victory = false;
    let victoryT = 0;
    let victoryStars = 5;
    let dragonVisible = false;
    let dlg: Dlg | null = { npc: "professor", idx: 0, chars: 0 };

    const startDlg = (npc: DlgNpc) => {
      dlg = { npc, idx: 0, chars: 0 };
    };

    const advanceDlg = () => {
      const d = dlg;
      if (!d) return;
      const full = DIALOGUES[d.npc].lines[d.idx]!;
      if (d.chars < full.length) {
        d.chars = full.length;
        return;
      }
      d.idx += 1;
      d.chars = 0;
      if (d.idx < DIALOGUES[d.npc].lines.length) return;
      dlg = null;
      if (d.npc === "professor") {
        phase = "intro";
        introT = 0;
        fade = 1;
      } else if (d.npc === "pope") {
        dragonVisible = true;
        say("O Dragão Preconceito e Discriminação apareceu!");
      } else if (d.npc === "muhammad" && !hasLight) {
        hasLight = true;
        say("Você recebeu a Luz Brilhante!");
      }
    };

    const CHARGE = 120; // 2s para carregar o golpe
    const VULN = 240; // 4s vulnerável
    const DIZZY = 180; // 3s tonto

    const villageEnemies: Enemy[] = [
      makeEnemy("soldier", SOLDIER1_X),
      makeEnemy("soldier", SOLDIER2_X),
      makeEnemy("general", GENERAL_X),
    ];
    const fase2Enemies: Enemy[] = [
      makeEnemy("soldier", F2_SOLDIER1_X),
      makeEnemy("soldier", F2_SOLDIER2_X),
      makeEnemy("soldier", F2_SOLDIER3_X),
      makeEnemy("dragon", DRAGON_X),
    ];
    const general = villageEnemies[2]!;
    const soldiersDefeated = () =>
      fase2Enemies.filter((en) => en.kind === "soldier").every((en) => en.state === "gone");
    let enemies = villageEnemies;
    let current = 0;

    const activeEnemy = (): Enemy | null => {
      if (phase !== "village" && phase !== "fase2") return null;
      const e = enemies[current];
      return e && e.state !== "gone" ? e : null;
    };

    const down = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      if (
        [" ", "a", "d", "e", "q", "r", "s", "w", "arrowleft", "arrowright", "arrowup"].includes(k)
      )
        e.preventDefault();
      if (!keys[k]) justPressed[k] = true;
      keys[k] = true;
    };
    const up = (e: KeyboardEvent) => {
      keys[e.key.toLowerCase()] = false;
    };
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);

    // ---- controles de toque (celular) ----
    // deslize com 1 dedo: andar · toque com 1 dedo: pular/agir
    // 2 dedos = Q · 3 dedos = W · 4 dedos = E
    const SWIPE = 30;
    let touchStart: { x: number; y: number; t: number } | null = null;
    let touchLast = { x: 0, y: 0 };
    let maxTouches = 0;
    let dodgeTimer: ReturnType<typeof setTimeout> | null = null;

    const touchKey = (fingers: number) =>
      fingers === 2 ? "q" : fingers === 3 ? "w" : fingers === 4 ? "e" : null;

    const onTouchStart = (ev: TouchEvent) => {
      ev.preventDefault();
      if (ev.touches.length === 1) {
        const t0 = ev.touches[0]!;
        touchStart = { x: t0.clientX, y: t0.clientY, t: performance.now() };
        touchLast = { x: t0.clientX, y: t0.clientY };
        maxTouches = 1;
      } else {
        touchStart = null;
        keys["a"] = false;
        keys["d"] = false;
        maxTouches = Math.max(maxTouches, ev.touches.length);
        if (dodgeTimer) clearTimeout(dodgeTimer);
        dodgeTimer = setTimeout(() => {
          dodgeTimer = null;
          const k = touchKey(maxTouches);
          maxTouches = 0;
          if (!k) return;
          justPressed[k] = true;
          keys[k] = true;
          setTimeout(() => {
            keys[k] = false;
          }, 120);
        }, 90);
      }
    };

    const onTouchMove = (ev: TouchEvent) => {
      ev.preventDefault();
      if (ev.touches.length !== 1 || !touchStart) return;
      const t0 = ev.touches[0]!;
      touchLast = { x: t0.clientX, y: t0.clientY };
      const dx = t0.clientX - touchStart.x;
      keys["a"] = dx < -SWIPE;
      keys["d"] = dx > SWIPE;
    };

    const onTouchEnd = (ev: TouchEvent) => {
      ev.preventDefault();
      if (ev.touches.length > 0) return;
      keys["a"] = false;
      keys["d"] = false;
      if (touchStart) {
        const dur = performance.now() - touchStart.t;
        const moved = Math.hypot(touchLast.x - touchStart.x, touchLast.y - touchStart.y);
        touchStart = null;
        if (dur < 350 && moved < SWIPE) {
          justPressed[" "] = true;
          keys[" "] = true;
          setTimeout(() => {
            keys[" "] = false;
          }, 120);
        }
      }
    };

    canvas.addEventListener("touchstart", onTouchStart, { passive: false });
    canvas.addEventListener("touchmove", onTouchMove, { passive: false });
    canvas.addEventListener("touchend", onTouchEnd, { passive: false });
    canvas.addEventListener("touchcancel", onTouchEnd, { passive: false });

    let raf = 0;
    let t = 0;

    const say = (text: string) => {
      banner = text;
      bannerT = 150;
    };

    const physics = (worldW: number, frozen: boolean) => {
      const left = !frozen && (keys["a"] || keys["arrowleft"]);
      const right = !frozen && (keys["d"] || keys["arrowright"]);
      if (left) ball.vx -= 0.8;
      if (right) ball.vx += 0.8;
      ball.vx *= frozen ? 0.7 : 0.86;
      if (Math.abs(ball.vx) > 6.5) ball.vx = Math.sign(ball.vx) * 6.5;

      if (!frozen && (keys[" "] || keys["arrowup"]) && ball.onGround) {
        const e = activeEnemy();
        if (!e || e.state === "idle") {
          ball.vy = -13.5;
          ball.onGround = false;
        }
      }

      ball.vy += 0.6;
      if (ball.vy > 18) ball.vy = 18;

      ball.x += ball.vx;
      if (ball.x - ball.r < 0) {
        ball.x = ball.r;
        ball.vx = 0;
      }
      if (ball.x + ball.r > worldW) {
        ball.x = worldW - ball.r;
        ball.vx = 0;
      }
      const e = activeEnemy();
      if (e && e.state !== "gone" && ball.x > e.x - 80) {
        ball.x = e.x - 80;
        ball.vx = 0;
      }

      ball.y += ball.vy;
      if (ball.y + ball.r >= GROUND) {
        ball.y = GROUND - ball.r;
        ball.vy = 0;
        ball.onGround = true;
      }
      if (ball.y - ball.r < 0) {
        ball.y = ball.r;
        ball.vy = 0;
      }
    };

    const takeHit = (amount: number) => {
      hearts -= amount;
      hitFlash = 24;
      if (hearts <= 0) {
        hearts = 0;
        dead = true;
        setTimeout(onDeath, 1200);
      }
    };

    const pickAttack = () => ATTACKS[Math.floor(Math.random() * ATTACKS.length)]!;

    const combat = () => {
      if (dead) return;
      if (hitFlash > 0) hitFlash--;
      if (dodgeFlash > 0) dodgeFlash--;

      const e = enemies[current];
      if (!e) return;
      if (e.kind === "dragon" && !dragonVisible) return;
      if (e.bucket > 0) e.bucket--;
      if (e.shieldThrow > 0) e.shieldThrow++;

      if (e.state === "idle") {
        // o dragão só se aproxima depois do Papa (gatilho mais curto)
        const trig = e.kind === "dragon" ? 200 : 420;
        if (ball.x > e.x - trig) {
          e.state = "charging";
          e.timer = 0;
          e.hits = 0;
          e.resolved = false;
          e.atk = pickAttack();
          say(
            e.kind === "dragon"
              ? "O Dragão Preconceito e Discriminação apareceu!"
              : e.name + " apareceu!",
          );
        }
        return;
      }
      if (e.state === "gone") return;

      e.timer++;

      if (e.state === "charging") {
        if (!e.resolved) {
          for (const a of ATTACKS) {
            if (justPressed[a.key]) {
              e.resolved = true;
              e.dodged = a.key === e.atk.key;
              break;
            }
          }
        }
        if (e.timer >= CHARGE) {
          if (e.dodged) dodgeFlash = 30;
          else takeHit(e.kind === "dragon" ? 3 : e.kind === "general" ? 2 : 1);
          e.hits++;
          e.timer = 0;
          e.resolved = false;
          e.dodged = false;
          e.atk = pickAttack();
          if (e.hits >= 3) {
            e.state = "vulnerable";
            e.timer = 0;
          }
        }
      } else if (e.state === "vulnerable") {
        if (justPressed[" "]) {
          if (e.kind === "soldier") {
            e.state = "dizzy";
            e.timer = 0;
            e.bucket = 40;
          } else if (e.kind === "dragon") {
            if (hasLight) {
              e.heads -= 1;
              dodgeFlash = 30;
              if (e.heads <= 0) {
                e.state = "gone";
                victory = true;
                victoryT = 0;
                victoryStars = Math.max(1, Math.min(5, hearts));
              } else {
                e.state = "charging";
                e.timer = 0;
                e.hits = 0;
                e.resolved = false;
                e.dodged = false;
                e.atk = pickAttack();
                say(`Cabeça derrotada! Faltam ${e.heads}.`);
              }
            } else {
              say("Sem a Luz Brilhante você não pode derrotá-lo!");
            }
          } else if (hasShield) {
            e.state = "pinned";
            e.timer = 0;
            e.shieldThrow = 1;
            hasShield = false;
            say("O escudo prendeu o general na parede do moinho!");
          } else {
            say("Sem o escudo templário você não pode derrotá-lo!");
          }
        }
        if (e.timer >= VULN) {
          e.state = "charging";
          e.timer = 0;
          e.hits = 0;
          e.resolved = false;
          e.dodged = false;
          e.atk = pickAttack();
        }
      } else if (e.state === "dizzy") {
        if (e.timer >= DIZZY) {
          e.state = "gone";
          current = Math.min(current + 1, enemies.length - 1);
          if (enemies === fase2Enemies && soldiersDefeated()) {
            say("Soldados derrotados! Procure o Papa →");
          } else {
            say("Inimigo derrotado!");
          }
        }
      } else if (e.state === "pinned") {
        if (e.timer >= 150) {
          e.state = "gone";
          say("Entre no moinho para a próxima fase!");
        }
      }
    };

    const step = () => {
      t += 1;
      if (bannerT > 0) bannerT--;

      if (justPressed["r"] && hasPotion) {
        hearts = Math.min(5, hearts + 3);
        hasPotion = false;
        say("A poção recuperou 3 corações!");
      }

      // progressão dos diálogos (caixa de texto na parte inferior)
      if (dlg) {
        dlg.chars += 1;
        if (justPressed["s"] || justPressed[" "]) advanceDlg();
      }

      if (phase === "classroom") {
        drawClassroom(ctx, t);
        if (dlg) drawDialog(ctx, dlg);
      } else if (phase === "intro") {
        introT += 1;
        const target = CHEST.x - 24;
        if (introT < 90) {
          if (ball.x < target) ball.x += 2.4;
        } else if (introT < 150) {
          chestOpen = Math.min(1, (introT - 90) / 45);
          if (introT === 120) ball.vy = -11;
        } else {
          phase = "inside";
        }
        ball.vy += 0.6;
        ball.y += ball.vy;
        if (ball.y + ball.r >= GROUND) {
          ball.y = GROUND - ball.r;
          ball.vy = 0;
        }
        drawInside(ctx, ball, t, chestOpen, introT);
      } else if (phase === "inside") {
        chestOpen = 1;
        physics(W, false);
        if (
          ball.x + ball.r > DOOR.x + 20 &&
          ball.y + ball.r > DOOR.y &&
          ball.y - ball.r < DOOR.y + DOOR.h
        ) {
          phase = "village";
          fade = 1;
          ball.x = 200;
          ball.y = GROUND - ball.r;
          ball.vx = 0;
          ball.vy = 0;
        }
        drawInside(ctx, ball, t, chestOpen, introT);
      } else if (phase === "shieldhouse") {
        physics(W, false);
        // pedestal sólido: dá para subir pulando em cima dele
        if (
          ball.vy >= 0 &&
          ball.x + ball.r > 410 &&
          ball.x - ball.r < 510 &&
          ball.y + ball.r > GROUND - 68 &&
          ball.y + ball.r < GROUND
        ) {
          ball.y = GROUND - 68 - ball.r;
          ball.vy = 0;
          ball.onGround = true;
        }
        drawShieldHouse(ctx, ball, t, hasShield);
        // pega o escudo encostando nele; do chão não alcança, é preciso pular
        if (!hasShield && Math.abs(ball.x - 460) < 60 && Math.abs(ball.y - (GROUND - 120)) < 60) {
          hasShield = true;
          say("Escudo templário obtido!");
        }
        if (!hasShield && Math.abs(ball.x - 460) < 70) {
          hintText(ctx, "Pule no escudo para pegá-lo!");
        }
        if (ball.x < 90) {
          phase = "village";
          fade = 1;
          ball.x = SHIELD_HOUSE_X + 60;
          ball.vx = 0;
        }
        if (hasShield) hintText(ctx, "Volte pela porta à esquerda ←");
      } else if (phase === "potionhouse") {
        physics(W, false);
        // pedestal sólido: dá para subir pulando em cima dele
        if (
          ball.vy >= 0 &&
          ball.x + ball.r > 410 &&
          ball.x - ball.r < 510 &&
          ball.y + ball.r > GROUND - 68 &&
          ball.y + ball.r < GROUND
        ) {
          ball.y = GROUND - 68 - ball.r;
          ball.vy = 0;
          ball.onGround = true;
        }
        drawPotionHouse(ctx, ball, t, hasPotion);
        if (!hasPotion && Math.abs(ball.x - 460) < 60 && Math.abs(ball.y - (GROUND - 120)) < 60) {
          hasPotion = true;
          say("Poção obtida! Aperte R para beber");
        }
        if (!hasPotion && Math.abs(ball.x - 460) < 70) {
          hintText(ctx, "Pule na poção para pegá-la!");
        }
        if (ball.x < 90) {
          phase = "fase2";
          fade = 1;
          ball.x = F2_POTION_HOUSE_X + 60;
          ball.vx = 0;
        }
        if (hasPotion) hintText(ctx, "Volte pela porta à esquerda ←");
      } else if (phase === "millinside") {
        millT++;
        drawMillInside(ctx, ball, millT, millStars, t);
        if (millT > 216 && justPressed[" "]) {
          phase = "fase2";
          fade = 1;
          enemies = fase2Enemies;
          current = 0;
          ball.x = 160;
          ball.y = GROUND - ball.r;
          ball.vx = 0;
          ball.vy = 0;
          say("Fase 2 — outra parte da aldeia medieval");
        }
      } else if (phase === "village" || phase === "fase2") {
        const e = activeEnemy();
        const inDlg = !!dlg;
        const frozen = inDlg || (!!e && (e.state === "charging" || e.state === "vulnerable"));
        if (!dead) physics(VILLAGE_W, frozen);
        if (!inDlg) combat();

        // iniciar diálogo com NPCs: aperte S perto do mais próximo
        if (!dlg) {
          let npc: DlgNpc | null = null;
          let best = 120;
          const consider = (n: DlgNpc, x: number) => {
            const dist = Math.abs(ball.x - x);
            if (dist < best) {
              best = dist;
              npc = n;
            }
          };
          if (phase === "village") consider("knight", KNIGHT_X);
          if (phase === "fase2") consider("merchant", F2_MERCHANT_X);
          if (phase === "fase2" && soldiersDefeated()) {
            consider("pope", POPE_X);
            consider("muhammad", MUHAMMAD_X);
          }
          if (npc) {
            hintText(ctx, "Aperte S (ou toque) para conversar");
            if (justPressed["s"] || justPressed[" "]) startDlg(npc);
          }
        }

        camX = Math.max(0, Math.min(VILLAGE_W - W, ball.x - W / 2));
        drawVillage(ctx, ball, t, camX, phase === "fase2");

        if (phase === "village") {
          drawKnight(ctx, camX, t, ball);
          drawShieldHouse2D(ctx, camX, t);
          drawMill(ctx, camX, general);
          for (const en of enemies) drawEnemy(ctx, camX, t, en);

          // entrar na casa do escudo (dá para entrar antes de enfrentar os soldados)
          if (!dlg && Math.abs(ball.x - SHIELD_HOUSE_X) < 55) {
            hintText(ctx, "Aperte ESPAÇO para entrar na casa");
            if (justPressed[" "]) {
              phase = "shieldhouse";
              fade = 1;
              ball.x = 180;
              ball.y = GROUND - ball.r;
              ball.vx = 0;
              ball.vy = 0;
            }
          }

          // entrar no moinho
          if (
            !dlg &&
            general.state === "gone" &&
            Math.abs(ball.x - (MILL_DOOR.x + MILL_DOOR.w / 2)) < 50
          ) {
            hintText(ctx, "Aperte ESPAÇO para entrar no moinho");
            if (justPressed[" "]) {
              phase = "millinside";
              fade = 1;
              millT = 0;
              millStars = Math.max(1, Math.min(5, hearts));
              ball.x = W / 2;
              ball.y = GROUND - ball.r;
              ball.vx = 0;
              ball.vy = 0;
            }
          }
        } else {
          drawMillExit(ctx, camX);
          drawPotionHouse2D(ctx, camX, t);
          drawMerchant(ctx, camX, t, ball);
          if (soldiersDefeated()) {
            drawPope(ctx, camX, t, ball);
            drawMuhammad(ctx, camX, t, ball);
          }
          for (const en of enemies) {
            if (en.kind !== "dragon" || dragonVisible) drawEnemy(ctx, camX, t, en);
          }

          // entrar na casa da poção
          if (!dlg && Math.abs(ball.x - F2_POTION_HOUSE_X) < 55) {
            hintText(ctx, "Aperte ESPAÇO para entrar na casa da poção");
            if (justPressed[" "]) {
              phase = "potionhouse";
              fade = 1;
              ball.x = 180;
              ball.y = GROUND - ball.r;
              ball.vx = 0;
              ball.vy = 0;
            }
          }

          if (victory) {
            victoryT++;
            drawVictory(ctx, victoryT, victoryStars);
            if (victoryT > 90 && justPressed[" "]) onDeath();
          }
        }

        // bola sempre visível na frente das casas e NPCs
        drawBall(ctx, ball.x - camX, ball.y, ball.r);
        drawHud(
          ctx,
          hearts,
          hasShield,
          phase === "village" ? enemies[current]! : (enemies[current] ?? null),
          hasLight,
          hasPotion,
        );
        if (dlg) drawDialog(ctx, dlg);

        if (hitFlash > 0) {
          ctx.fillStyle = `rgba(180,20,20,${(hitFlash / 24) * 0.4})`;
          ctx.fillRect(0, 0, W, H);
        }
        if (dodgeFlash > 0) {
          ctx.fillStyle = `rgba(255,255,255,${(dodgeFlash / 30) * 0.25})`;
          ctx.fillRect(0, 0, W, H);
        }
        if (dead) {
          ctx.fillStyle = "rgba(0,0,0,0.65)";
          ctx.fillRect(0, 0, W, H);
          ctx.fillStyle = "#d1442f";
          ctx.font = "bold 40px serif";
          ctx.textAlign = "center";
          ctx.fillText("Você caiu...", W / 2, H / 2);
          ctx.textAlign = "left";
        }
      }

      if (bannerT > 0 && banner) {
        ctx.fillStyle = "rgba(0,0,0,0.55)";
        ctx.fillRect(0, H - 92, W, 40);
        ctx.fillStyle = "#e8c46a";
        ctx.font = "bold 22px serif";
        ctx.textAlign = "center";
        ctx.fillText(banner, W / 2, H - 64);
        ctx.textAlign = "left";
      }

      if (fade > 0) {
        ctx.fillStyle = `rgba(0,0,0,${fade})`;
        ctx.fillRect(0, 0, W, H);
        fade -= 0.02;
      }

      justPressed = {};
      raf = requestAnimationFrame(step);
    };

    raf = requestAnimationFrame(step);
    return () => {
      cancelAnimationFrame(raf);
      if (dodgeTimer) clearTimeout(dodgeTimer);
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
      canvas.removeEventListener("touchstart", onTouchStart);
      canvas.removeEventListener("touchmove", onTouchMove);
      canvas.removeEventListener("touchend", onTouchEnd);
      canvas.removeEventListener("touchcancel", onTouchEnd);
    };
  }, [onDeath]);

  return (
    <canvas
      ref={canvasRef}
      width={W}
      height={H}
      tabIndex={0}
      aria-label="Área de jogo: bola em uma casa medieval e aldeia"
      className="max-w-full touch-none select-none rounded-lg border-4 border-[#5b432a] shadow-2xl outline-none"
    />
  );
}

function hintText(ctx: CanvasRenderingContext2D, text: string) {
  ctx.fillStyle = "rgba(0,0,0,0.5)";
  ctx.font = "18px serif";
  const w = ctx.measureText(text).width + 30;
  ctx.fillRect(W / 2 - w / 2, H - 150, w, 32);
  ctx.fillStyle = "#f0e2c0";
  ctx.textAlign = "center";
  ctx.fillText(text, W / 2, H - 128);
  ctx.textAlign = "left";
}

function drawBall(ctx: CanvasRenderingContext2D, x: number, y: number, r: number) {
  const grad = ctx.createRadialGradient(x - 6, y - 7, 3, x, y, r);
  grad.addColorStop(0, "#ffe8a8");
  grad.addColorStop(1, "#d1442f");
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "#3b1a12";
  ctx.lineWidth = 3;
  ctx.stroke();
}

function drawTemplarShield(ctx: CanvasRenderingContext2D, x: number, y: number, s: number) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(s, s);
  // "dentes" na parte superior
  ctx.fillStyle = "#b9c2cc";
  for (let i = 0; i < 4; i++) {
    ctx.beginPath();
    ctx.moveTo(-28 + i * 14, -30);
    ctx.lineTo(-21 + i * 14, -47);
    ctx.lineTo(-14 + i * 14, -30);
    ctx.closePath();
    ctx.fill();
  }
  ctx.fillStyle = "#f2ece0";
  ctx.beginPath();
  ctx.moveTo(-28, -30);
  ctx.lineTo(28, -30);
  ctx.lineTo(28, 8);
  ctx.lineTo(0, 34);
  ctx.lineTo(-28, 8);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = "#8a6a3b";
  ctx.lineWidth = 3;
  ctx.stroke();
  ctx.fillStyle = "#b3352f";
  ctx.fillRect(-4, -24, 8, 46);
  ctx.fillRect(-20, -8, 40, 8);
  ctx.restore();
}

function drawTorch(ctx: CanvasRenderingContext2D, tx: number, ty: number, t: number) {
  ctx.fillStyle = "#2a2119";
  ctx.fillRect(tx - 5, ty, 10, 34);
  const flick = 6 * Math.sin(t / 6 + tx);
  const g = ctx.createRadialGradient(tx, ty - 8, 2, tx, ty - 8, 46 + flick);
  g.addColorStop(0, "rgba(255,196,90,0.85)");
  g.addColorStop(1, "rgba(255,150,40,0)");
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.arc(tx, ty - 8, 46 + flick, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#ffb340";
  ctx.beginPath();
  ctx.ellipse(tx, ty - 12, 7, 14 + flick / 3, 0, 0, Math.PI * 2);
  ctx.fill();
}

function stoneRoom(ctx: CanvasRenderingContext2D) {
  ctx.fillStyle = "#3a3129";
  ctx.fillRect(0, 0, W, H);
  ctx.strokeStyle = "rgba(0,0,0,0.28)";
  ctx.lineWidth = 2;
  const bw = 76;
  const bh = 38;
  for (let row = 0; row * bh < H; row++) {
    const off = row % 2 === 0 ? 0 : bw / 2;
    for (let x = -bw; x < W + bw; x += bw) {
      ctx.strokeRect(x + off, row * bh, bw, bh);
    }
  }
  ctx.fillStyle = "#4b3f31";
  ctx.fillRect(0, GROUND, W, H - GROUND);
  ctx.fillStyle = "rgba(255,255,255,0.10)";
  ctx.fillRect(0, GROUND, W, 5);
}

function drawInside(
  ctx: CanvasRenderingContext2D,
  ball: Ball,
  t: number,
  chestOpen: number,
  introT: number,
) {
  stoneRoom(ctx);

  const drawWindow = (wx: number, wy: number) => {
    ctx.beginPath();
    ctx.moveTo(wx, wy + 90);
    ctx.lineTo(wx, wy + 34);
    ctx.arc(wx + 26, wy + 34, 26, Math.PI, 0);
    ctx.lineTo(wx + 52, wy + 90);
    ctx.closePath();
    ctx.fillStyle = "#7fa8c9";
    ctx.fill();
    ctx.strokeStyle = "#241b13";
    ctx.lineWidth = 6;
    ctx.stroke();
  };
  drawWindow(140, 60);
  drawWindow(560, 60);

  drawTorch(ctx, 300, 120, t);
  drawTorch(ctx, 680, 120, t);

  ctx.fillStyle = "#6b4a2a";
  ctx.fillRect(DOOR.x, DOOR.y, DOOR.w, DOOR.h);
  ctx.strokeStyle = "#2a1c10";
  ctx.lineWidth = 5;
  ctx.strokeRect(DOOR.x, DOOR.y, DOOR.w, DOOR.h);
  ctx.fillStyle = "#3b2a17";
  for (let i = 1; i < 4; i++) {
    ctx.fillRect(DOOR.x + (i * DOOR.w) / 4 - 2, DOOR.y, 4, DOOR.h);
  }
  ctx.fillStyle = "#e8c46a";
  ctx.beginPath();
  ctx.arc(DOOR.x + DOOR.w - 14, DOOR.y + DOOR.h / 2, 5, 0, Math.PI * 2);
  ctx.fill();

  const lidAngle = -chestOpen * 1.5;
  if (chestOpen > 0.15) {
    const g = ctx.createRadialGradient(
      CHEST.x + CHEST.w / 2,
      CHEST.y,
      4,
      CHEST.x + CHEST.w / 2,
      CHEST.y,
      120,
    );
    g.addColorStop(0, `rgba(255,220,120,${0.6 * chestOpen})`);
    g.addColorStop(1, "rgba(255,200,80,0)");
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(CHEST.x + CHEST.w / 2, CHEST.y, 120, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.save();
  ctx.translate(CHEST.x, CHEST.y);
  ctx.rotate(lidAngle);
  ctx.fillStyle = "#7a5326";
  ctx.fillRect(0, -18, CHEST.w, 18);
  ctx.strokeStyle = "#2a1c10";
  ctx.lineWidth = 4;
  ctx.strokeRect(0, -18, CHEST.w, 18);
  ctx.restore();
  ctx.fillStyle = "#6b4a2a";
  ctx.fillRect(CHEST.x, CHEST.y, CHEST.w, CHEST.h);
  ctx.strokeStyle = "#2a1c10";
  ctx.lineWidth = 4;
  ctx.strokeRect(CHEST.x, CHEST.y, CHEST.w, CHEST.h);
  ctx.fillStyle = "#c9a24a";
  ctx.fillRect(CHEST.x + CHEST.w / 2 - 7, CHEST.y + 12, 14, 18);

  drawBall(ctx, ball.x, ball.y, ball.r);

  if (introT >= 150) {
    ctx.fillStyle = "rgba(240,226,192,0.85)";
    ctx.font = "20px serif";
    ctx.textAlign = "center";
    ctx.fillText("Vá até a porta →", W / 2, 60);
    ctx.textAlign = "left";
  }
}

function drawShieldHouse(ctx: CanvasRenderingContext2D, ball: Ball, t: number, taken: boolean) {
  stoneRoom(ctx);
  drawTorch(ctx, 220, 140, t);
  drawTorch(ctx, 700, 140, t);

  // porta de saída à esquerda
  ctx.fillStyle = "#6b4a2a";
  ctx.fillRect(20, GROUND - 130, 70, 130);
  ctx.strokeStyle = "#2a1c10";
  ctx.lineWidth = 5;
  ctx.strokeRect(20, GROUND - 130, 70, 130);

  // pedestal
  ctx.fillStyle = "#7a736a";
  ctx.fillRect(420, GROUND - 60, 80, 60);
  ctx.fillStyle = "#948c81";
  ctx.fillRect(410, GROUND - 68, 100, 12);

  if (!taken) {
    const g = ctx.createRadialGradient(460, GROUND - 120, 6, 460, GROUND - 120, 120);
    g.addColorStop(0, "rgba(255,230,150,0.55)");
    g.addColorStop(1, "rgba(255,200,80,0)");
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(460, GROUND - 120, 120, 0, Math.PI * 2);
    ctx.fill();
    drawTemplarShield(ctx, 460, GROUND - 120 + Math.sin(t / 25) * 5, 1.1);
  }

  drawBall(ctx, ball.x, ball.y, ball.r);

  ctx.fillStyle = "rgba(240,226,192,0.85)";
  ctx.font = "20px serif";
  ctx.textAlign = "center";
  ctx.fillText("Casa do Escudo Templário", W / 2, 54);
  ctx.textAlign = "left";
}

function drawVillageHouse(
  ctx: CanvasRenderingContext2D,
  bx: number,
  bh2: number,
  t: number,
  i: number,
) {
  const by = GROUND - bh2;

  ctx.fillStyle = "#8f8a7a";
  ctx.fillRect(bx, GROUND - 40, 170, 40);
  ctx.strokeStyle = "rgba(0,0,0,0.25)";
  ctx.lineWidth = 2;
  for (let sy = GROUND - 40; sy < GROUND; sy += 13) {
    for (let sx = bx; sx < bx + 170; sx += 28) {
      ctx.strokeRect(sx, sy, 28, 13);
    }
  }

  ctx.fillStyle = i % 2 === 0 ? "#e6dcc4" : "#dbcfae";
  ctx.fillRect(bx - 10, by, 190, bh2 - 40);
  ctx.strokeStyle = "#4a3520";
  ctx.lineWidth = 3;
  ctx.strokeRect(bx - 10, by, 190, bh2 - 40);

  ctx.strokeStyle = "#5b3f24";
  ctx.lineWidth = 7;
  ctx.beginPath();
  ctx.moveTo(bx - 10, by + 26);
  ctx.lineTo(bx + 180, by + 26);
  ctx.moveTo(bx + 40, by);
  ctx.lineTo(bx + 40, GROUND - 40);
  ctx.moveTo(bx + 130, by);
  ctx.lineTo(bx + 130, GROUND - 40);
  ctx.moveTo(bx + 40, by + 26);
  ctx.lineTo(bx + 130, GROUND - 40);
  ctx.moveTo(bx + 130, by + 26);
  ctx.lineTo(bx + 40, GROUND - 40);
  ctx.stroke();

  ctx.fillStyle = i % 3 === 0 ? "#9c7a3f" : "#7d4a34";
  ctx.beginPath();
  ctx.moveTo(bx - 26, by + 4);
  ctx.lineTo(bx + 85, by - 74);
  ctx.lineTo(bx + 196, by + 4);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = "rgba(0,0,0,0.3)";
  ctx.lineWidth = 3;
  ctx.stroke();

  ctx.fillStyle = "#7a7266";
  ctx.fillRect(bx + 140, by - 60, 22, 46);
  ctx.fillStyle = "rgba(230,230,230,0.35)";
  ctx.beginPath();
  ctx.arc(bx + 151 + Math.sin((t + i * 20) / 30) * 8, by - 80, 12, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#5c3d21";
  ctx.beginPath();
  ctx.moveTo(bx + 62, GROUND);
  ctx.lineTo(bx + 62, GROUND - 40);
  ctx.arc(bx + 85, GROUND - 40, 23, Math.PI, 0);
  ctx.lineTo(bx + 108, GROUND);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = "#2a1c10";
  ctx.lineWidth = 3;
  ctx.stroke();

  ctx.fillStyle = "#3c2a18";
  ctx.fillRect(bx + 6, by + 44, 32, 30);
  ctx.fillRect(bx + 142, by + 44, 32, 30);
  ctx.fillStyle = "#f2c96a";
  ctx.fillRect(bx + 10, by + 48, 24, 22);
  ctx.fillRect(bx + 146, by + 48, 24, 22);

  if (i % 3 === 1) {
    ctx.fillStyle = "#8c2b2b";
    ctx.beginPath();
    ctx.moveTo(bx + 176, by + 10);
    ctx.lineTo(bx + 206, by + 20);
    ctx.lineTo(bx + 176, by + 46);
    ctx.closePath();
    ctx.fill();
  }
}

function drawVillage(
  ctx: CanvasRenderingContext2D,
  ball: Ball,
  t: number,
  camX: number,
  fase2: boolean,
) {
  const sky = ctx.createLinearGradient(0, 0, 0, GROUND);
  sky.addColorStop(0, fase2 ? "#8a6f9c" : "#6f9dc4");
  sky.addColorStop(1, fase2 ? "#e0c8a8" : "#cfd9c8");
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, W, H);

  ctx.fillStyle = fase2 ? "#6e7a63" : "#7f8f6d";
  for (let i = 0; i < 12; i++) {
    const hx = i * 400 - camX * 0.3;
    ctx.beginPath();
    ctx.arc(hx, GROUND + 20, 180, Math.PI, 0);
    ctx.fill();
  }

  const cx = 1200 - camX * 0.5;
  ctx.fillStyle = "#8d8778";
  ctx.fillRect(cx, GROUND - 210, 260, 210);
  for (let i = 0; i < 3; i++) {
    const tx = cx - 30 + i * 130;
    ctx.fillRect(tx, GROUND - 270, 60, 270);
    ctx.fillStyle = "#6d4a3a";
    ctx.beginPath();
    ctx.moveTo(tx - 8, GROUND - 270);
    ctx.lineTo(tx + 30, GROUND - 320);
    ctx.lineTo(tx + 68, GROUND - 270);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = "#8d8778";
  }

  ctx.save();
  ctx.translate(-camX, 0);

  const seed = fase2 ? 5 : 0;
  for (let i = 0; i < 14; i++) {
    if (fase2 ? i === 6 : i === 4) continue; // vagas da casa do escudo (fase 1) e da poção (fase 2)
    const bx = 120 + i * 250;
    const bh2 = 140 + (((i + seed) * 37) % 60);
    drawVillageHouse(ctx, bx, bh2, t, i);
  }

  const px = VILLAGE_W / 2;
  ctx.fillStyle = "#7a736a";
  ctx.fillRect(px - 45, GROUND - 46, 90, 46);
  ctx.fillStyle = "#3a3129";
  ctx.fillRect(px - 30, GROUND - 40, 60, 26);
  ctx.strokeStyle = "#5b432a";
  ctx.lineWidth = 7;
  ctx.beginPath();
  ctx.moveTo(px - 40, GROUND - 46);
  ctx.lineTo(px, GROUND - 110);
  ctx.lineTo(px + 40, GROUND - 46);
  ctx.stroke();

  ctx.fillStyle = "#6d5a3c";
  ctx.fillRect(0, GROUND, VILLAGE_W, H - GROUND);
  ctx.fillStyle = "#4e7a3a";
  ctx.fillRect(0, GROUND, VILLAGE_W, 8);
  ctx.fillStyle = "rgba(0,0,0,0.18)";
  for (let x = 0; x < VILLAGE_W; x += 60) {
    ctx.fillRect(x, GROUND + 20, 34, 6);
  }

  ctx.restore();

  ctx.fillStyle = "rgba(0,0,0,0.35)";
  ctx.fillRect(20, 50, 200, 10);
  ctx.fillStyle = "#e8c46a";
  ctx.fillRect(20, 50, 200 * (ball.x / VILLAGE_W), 10);
}

function drawTalkPrompt(ctx: CanvasRenderingContext2D, x: number, y: number, t: number) {
  const bob = Math.sin(t / 15) * 3;
  ctx.fillStyle = "#e8c46a";
  ctx.strokeStyle = "#4a3520";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(x, y + bob, 12, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = "#241b13";
  ctx.font = "bold 14px serif";
  ctx.textAlign = "center";
  ctx.fillText("S", x, y + bob + 5);
  ctx.textAlign = "left";
}

function drawDialog(ctx: CanvasRenderingContext2D, dlg: Dlg) {
  const d = DIALOGUES[dlg.npc];
  const full = d.lines[dlg.idx]!;
  const shown = full.slice(0, Math.floor(dlg.chars));

  const bx = 40;
  const bw = W - 80;
  const bh = 88;
  const by = H - bh - 12;
  ctx.fillStyle = "rgba(20,14,8,0.92)";
  ctx.strokeStyle = "#e8c46a";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.roundRect(bx, by, bw, bh, 10);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = "#e8c46a";
  ctx.font = "bold 18px serif";
  ctx.fillText(d.name, bx + 20, by + 28);

  ctx.fillStyle = "#f0e2c0";
  ctx.font = "18px serif";
  const maxW = bw - 40;
  const words = shown.split(" ");
  let line = "";
  let ly = by + 54;
  for (const w of words) {
    const test = line ? line + " " + w : w;
    if (ctx.measureText(test).width > maxW && line) {
      ctx.fillText(line, bx + 20, ly);
      line = w;
      ly += 24;
    } else {
      line = test;
    }
  }
  ctx.fillText(line, bx + 20, ly);

  if (shown.length >= full.length) {
    ctx.fillStyle = `rgba(232,196,106,${0.5 + 0.5 * Math.sin(performance.now() / 200)})`;
    ctx.font = "bold 15px serif";
    ctx.textAlign = "right";
    ctx.fillText(
      dlg.idx >= d.lines.length - 1 ? "S para fechar ▸" : "S para continuar ▸",
      bx + bw - 16,
      by + bh - 12,
    );
    ctx.textAlign = "left";
  }
}

function drawShieldHouse2D(ctx: CanvasRenderingContext2D, camX: number, t: number) {
  const x = SHIELD_HOUSE_X - camX;
  if (x < -200 || x > W + 200) return;
  // mesma casa das do fundo; a cruz templária na fachada diferencia das outras
  ctx.save();
  ctx.translate(-camX, 0);
  drawVillageHouse(ctx, SHIELD_HOUSE_X - 85, 168, t, 4);
  drawHouseCross(ctx, SHIELD_HOUSE_X, GROUND - 140);
  ctx.restore();
}

function drawHouseCross(ctx: CanvasRenderingContext2D, cx: number, cy: number) {
  ctx.fillStyle = "#b3352f";
  ctx.fillRect(cx - 5, cy - 24, 10, 48);
  ctx.fillRect(cx - 19, cy - 12, 38, 10);
  ctx.strokeStyle = "#7a1f1c";
  ctx.lineWidth = 2;
  ctx.strokeRect(cx - 5, cy - 24, 10, 48);
  ctx.strokeRect(cx - 19, cy - 12, 38, 10);
}

function drawPotionHouse2D(ctx: CanvasRenderingContext2D, camX: number, t: number) {
  const x = F2_POTION_HOUSE_X - camX;
  if (x < -200 || x > W + 200) return;
  // casa idêntica à do escudo, também com a cruz templária
  ctx.save();
  ctx.translate(-camX, 0);
  drawVillageHouse(ctx, F2_POTION_HOUSE_X - 85, 168, t, 6);
  drawHouseCross(ctx, F2_POTION_HOUSE_X, GROUND - 140);
  ctx.restore();
}

function drawMill(ctx: CanvasRenderingContext2D, camX: number, general: Enemy) {
  const x = MILL_X - camX;
  if (x < -320 || x > W + 320) return;
  // corpo
  ctx.fillStyle = "#9b9081";
  ctx.beginPath();
  ctx.moveTo(x - 20, GROUND);
  ctx.lineTo(x + 8, GROUND - 270);
  ctx.lineTo(x + 74, GROUND - 270);
  ctx.lineTo(x + 102, GROUND);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = "#5b5248";
  ctx.lineWidth = 3;
  ctx.stroke();
  // telhado
  ctx.fillStyle = "#6d4a3a";
  ctx.beginPath();
  ctx.moveTo(x - 2, GROUND - 268);
  ctx.lineTo(x + 41, GROUND - 325);
  ctx.lineTo(x + 84, GROUND - 268);
  ctx.closePath();
  ctx.fill();
  // pás
  ctx.save();
  ctx.translate(x + 41, GROUND - 282);
  ctx.rotate(performance.now() / 2200);
  ctx.fillStyle = "#c8b48a";
  for (let i = 0; i < 4; i++) {
    ctx.rotate(Math.PI / 2);
    ctx.fillRect(-7, -128, 14, 116);
  }
  ctx.restore();
  // porta
  ctx.fillStyle = "#5c3d21";
  ctx.fillRect(MILL_DOOR.x - camX, MILL_DOOR.y, MILL_DOOR.w, MILL_DOOR.h);
  ctx.strokeStyle = "#2a1c10";
  ctx.lineWidth = 4;
  ctx.strokeRect(MILL_DOOR.x - camX, MILL_DOOR.y, MILL_DOOR.w, MILL_DOOR.h);

  // general preso na parede pelo escudo
  if (general.state === "pinned" || (general.state === "gone" && general.shieldThrow > 0)) {
    // contraforte de pedra onde ele fica cravado
    ctx.fillStyle = "#8a8074";
    ctx.beginPath();
    ctx.moveTo(x + 58, GROUND);
    ctx.lineTo(x + 62, GROUND - 160);
    ctx.lineTo(x + 112, GROUND - 160);
    ctx.lineTo(x + 116, GROUND);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = "#5b5248";
    ctx.lineWidth = 3;
    ctx.stroke();

    const gx = x + 88;
    ctx.save();
    ctx.translate(gx, GROUND - 74);
    ctx.rotate(0.06);
    // braços abertos contra a parede
    ctx.strokeStyle = "#3f5a4a";
    ctx.lineWidth = 10;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(-13, -36);
    ctx.lineTo(-30, -48);
    ctx.moveTo(13, -36);
    ctx.lineTo(30, -48);
    ctx.stroke();
    // pernas penduradas
    ctx.beginPath();
    ctx.moveTo(-8, 8);
    ctx.lineTo(-14, 30);
    ctx.moveTo(8, 8);
    ctx.lineTo(12, 30);
    ctx.stroke();
    ctx.lineCap = "butt";
    // corpo
    ctx.fillStyle = "#2f4a3c";
    ctx.fillRect(-16, -46, 32, 56);
    // cabeça com turbante
    ctx.fillStyle = "#d8cfae";
    ctx.beginPath();
    ctx.arc(0, -58, 12, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#e8e2d2";
    ctx.beginPath();
    ctx.ellipse(0, -64, 15, 8, 0, Math.PI, 0);
    ctx.fill();
    // olhos fechados (desmaiado)
    ctx.strokeStyle = "#2b2620";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(-7, -58);
    ctx.lineTo(-3, -58);
    ctx.moveTo(3, -58);
    ctx.lineTo(7, -58);
    ctx.stroke();
    ctx.restore();
    // escudo cravado no peito
    drawTemplarShield(ctx, gx + 2, GROUND - 68, 0.85);
    // linhas de impacto ao redor do escudo
    ctx.strokeStyle = "rgba(255,240,200,0.8)";
    ctx.lineWidth = 2;
    for (let i = 0; i < 3; i++) {
      const a = -0.5 - i * 0.35;
      ctx.beginPath();
      ctx.moveTo(gx + 2 + Math.cos(a) * 34, GROUND - 68 + Math.sin(a) * 34);
      ctx.lineTo(gx + 2 + Math.cos(a) * 44, GROUND - 68 + Math.sin(a) * 44);
      ctx.stroke();
    }
  }
}

function drawMillExit(ctx: CanvasRenderingContext2D, camX: number) {
  const x = 120 - camX;
  ctx.fillStyle = "#9b9081";
  ctx.beginPath();
  ctx.moveTo(x - 20, GROUND);
  ctx.lineTo(x + 8, GROUND - 270);
  ctx.lineTo(x + 74, GROUND - 270);
  ctx.lineTo(x + 102, GROUND);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = "#5b5248";
  ctx.lineWidth = 3;
  ctx.stroke();
  ctx.fillStyle = "#6d4a3a";
  ctx.beginPath();
  ctx.moveTo(x - 2, GROUND - 268);
  ctx.lineTo(x + 41, GROUND - 325);
  ctx.lineTo(x + 84, GROUND - 268);
  ctx.closePath();
  ctx.fill();
  ctx.save();
  ctx.translate(x + 41, GROUND - 282);
  ctx.rotate(performance.now() / 2200);
  ctx.fillStyle = "#c8b48a";
  for (let i = 0; i < 4; i++) {
    ctx.rotate(Math.PI / 2);
    ctx.fillRect(-7, -128, 14, 116);
  }
  ctx.restore();
  ctx.fillStyle = "#5c3d21";
  ctx.fillRect(x + 12, GROUND - 130, 60, 130);
  ctx.strokeStyle = "#2a1c10";
  ctx.lineWidth = 4;
  ctx.strokeRect(x + 12, GROUND - 130, 60, 130);
}

function drawStar(ctx: CanvasRenderingContext2D, x: number, y: number, r: number) {
  ctx.beginPath();
  for (let i = 0; i < 10; i++) {
    const a = -Math.PI / 2 + (i * Math.PI) / 5;
    const rr = i % 2 === 0 ? r : r * 0.45;
    const px = x + Math.cos(a) * rr;
    const py = y + Math.sin(a) * rr;
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
}

function drawMillInside(
  ctx: CanvasRenderingContext2D,
  ball: Ball,
  millT: number,
  stars: number,
  t: number,
) {
  // paredes de tábuas
  ctx.fillStyle = "#5f452a";
  ctx.fillRect(0, 0, W, H);
  ctx.strokeStyle = "rgba(0,0,0,0.3)";
  ctx.lineWidth = 2;
  for (let px = 0; px <= W; px += 64) {
    ctx.beginPath();
    ctx.moveTo(px, 0);
    ctx.lineTo(px, GROUND);
    ctx.stroke();
  }
  // chão
  ctx.fillStyle = "#7a5c38";
  ctx.fillRect(0, GROUND, W, H - GROUND);
  ctx.fillStyle = "rgba(255,255,255,0.08)";
  ctx.fillRect(0, GROUND, W, 5);

  // janela com feixe de luz
  const wx = W - 230;
  ctx.fillStyle = "#8fb6d6";
  ctx.fillRect(wx, 80, 100, 120);
  const beam = ctx.createLinearGradient(wx, 80, wx - 160, GROUND);
  beam.addColorStop(0, "rgba(255,230,150,0.28)");
  beam.addColorStop(1, "rgba(255,230,150,0)");
  ctx.fillStyle = beam;
  ctx.beginPath();
  ctx.moveTo(wx, 80);
  ctx.lineTo(wx + 100, 80);
  ctx.lineTo(wx - 40, GROUND);
  ctx.lineTo(wx - 160, GROUND);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = "#3a2a18";
  ctx.lineWidth = 6;
  ctx.strokeRect(wx, 80, 100, 120);
  ctx.beginPath();
  ctx.moveTo(wx + 50, 80);
  ctx.lineTo(wx + 50, 200);
  ctx.moveTo(wx, 140);
  ctx.lineTo(wx + 100, 140);
  ctx.stroke();

  // eixo vertical com engrenagem girando
  ctx.fillStyle = "#6b4a2a";
  ctx.fillRect(160, 130, 22, GROUND - 130);
  ctx.save();
  ctx.translate(171, 170);
  ctx.rotate(t / 40);
  ctx.fillStyle = "#8a6a3b";
  ctx.beginPath();
  ctx.arc(0, 0, 34, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#5b432a";
  for (let i = 0; i < 8; i++) {
    ctx.rotate(Math.PI / 4);
    ctx.fillRect(-7, -58, 14, 26);
  }
  ctx.restore();

  // sacos de farinha
  ctx.fillStyle = "#c9b48a";
  ctx.strokeStyle = "#8a6a3b";
  ctx.lineWidth = 3;
  for (let i = 0; i < 3; i++) {
    const sx = 620 + i * 50;
    const sy = GROUND - 24 - (i % 2) * 12;
    ctx.beginPath();
    ctx.ellipse(sx, sy, 24, 30, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  }

  drawTorch(ctx, 80, 160, t);

  // título e ranking da fase 1
  ctx.fillStyle = "rgba(0,0,0,0.5)";
  ctx.fillRect(0, 36, W, 82);
  ctx.fillStyle = "#e8c46a";
  ctx.font = "bold 30px serif";
  ctx.textAlign = "center";
  ctx.fillText("Fase 1 concluída!", W / 2, 70);
  ctx.fillStyle = "#f0e2c0";
  ctx.font = "20px serif";
  ctx.fillText("Seu ranking na fase:", W / 2, 100);
  ctx.textAlign = "left";

  const revealEach = 28;
  for (let i = 0; i < 5; i++) {
    const sx = W / 2 - 110 + i * 55;
    const sy = 156;
    const shown = millT > 36 + i * revealEach;
    if (shown && i < stars) {
      const pop = Math.min(1, (millT - (36 + i * revealEach)) / 10);
      const scale = 0.5 + 0.5 * pop;
      ctx.save();
      ctx.translate(sx, sy);
      ctx.scale(scale, scale);
      drawStar(ctx, 0, 0, 24);
      ctx.fillStyle = "#e8c46a";
      ctx.fill();
      ctx.strokeStyle = "#8a6a3b";
      ctx.lineWidth = 3;
      ctx.stroke();
      ctx.restore();
    } else {
      drawStar(ctx, sx, sy, 20);
      ctx.strokeStyle = shown ? "rgba(240,226,192,0.35)" : "rgba(240,226,192,0.18)";
      ctx.lineWidth = 2;
      ctx.stroke();
    }
  }

  // bola em pose de triunfo: pulinhos, brilho e estrelinhas
  const hop = Math.abs(Math.sin(millT / 9)) * 26;
  const bx = W / 2;
  const by = GROUND - ball.r - hop;
  const glow = ctx.createRadialGradient(bx, by, 4, bx, by, 70);
  glow.addColorStop(0, "rgba(255,220,120,0.5)");
  glow.addColorStop(1, "rgba(255,220,120,0)");
  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.arc(bx, by, 70, 0, Math.PI * 2);
  ctx.fill();
  drawBall(ctx, bx, by, ball.r);
  ctx.fillStyle = "#e8c46a";
  for (let i = 0; i < 6; i++) {
    const a = t / 20 + (i * Math.PI) / 3;
    const rr = 46 + Math.sin(t / 12 + i) * 8;
    drawStar(ctx, bx + Math.cos(a) * rr, by + Math.sin(a) * rr * 0.7, 6);
    ctx.fill();
  }

  if (millT > 36 + 5 * revealEach + 40) {
    hintText(ctx, "Aperte ESPAÇO para avançar para a próxima fase");
  }
}

function drawKnight(ctx: CanvasRenderingContext2D, camX: number, t: number, ball: Ball) {
  const x = KNIGHT_X - camX;
  if (x < -140 || x > W + 140) return;
  const base = GROUND;
  const bob = Math.sin(t / 30) * 2;

  ctx.save();
  ctx.translate(x, base + bob);

  ctx.fillStyle = "#9b2d2d";
  ctx.beginPath();
  ctx.moveTo(-6, -74);
  ctx.lineTo(-34, -4);
  ctx.lineTo(10, -4);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = "#9aa3ad";
  ctx.fillRect(-12, -30, 10, 30);
  ctx.fillRect(4, -30, 10, 30);

  ctx.fillStyle = "#c3cbd4";
  ctx.fillRect(-16, -66, 32, 40);
  ctx.strokeStyle = "#6a7480";
  ctx.lineWidth = 2;
  ctx.strokeRect(-16, -66, 32, 40);

  ctx.fillStyle = "#d5dce3";
  ctx.beginPath();
  ctx.arc(0, -76, 13, Math.PI, 0);
  ctx.fill();
  ctx.fillRect(-13, -76, 26, 14);
  ctx.fillStyle = "#3a3f45";
  ctx.fillRect(-9, -72, 18, 5);
  ctx.fillStyle = "#e8c46a";
  ctx.fillRect(-2, -94, 4, 16);

  ctx.fillStyle = "#e9e4d6";
  ctx.beginPath();
  ctx.moveTo(-40, -62);
  ctx.lineTo(-12, -62);
  ctx.lineTo(-12, -30);
  ctx.lineTo(-26, -18);
  ctx.lineTo(-40, -30);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = "#8a6a3b";
  ctx.lineWidth = 3;
  ctx.stroke();
  ctx.fillStyle = "#b3352f";
  ctx.fillRect(-28, -58, 5, 32);
  ctx.fillRect(-38, -50, 25, 5);

  ctx.fillStyle = "#dfe6ec";
  ctx.fillRect(22, -80, 6, 52);
  ctx.fillStyle = "#8a6a3b";
  ctx.fillRect(16, -30, 18, 5);
  ctx.fillRect(23, -25, 4, 12);

  ctx.restore();

  // nome
  const label = "Cavaleiro Cristão";
  ctx.fillStyle = "rgba(0,0,0,0.55)";
  ctx.font = "bold 15px serif";
  const nw = ctx.measureText(label).width + 16;
  ctx.fillRect(x - nw / 2, base - 168, nw, 22);
  ctx.fillStyle = "#f0e2c0";
  ctx.textAlign = "center";
  ctx.fillText(label, x, base - 152);
  ctx.textAlign = "left";

  if (Math.abs(ball.x - KNIGHT_X) < 120) {
    drawTalkPrompt(ctx, x, base - 140, t);
  }
}

function drawMerchant(ctx: CanvasRenderingContext2D, camX: number, t: number, ball: Ball) {
  const x = F2_MERCHANT_X - camX;
  if (x < -220 || x > W + 220) return;
  const base = GROUND;
  const bob = Math.sin(t / 30) * 2;

  // tapete com mercadorias
  ctx.fillStyle = "#8c2b2b";
  ctx.fillRect(x - 80, base - 6, 160, 8);
  ctx.fillStyle = "#c9a24a";
  for (const px of [-52, 0, 52]) {
    ctx.beginPath();
    ctx.moveTo(x + px - 12, base - 6);
    ctx.lineTo(x + px - 6, base - 34);
    ctx.lineTo(x + px + 6, base - 34);
    ctx.lineTo(x + px + 12, base - 6);
    ctx.closePath();
    ctx.fill();
  }

  ctx.save();
  ctx.translate(x, base + bob);

  // túnica
  ctx.fillStyle = "#6d5a3c";
  ctx.beginPath();
  ctx.moveTo(-14, -70);
  ctx.lineTo(-22, 0);
  ctx.lineTo(22, 0);
  ctx.lineTo(14, -70);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = "#c9a24a";
  ctx.fillRect(-16, -44, 32, 6);

  // cabeça, barba e turbante
  ctx.fillStyle = "#c8a07a";
  ctx.beginPath();
  ctx.arc(0, -78, 11, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#3a2a18";
  ctx.beginPath();
  ctx.moveTo(-9, -76);
  ctx.quadraticCurveTo(0, -56, 9, -76);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = "#e8e2d2";
  ctx.beginPath();
  ctx.ellipse(0, -88, 14, 8, 0, Math.PI, 0);
  ctx.fill();
  ctx.fillStyle = "#c9a24a";
  ctx.beginPath();
  ctx.arc(8, -90, 3, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  if (Math.abs(ball.x - F2_MERCHANT_X) < 120) {
    drawTalkPrompt(ctx, x, base - 128, t);
  }
}

function drawPope(ctx: CanvasRenderingContext2D, camX: number, t: number, ball: Ball) {
  const x = POPE_X - camX;
  if (x < -220 || x > W + 220) return;
  const base = GROUND;
  const bob = Math.sin(t / 30) * 2;

  ctx.save();
  ctx.translate(x, base + bob);

  // bastão com cruz
  ctx.fillStyle = "#8a6a3b";
  ctx.fillRect(24, -110, 6, 110);
  ctx.fillStyle = "#e8c46a";
  ctx.fillRect(21, -122, 12, 4);
  ctx.fillRect(25, -126, 4, 12);

  // túnica branca com estola dourada
  ctx.fillStyle = "#f0ede4";
  ctx.beginPath();
  ctx.moveTo(-16, -74);
  ctx.lineTo(-24, 0);
  ctx.lineTo(24, 0);
  ctx.lineTo(16, -74);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = "#d8d2c2";
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.fillStyle = "#e8c46a";
  ctx.fillRect(-6, -72, 5, 70);
  ctx.fillRect(1, -72, 5, 70);
  ctx.fillRect(-8, -70, 16, 6);

  // cabeça e tiara (tripla coroa)
  ctx.fillStyle = "#e8c4a0";
  ctx.beginPath();
  ctx.arc(0, -82, 11, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#e8c46a";
  ctx.beginPath();
  ctx.ellipse(0, -92, 13, 5, 0, Math.PI, 0);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(0, -97, 11, 4, 0, Math.PI, 0);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(0, -102, 9, 4, 0, Math.PI, 0);
  ctx.fill();
  ctx.restore();

  if (Math.abs(ball.x - POPE_X) < 120) {
    drawTalkPrompt(ctx, x, base - 150, t);
  }
}

function drawDragon(ctx: CanvasRenderingContext2D, camX: number, t: number, e: Enemy) {
  if (e.state === "gone") return;
  const x = e.x - camX;
  if (x < -340 || x > W + 340) return;
  const base = GROUND;
  const charging = e.state === "charging";
  const vulnerable = e.state === "vulnerable";
  const bob = Math.sin(t / 26) * 5;
  const flap = Math.sin(t / 12) * 24;

  ctx.save();
  ctx.translate(x, base + bob);

  // asas
  ctx.fillStyle = "#15151c";
  for (const s of [-1, 1]) {
    ctx.save();
    ctx.scale(s, 1);
    ctx.beginPath();
    ctx.moveTo(40, -110);
    ctx.lineTo(170, -200 + flap);
    ctx.lineTo(150, -100);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  // cauda
  ctx.strokeStyle = "#1d1d26";
  ctx.lineWidth = 16;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(-55, -70);
  ctx.quadraticCurveTo(-150, -60, -180, -120);
  ctx.stroke();
  ctx.fillStyle = "#1d1d26";
  ctx.beginPath();
  ctx.moveTo(-180, -120);
  ctx.lineTo(-202, -138);
  ctx.lineTo(-176, -134);
  ctx.closePath();
  ctx.fill();
  ctx.lineCap = "butt";

  // pernas com garras
  ctx.fillStyle = "#1d1d26";
  ctx.fillRect(-46, -42, 24, 42);
  ctx.fillRect(22, -42, 24, 42);
  ctx.fillStyle = "#dfe6ec";
  for (const lx of [-46, -32, 22, 36]) ctx.fillRect(lx, -6, 8, 6);

  // corpo e barriga
  ctx.fillStyle = "#1d1d26";
  ctx.beginPath();
  ctx.ellipse(0, -86, 72, 54, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "#000";
  ctx.lineWidth = 3;
  ctx.stroke();
  ctx.fillStyle = "#2e2e3c";
  ctx.beginPath();
  ctx.ellipse(0, -64, 44, 26, 0, 0, Math.PI * 2);
  ctx.fill();

  // cabeças conforme restam
  const neckOffsets = e.heads === 3 ? [-64, 0, 64] : e.heads === 2 ? [-38, 38] : [0];
  for (const nx of neckOffsets) {
    ctx.strokeStyle = "#1d1d26";
    ctx.lineWidth = 18;
    ctx.beginPath();
    ctx.moveTo(nx / 2, -110);
    ctx.quadraticCurveTo(nx, -160, nx, -196);
    ctx.stroke();

    ctx.save();
    ctx.translate(nx, -204);
    if (nx < 0) ctx.rotate(-0.25);
    if (nx > 0) ctx.rotate(0.25);
    ctx.fillStyle = "#1d1d26";
    ctx.beginPath();
    ctx.ellipse(0, 0, 24, 13, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(6, 2);
    ctx.lineTo(30, 10 + (charging ? 6 : 2));
    ctx.lineTo(6, 10);
    ctx.closePath();
    ctx.fill();
    if (charging) {
      ctx.fillStyle = e.atk.glow + "0.9)";
      ctx.beginPath();
      ctx.ellipse(38, 8, 16, 8, 0.2, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.fillStyle = vulnerable ? "#ffd24a" : "#ff4040";
    ctx.beginPath();
    ctx.arc(4, -6, 3.4, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#dfe6ec";
    ctx.beginPath();
    ctx.moveTo(-8, -12);
    ctx.lineTo(-14, -26);
    ctx.lineTo(-4, -14);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  // aura do golpe ou brilho de vulnerável
  if (charging || vulnerable) {
    const p = 0.3 + 0.3 * Math.sin(t / 6);
    const col = charging ? e.atk.glow : "rgba(255,220,120,";
    const g = ctx.createRadialGradient(0, -150, 30, 0, -150, 170);
    g.addColorStop(0, col + p.toFixed(2) + ")");
    g.addColorStop(1, col + "0)");
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(0, -150, 170, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();

  // nome da cabeça atual
  const label = dragonHeadName(e);
  ctx.fillStyle = "rgba(0,0,0,0.55)";
  ctx.font = "bold 16px serif";
  const nw = ctx.measureText(label).width + 16;
  ctx.fillRect(x - nw / 2, base - 268, nw, 24);
  ctx.fillStyle = "#f0e2c0";
  ctx.textAlign = "center";
  ctx.fillText(label, x, base - 251);
  ctx.textAlign = "left";
}

function drawMuhammad(ctx: CanvasRenderingContext2D, camX: number, t: number, ball: Ball) {
  const x = MUHAMMAD_X - camX;
  if (x < -220 || x > W + 220) return;
  const base = GROUND;
  const bob = Math.sin(t / 30) * 2;

  ctx.save();
  ctx.translate(x, base + bob);

  // cajado
  ctx.fillStyle = "#8a6a3b";
  ctx.fillRect(-30, -104, 5, 104);

  // túnica verde com faixa
  ctx.fillStyle = "#2f6b4f";
  ctx.beginPath();
  ctx.moveTo(-15, -72);
  ctx.lineTo(-22, 0);
  ctx.lineTo(22, 0);
  ctx.lineTo(15, -72);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = "#1d4a37";
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.fillStyle = "#e8c46a";
  ctx.fillRect(-17, -46, 34, 6);

  // cabeça, barba e turbante branco
  ctx.fillStyle = "#c8a07a";
  ctx.beginPath();
  ctx.arc(0, -80, 11, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#4a3520";
  ctx.beginPath();
  ctx.moveTo(-9, -78);
  ctx.quadraticCurveTo(0, -58, 9, -78);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = "#f0ede4";
  ctx.beginPath();
  ctx.ellipse(0, -90, 14, 8, 0, Math.PI, 0);
  ctx.fill();
  ctx.restore();

  if (Math.abs(ball.x - MUHAMMAD_X) < 120) {
    drawTalkPrompt(ctx, x, base - 128, t);
  }
}

function drawPeaceScene(ctx: CanvasRenderingContext2D, cx: number, cy: number) {
  // Papa à esquerda
  ctx.save();
  ctx.translate(cx - 70, cy);
  ctx.fillStyle = "#f0ede4";
  ctx.beginPath();
  ctx.moveTo(-14, -64);
  ctx.lineTo(-20, 0);
  ctx.lineTo(20, 0);
  ctx.lineTo(14, -64);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = "#d8d2c2";
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.fillStyle = "#e8c46a";
  ctx.fillRect(-5, -62, 4, 60);
  ctx.fillRect(1, -62, 4, 60);
  ctx.fillStyle = "#e8c4a0";
  ctx.beginPath();
  ctx.arc(0, -72, 10, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#e8c46a";
  ctx.beginPath();
  ctx.ellipse(0, -81, 12, 5, 0, Math.PI, 0);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(0, -86, 10, 4, 0, Math.PI, 0);
  ctx.fill();
  ctx.strokeStyle = "#f0ede4";
  ctx.lineWidth = 8;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(8, -50);
  ctx.lineTo(52, -44);
  ctx.stroke();
  ctx.restore();

  // Maomé à direita
  ctx.save();
  ctx.translate(cx + 70, cy);
  ctx.fillStyle = "#2f6b4f";
  ctx.beginPath();
  ctx.moveTo(-14, -64);
  ctx.lineTo(-20, 0);
  ctx.lineTo(20, 0);
  ctx.lineTo(14, -64);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = "#1d4a37";
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.fillStyle = "#e8c46a";
  ctx.fillRect(-17, -40, 34, 6);
  ctx.fillStyle = "#c8a07a";
  ctx.beginPath();
  ctx.arc(0, -72, 10, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#4a3520";
  ctx.beginPath();
  ctx.moveTo(-8, -70);
  ctx.quadraticCurveTo(0, -54, 8, -70);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = "#f0ede4";
  ctx.beginPath();
  ctx.ellipse(0, -81, 12, 5, 0, Math.PI, 0);
  ctx.fill();
  ctx.strokeStyle = "#2f6b4f";
  ctx.lineWidth = 8;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(-8, -50);
  ctx.lineTo(-52, -44);
  ctx.stroke();
  ctx.restore();
  ctx.lineCap = "butt";

  // aperto de mãos brilhante
  const g = ctx.createRadialGradient(cx, cy - 47, 2, cx, cy - 47, 26);
  g.addColorStop(0, "rgba(255,240,180,0.9)");
  g.addColorStop(1, "rgba(255,240,180,0)");
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.arc(cx, cy - 47, 26, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#e8c46a";
  ctx.beginPath();
  ctx.arc(cx, cy - 47, 5, 0, Math.PI * 2);
  ctx.fill();

  // pombinhas da paz acima
  ctx.fillStyle = "#f0ede4";
  for (const s of [-1, 1]) {
    ctx.beginPath();
    ctx.ellipse(cx + s * 26, cy - 96, 9, 6, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(cx + s * 32, cy - 100, 4, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawClassroom(ctx: CanvasRenderingContext2D, t: number) {
  // parede e piso
  ctx.fillStyle = "#d9cba8";
  ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = "#8a6a4a";
  ctx.fillRect(0, H - 110, W, 110);
  ctx.fillStyle = "rgba(0,0,0,0.15)";
  ctx.fillRect(0, H - 110, W, 6);

  // quadro-negro
  ctx.fillStyle = "#5b432a";
  ctx.fillRect(80, 50, 580, 250);
  ctx.fillStyle = "#2e4231";
  ctx.fillRect(94, 64, 552, 222);
  ctx.fillStyle = "rgba(240,240,220,0.9)";
  ctx.font = "bold 34px serif";
  ctx.textAlign = "center";
  ctx.fillText("As Cruzadas", 370, 130);
  ctx.font = "20px serif";
  ctx.fillText("uma guerra religiosa na Idade Média", 370, 168);
  ctx.textAlign = "left";

  // giz e apagador na bandeja do quadro
  ctx.fillStyle = "#f0ede4";
  ctx.fillRect(120, 306, 40, 7);
  ctx.fillStyle = "#4a3520";
  ctx.fillRect(560, 304, 46, 9);

  // relógio
  ctx.fillStyle = "#f0ede4";
  ctx.beginPath();
  ctx.arc(820, 100, 26, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "#4a3520";
  ctx.lineWidth = 3;
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(820, 100);
  ctx.lineTo(820, 84);
  ctx.moveTo(820, 100);
  ctx.lineTo(832, 104);
  ctx.stroke();

  // professor de ensino religioso
  const bob = Math.sin(t / 30) * 2;
  ctx.save();
  ctx.translate(740, H - 110 + bob);
  ctx.fillStyle = "#3a2a18";
  ctx.fillRect(-14, -46, 11, 46);
  ctx.fillRect(3, -46, 11, 46);
  ctx.fillStyle = "#6b5844";
  ctx.fillRect(-18, -110, 36, 66);
  ctx.strokeStyle = "#4a3520";
  ctx.lineWidth = 2;
  ctx.strokeRect(-18, -110, 36, 66);
  ctx.fillStyle = "#f0ede4";
  ctx.fillRect(-5, -110, 10, 30);
  ctx.fillStyle = "#8c2b2b";
  ctx.beginPath();
  ctx.moveTo(0, -108);
  ctx.lineTo(4, -100);
  ctx.lineTo(0, -84);
  ctx.lineTo(-4, -100);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = "#e8c4a0";
  ctx.beginPath();
  ctx.arc(0, -122, 12, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#7a736a";
  ctx.beginPath();
  ctx.arc(0, -126, 12, Math.PI, 0);
  ctx.fill();
  ctx.strokeStyle = "#3a2a18";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(-5, -121, 4, 0, Math.PI * 2);
  ctx.arc(5, -121, 4, 0, Math.PI * 2);
  ctx.moveTo(-1, -121);
  ctx.lineTo(1, -121);
  ctx.stroke();
  ctx.strokeStyle = "#6b5844";
  ctx.lineWidth = 9;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(-14, -100);
  ctx.lineTo(-58, -130);
  ctx.stroke();
  ctx.lineCap = "butt";
  ctx.strokeStyle = "#8a6a3b";
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(-58, -130);
  ctx.lineTo(-96, -150);
  ctx.stroke();
  ctx.restore();

  // carteiras em primeiro plano
  for (let i = 0; i < 3; i++) {
    const dx = 130 + i * 300;
    ctx.fillStyle = "#5b432a";
    ctx.fillRect(dx, H - 84, 220, 14);
    ctx.fillRect(dx + 8, H - 70, 12, 60);
    ctx.fillRect(dx + 200, H - 70, 12, 60);
    ctx.fillStyle = "rgba(0,0,0,0.2)";
    ctx.fillRect(dx, H - 84, 220, 4);
  }
}

function drawVictory(ctx: CanvasRenderingContext2D, victoryT: number, stars: number) {
  ctx.fillStyle = "rgba(10,5,0,0.78)";
  ctx.fillRect(0, 0, W, H);

  const g = ctx.createRadialGradient(W / 2, 180, 20, W / 2, 180, 300);
  g.addColorStop(0, "rgba(255,230,150,0.35)");
  g.addColorStop(1, "rgba(255,230,150,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, H);

  ctx.textAlign = "center";
  ctx.fillStyle = "#e8c46a";
  ctx.font = "bold 42px serif";
  ctx.fillText("Você zerou o jogo!", W / 2, 64);

  // o Papa e Maomé fazem as pazes
  drawPeaceScene(ctx, W / 2, 210);

  ctx.fillStyle = "#f0e2c0";
  ctx.font = "22px serif";
  ctx.fillText("O Papa e Maomé fizeram as pazes!", W / 2, 252);
  ctx.fillText("E assim Jerusalém virou território pacífico!", W / 2, 280);

  // ranking da fase 2 (1 a 5 estrelas conforme os corações)
  ctx.fillStyle = "#e8c46a";
  ctx.font = "bold 20px serif";
  ctx.fillText("Ranking da Fase 2", W / 2, 322);
  const revealEach = 28;
  for (let i = 0; i < 5; i++) {
    const sx = W / 2 - 110 + i * 55;
    const appear = 40 + i * revealEach;
    if (i < stars && victoryT >= appear) {
      const pop = Math.min(1, (victoryT - appear) / 10);
      const scale = 0.5 + 0.5 * pop;
      ctx.save();
      ctx.translate(sx, 356);
      ctx.scale(scale, scale);
      drawStar(ctx, 0, 0, 22);
      ctx.fillStyle = "#e8c46a";
      ctx.fill();
      ctx.strokeStyle = "#8a6a3b";
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.restore();
    } else {
      drawStar(ctx, sx, 356, 18);
      ctx.strokeStyle = "rgba(240,226,192,0.35)";
      ctx.lineWidth = 2;
      ctx.stroke();
    }
  }

  if (victoryT > 90) {
    ctx.fillStyle = "#e8c46a";
    ctx.font = "bold 20px serif";
    ctx.fillText("Aperte ESPAÇO para voltar ao menu", W / 2, 424);
  }
  ctx.textAlign = "left";
}

function drawPotion(ctx: CanvasRenderingContext2D, x: number, y: number) {
  const g = ctx.createRadialGradient(x, y, 4, x, y, 90);
  g.addColorStop(0, "rgba(255,90,120,0.5)");
  g.addColorStop(1, "rgba(255,90,120,0)");
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.arc(x, y, 90, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "rgba(230,240,250,0.5)";
  ctx.fillRect(x - 4, y - 18, 8, 12);
  ctx.fillStyle = "#8a6a3b";
  ctx.fillRect(x - 5, y - 22, 10, 6);
  ctx.fillStyle = "#d13a56";
  ctx.beginPath();
  ctx.arc(x, y + 7, 12, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "rgba(255,255,255,0.7)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(x, y + 7, 15, 0, Math.PI * 2);
  ctx.stroke();
  ctx.strokeRect(x - 4, y - 18, 8, 12);
}

function drawPotionIcon(ctx: CanvasRenderingContext2D, x: number, y: number) {
  ctx.fillStyle = "rgba(230,240,250,0.6)";
  ctx.fillRect(x - 3, y - 12, 6, 8);
  ctx.fillStyle = "#8a6a3b";
  ctx.fillRect(x - 4, y - 15, 8, 4);
  ctx.fillStyle = "#d13a56";
  ctx.beginPath();
  ctx.arc(x, y + 4, 9, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "rgba(255,255,255,0.6)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(x, y + 4, 10, 0, Math.PI * 2);
  ctx.stroke();
}

function drawPotionHouse(ctx: CanvasRenderingContext2D, ball: Ball, t: number, taken: boolean) {
  stoneRoom(ctx);
  drawTorch(ctx, 220, 140, t);
  drawTorch(ctx, 700, 140, t);

  // porta de saída à esquerda
  ctx.fillStyle = "#6b4a2a";
  ctx.fillRect(20, GROUND - 130, 70, 130);
  ctx.strokeStyle = "#2a1c10";
  ctx.lineWidth = 5;
  ctx.strokeRect(20, GROUND - 130, 70, 130);

  // pedestal
  ctx.fillStyle = "#7a736a";
  ctx.fillRect(420, GROUND - 60, 80, 60);
  ctx.fillStyle = "#948c81";
  ctx.fillRect(410, GROUND - 68, 100, 12);

  if (!taken) drawPotion(ctx, 460, GROUND - 120 + Math.sin(t / 25) * 5);

  drawBall(ctx, ball.x, ball.y, ball.r);

  ctx.fillStyle = "rgba(240,226,192,0.85)";
  ctx.font = "20px serif";
  ctx.textAlign = "center";
  ctx.fillText("Casa da Poção", W / 2, 54);
  ctx.textAlign = "left";
}

function drawEnemy(ctx: CanvasRenderingContext2D, camX: number, t: number, e: Enemy) {
  if (e.kind === "dragon") {
    drawDragon(ctx, camX, t, e);
    return;
  }
  if (e.state === "idle" || e.state === "gone" || e.state === "pinned") return;
  const x = e.x - camX;
  if (x < -220 || x > W + 220) return;
  const base = GROUND;
  const dizzy = e.state === "dizzy";
  const fallen = dizzy && e.timer > 40;
  const general = e.kind === "general";
  const scale = general ? 1.25 : 1;

  ctx.save();
  ctx.translate(x, base);
  ctx.scale(scale, scale);
  if (fallen) {
    ctx.rotate(-1.2);
    ctx.translate(0, 10);
  }

  // manto
  ctx.fillStyle = general ? "#2f4a3c" : "#3a4a63";
  ctx.beginPath();
  ctx.moveTo(8, -78);
  ctx.lineTo(38, -4);
  ctx.lineTo(-6, -4);
  ctx.closePath();
  ctx.fill();

  // pernas
  ctx.fillStyle = "#5a5348";
  ctx.fillRect(-12, -32, 11, 32);
  ctx.fillRect(4, -32, 11, 32);

  // torso (cota de malha)
  ctx.fillStyle = e.state === "vulnerable" ? "#8a6a5a" : general ? "#6a7a68" : "#71798a";
  ctx.fillRect(-18, -70, 36, 40);
  ctx.strokeStyle = "#3a3730";
  ctx.lineWidth = 3;
  ctx.strokeRect(-18, -70, 36, 40);

  // elmo com turbante
  ctx.fillStyle = "#c9c2b2";
  ctx.beginPath();
  ctx.arc(0, -80, 13, Math.PI, 0);
  ctx.fill();
  ctx.fillStyle = "#e8e2d2";
  ctx.beginPath();
  ctx.ellipse(0, -84, 17, 9, 0, Math.PI, 0);
  ctx.fill();
  ctx.fillStyle = "#c9c2b2";
  ctx.beginPath();
  ctx.moveTo(-1, -100);
  ctx.lineTo(1, -100);
  ctx.lineTo(1, -92);
  ctx.lineTo(-1, -92);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = "#d8cfae";
  ctx.fillRect(-13, -80, 26, 12);
  ctx.fillStyle = dizzy ? "#8a8a8a" : "#2b2620";
  ctx.fillRect(-9, -77, 6, 4);
  ctx.fillRect(3, -77, 6, 4);

  // arma erguida e parada durante o carregamento
  const charging = e.state === "charging";
  ctx.save();
  ctx.translate(24, -60);
  ctx.rotate(charging ? -1.35 : dizzy ? 1.2 : -0.3);
  if (charging) {
    const p = 0.35 + 0.35 * Math.sin(t / 6);
    ctx.shadowColor = e.atk.glow + "1)";
    ctx.shadowBlur = 28;
    ctx.fillStyle = e.atk.glow + p.toFixed(2) + ")";
    ctx.fillRect(-9, -70, 24, 82);
  }
  ctx.shadowBlur = 0;
  if (general) {
    // foice
    ctx.fillStyle = "#6b4a2a";
    ctx.fillRect(-3, -66, 7, 70);
    ctx.strokeStyle = "#dfe6ec";
    ctx.lineWidth = 7;
    ctx.beginPath();
    ctx.arc(-26, -62, 28, -0.2, 1.5);
    ctx.stroke();
  } else {
    ctx.fillStyle = "#cfd6dd";
    ctx.fillRect(-3, -62, 7, 62);
    ctx.fillStyle = "#8a6a3b";
    ctx.fillRect(-10, 0, 21, 6);
  }
  ctx.restore();
  ctx.restore();

  // balde
  if (e.bucket > 0) {
    const p = 1 - e.bucket / 40;
    const bxp = x - 120 + 120 * p;
    const byp = base - 200 + 120 * p * p;
    ctx.fillStyle = "#8a6a3b";
    ctx.fillRect(bxp - 14, byp - 14, 28, 24);
    ctx.fillStyle = "#5b432a";
    ctx.fillRect(bxp - 16, byp - 18, 32, 6);
  }
  if (dizzy) {
    ctx.fillStyle = "#e8c46a";
    ctx.font = "20px serif";
    ctx.textAlign = "center";
    for (let i = 0; i < 3; i++) {
      const a = t / 12 + (i * Math.PI * 2) / 3;
      ctx.fillText("★", x + Math.cos(a) * 26, base - 105 + Math.sin(a) * 10);
    }
    ctx.textAlign = "left";
  }

  // nome
  if (!dizzy) {
    ctx.fillStyle = "rgba(0,0,0,0.55)";
    ctx.font = "bold 15px serif";
    const nw = ctx.measureText(e.name).width + 16;
    ctx.fillRect(x - nw / 2, base - 145, nw, 22);
    ctx.fillStyle = "#f0e2c0";
    ctx.textAlign = "center";
    ctx.fillText(e.name, x, base - 129);
    ctx.textAlign = "left";
  }
}

function drawHud(
  ctx: CanvasRenderingContext2D,
  hearts: number,
  hasShield: boolean,
  e: Enemy | null,
  hasLight = false,
  hasPotion = false,
) {
  for (let i = 0; i < 5; i++) {
    const hx = 28 + i * 30;
    const hy = 28;
    ctx.fillStyle = i < hearts ? "#e03b3b" : "rgba(0,0,0,0.35)";
    ctx.beginPath();
    ctx.moveTo(hx, hy + 8);
    ctx.bezierCurveTo(hx - 14, hy - 6, hx - 4, hy - 16, hx, hy - 6);
    ctx.bezierCurveTo(hx + 4, hy - 16, hx + 14, hy - 6, hx, hy + 8);
    ctx.fill();
    ctx.strokeStyle = "rgba(0,0,0,0.5)";
    ctx.lineWidth = 2;
    ctx.stroke();
  }

  if (hasShield) drawTemplarShield(ctx, 210, 34, 0.5);
  if (hasPotion) drawPotionIcon(ctx, 252, 30);
  if (hasLight) {
    const g = ctx.createRadialGradient(296, 28, 2, 296, 28, 24);
    g.addColorStop(0, "rgba(255,240,180,0.95)");
    g.addColorStop(1, "rgba(255,240,180,0)");
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(296, 28, 24, 0, Math.PI * 2);
    ctx.fill();
  }

  if (!e) return;

  if (e.state === "charging") {
    const p = e.timer / 120;
    ctx.fillStyle = "rgba(0,0,0,0.5)";
    ctx.fillRect(W / 2 - 160, 24, 320, 16);
    ctx.fillStyle = e.atk.color;
    ctx.fillRect(W / 2 - 160, 24, 320 * p, 16);
    ctx.fillStyle = "#fff";
    ctx.font = "bold 20px serif";
    ctx.textAlign = "center";
    const verb = hasShield ? "defender" : "desviar";
    ctx.fillText(
      e.resolved
        ? e.dodged
          ? hasShield
            ? "Defesa pronta!"
            : "Desvio pronto!"
          : "Tecla errada!"
        : `Aperte ${e.atk.label} para ${verb}!`,
      W / 2,
      62,
    );
    ctx.textAlign = "left";
  } else if (e.state === "vulnerable") {
    const p = 1 - e.timer / 240;
    ctx.fillStyle = "rgba(0,0,0,0.5)";
    ctx.fillRect(W / 2 - 160, 24, 320, 16);
    ctx.fillStyle = "#e8c46a";
    ctx.fillRect(W / 2 - 160, 24, 320 * Math.max(0, p), 16);
    ctx.fillStyle = "#fff";
    ctx.font = "bold 20px serif";
    ctx.textAlign = "center";
    ctx.fillText(
      e.kind === "dragon"
        ? hasLight
          ? "Vulnerável! ESPAÇO para usar a Luz Brilhante"
          : "Vulnerável! Você precisa da Luz Brilhante"
        : e.kind === "general"
          ? hasShield
            ? "Vulnerável! ESPAÇO para arremessar o escudo"
            : "Vulnerável! Você precisa do escudo templário"
          : "Vulnerável! Aperte ESPAÇO para o balde",
      W / 2,
      62,
    );
    ctx.textAlign = "left";
  }
}
