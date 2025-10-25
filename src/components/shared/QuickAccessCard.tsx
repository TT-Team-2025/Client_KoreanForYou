import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { ChevronRight, LucideIcon } from "lucide-react";

interface QuickAccessCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  iconBgColor?: string;
  iconColor?: string;
  borderHoverColor?: string;
  onClick?: () => void;
}

export function QuickAccessCard({ 
  icon: Icon, 
  title, 
  description, 
  iconBgColor = "bg-blue-100",
  iconColor = "text-blue-600",
  borderHoverColor = "hover:border-blue-500",
  onClick 
}: QuickAccessCardProps) {
  return (
    <Card 
      className={`cursor-pointer hover:shadow-lg transition-all border-2 ${borderHoverColor}`}
      onClick={onClick}
    >
      <CardHeader>
        <div className="flex items-center justify-between mb-2">
          <div className={`w-12 h-12 rounded-lg ${iconBgColor} flex items-center justify-center`}>
            <Icon className={`w-6 h-6 ${iconColor}`} />
          </div>
          <ChevronRight className="w-5 h-5 text-gray-400" />
        </div>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
    </Card>
  );
}
