// components/ResponsiveText.js
import styled from 'styled-components';

const ResponsiveText = styled.p`
  font-size: 15px;

  @media (min-width: 768px) {
    font-size: 16px;
  }

  @media (min-width: 1024px) {
    font-size: 18px;
  }
`;

export default ResponsiveText;
