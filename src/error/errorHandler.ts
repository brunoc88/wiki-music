import { AppError } from "@/error/appError"
import { NextResponse } from "next/server"

const errorHandler = (error: any) => {
    if (error instanceof AppError) {
        return NextResponse.json(
            { error: error.message },
            { status: error.status }
        )
    }
    
    if (error.code === "P2002") {
        return NextResponse.json(
            { error: `El campo ${error.meta.target} ya está en uso` },
            { status: 409 }
        )
    }

   
    if (error.code === 'P2025') {
        return NextResponse.json(
            { error: 'Recurso no encontrado' },
            { status: 404 }
        )
    }

    
    return NextResponse.json({ error: error.message }, { status: 500 })
}

export default errorHandler