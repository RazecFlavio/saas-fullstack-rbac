import { Sheet, SheetHeader, SheetTitle } from "@/components/ui/sheet";

import { InterceptedSheetContent } from "@/components/intercepted-sheet-content";
import { OrganizationForm } from "../../org/organization-form";

export default function CreateOrganization() {
    return (
        <Sheet defaultOpen>
            <InterceptedSheetContent>
                <SheetHeader>
                    <SheetTitle>Create Organization</SheetTitle>
                </SheetHeader>

                <div className="py-4">
                    <OrganizationForm />
                </div>
            </InterceptedSheetContent>
        </Sheet>
    )
}