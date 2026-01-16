import { NextResponse } from "next/server"

const errorHandler = (error: any) => {
    if (error.code === "P2002") {
        return NextResponse.json(
            { error: `El campo ${error.meta.target} ya está en uso` },
            { status: 409 }
        )
    }

    // cuestion: preguntar si usarlo o crear clase
    if (error.code === 'P2025') {
        return NextResponse.json(
            { error: 'Recurso no encontrado' },
            { status: 404 }
        )
    }

    return NextResponse.json({ error: error.message }, { status: 500 })
}

export default errorHandler