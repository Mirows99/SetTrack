'use client'

import { createClient } from '@/lib/supabase/client'
import { createContext, useContext, useState } from 'react'
import type { SupabaseClient } from '@supabase/supabase-js'

type SupabaseContext = {
    supabase: SupabaseClient
}

const Context = createContext<SupabaseContext | undefined>(undefined)

export function SupabaseProvider({ children }: { children: React.ReactNode }) {
    // lazyInit to prevent new client on every render, fcking remember this you idiot
    const [supabase] = useState(() => createClient())

    return (
        <Context.Provider value={{ supabase }}>
            {children}
        </Context.Provider>
    )
}

export const useSupabase = () => {
    const context = useContext(Context)
    if (context === undefined) {
        throw new Error('useSupabase must be used inside SupabaseProvider')
    }
    return context
}