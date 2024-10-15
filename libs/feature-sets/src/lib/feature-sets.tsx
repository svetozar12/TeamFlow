import React from 'react';
import { useSetListQuery } from '@team-flow/data-access';
import {
  CircularProgress,
  Typography,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';

export const SetList = () => {
  const { loading, error, data } = useSetListQuery();

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">Error :(</Typography>;
  if (!data || !data.allSets) return null;

  return (
    <List>
      {data.allSets.map(({ id, name, numParts, year }) => (
        <ListItem key={id}>
          <ListItemText
            primary={`${year} - ${name}`}
            secondary={`${numParts} parts`}
          />
        </ListItem>
      ))}
    </List>
  );
};

export default SetList;
