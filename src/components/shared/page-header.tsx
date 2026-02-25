import { ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  description?: string;
  action?: ReactNode;
}

export function PageHeader({ title, description, action }: PageHeaderProps) {
  return (
    <div className="gradient-header rounded-2xl p-6 sm:p-8 mb-8 text-white">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-script text-3xl sm:text-4xl mb-1">{title}</h1>
          {description && (
            <p className="text-white/80 text-sm sm:text-base">{description}</p>
          )}
        </div>
        {action && <div className="shrink-0">{action}</div>}
      </div>
    </div>
  );
}
