import { getCurrentOrg } from "@/auth/auth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getBilling } from "@/http/get-billing";
import { toCurrency } from "@/lib/utils";

export async function Billing() {
    const currentOrg = await getCurrentOrg();
    const { billing } = await getBilling(currentOrg!)

    return <>
        <Separator />
        <Card>
            <CardHeader>
                <CardTitle>Billing</CardTitle>
                <CardDescription>
                    Information abou your organization costs
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Cost Type</TableHead>
                            <TableHead className="text-right" style={{ width: 120 }}>Quantity</TableHead>
                            <TableHead className="text-right" style={{ width: 200 }}>SubTotal</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <TableRow>
                            <TableCell>Amount of projects</TableCell>
                            <TableCell className="text-right">{billing.projects.amount}</TableCell>
                            <TableCell className="text-right">{toCurrency(billing.projects.price)} ( {toCurrency(billing.projects.unit)} each )</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>Amount of seats</TableCell>
                            <TableCell className="text-right">{billing.seats.amount}</TableCell>
                            <TableCell className="text-right">{toCurrency(billing.seats.price)} ( {toCurrency(billing.seats.unit)} each )</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell></TableCell>
                            <TableCell className="text-right">Total</TableCell>
                            <TableCell className="text-right">{toCurrency(billing.total)}</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    </>
}