"use client";
import React, { useState } from "react";
import {  Menu, MenuItem } from "@/components/ui/navbar-menu";
// import { cn } from "@/utils/cn";
import Link from 'next/link'

export default function navbar() {
    return (
        <div>
            <Navbar />
        </div>
    );
}

function Navbar() {
    const [active, setActive] = useState<string | null>(null);
    return (
        <div>
            <Menu setActive={setActive}>
                {/* <Link href="/">
                    <MenuItem setActive={setActive} item="Home"></MenuItem>
                </Link> */}
                <Link href="/auth/register">
                    <MenuItem setActive={setActive} item="Register"></MenuItem>
                </Link>
                <Link href="/auth/login">
                    <MenuItem setActive={setActive}  item="Login"></MenuItem>
                </Link>
            </Menu>
        </div>
    );
}