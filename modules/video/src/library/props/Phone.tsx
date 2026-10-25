// Phone.tsx: a phone, front on (560×1140 px; place and scale it with the wrapper's style). Two screens:
//   lock   the lock screen: the clock, the date, and a notification sliding down from the top (notif 0..1)
//   chat   a group chat: the header (with who is typing), a date pill, message bubbles fading in, a read count
// No brand: a generic messaging app with a green accent.
import React from "react";
import { easeOut } from "../../lib/anim";
import { ROBOTO } from "../style";

export type Message = { from: string; color: string; text: string; time: string; a: number; avatar?: React.ReactNode };
export type Notification = { app: string; title: string; body: string; avatar?: React.ReactNode; titleColor?: string };

export const PHONE_W = 560, PHONE_H = 1140;

export const Phone: React.FC<{
  screen: "lock" | "chat"; clock?: string; date?: string; notif?: number; notification?: Notification;
  group?: string; members?: string; typing?: string; messages?: Message[]; seen?: number; seenText?: string;
  style?: React.CSSProperties; t?: number;
}> = ({ screen, clock = "02:00", date = "Pazar, 25 Ekim", notif = 0, notification, group = "Apartman Grubu", members = "", typing, messages = [], seen = 0, seenText = "", style, t = 0 }) => (
  <div style={{ position: "absolute", width: PHONE_W, height: PHONE_H, borderRadius: 78, background: "#1C1A20", border: "5px solid #0D0C10", boxShadow: "0 0 140px rgba(140,170,255,.25)", fontFamily: ROBOTO, ...style }}>
    <div style={{ position: "absolute", inset: 14, borderRadius: 64, overflow: "hidden", background: screen === "lock" ? "linear-gradient(170deg, #1E2540 0%, #141828 55%, #0E101A 100%)" : "#ECE4D8" }}>
      <div style={{ position: "absolute", top: 22, left: "50%", transform: "translateX(-50%)", width: 130, height: 38, borderRadius: 20, background: "#0B0A0D", zIndex: 5 }} />
      {screen === "lock" ? (
        <>
          <div style={{ position: "absolute", top: 150, width: "100%", textAlign: "center", color: "#E8ECF8", fontSize: 30, letterSpacing: 1 }}>{date}</div>
          <div style={{ position: "absolute", top: 180, width: "100%", textAlign: "center", color: "#F2F4FB", fontSize: 168, fontWeight: 700, letterSpacing: -4 }}>{clock}</div>
          {notification && notif > 0 && (
            <div style={{ position: "absolute", left: 22, right: 22, top: 430 - 140 * (1 - easeOut(notif)), opacity: Math.min(1, notif * 2.5), borderRadius: 30, padding: "22px 24px", background: "rgba(236,240,250,.92)", display: "flex", gap: 18, alignItems: "center" }}>
              {notification.avatar ?? <AppIcon />}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 22, color: "#5E6170" }}><span>{notification.app}</span><span>şimdi</span></div>
                <div style={{ fontSize: 28, fontWeight: 700, color: notification.titleColor ?? "#15161C", marginTop: 4 }}>{notification.title}</div>
                <div style={{ fontSize: 26, color: "#2A2C36", marginTop: 2 }}>{notification.body}</div>
              </div>
            </div>
          )}
          <div style={{ position: "absolute", bottom: 26, left: "50%", transform: "translateX(-50%)", width: 160, height: 8, borderRadius: 4, background: "#E8ECF8" }} />
        </>
      ) : (
        <>
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 210, background: "#F7F4EE", borderBottom: "1px solid #D5CEC2" }}>
            <div style={{ position: "absolute", top: 34, left: 52, fontSize: 24, fontWeight: 700, color: "#1E1B22" }}>{clock}</div>
            <div style={{ position: "absolute", top: 118, left: 30, fontSize: 40, color: "#2F7AF5" }}>‹</div>
            <div style={{ position: "absolute", top: 112, left: 70 }}><AppIcon size={62} /></div>
            <div style={{ position: "absolute", top: 112, left: 148, fontSize: 30, fontWeight: 700, color: "#1E1B22" }}>{group}</div>
            <div style={{ position: "absolute", top: 152, left: 148, fontSize: 21, fontWeight: typing ? 700 : 400, color: typing ? "#1F8A70" : "#8A8478" }}>
              {typing ? `${typing} yazıyor${".".repeat(1 + (Math.floor(t * 3) % 3))}` : members}
            </div>
          </div>
          <div style={{ position: "absolute", top: 236, left: "50%", transform: "translateX(-50%)", fontSize: 19, color: "#6F695F", background: "#DCD5C9", borderRadius: 12, padding: "4px 16px" }}>Bugün</div>
          <div style={{ position: "absolute", top: 290, left: 26, right: 26, display: "flex", flexDirection: "column", gap: 30 }}>
            {messages.map((m, i) => (
              <div key={i} style={{ opacity: m.a, transform: `translateY(${(1 - easeOut(m.a)) * 30}px)`, display: "flex", gap: 12, alignItems: "flex-end" }}>
                <div style={{ flexShrink: 0 }}>{m.avatar}</div>
                <div style={{ background: "#FDFBF6", borderRadius: 22, padding: "16px 22px 12px", maxWidth: 400, boxShadow: "0 2px 0 #D8D0C2" }}>
                  <div style={{ fontSize: 22, fontWeight: 700, color: m.color }}>{m.from}</div>
                  <div style={{ fontSize: 30, color: "#1E1B22", lineHeight: 1.3, marginTop: 4 }}>{m.text}</div>
                  <div style={{ fontSize: 18, color: "#8A8478", textAlign: "right", marginTop: 4 }}>{m.time}</div>
                  {i === 0 && seen > 0 && <div style={{ position: "absolute", marginTop: 14, fontSize: 20, color: "#8A8478", opacity: seen }}>{seenText}</div>}
                </div>
              </div>
            ))}
          </div>
          <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 110, background: "#F7F4EE", borderTop: "1px solid #D5CEC2" }}>
            <div style={{ position: "absolute", top: 22, left: 70, right: 90, height: 52, borderRadius: 26, background: "#FFFDF8", border: "1px solid #C9C2B6", fontSize: 22, color: "#A39C90", padding: "12px 22px", boxSizing: "border-box" }}>Mesaj</div>
            <div style={{ position: "absolute", top: 22, right: 24, width: 52, height: 52, borderRadius: 26, background: "#1F8A70" }} />
          </div>
        </>
      )}
    </div>
  </div>
);

const AppIcon: React.FC<{ size?: number }> = ({ size = 70 }) => (
  <div style={{ width: size, height: size, borderRadius: size * .28, background: "#1F8A70", color: "#F7F4EE", fontSize: size * .5, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>A</div>
);
