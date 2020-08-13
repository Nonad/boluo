import * as React from 'react';
import Prando from 'prando';
import { encodeUuid, Id } from '@/utils/id';
import styled from '@emotion/styled';
import { Link } from 'react-router-dom';
import { alignRight, floatLeft, fontBold, mR } from '@/styles/atoms';
import { hsl } from 'polished';
import Icon from '@/components/atoms/Icon';
import masterIcon from '../../assets/icons/gamemaster.svg';

interface Props {
  name: string;
  master: boolean;
  action: boolean;
  userId: Id;
}

const Container = styled.span`
  ${[mR(1), alignRight]};
`;

const NameLink = styled(Link)`
  ${[fontBold]};
  text-decoration: none;
`;

const colorMap: Record<string, string> = {};

function genColor(rng: Prando): string {
  return hsl(rng.next(0, 365), rng.next(), rng.next(0.5, 0.8));
}

function ChatItemName({ name, userId, master, action }: Props) {
  if (!colorMap[name]) {
    const rng = new Prando(name);
    colorMap[name] = genColor(rng);
  }
  const color = colorMap[name];
  return (
    <Container>
      {master && <Icon css={mR(1)} sprite={masterIcon} />}
      <NameLink css={{ color }} to={`/profile/${encodeUuid(userId)}`}>
        {name}
      </NameLink>
      {!action && ':'}
    </Container>
  );
}

export default React.memo(ChatItemName);