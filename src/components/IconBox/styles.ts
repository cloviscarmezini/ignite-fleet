import { css } from 'styled-components';
import styled from 'styled-components/native';

export type SizeProps = 'SMALL' | 'NORMAL';

type Props = {
  size: SizeProps;
}

const variantSizeStyles = (size: SizeProps) => {
  return {
    SMALL: css`
      height: 32px;
      width: 32px;
    `,
    NORMAL: css`
      height: 46px;
      width: 46px;
    `,
  }[size]
}

export const Container = styled.View<Props>`
  ${({ size }) => variantSizeStyles(size)};
  border-radius: 6px;
  background-color: ${({ theme }) => theme.COLORS.GRAY_700};
  
  align-items: center;
  justify-content: center;
  
  margin-right: 12px;
`;