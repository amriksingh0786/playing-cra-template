import React, { useCallback,useState} from 'react';
import { useDispatch } from 'react-redux';
import { useMount, usePrevious, useUpdateEffect } from 'react-use';
import styled from 'styled-components';
import {
  Button,
  ButtonGroup,
  Flex,
  Grid,
  Heading,
  Image,
  Link,
  Paragraph,
  responsive,
} from 'styled-minimal';

import { useShallowEqualSelector } from 'modules/hooks';
import theme, { appColor, spacer } from 'modules/theme';

import { STATUS } from 'literals';

import { getRepos, showAlert } from 'actions';

import Loader from 'components/Loader';
import { marginLeft } from 'styled-system';

const Item = styled(Link)`
  align-items: center;
  border: solid 0.1rem ${appColor};
  border-radius: 0.4rem;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  padding: ${spacer(3)};
  text-align: center;
  width: 100%;
  /* stylelint-disable */
  ${responsive({
    md: {
      padding: spacer(3),
    },
    lg: {
      padding: spacer(4),
    },
  })};
  /* stylelint-enable */

  p {
    color: #000;
  }

  img {
    height: 8rem;
    margin-bottom: ${spacer(2)};
  }
`;

const ItemHeader = styled.div`
  margin-bottom: ${spacer(3)};

  small {
    color: ${theme.colors.gray60};
  }
`;

function GitHub() {
  let countRepo= 0;
  const dispatch = useDispatch();
  const { data, message, query, status } = useShallowEqualSelector(({ github }) => ({
    data: github.topics[github.query]?.data || [],
    message: github.topics[github.query]?.message || '',
    query: github.query,
    status: github.topics[github.query]?.status || STATUS.IDLE,
  }));
  const previousStatus = usePrevious(status);

  useMount(() => {
    dispatch(getRepos(query || 'react'));
  });

  useUpdateEffect(() => {
    if (previousStatus !== status && status === STATUS.ERROR) {
      dispatch(showAlert(message, { variant: 'danger' }));
    }
  }, [dispatch, message, previousStatus, status]);

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      const { topic = '' } = e.currentTarget.dataset;

      dispatch(getRepos(topic));
    },
    [dispatch],
  );

  const isRunning = status === STATUS.RUNNING;
  let output;
  STATUS.RUNNING ? countRepo= data.length : 0;

  if (status === STATUS.SUCCESS) {
    if (data.length) {
      output = (
        <Grid
          data-testid="GitHubGrid"
          data-topic={query}
          gridGap={{
            _: spacer(2),
            sm: spacer(3),
            xl: spacer(4),
          }}
          gridTemplateColumns={{
            _: '100%',
            md: 'repeat(2, 1fr)',
            lg: 'repeat(3, 1fr)',
            xl: 'repeat(4, 1fr)',
          }}
          m="0 auto"
          mt={5}
          padding={0}
          width={{
            _: '100%',
            sm: '90%',
          }}
        >
          {data.map((d: Record<string, any>) => (
            <Item key={d.id} href={d.html_url} target="_blank">
              <Image alt={d.owner.login} src={d.owner.avatar_url} />
              <ItemHeader>
                <Heading as="h5" h={100} lineHeight={1}>
                  {d.name}
                </Heading>
                <small>{d.owner.login}</small>
              </ItemHeader>
              <Paragraph>{d.description}</Paragraph>
            </Item>
          ))}
        </Grid>
      );
    } else {
      output = <h3>Nothing found</h3>;
    }
  } else {
    output = <Loader block />;
  }

  return (
    <div key="GitHub" data-testid="GitHubWrapper">
      <Flex justifyContent="center">
        <ButtonGroup aria-label="GitHub Selector" data-testid="GitHubSelector" role="group">
          <Button
            busy={query === 'react' && isRunning}
            data-topic="react"
            invert={query !== 'react'}
            onClick={handleClick}
            size="lg"
          >
            React
            
          </Button>
          
          <Button
            busy={query === 'redux' && isRunning}
            data-topic="redux"
            invert={query !== 'redux'}
            onClick={handleClick}
            size="lg"
          >
            Redux
           
          </Button>
          <Button
            busy={query === 'amrik' && isRunning}
            data-topic="amrik"
            invert={query !== 'amrik'}
            onClick={handleClick}
            size="lg"
          >
            Amrik
           
          </Button>
        </ButtonGroup>
      </Flex>
      <Flex justifyContent="center" style={{marginLeft : query==="amrik"? "140px" : "0px",marginRight: query==="react"? "140px" : "0px"}}>
        
        
       
        {countRepo}
      </Flex>
      {output}
    </div>
  );
}

export default GitHub;
