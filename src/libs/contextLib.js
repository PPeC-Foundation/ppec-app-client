// React required
import { useContext, createContext } from "react";
//------------------------------------------------------ \\
// This file can be exported/used across the entire App
// -------------- Application Begins Bellow ------------ //

// This context saves User and Contract information for our App
export const AppContext = createContext(null);

// This context uses the AppContext
export function useAppContext() {
    return useContext(AppContext);
}