import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";

export function ProjectList() {
    return (
        <div className="grid grid-cols-3 gap-4">
            <Card>
                <CardHeader>
                    <CardTitle>Projeto 01</CardTitle>
                    <CardDescription className="line-clamp-2 leading-relaxed">
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Accusantium quaerat ducimus asperiores veritatis.
                    </CardDescription>
                </CardHeader>
                <CardFooter className="flex items-center gap-1.5">
                    <Avatar className="size-4">
                        <AvatarImage src='http://github.com/razecflavio.png' />
                        <AvatarFallback />
                    </Avatar>
                    <span className="text-muted-foreground text-xs">
                        Created by <span className="font-medium text-foreground">Flavio Cezar</span> a day ago.
                    </span>
                    <Button size={'xs'} variant={"outline"} className="ml-auto">
                        View <ArrowRight className="size-3 ml-2" />
                    </Button>
                </CardFooter>
            </Card>
        </div>
    )
}