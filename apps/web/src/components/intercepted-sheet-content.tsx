'use client'

import * as React from "react"
import * as SheetPrimitive from "@radix-ui/react-dialog"
import { type VariantProps } from "class-variance-authority"
import { X } from "lucide-react"
import { SheetOverlay, SheetPortal, sheetVariants } from "./ui/sheet"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"

interface InterceptedSheetContentProps
    extends React.ComponentPropsWithoutRef<typeof SheetPrimitive.Content>,
    VariantProps<typeof sheetVariants> { }

export const InterceptedSheetContent = React.forwardRef<
    React.ElementRef<typeof SheetPrimitive.Content>,
    InterceptedSheetContentProps
>(({ side = "right", className, children, ...props }, ref) => {
    const router = useRouter();
    function onDismiss() {
        router.back();
    }

    return (
        <SheetPortal>
            <SheetOverlay />
            <SheetPrimitive.Content
                ref={ref}
                onEscapeKeyDown={onDismiss}
                onPointerDownOutside={onDismiss}
                className={cn(sheetVariants({ side }), className)}
                {...props}
            >
                <SheetPrimitive.Close
                    onClick={onDismiss}
                    className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary">
                    <X className="h-4 w-4" />
                    <span className="sr-only">Close</span>
                </SheetPrimitive.Close>
                {children}
            </SheetPrimitive.Content>
        </SheetPortal>
    )
})

InterceptedSheetContent.displayName = SheetPrimitive.Content.displayName