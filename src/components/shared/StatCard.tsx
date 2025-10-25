import { Card, CardContent } from "../ui/card";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  icon: LucideIcon;
  value: string | number;
  label: string;
  iconColor?: string;
}

export function StatCard({ icon: Icon, value, label, iconColor = "text-blue-500" }: StatCardProps) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="text-center">
          <Icon className={`w-8 h-8 mx-auto mb-2 ${iconColor}`} />
          <div className="text-2xl mb-1">{value}</div>
          <div className="text-sm text-gray-600">{label}</div>
        </div>
      </CardContent>
    </Card>
  );
}
