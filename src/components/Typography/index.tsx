import React from 'react';
import { Text, TextProps, TextStyle, StyleSheet } from 'react-native';
import { useTheme, textStyles } from '../../theme';

type TextVariant = keyof typeof textStyles;

interface TypographyProps extends TextProps {
  variant?: TextVariant;
  color?: string;
  align?: TextStyle['textAlign'];
  children: React.ReactNode;
}

export const Typography: React.FC<TypographyProps> = ({
  variant = 'bodyMedium',
  color,
  align,
  style,
  children,
  ...props
}) => {
  const theme = useTheme();

  const textColor = color || theme.colors.text;
  const variantStyle = textStyles[variant];

  return (
    <Text
      style={[
        variantStyle,
        { color: textColor },
        align && { textAlign: align },
        style,
      ]}
      {...props}
    >
      {children}
    </Text>
  );
};

// Convenience components for common variants
export const DisplayText: React.FC<Omit<TypographyProps, 'variant'>> = (props) => (
  <Typography variant="displayMedium" {...props} />
);

export const Heading1: React.FC<Omit<TypographyProps, 'variant'>> = (props) => (
  <Typography variant="h1" {...props} />
);

export const Heading2: React.FC<Omit<TypographyProps, 'variant'>> = (props) => (
  <Typography variant="h2" {...props} />
);

export const Heading3: React.FC<Omit<TypographyProps, 'variant'>> = (props) => (
  <Typography variant="h3" {...props} />
);

export const BodyText: React.FC<Omit<TypographyProps, 'variant'>> = (props) => (
  <Typography variant="bodyMedium" {...props} />
);

export const Label: React.FC<Omit<TypographyProps, 'variant'>> = (props) => (
  <Typography variant="labelMedium" {...props} />
);

export const Caption: React.FC<Omit<TypographyProps, 'variant'>> = (props) => (
  <Typography variant="caption" {...props} />
);

export const NumericText: React.FC<Omit<TypographyProps, 'variant'> & { size?: 'sm' | 'md' | 'lg' }> = ({
  size = 'md',
  ...props
}) => {
  const variant = size === 'lg' ? 'numericLarge' : size === 'sm' ? 'numericSmall' : 'numericMedium';
  return <Typography variant={variant} {...props} />;
};

export default Typography;
