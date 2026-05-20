import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  subtitle?: string;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  title,
  subtitle,
  onClick,
}) => {
  const cardClasses = `ui-card ${onClick ? 'ui-card-interactive' : ''} ${className}`;

  return (
    <div className={cardClasses} onClick={onClick}>
      {(title || subtitle) && (
        <div className="ui-card-header">
          {title && <h3 className="ui-card-title">{title}</h3>}
          {subtitle && <span className="ui-card-subtitle">{subtitle}</span>}
        </div>
      )}
      <div className="ui-card-content">{children}</div>
    </div>
  );
};
