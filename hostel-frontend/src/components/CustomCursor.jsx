"use client"

import { useEffect, useState } from "react"

export default function CustomCursor() {

    const [position, setPosition] = useState({ x: 0, y: 0 })

    useEffect(() => {
        const move = (e) => {
            setPosition({ x: e.clientX, y: e.clientY })
        }

        window.addEventListener("mousemove", move)

        return () => window.removeEventListener("mousemove", move)
    }, [])

    return (
        <div
            style={{
                left: position.x,
                top: position.y
            }}
            className="fixed w-5 h-5 bg-blue-500 rounded-full pointer-events-none opacity-70 blur-sm transform -translate-x-1/2 -translate-y-1/2 z-[999] hidden md:block"
        />
    )
}
