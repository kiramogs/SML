"use client";

import { motion, useInView, AnimatePresence } from "framer-motion";
import { useRef, useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast, Toaster } from "sonner";

const feelings = [
    { id: "hurt", label: "Hurt", icon: "◆" },
    { id: "upset", label: "Upset", icon: "◇" },
    { id: "okay", label: "Okay", icon: "○" },
    { id: "need-time", label: "Need time", icon: "◎" },
    { id: "want-to-talk", label: "Want to talk", icon: "◈" },
] as const;

const schema = z.object({
    feeling: z.string().min(1, "Choose how you feel"),
    message: z.string().min(1, "Write something, anything").max(1000),
});
type FormValues = z.infer<typeof schema>;
type SendState = "idle" | "folding" | "sent";

export default function ResponseSection() {
    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { once: true, margin: "-10%" });
    const [selected, setSelected] = useState<string | null>(null);
    const [sendState, setSendState] = useState<SendState>("idle");
    const [toneText, setToneText] = useState("");
    const [charCount, setCharCount] = useState(0);

    const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<FormValues>({
        resolver: zodResolver(schema),
    });
    const msg = watch("message", "");

    // Extract register so we can combine onChange handlers
    const messageReg = register("message");

    const pick = useCallback((id: string) => {
        setSelected(id);
        setValue("feeling", id, { shouldValidate: true });
    }, [setValue]);

    const onMsgChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        messageReg.onChange(e); // let react-hook-form track the value
        const len = e.target.value.length;
        setCharCount(len);
        setToneText(len === 0 ? "" : len > 50 ? "Thank you for sharing" : len > 8 ? "Received" : "");
    };

    const onSubmit = async (data: FormValues) => {
        if (sendState !== "idle") return;
        setSendState("folding");
        try {
            await fetch("/api/response", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...data, timestamp: Date.now() }),
            });
            toast.success("Your note has been received", {
                description: "Thank you for being honest, Nandini.",
                duration: 4000,
                style: {
                    background: "rgba(12,18,34,0.95)",
                    border: "1px solid rgba(94,234,212,0.2)",
                    color: "#f5f0e8",
                    backdropFilter: "blur(12px)",
                },
            });
        } catch (e) {
            console.error(e);
            toast.error("Couldn't send — but I still heard you.");
        }
        setTimeout(() => setSendState("sent"), 1100);
    };

    return (
        <section id="response" className="relative px-6 py-32 flex justify-center">
            <Toaster position="top-center" />
            <div className="w-full max-w-xl" ref={ref}>
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={isInView ? { opacity: 1 } : {}}
                    transition={{ duration: 0.7 }}
                    className="text-center mb-3"
                    style={{
                        fontFamily: "var(--font-body)", fontSize: "0.7rem",
                        letterSpacing: "0.4em", textTransform: "uppercase" as const,
                        color: "rgba(94,234,212,0.4)",
                    }}
                >
                    your turn
                </motion.p>

                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.9, delay: 0.1, ease: [0.22, 1, 0.36, 1] as const }}
                    className="text-center mb-12"
                    style={{
                        fontFamily: "var(--font-heading)",
                        fontSize: "clamp(1.8rem, 5vw, 2.6rem)",
                        fontWeight: 400, fontStyle: "italic",
                        color: "var(--ivory)", lineHeight: 1.2,
                    }}
                >
                    How are you feeling?
                </motion.h2>

                <AnimatePresence mode="wait">
                    {sendState === "sent" ? (
                        <Confirmation key="done" />
                    ) : (
                        <motion.form
                            key="form"
                            onSubmit={handleSubmit(onSubmit)}
                            exit={{ opacity: 0, scale: 0.97 }}
                            transition={{ duration: 0.35 }}
                            className="space-y-8"
                        >
                            {/* Feeling chips */}
                            <motion.div
                                initial={{ opacity: 0, y: 24 }}
                                animate={isInView ? { opacity: 1, y: 0 } : {}}
                                transition={{ duration: 0.8, delay: 0.2 }}
                            >
                                <div className="flex flex-wrap gap-3 justify-center" role="radiogroup">
                                    {feelings.map((f, i) => (
                                        <Chip key={f.id} f={f} selected={selected === f.id} onPick={pick} i={i} inView={isInView} />
                                    ))}
                                </div>
                                {errors.feeling && (
                                    <p className="text-center mt-3" style={{ color: "rgba(94,234,212,0.6)", fontSize: "0.8rem" }}>
                                        {errors.feeling.message}
                                    </p>
                                )}
                            </motion.div>

                            {/* Textarea */}
                            <motion.div
                                initial={{ opacity: 0, y: 24 }}
                                animate={isInView ? { opacity: 1, y: 0 } : {}}
                                transition={{ duration: 0.8, delay: 0.35 }}
                                style={{ position: "relative" }}
                            >
                                <motion.textarea
                                    name={messageReg.name}
                                    ref={messageReg.ref}
                                    onBlurCapture={messageReg.onBlur}
                                    placeholder="Say anything. Or nothing. This space is yours."
                                    onChange={onMsgChange}
                                    rows={3}
                                    animate={{ height: msg.length > 120 ? "155px" : msg.length > 40 ? "115px" : "88px" }}
                                    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] as const }}
                                    style={{
                                        width: "100%",
                                        background: "rgba(245,240,232,0.03)",
                                        border: "1px solid rgba(94,234,212,0.12)",
                                        borderRadius: "14px",
                                        padding: "1.1rem 1.3rem",
                                        fontFamily: "var(--font-body)",
                                        fontSize: "0.92rem", fontWeight: 300,
                                        color: "var(--ivory-dim)",
                                        resize: "none", outline: "none",
                                        backdropFilter: "blur(8px)",
                                        lineHeight: 1.75,
                                        transition: "border-color 0.3s, box-shadow 0.3s",
                                    }}
                                    onFocus={(e) => {
                                        e.target.style.borderColor = "rgba(94,234,212,0.35)";
                                        e.target.style.boxShadow = "0 0 0 3px rgba(94,234,212,0.06), 0 0 24px rgba(94,234,212,0.04)";
                                    }}
                                    onBlur={(e) => {
                                        e.target.style.borderColor = "rgba(94,234,212,0.12)";
                                        e.target.style.boxShadow = "none";
                                    }}
                                />

                                {/* Bottom bar: tone meter + char count */}
                                <div style={{
                                    display: "flex", justifyContent: "space-between",
                                    alignItems: "center", padding: "0 4px", marginTop: "6px",
                                }}>
                                    <AnimatePresence>
                                        {toneText && (
                                            <motion.span
                                                initial={{ opacity: 0, x: -8 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: -8 }}
                                                transition={{ duration: 0.35 }}
                                                style={{
                                                    fontFamily: "var(--font-body)", fontSize: "0.68rem",
                                                    color: "rgba(212,160,83,0.55)", letterSpacing: "0.05em",
                                                }}
                                            >
                                                {toneText}
                                            </motion.span>
                                        )}
                                    </AnimatePresence>
                                    <span style={{
                                        fontFamily: "var(--font-body)", fontSize: "0.62rem",
                                        color: charCount > 900 ? "rgba(251,113,133,0.6)" : "rgba(245,240,232,0.15)",
                                        marginLeft: "auto",
                                        transition: "color 0.3s",
                                    }}>
                                        {charCount > 0 && `${charCount}/1000`}
                                    </span>
                                </div>

                                {errors.message && (
                                    <p className="mt-1" style={{ color: "rgba(94,234,212,0.6)", fontSize: "0.8rem" }}>
                                        {errors.message.message}
                                    </p>
                                )}
                            </motion.div>

                            {/* Send */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={isInView ? { opacity: 1 } : {}}
                                transition={{ delay: 0.5 }}
                                className="flex justify-center"
                            >
                                <motion.button
                                    type="submit"
                                    disabled={sendState !== "idle"}
                                    whileHover={sendState === "idle" ? {
                                        scale: 1.05, y: -3,
                                        boxShadow: "0 0 50px rgba(94,234,212,0.3), 0 8px 24px rgba(0,0,0,0.35)",
                                    } : {}}
                                    whileTap={sendState === "idle" ? { scale: 0.96 } : {}}
                                    animate={sendState === "folding"
                                        ? { y: -80, scale: 0.45, opacity: 0, rotate: -15 }
                                        : { y: 0, scale: 1, opacity: 1, rotate: 0 }}
                                    transition={sendState === "folding"
                                        ? { duration: 0.9, ease: [0.22, 1, 0.36, 1] as const }
                                        : { type: "spring", stiffness: 300, damping: 20 }}
                                    style={{
                                        padding: "0.85rem 2.6rem", borderRadius: "100px", border: "none",
                                        background: "linear-gradient(135deg, rgba(94,234,212,0.75), rgba(139,92,246,0.55), rgba(94,234,212,0.5))",
                                        color: "var(--midnight)", fontFamily: "var(--font-body)",
                                        fontSize: "0.9rem", fontWeight: 600, letterSpacing: "0.04em",
                                        cursor: sendState === "idle" ? "pointer" : "default",
                                        boxShadow: "0 0 35px rgba(94,234,212,0.2), 0 6px 20px rgba(0,0,0,0.35)",
                                        display: "flex", alignItems: "center", gap: "0.5rem",
                                        position: "relative", overflow: "hidden",
                                    }}
                                >
                                    <motion.span
                                        className="absolute inset-0"
                                        style={{
                                            background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)",
                                            pointerEvents: "none",
                                        }}
                                        animate={{ x: ["-100%", "200%"] }}
                                        transition={{ repeat: Infinity, duration: 3, ease: "linear", repeatDelay: 2 }}
                                    />
                                    {sendState === "folding" ? "Sending…" : "Send as a note"}
                                </motion.button>
                            </motion.div>
                        </motion.form>
                    )}
                </AnimatePresence>
            </div>
        </section>
    );
}

/* ─── Chip ─── */
function Chip({ f, selected, onPick, i, inView }: {
    f: { id: string; label: string; icon: string }; selected: boolean;
    onPick: (id: string) => void; i: number; inView: boolean;
}) {
    return (
        <motion.button
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => onPick(f.id)}
            initial={{ opacity: 0, y: 16 }}
            animate={inView
                ? selected
                    ? { opacity: 1, y: 0, scale: [1, 1.12, 0.97, 1.03, 1] }
                    : { opacity: 1, y: 0, scale: 1 }
                : { opacity: 0, y: 16 }}
            transition={{ duration: 0.5, delay: inView ? 0.2 + i * 0.07 : 0, ease: [0.22, 1, 0.36, 1] as const }}
            whileHover={{ scale: 1.08, y: -3, boxShadow: "0 0 24px rgba(94,234,212,0.2), 0 6px 14px rgba(0,0,0,0.25)" }}
            whileTap={{ scale: 0.94 }}
            style={{
                padding: "0.6rem 1.4rem", borderRadius: "100px",
                border: selected ? "1px solid rgba(94,234,212,0.55)" : "1px solid rgba(245,240,232,0.08)",
                background: selected
                    ? "linear-gradient(135deg, rgba(94,234,212,0.16), rgba(139,92,246,0.08))"
                    : "rgba(245,240,232,0.03)",
                color: selected ? "var(--teal-soft)" : "var(--ivory-faint)",
                fontFamily: "var(--font-body)", fontSize: "0.86rem",
                fontWeight: selected ? 500 : 400,
                cursor: "pointer",
                backdropFilter: "blur(8px)",
                boxShadow: selected
                    ? "0 0 20px rgba(94,234,212,0.18), 0 4px 12px rgba(0,0,0,0.2)"
                    : "0 2px 6px rgba(0,0,0,0.12)",
                transition: "background 0.3s, border-color 0.3s, color 0.3s, box-shadow 0.3s",
                position: "relative", overflow: "hidden",
                display: "flex", alignItems: "center", gap: "0.45rem",
            }}
        >
            {/* Ripple on select */}
            {selected && (
                <motion.span
                    initial={{ scale: 0, opacity: 0.5 }}
                    animate={{ scale: 3, opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    style={{
                        position: "absolute", inset: 0, borderRadius: "inherit",
                        background: "rgba(94,234,212,0.12)", pointerEvents: "none",
                    }}
                />
            )}
            <span style={{
                fontSize: "0.65rem",
                color: selected ? "var(--teal-soft)" : "rgba(245,240,232,0.25)",
                transition: "color 0.3s",
            }}>
                {f.icon}
            </span>
            {f.label}
            {selected && (
                <motion.span
                    initial={{ scale: 0, rotate: -90 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 400, damping: 18 }}
                    style={{ fontSize: "0.7rem" }}
                >✓</motion.span>
            )}
        </motion.button>
    );
}

/* ─── Confirmation ─── */
function Confirmation() {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] as const }}
            className="flex flex-col items-center gap-5 py-12"
        >
            <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
                style={{
                    width: "72px", height: "72px", borderRadius: "50%",
                    background: "linear-gradient(135deg, rgba(94,234,212,0.14), rgba(212,160,83,0.1))",
                    border: "1px solid rgba(94,234,212,0.25)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "1.6rem",
                    boxShadow: "0 0 30px rgba(94,234,212,0.15)",
                }}
            >
                ☽
            </motion.div>
            <motion.p
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                style={{
                    fontFamily: "var(--font-heading)",
                    fontSize: "clamp(1.3rem, 4vw, 1.8rem)",
                    fontStyle: "italic", fontWeight: 400,
                    color: "var(--ivory)", textAlign: "center",
                }}
            >
                Your note is received.
            </motion.p>
            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "0.88rem", fontWeight: 300,
                    color: "var(--ivory-faint)", textAlign: "center",
                    maxWidth: "260px", lineHeight: 1.7,
                }}
            >
                Thank you for sharing, Nandini. It means everything.
            </motion.p>
        </motion.div>
    );
}
