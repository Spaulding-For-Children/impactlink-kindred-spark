import { motion } from "framer-motion";
import { MapPin, Mail, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface ProfileCardProps {
  id: number;
  name: string;
  title?: string;
  organization?: string;
  location: string;
  email?: string;
  avatar?: string;
  tags: string[];
  description: string;
  type: "student" | "researcher" | "agency";
  index: number;
}

export const ProfileCard = ({
  id,
  name,
  title,
  organization,
  location,
  email,
  avatar,
  tags,
  description,
  type,
  index,
}: ProfileCardProps) => {
  const profileUrl = `/${type}s/${id}`;
  const colorClasses = {
    student: {
      bg: "bg-amber/10",
      text: "text-amber",
      badge: "bg-amber/10 text-amber hover:bg-amber/20",
    },
    researcher: {
      bg: "bg-navy/10",
      text: "text-navy",
      badge: "bg-navy/10 text-navy hover:bg-navy/20",
    },
    agency: {
      bg: "bg-sage/10",
      text: "text-sage",
      badge: "bg-sage/10 text-sage hover:bg-sage/20",
    },
  };

  const colors = colorClasses[type];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="group bg-card rounded-2xl border border-border shadow-soft hover:shadow-elevated transition-all duration-300 overflow-hidden"
    >
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start gap-4 mb-4">
          <div
            className={`w-14 h-14 rounded-xl ${colors.bg} flex items-center justify-center flex-shrink-0`}
          >
            {avatar ? (
              <img
                src={avatar}
                alt={name}
                className="w-full h-full object-cover rounded-xl"
              />
            ) : (
              <span className={`text-xl font-bold ${colors.text}`}>
                {name.charAt(0)}
              </span>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-display font-bold text-lg text-foreground truncate">
              {name}
            </h3>
            {title && (
              <p className="text-sm text-muted-foreground truncate">{title}</p>
            )}
            {organization && (
              <p className={`text-sm ${colors.text} truncate`}>{organization}</p>
            )}
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
          {description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {tags.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="secondary" className={colors.badge}>
              {tag}
            </Badge>
          ))}
          {tags.length > 3 && (
            <Badge variant="outline" className="text-muted-foreground">
              +{tags.length - 3}
            </Badge>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-border">
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              {location}
            </span>
            {email && (
              <span className="flex items-center gap-1">
                <Mail className="h-3 w-3" />
                Contact
              </span>
            )}
          </div>
          <Link to={profileUrl}>
            <Button
              variant="ghost"
              size="sm"
              className={`${colors.text} hover:${colors.bg}`}
            >
              View Profile
              <ExternalLink className="h-3 w-3 ml-1" />
            </Button>
          </Link>
        </div>
      </div>
    </motion.div>
  );
};
