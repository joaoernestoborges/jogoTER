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

type Screen = "menu" | "game" | "credits";

const W = 900;
const H = 520;
const GROUND = H - 48;
const VILLAGE_W = W * 4;

const CHEST = { x: 380, y: GROUND - 54, w: 90, h: 54 };
const DOOR = { x: 780, y: GROUND - 130, w: 76, h: 130 };

const KNIGHT_X = 760;
const SHIELD_HOUSE_X = 1300; // porta da casa do escudo (na vila)
const SOLDIER1_X = 2050;
const SOLDIER2_X = 2600;
const GENERAL_X = 3050;
const MILL_X = 3380;
const MILL_DOOR = { x: MILL_X + 6, y: GROUND - 110, w: 70, h: 110 };

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
          </p>
          <div className="w-64">
            <MenuButton onClick={() => setScreen("menu")}>Voltar ao menu</MenuButton>
          </div>
        </section>
      )}
    </main>
  );
}

function MenuButton({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick: () => void;
}) {
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
type EnemyKind = "soldier" | "general";
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
};

function makeEnemy(kind: EnemyKind, x: number): Enemy {
  return {
    kind,
    x,
    name: kind === "soldier" ? "Soldado Muçulmano" : "General Muçulmano",
    state: "idle",
    timer: 0,
    atk: ATTACKS[0]!,
    hits: 0,
    resolved: false,
    dodged: false,
    bucket: 0,
    shieldThrow: 0,
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

    let phase: "intro" | "inside" | "village" | "shieldhouse" | "fase2" = "intro";
    let introT = 0;
    let chestOpen = 0;
    let camX = 0;
    let fade = 0;

    let hearts = 5;
    let hasShield = false;
    let hitFlash = 0;
    let dodgeFlash = 0;
    let dead = false;
    let banner = "";
    let bannerT = 0;

    const CHARGE = 120; // 2s para carregar o golpe
    const VULN = 240; // 4s vulnerável
    const DIZZY = 180; // 3s tonto

    const enemies: Enemy[] = [
      makeEnemy("soldier", SOLDIER1_X),
      makeEnemy("soldier", SOLDIER2_X),
      makeEnemy("general", GENERAL_X),
    ];
    let current = 0;

    const activeEnemy = (): Enemy | null => {
      if (phase !== "village") return null;
      const e = enemies[current];
      return e && e.state !== "gone" ? e : null;
    };

    const down = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      if ([" ", "a", "d", "e", "q", "w", "arrowleft", "arrowright", "arrowup"].includes(k))
        e.preventDefault();
      if (!keys[k]) justPressed[k] = true;
      keys[k] = true;
    };
    const up = (e: KeyboardEvent) => {
      keys[e.key.toLowerCase()] = false;
    };
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);

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
      if (e.bucket > 0) e.bucket--;
      if (e.shieldThrow > 0) e.shieldThrow++;

      if (e.state === "idle") {
        if (ball.x > e.x - 420) {
          e.state = "charging";
          e.timer = 0;
          e.hits = 0;
          e.resolved = false;
          e.atk = pickAttack();
          say(e.name + " apareceu!");
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
          else takeHit(e.kind === "general" ? 2 : 1);
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
          say("Inimigo derrotado!");
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

      if (phase === "intro") {
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
      } else if (phase === "village" || phase === "fase2") {
        const e = activeEnemy();
        const frozen = !!e && (e.state === "charging" || e.state === "vulnerable");
        if (!dead) physics(VILLAGE_W, frozen);
        if (phase === "village") combat();

        camX = Math.max(0, Math.min(VILLAGE_W - W, ball.x - W / 2));
        drawVillage(ctx, ball, t, camX, phase === "fase2");

        if (phase === "village") {
          drawKnight(ctx, camX, t, ball);
          drawShieldHouse2D(ctx, camX);
          drawMill(ctx, camX, enemies[2]!);
          for (const en of enemies) drawEnemy(ctx, camX, t, en);
          drawHud(ctx, hearts, hasShield, enemies[current]!);

          // entrar na casa do escudo
          if (Math.abs(ball.x - SHIELD_HOUSE_X) < 40 && ball.onGround) {
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
            enemies[2]!.state === "gone" &&
            Math.abs(ball.x - (MILL_DOOR.x + MILL_DOOR.w / 2)) < 50
          ) {
            hintText(ctx, "Aperte ESPAÇO para entrar no moinho");
            if (justPressed[" "]) {
              phase = "fase2";
              fade = 1;
              ball.x = 160;
              ball.y = GROUND - ball.r;
              ball.vx = 0;
              ball.vy = 0;
              say("Fase 2 — outra parte da aldeia medieval");
            }
          }
        } else {
          drawMillExit(ctx, camX);
          drawHud(ctx, hearts, hasShield, null);
        }

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
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
    };
  }, [onDeath]);

  return (
    <canvas
      ref={canvasRef}
      width={W}
      height={H}
      tabIndex={0}
      aria-label="Área de jogo: bola em uma casa medieval e aldeia"
      className="max-w-full rounded-lg border-4 border-[#5b432a] shadow-2xl outline-none"
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
  for (let i = 0; i < 5; i++) {
    ctx.beginPath();
    ctx.moveTo(-26 + i * 13, -30);
    ctx.lineTo(-19.5 + i * 13, -46);
    ctx.lineTo(-13 + i * 13, -30);
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

function drawShieldHouse(
  ctx: CanvasRenderingContext2D,
  ball: Ball,
  t: number,
  taken: boolean,
) {
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
    const bx = 120 + i * 250;
    const bh2 = 140 + (((i + seed) * 37) % 60);
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

  drawBall(ctx, ball.x, ball.y, ball.r);
  ctx.restore();

  ctx.fillStyle = "rgba(0,0,0,0.35)";
  ctx.fillRect(20, 50, 200, 10);
  ctx.fillStyle = "#e8c46a";
  ctx.fillRect(20, 50, 200 * (ball.x / VILLAGE_W), 10);
}

function speech(ctx: CanvasRenderingContext2D, x: number, y: number, text: string) {
  ctx.font = "18px serif";
  const w = ctx.measureText(text).width + 28;
  ctx.fillStyle = "rgba(255,250,235,0.95)";
  ctx.strokeStyle = "#4a3520";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.roundRect(x - w / 2, y - 44, w, 38, 10);
  ctx.fill();
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(x - 8, y - 8);
  ctx.lineTo(x + 8, y - 8);
  ctx.lineTo(x, y + 4);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = "#2a1c10";
  ctx.textAlign = "center";
  ctx.fillText(text, x, y - 19);
  ctx.textAlign = "left";
}

function drawShieldHouse2D(ctx: CanvasRenderingContext2D, camX: number) {
  const x = SHIELD_HOUSE_X - camX;
  if (x < -160 || x > W + 160) return;
  // porta destacada com estandarte templário
  ctx.fillStyle = "#4a2f16";
  ctx.beginPath();
  ctx.moveTo(x - 30, GROUND);
  ctx.lineTo(x - 30, GROUND - 60);
  ctx.arc(x, GROUND - 60, 30, Math.PI, 0);
  ctx.lineTo(x + 30, GROUND);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = "#e8c46a";
  ctx.lineWidth = 4;
  ctx.stroke();
  ctx.fillStyle = "#f2ece0";
  ctx.fillRect(x - 16, GROUND - 150, 32, 46);
  ctx.fillStyle = "#b3352f";
  ctx.fillRect(x - 3, GROUND - 146, 6, 38);
  ctx.fillRect(x - 13, GROUND - 133, 26, 6);
}

function drawMill(ctx: CanvasRenderingContext2D, camX: number, general: Enemy) {
  const x = MILL_X - camX;
  if (x < -320 || x > W + 320) return;
  // corpo
  ctx.fillStyle = "#9b9081";
  ctx.beginPath();
  ctx.moveTo(x - 20, GROUND);
  ctx.lineTo(x + 8, GROUND - 200);
  ctx.lineTo(x + 74, GROUND - 200);
  ctx.lineTo(x + 102, GROUND);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = "#5b5248";
  ctx.lineWidth = 3;
  ctx.stroke();
  // telhado
  ctx.fillStyle = "#6d4a3a";
  ctx.beginPath();
  ctx.moveTo(x - 2, GROUND - 198);
  ctx.lineTo(x + 41, GROUND - 250);
  ctx.lineTo(x + 84, GROUND - 198);
  ctx.closePath();
  ctx.fill();
  // pás
  ctx.save();
  ctx.translate(x + 41, GROUND - 210);
  ctx.rotate(performance.now() / 2200);
  ctx.fillStyle = "#c8b48a";
  for (let i = 0; i < 4; i++) {
    ctx.rotate(Math.PI / 2);
    ctx.fillRect(-6, -110, 12, 100);
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
    const gx = x + 100;
    ctx.save();
    ctx.translate(gx, GROUND - 90);
    ctx.fillStyle = "#3f5a4a";
    ctx.fillRect(-16, -30, 32, 60);
    ctx.fillStyle = "#d8cfae";
    ctx.beginPath();
    ctx.arc(0, -42, 13, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
    drawTemplarShield(ctx, gx, GROUND - 100, 0.8);
  }
}

function drawMillExit(ctx: CanvasRenderingContext2D, camX: number) {
  const x = 120 - camX;
  ctx.fillStyle = "#9b9081";
  ctx.beginPath();
  ctx.moveTo(x - 20, GROUND);
  ctx.lineTo(x + 8, GROUND - 200);
  ctx.lineTo(x + 74, GROUND - 200);
  ctx.lineTo(x + 102, GROUND);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = "#5c3d21";
  ctx.fillRect(x + 12, GROUND - 110, 60, 110);
  ctx.fillStyle = "rgba(240,226,192,0.9)";
  ctx.font = "20px serif";
  ctx.textAlign = "center";
  ctx.fillText("Fase 2 — Outra parte da aldeia", W / 2, 92);
  ctx.textAlign = "left";
}

function drawKnight(
  ctx: CanvasRenderingContext2D,
  camX: number,
  t: number,
  ball: Ball,
) {
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

  if (Math.abs(ball.x - KNIGHT_X) < 260) {
    speech(ctx, x, base - 100, "Nossa vila está sendo atacada!");
  }
}

function drawEnemy(ctx: CanvasRenderingContext2D, camX: number, t: number, e: Enemy) {
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
      e.kind === "general"
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
